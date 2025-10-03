<template>
  <div class="popup-overlay">
    <div class="popup">
      <div class="popup-header">동아리 위치 정보 수정</div>

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
  min-width: 380px;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
}

.popup {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 452px;
  min-width: 300px;
  min-height: 184px;
  text-align: left;
  position: relative;
  box-sizing: border-box;
}


.popup-header {
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #d3d3d3;
  padding-bottom: 12px;
  margin-bottom: 20px;
}
.popup-header {
  font-size: 18px;
  text-align: left;
}

.confirm-message{
  font-size: 16px;
  text-align: left;

}

.confirm-message {
  text-align: left;
  color: #333;
  margin: 0 0 60px 0;
  font-size : 16px;
}

.confirm-button {
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
