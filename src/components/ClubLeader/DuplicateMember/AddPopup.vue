<template>
  <div class="popup-overlay">
    <div class="popup-container">
      <h2 class="popup-title">동아리 회원 추가</h2>

      <div class="popup-separator"></div>


      <div class="info-row">
        <span>이름: {{ name }}</span>
      </div>
      <div class="info-row">
        <span>학번: {{ studentId }}</span>
      </div>
      <div class="info-row">
        <span>전화번호: {{ phoneNumber }}</span>
      </div>
      <p class="confirmation-text">해당 회원을 동아리에 추가하시겠습니까?</p>


      <div class="popup-footer">
        <div class="button-group">
          <button @click="$emit('cancel')" class="cancel-button">취소</button>
          <button @click="$emit('confirm')" class="confirm-button">확인</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddPopup',
  props: {
    name: { /* 이름 팝업 */
      type: String,
      required: true
    },
    studentId: { /* 학번 팝업 */
      type: String,
      required: true
    },
    phoneNumber: { /* 전화번호 팝업 */
      type: String,
      required: true
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
  z-index: 1000;
}

.popup-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  position: relative;
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
  margin-top: -2px;
}

.info-row {
  margin-bottom: 5px;
  font-size: 14px;
}

.confirmation-text {
  margin-top: 16px;
  font-size: 14px;
  color: #333;
}

.popup-footer {
  margin-top: auto;
}

.button-group {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.cancel-button, .confirm-button {
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 87px;
  height: 32px;
  font-size: 14px;
  white-space: nowrap;  /* 텍스트 줄바꿈 방지 */
}

.cancel-button {
  background-color: #B9B9B9;
  color: #ffffff;
}

.cancel-button:hover {
  background-color: #9a9a9a;
}

.confirm-button {
  background-color: #FFB052;
  color: white;
}

.confirm-button:hover {
  background-color: #e6953e;
}
</style>