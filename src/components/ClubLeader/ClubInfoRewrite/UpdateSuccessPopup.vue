<template>
  <div class="custom-popup" v-if="isVisible">
    <div class="popup-content">
      <div class="popup-header">
        <p class="popup-title">동아리 정보 수정</p>
      </div>
      <div class="popup-separator"></div>
      <div class="popup-body">
        <p class="popup-message">동아리 정보 수정이 완료되었습니다.</p>
      </div>
      <button @click="closePopup" class="expel-button">확인</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UpdateSuccessPopup',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closePopup() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.custom-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  width: 460px;
  height: 152px;
  text-align: left;
  position: relative;
}

.popup-header {
  margin-bottom: 10px;
}

.popup-title {
  font-size: 18px;
  font-weight: bold;
  color: black;
  margin: 0;
}

.popup-separator {
  border-bottom: 1px solid #d3d3d3;
  margin: 10px 0;
}

.popup-body {
  margin-bottom: 0px;
  margin-top: 22px;
}

.popup-message {
  font-size: 16px;
  color: #333333;
  margin: 0;
}

.expel-button {
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

.expel-button:hover {
  background-color: #e6953e;
}
</style>