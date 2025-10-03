<template>
  <div class="session-popup-overlay">
    <div class="session-popup-container">
      <div class="session-popup-content">

        <div class="session-popup-header">
          <p class="session-popup-title">세션 만료</p>
        </div>
        <div class="session-popup-separator"></div>

        <div class="session-popup-body">
          <p class="session-popup-message">로그인 세션이 만료되었습니다.</p>
          <p class="session-popup-message">다시 로그인해주세요.</p>
        </div>
        <button class="confirm-button" @click="handleConfirm">확인</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Popup401',
  methods: {
    handleConfirm() {
      // 로그아웃 처리
      this.$store.dispatch('logout');
      // 로그인 페이지로 이동 (라우터 이름을 소문자 'login'으로 수정)
      this.$router.push({ name: 'login' });  // 로그인 페이지로 이동
      // 팝업 닫기 혹시 몰라서
      this.$emit('close');
    }
  }
};
</script>
<style scoped>
.session-popup-overlay {
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
}

.session-popup-container {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  width: 360px;
  /* [수정] 고정 높이 제거 -> 내용에 따라 높이가 자동으로 조절됩니다. */
  /* height: 165px; */
}

.session-popup-title {
  font-size: 18px;
  font-weight: bold;
  color: black;
  margin: 0;
}

.session-popup-separator {
  border-bottom: 1px solid #d3d3d3;
  margin: 10px 0;
}

.session-popup-content {
  text-align: center;
}

.session-popup-body {
  /* [수정] 버튼과의 간격을 확보하기 위해 margin-bottom 값을 늘렸습니다. */
  margin-bottom: 24px;
  margin-top: 22px;
}

.session-popup-message {
  font-size: 16px;
  color: #333333;
  margin: 4px 0; /* 메시지 줄 사이의 간격을 살짝 추가 */
}

.confirm-button {
  background-color: #FFB052;
  color: white;
  border: none;
  padding: 8px 24px;
  border-radius: 7px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.confirm-button:hover {
  background-color: #e6953e;
}
</style>