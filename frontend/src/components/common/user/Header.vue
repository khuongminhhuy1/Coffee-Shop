<template lang="">
  <div class="flex flex-row justify-between items-center w-full text-white px-2 pt-4">
    <div>Sidebar</div>
    <div>Coffee Shop</div>
    <LoginButton />
  </div>
</template>
<script>
import LoginButton from '@/components/btn/LoginButton.vue'
export default {
  name: 'Header',
  components: { LoginButton },
}
</script>
<style lang=""></style>
