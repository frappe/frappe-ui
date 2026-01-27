<script setup>
import { session } from "../data/session";
import { Button } from "frappe-ui";
</script>

<template>
  <div class="max-w-3xl m-20 mx-auto">
    <span> User : {{ session.user }}! </span>

    <div class="flex flex-row space-x-2 mt-4">
      <Button theme="red" @click="session.logout.submit()">Logout</Button>
    </div>
  </div>
</template>
