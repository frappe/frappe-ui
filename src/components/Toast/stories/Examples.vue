<script setup lang="ts">
import { Button, toast } from 'frappe-ui'
</script>

<template>
  <Button label="Workspace created" @click="toast.success('Workspace created')" />
  <Button label="Link copied" @click="toast.info('Link copied to clipboard')" />
  <Button
    label="Comment posted"
    @click="
      toast.message('Comment posted', {
        description: '“Looks good — shipping it!”',
      })
    "
  />
  <Button
    label="Profile updated"
    @click="
      toast.success('Profile updated', {
        description: 'Your changes have been saved.',
      })
    "
  />
  <Button
    label="Payment failed"
    @click="
      toast.error('Payment failed', {
        description: 'Your card was declined. Try a different one.',
      })
    "
  />
  <Button
    label="Storage almost full"
    @click="
      toast.warning('Storage almost full', {
        description: 'You have used 9.2 GB of 10 GB. Upgrade to keep syncing.',
      })
    "
  />
</template>
