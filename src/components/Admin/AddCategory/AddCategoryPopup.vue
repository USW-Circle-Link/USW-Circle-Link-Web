<template>
  <div class="popup-overlay">
    <div class="popup">
      <div class="popup-header">카테고리 설정</div>
      <hr />
      <p class="confirm-message">{{ message }}</p>
      <button @click="$emit('close')" class="confirm-button">확인</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AddCategoryPopup',
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
  min-width: 390px;
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
.popup-header {
  font-size: 18px;
  font-weight: 500;
  text-align: left;
}
/*
hr {
  //border-bottom: 1px solid #d3d3d3;
}
*/
.confirm-message{
  font-size: 16px;
  text-align: left;
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