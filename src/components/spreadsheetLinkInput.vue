<template>
  <input v-model="sheetUrl" placeholder="Enter Google Sheets URL" />
</template>
<script>
  export default {
    name: 'PopUpView',
    data() {
      return {
        sheetUrl: '',
      };
    },
    methods: {
      closeModal() {
        this.$emit('sendClose', false)
      },
    },
  }
</script>
<style scoped>

</style>