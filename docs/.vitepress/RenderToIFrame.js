import { h, ref, createApp, onMounted, onBeforeUpdate } from 'vue'

export default {
  name: 'RenderToIFrame',
  props: {
    css: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    if (props.disabled) {
      return () => slots.default()
    }
    const iframeRef = ref(null)
    const iframeBody = ref(null)
    const iframeHead = ref(null)
    const iframeStyle = ref(null)
    let iframeApp = null

    onMounted(() => {
      iframeBody.value = iframeRef.value.contentDocument.body
      iframeHead.value = iframeRef.value.contentDocument.head
      const el = document.createElement('div')
      iframeBody.value.appendChild(el)
      iframeStyle.value = document.createElement('style')
      iframeStyle.value.innerHTML = props.css
      iframeHead.value.appendChild(iframeStyle.value)

      iframeApp = createApp({
        name: 'iframeRender',
        setup() {
          return () => slots.default()
        },
      }).mount(el)
    })
    onBeforeUpdate(() => {
      if (!iframeApp || !iframeRef.value) {
        return
      }
      if (props.css) {
        iframeStyle.value.innerHTML = props.css
      }
    })
    return () => h('iframe', { ref: iframeRef })
  },
}
