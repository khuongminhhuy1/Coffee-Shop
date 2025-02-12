<template>
  <!-- The button to open modal -->
  <label for="delete_modal" class="btn">Delete</label>

  <!-- Put this part before </body> tag -->
  <input type="checkbox" id="delete_modal" class="modal-toggle" />
  <div class="modal" role="dialog">
    <div class="modal-box">
      <form action="">
        <p>Do you want to delete this user ?</p>
      </form>
      <div class="modal-action">
        <button type="submit" @click="deleteUser" class="btn">Yes</button>
        <label for="delete_modal" class="btn">Close!</label>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useAdmin } from '@/composables/admin.composables'
const admin = useAdmin()
const props = defineProps({
  id: String,
})
const emit = defineEmits(['delete'])
const deleteUser = async () => {
  try {
    console.log(props.id)
    await admin.deleteUser(props.id)
    emit('delete', props.id)
    console.log('deleted user')
  } catch (error) {
    console.log('Error : ', error)
  }
}
</script>
