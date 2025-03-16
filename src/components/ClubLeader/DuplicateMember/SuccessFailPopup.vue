<template>
  <div class="popup-overlay">
    <div class="popup-container">
      <h3 class="popup-title">동아리 회원 추가</h3>

      <div class="popup-separator"></div>

      <p class="message">{{ message }}</p>

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
      // 성공 시 True, 실패 시 False
      type: Boolean,
      required: true, // 필수적으로 부모 컴포넌트로 props 전달
    },
    serverMessage: {
      type: String,
      required: true,
    },
  },
  computed: {
    message() {
      return this.serverMessage;
    },
  },
};
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
  z-index: 1000;
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
  background-color: #ffb052;
  color: white;
}

.confirm-button:hover {
  background-color: #e6953e;
}

.message {
  color: #2f2f2f;
  font-family: Pretendard;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 12px; /* 80% */
}
</style>
