<template>
  <div class="popup-overlay">
    <div class="popup-container">
      <h3 class="popup-title">동아리 회원 추가</h3>

      <div class="popup-separator"></div>

      <div class="popup-content">
        <p>{{ message }}</p>
      </div>

      <div class="button-group">
        <button @click="$emit('close')" class="confirm-button">확인</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SuccessFailPopup',
  props: {
    isSuccess: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    message() {
      return this.isSuccess
          ? "해당 회원의 추가가 정상적으로 처리되었습니다."
          : "해당 회원의 정보를 찾을 수 없습니다. ���시 확인해주세요."
    }
  }
}
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
}

.popup-separator {
  border-bottom: 1px solid #d3d3d3;
  margin: 0px 0;
  margin-bottom: 20px;
}

.popup-title {
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  margin-top: -1px;
}

.popup-content {
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.confirm-button {
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 80px;
  height: 32px;
}

.cancel-button:hover {
  background-color: #9a9a9a; /* Darker shade */
}

.confirm-button {
  background-color: #FFB052;
  color: white;
}

.confirm-button:hover {
  background-color: #e6953e;
}
</style>