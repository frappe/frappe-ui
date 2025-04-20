import { ref, watch, type Ref, readonly } from 'vue'

interface UseTouchHandlerOptions {
  targetRef: Ref<HTMLElement | null | undefined>
  zoomLevel?: Ref<number>
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onDoubleTap?: (event: TouchEvent) => void
  onTap?: (event: TouchEvent) => void
  onPanStart?: (event: TouchEvent) => void
  onPanMove?: (deltaX: number, deltaY: number, event: TouchEvent) => void
  onPanAnimate?: (x: number, y: number) => void // Callback for inertia animation frame updates
  onPanEnd?: (event: TouchEvent) => void
  onPinchStart?: (event: TouchEvent) => void
  onPinchMove?: (scale: number, event: TouchEvent) => void
  onPinchEnd?: (event: TouchEvent) => void
  doubleTapDelay?: number
  minSwipeDistance?: number
  maxVerticalSwipeDistance?: number
  maxTapDuration?: number
  maxTapMovement?: number
  panThreshold?: number
  inertiaDamping?: number // Damping factor for inertia (e.g., 0.95)
  inertiaVelocityThreshold?: number // Minimum velocity (pixels/ms) to trigger inertia
}

export function useTouchHandler(options: UseTouchHandlerOptions) {
  const {
    targetRef,
    zoomLevel = ref(100),
    onSwipeLeft,
    onSwipeRight,
    onDoubleTap,
    onTap,
    onPanStart,
    onPanMove,
    onPanAnimate,
    onPanEnd,
    onPinchStart,
    onPinchMove,
    onPinchEnd,
    doubleTapDelay = 300,
    minSwipeDistance = 50,
    maxVerticalSwipeDistance = 75,
    maxTapDuration = 200,
    maxTapMovement = 10,
    panThreshold = 5, // Pixels moved before pan starts
    inertiaDamping = 0.94, // Damping for inertia slowdown (higher = slower stop)
    inertiaVelocityThreshold = 0.5, // Pixels per ms
  } = options

  const isPanning = ref(false)
  const isPinching = ref(false)
  const isAnimatingPan = ref(false) // Track inertia animation state
  const startPanCoords = ref({ x: 0, y: 0 })
  const lastTapTime = ref(0)
  const touchStartTime = ref(0)
  const touchStartDistance = ref(0)
  const initialTouchPoints = ref<TouchList | null>(null)

  // Velocity tracking for inertia
  const lastMoveTime = ref(0)
  const lastMoveCoords = ref({ x: 0, y: 0 })
  const panVelocity = ref({ x: 0, y: 0 })

  // Inertia animation frame
  const animationFrameId = ref<number | null>(null)

  const cancelInertiaAnimation = () => {
    if (animationFrameId.value !== null) {
      cancelAnimationFrame(animationFrameId.value)
      animationFrameId.value = null
    }
    isAnimatingPan.value = false
    panVelocity.value = { x: 0, y: 0 } // Reset velocity
  }

  const handleTouchStart = (event: TouchEvent) => {
    cancelInertiaAnimation() // Stop any ongoing inertia animation
    event.preventDefault() // Prevent default browser actions like scroll/zoom

    isPanning.value = false
    isPinching.value = false
    initialTouchPoints.value = event.touches

    const currentTime = performance.now()
    const timeSinceLastTap = currentTime - lastTapTime.value

    // Double Tap Detection
    if (
      timeSinceLastTap < doubleTapDelay &&
      timeSinceLastTap > 0 &&
      event.touches.length === 1 &&
      onDoubleTap
    ) {
      onDoubleTap(event)
      lastTapTime.value = 0 // Reset tap time after double tap
      touchStartTime.value = 0
      return // Don't process as single tap/pan/pinch start
    }

    // Record Start Info
    touchStartTime.value = currentTime
    if (event.touches.length === 1) {
      lastTapTime.value = currentTime // Record for potential double tap
      const touch = event.touches[0]
      startPanCoords.value = { x: touch.clientX, y: touch.clientY }
      // Reset velocity tracking on new touch start
      lastMoveTime.value = currentTime
      lastMoveCoords.value = { ...startPanCoords.value }
      panVelocity.value = { x: 0, y: 0 }
      if (onPanStart) onPanStart(event)
    } else if (event.touches.length === 2) {
      lastTapTime.value = 0 // Reset tap time if starting with pinch
      const touch1 = event.touches[0]
      const touch2 = event.touches[1]
      touchStartDistance.value = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY,
      )
      isPinching.value = true
      if (onPinchStart) onPinchStart(event)
    } else {
      // More than 2 touches, reset tap time
      lastTapTime.value = 0
      touchStartTime.value = 0
    }
  }

  const handleTouchMove = (event: TouchEvent) => {
    if (!initialTouchPoints.value) return // Should have initial points if touch started correctly

    event.preventDefault() // Prevent scroll/zoom during move

    const currentTime = performance.now()
    const deltaTime = currentTime - lastMoveTime.value

    // Pinching
    if (event.touches.length === 2 && initialTouchPoints.value.length === 2) {
      isPanning.value = false // Stop panning if pinch starts
      isPinching.value = true
      const touch1 = event.touches[0]
      const touch2 = event.touches[1]
      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY,
      )

      if (touchStartDistance.value > 0 && onPinchMove) {
        const scale = currentDistance / touchStartDistance.value
        onPinchMove(scale, event)
      }
      // Reset velocity if pinching occurs
      panVelocity.value = { x: 0, y: 0 }
    }
    // Panning
    else if (
      event.touches.length === 1 &&
      initialTouchPoints.value.length === 1 &&
      !isPinching.value // Don't pan if a pinch just ended but finger is still down
    ) {
      const currentX = event.touches[0].clientX
      const currentY = event.touches[0].clientY
      const rawDeltaX = currentX - lastMoveCoords.value.x
      const rawDeltaY = currentY - lastMoveCoords.value.y

      // Calculate velocity (pixels per millisecond) for inertia
      // Ensure deltaTime is not zero to avoid division by zero
      if (deltaTime > 1) {
        // Use a small threshold > 0
        panVelocity.value = {
          x: rawDeltaX / deltaTime,
          y: rawDeltaY / deltaTime,
        }
      } else {
        // If deltaTime is too small, retain previous velocity or reset
        panVelocity.value = { x: 0, y: 0 } // Resetting might be safer
      }

      // Update last move state
      lastMoveTime.value = currentTime
      lastMoveCoords.value = { x: currentX, y: currentY }

      const deltaXFromStart = currentX - startPanCoords.value.x
      const deltaYFromStart = currentY - startPanCoords.value.y

      // Start panning only if threshold is met AND zoom level allows panning
      if (
        !isPanning.value &&
        zoomLevel.value > 100 &&
        (Math.abs(deltaXFromStart) > panThreshold ||
          Math.abs(deltaYFromStart) > panThreshold)
      ) {
        isPanning.value = true
        // Adjust start coords slightly to avoid jump if pan starts mid-movement
        startPanCoords.value = {
          x: currentX,
          y: currentY,
        }
      }

      if (isPanning.value && onPanMove) {
        const zoomFactor = zoomLevel.value / 100
        // Pass the delta relative to the start of the *current* pan gesture, adjusted for zoom
        const panDeltaX = deltaXFromStart / zoomFactor
        const panDeltaY = deltaYFromStart / zoomFactor
        onPanMove(panDeltaX, panDeltaY, event)
      }
    }
  }

  const handleTouchEnd = (event: TouchEvent) => {
    const touchesLeft = event.touches.length
    const touchEndTime = performance.now()
    const wasPanning = isPanning.value
    const wasPinching = isPinching.value

    // Store current velocity before resetting states for potential inertia
    const finalVelocity = { ...panVelocity.value }

    // Handle Pan End and Inertia
    if (
      wasPanning &&
      initialTouchPoints.value &&
      touchesLeft < initialTouchPoints.value.length
    ) {
      isPanning.value = false // Set panning to false *before* starting animation
      if (onPanEnd) onPanEnd(event)

      // Check velocity threshold and start inertia animation if needed
      const velocityMagnitude = Math.hypot(finalVelocity.x, finalVelocity.y)
      if (
        velocityMagnitude > inertiaVelocityThreshold &&
        onPanAnimate &&
        zoomLevel.value > 100 // Only animate if zoomed in
      ) {
        isAnimatingPan.value = true
        let lastFrameTime = performance.now()
        // Use a copy of the velocity for the animation loop
        let animVelocity = { ...finalVelocity }

        const animate = (currentTime: number) => {
          // Ensure animation wasn't cancelled elsewhere (e.g., new touch start)
          if (!isAnimatingPan.value) return

          const frameDeltaTime = Math.max(1, currentTime - lastFrameTime) // Prevent zero/negative delta
          lastFrameTime = currentTime

          const zoomFactor = zoomLevel.value / 100
          const moveX = (animVelocity.x * frameDeltaTime) / zoomFactor
          const moveY = (animVelocity.y * frameDeltaTime) / zoomFactor

          // Call component's pan update function for each frame
          onPanAnimate(moveX, moveY)

          // Apply damping (adjust based on frame time for consistency)
          const dampingFactor = Math.pow(
            Math.min(0.999, inertiaDamping), // Ensure base is < 1
            frameDeltaTime / 16.67, // Normalize damping based on ~60fps
          )
          animVelocity.x *= dampingFactor
          animVelocity.y *= dampingFactor

          // Stop animation if velocity is negligible or zoom changed back to <= 100%
          if (
            Math.hypot(animVelocity.x, animVelocity.y) < 0.01 ||
            zoomLevel.value <= 100
          ) {
            cancelInertiaAnimation()
          } else {
            animationFrameId.value = requestAnimationFrame(animate)
          }
        }
        animationFrameId.value = requestAnimationFrame(animate)
      } else {
        panVelocity.value = { x: 0, y: 0 } // Reset velocity if no animation starts
      }
    } else if (!wasPanning) {
      // Reset velocity if touch ended without panning (e.g., tap, pinch)
      panVelocity.value = { x: 0, y: 0 }
    }

    // Handle Pinch End
    if (wasPinching && touchesLeft < 2) {
      isPinching.value = false
      touchStartDistance.value = 0 // Reset pinch distance tracking
      if (onPinchEnd) onPinchEnd(event)
    }

    // Gesture detection (Tap/Swipe) only when the *last* finger is lifted
    if (
      touchesLeft === 0 &&
      event.changedTouches.length === 1 && // Ensure it's the end of a single touch sequence
      touchStartTime.value > 0 && // Ensure there was a valid start time recorded
      initialTouchPoints.value?.length === 1 // Ensure it started as a single touch
    ) {
      const endCoords = event.changedTouches[0]
      const deltaX = endCoords.clientX - startPanCoords.value.x
      const deltaY = endCoords.clientY - startPanCoords.value.y
      const duration = touchEndTime - touchStartTime.value

      // Swipe Detection (only if not panning AND zoom is appropriate for swipe)
      if (
        !wasPanning && // Only detect swipe if not panning
        zoomLevel.value <= 100 && // Swipes only make sense at base zoom
        Math.abs(deltaX) > minSwipeDistance &&
        Math.abs(deltaY) < maxVerticalSwipeDistance // Allow some vertical movement
      ) {
        if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft()
        } else if (deltaX > 0 && onSwipeRight) {
          onSwipeRight()
        }
      }
      // Tap Detection (if not panning, not swiping, and within time/movement limits)
      else if (
        !wasPanning &&
        duration < maxTapDuration &&
        Math.abs(deltaX) < maxTapMovement &&
        Math.abs(deltaY) < maxTapMovement &&
        onTap
      ) {
        onTap(event)
      }
    }

    // Reset start time and coords only when all touches are up
    if (touchesLeft === 0) {
      touchStartTime.value = 0
      startPanCoords.value = { x: 0, y: 0 }
      initialTouchPoints.value = null
      // Don't reset isPanning here if inertia animation might start
      isPinching.value = false
      // Reset velocity only if not animating
      if (!isAnimatingPan.value) {
        panVelocity.value = { x: 0, y: 0 }
      }
    }
    // If some touches remain (e.g., pinch ended, one finger remains),
    // update start coords for potential pan with the remaining finger.
    else if (touchesLeft === 1 && !isPanning.value && !isPinching.value) {
      startPanCoords.value = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      }
      touchStartTime.value = performance.now() // Reset start time for the remaining finger
      initialTouchPoints.value = event.touches // Update initial touches to the single remaining one
    }
  }

  watch(
    targetRef,
    (newTarget, oldTarget) => {
      if (oldTarget) {
        oldTarget.removeEventListener('touchstart', handleTouchStart)
        oldTarget.removeEventListener('touchmove', handleTouchMove)
        oldTarget.removeEventListener('touchend', handleTouchEnd)
        oldTarget.removeEventListener('touchcancel', handleTouchEnd) // Treat cancel like end
        cancelInertiaAnimation() // Clean up animation on unmount/target change
      }
      if (newTarget) {
        // Use passive: false for start/move to allow preventDefault()
        newTarget.addEventListener('touchstart', handleTouchStart, {
          passive: false,
        })
        newTarget.addEventListener('touchmove', handleTouchMove, {
          passive: false,
        })
        // Use passive: true for end/cancel as we don't preventDefault there
        newTarget.addEventListener('touchend', handleTouchEnd, {
          passive: true,
        })
        newTarget.addEventListener('touchcancel', handleTouchEnd, {
          passive: true,
        })
      }
    },
    { immediate: true },
  )

  return {
    isPanning: readonly(isPanning),
    isPinching: readonly(isPinching),
    isAnimatingPan: readonly(isAnimatingPan), // Expose inertia animation status
  }
}
