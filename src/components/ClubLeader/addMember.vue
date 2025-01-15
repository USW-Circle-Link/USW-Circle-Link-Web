<template>
  <div class="container">
    <!-- 제목 -->
    <div class="title-row">
      <h2>엑셀 파일로 추가할 동아리 회원 정보</h2>
      <button class="upload-btn">
        <svg width="26" height="27" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M14.3905 2.70253H9.3255V1.50903L1 2.79403V14.0575L9.3255 15.4915V13.7225H14.3905C14.544 13.7306 14.6943 13.6774 14.8086 13.5746C14.9229 13.4719 14.9917 13.328 15 13.1745V3.25003C14.9916 3.09667 14.9227 2.9529 14.8085 2.85026C14.6942 2.74762 14.5439 2.69449 14.3905 2.70253ZM14.4705 13.2655H9.3085L9.3 12.321H10.5435V11.221H9.2905L9.2845 10.571H10.5435V9.47103H9.275L9.269 8.82103H10.5435V7.72103H9.265V7.07103H10.5435V5.97103H9.265V5.32103H10.5435V4.22103H9.265V3.22103H14.4705V13.2655Z" fill="#20744A"/>
          <path d="M11.2422 4.21948H13.4037V5.31948H11.2422V4.21948ZM11.2422 5.96998H13.4037V7.06998H11.2422V5.96998ZM11.2422 7.72048H13.4037V8.82048H11.2422V7.72048ZM11.2422 9.47098H13.4037V10.571H11.2422V9.47098ZM11.2422 11.2215H13.4037V12.3215H11.2422V11.2215Z" fill="#20744A"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M3.17403 5.83646L4.24703 5.77496L4.92153 7.62946L5.71853 5.69846L6.79153 5.63696L5.48853 8.26996L6.79153 10.9095L5.65703 10.833L4.89103 8.82096L4.12453 10.7565L3.08203 10.6645L4.29303 8.33296L3.17403 5.83646Z" fill="white"/>
        </svg>
        엑셀 파일 업로드
      </button>
    </div>

    <!-- 정보 및 버튼 섹션 -->
    <div class="info-section">
      <p>추가 회원: {{ member }}명</p>
      <p class="warning-text">
        동아리 회원 추가의 경우, 오타가 없는지 회장분들은 꼼꼼하게 확인해 주시길 바랍니다.
      </p>
      <div class="button-group">
        <button class="clear-btn">비우기</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      member : 0,
    };
  },
};
</script>
<style scoped>
.container {
  width: 860px;
  margin: 0 auto;
  padding: 20px;
}

.title-row{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

h2 {
  font-size: 18px;
  margin-bottom: 40px;
  color: #333;
  font-weight: 600;
}



.info-section {
  margin-top: 20px;
}

p {
  font-size: 14px;
  margin: 10px 0;
  font-weight: 300;
}

.warning-text {
  color: #ff4d4f; /* 빨간색 경고 메시지 */
  font-size: 12px;
}

.button-group {
  margin-top: 20px;
  display: flex;
  gap: 10px; /* 버튼 간격 */
}

.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1D6F42; /* 녹색 버튼 */
  color: #FFFFFF;
  border: none;
  width: 156px;
  height: 37px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0; /* 회색 버튼 */
  color: #333;
  padding: 10px 20px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.clear-btn:hover {
  background-color: #e0e0e0;
}
</style>
