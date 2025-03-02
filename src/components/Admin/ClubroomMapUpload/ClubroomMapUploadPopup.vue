<template>
  <div class="popup-overlay">
    <div class="popup">
      <p class="confirm-message">{{ message }}</p>
      <button @click="$emit('close')" class="confirm-button">확인</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ClubroomMapUploadPopup',
  props: {
    serverMessage: {
      type: String,
      required: true
    }
  },
  computed: {
    message() {
      return this.serverMessage;
    }
  }
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  flex-direction: column;
}

.popup {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  width: 452px;
  height: 184px;
  text-align: left;
  position: relative;
}

.confirm-message{
  text-align: center;
  margin-top: 80px;
  font-size: 20px;
  font-weight: 500;
  line-height: 12px;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
}

.confirm-button{
  background-color: #FFB052;
  color: white;
  border: none;
  padding: 7px 30px;
  border-radius: 7px;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>