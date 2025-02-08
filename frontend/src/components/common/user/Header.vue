<template lang="">
  <div class="flex flex-row justify-between items-center w-full text-white px-2 pt-4">
    <div><router-link to="/admin">Admin</router-link></div>
    <div>Coffee Shop</div>
    <LoginButton />
  </div>
</template>
<script setup>
import LoginButton from '@/components/btn/LoginButton.vue'
</script>
<style lang=""></style>
