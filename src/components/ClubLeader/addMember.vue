<template>
  <div class="container">
    <!-- 제목 -->
    <div class="title-row">
      <h2>엑셀 파일로 추가할 동아리 회원 정보</h2>
      <button class="upload-btn" @click="triggerFileInput">
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_4830_14361)">
            <path d="M14.1733 9.04535H11.6287V7.77304H14.1733V9.04535ZM14.1733 9.77235H11.6287V11.0447H14.1733V9.77235ZM14.1733 3.77441H11.6287V5.0467H14.1733V3.77441ZM14.1733 5.77373H11.6287V7.04601H14.1733V5.77373ZM14.1733 11.7717H11.6287V13.044H14.1733V11.7717ZM15.9309 14.2799C15.8582 14.658 15.4038 14.667 15.1003 14.6798H9.44769V16.3156H8.31897L0 14.8615V2.14045L8.36806 0.68457H9.44769V2.13316H14.9058C15.213 2.14588 15.5511 2.12407 15.8182 2.30763C16.0054 2.57663 15.9873 2.91835 16 3.22732L15.9927 12.6895C15.9837 13.2184 16.0418 13.7583 15.9309 14.2799ZM6.66497 11.4282C6.16334 10.4104 5.65263 9.39976 5.15278 8.38191C5.64716 7.39135 6.13428 6.39716 6.61956 5.40295C6.20697 5.42295 5.79437 5.44838 5.38363 5.47748C5.07644 6.22448 4.71838 6.95151 4.47847 7.72398C4.25491 6.99513 3.95866 6.29354 3.68784 5.58288C3.28797 5.60469 2.88809 5.62832 2.48825 5.65195C2.90991 6.58257 3.35888 7.50038 3.76781 8.43645C3.28616 9.34523 2.83541 10.2668 2.36828 11.181C2.76631 11.1973 3.16438 11.2137 3.56241 11.2191C3.84597 10.4958 4.19856 9.79963 4.44575 9.0617C4.6675 9.85416 5.04372 10.5866 5.35272 11.3445C5.79075 11.3755 6.22694 11.4027 6.66497 11.4282ZM15.1331 2.99638H9.44769V3.77441H10.9017V5.0467H9.44769V5.77373H10.9017V7.04601H9.44769V7.77304H10.9017V9.04535H9.44769V9.77235H10.9017V11.0447H9.44769V11.7717H10.9017V13.044H9.44769V13.8845H15.1331V2.99638Z" fill="white"/>
          </g>
          <defs>
            <clipPath id="clip0_4830_14361">
              <rect width="16" height="16" fill="white" transform="translate(0 0.5)"/>
            </clipPath>
          </defs>
        </svg>
        엑셀 파일 업로드
        <input type="file" ref="fileInput" @change="handleFileUpload" accept=".xlsx, .xls" hidden />
      </button>
    </div>

    <!-- 정보 및 버튼 섹션 -->
    <div class="info-section">
        <div class="info-section-col">
          <p>추가 회원: {{ members.length }}명</p>
          <p class="warning-text">
            동아리 회원 추가의 경우, 오타가 없는지 회장분들은 꼼꼼하게 확인해 주시길 바랍니다.
          </p>
        </div>
        <div>
          <button class="clear-btn" @click="clearList">
            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 3.25H11.25V2.5C11.25 2.16848 11.1183 1.85054 10.8839 1.61612C10.6495 1.3817 10.3315 1.25 10 1.25H7C6.66848 1.25 6.35054 1.3817 6.11612 1.61612C5.8817 1.85054 5.75 2.16848 5.75 2.5V3.25H3C2.9337 3.25 2.87011 3.27634 2.82322 3.32322C2.77634 3.37011 2.75 3.4337 2.75 3.5C2.75 3.5663 2.77634 3.62989 2.82322 3.67678C2.87011 3.72366 2.9337 3.75 3 3.75H3.75V13C3.75 13.1989 3.82902 13.3897 3.96967 13.5303C4.11032 13.671 4.30109 13.75 4.5 13.75H12.5C12.6989 13.75 12.8897 13.671 13.0303 13.5303C13.171 13.3897 13.25 13.1989 13.25 13V3.75H14C14.0663 3.75 14.1299 3.72366 14.1768 3.67678C14.2237 3.62989 14.25 3.5663 14.25 3.5C14.25 3.4337 14.2237 3.37011 14.1768 3.32322C14.1299 3.27634 14.0663 3.25 14 3.25ZM6.25 2.5C6.25 2.30109 6.32902 2.11032 6.46967 1.96967C6.61032 1.82902 6.80109 1.75 7 1.75H10C10.1989 1.75 10.3897 1.82902 10.5303 1.96967C10.671 2.11032 10.75 2.30109 10.75 2.5V3.25H6.25V2.5ZM12.75 13C12.75 13.0663 12.7237 13.1299 12.6768 13.1768C12.6299 13.2237 12.5663 13.25 12.5 13.25H4.5C4.4337 13.25 4.37011 13.2237 4.32322 13.1768C4.27634 13.1299 4.25 13.0663 4.25 13V3.75H12.75V13ZM7.25 6.5V10.5C7.25 10.5663 7.22366 10.6299 7.17678 10.6768C7.12989 10.7237 7.0663 10.75 7 10.75C6.9337 10.75 6.87011 10.7237 6.82322 10.6768C6.77634 10.6299 6.75 10.5663 6.75 10.5V6.5C6.75 6.4337 6.77634 6.37011 6.82322 6.32322C6.87011 6.27634 6.9337 6.25 7 6.25C7.0663 6.25 7.12989 6.27634 7.17678 6.32322C7.22366 6.37011 7.25 6.4337 7.25 6.5ZM10.25 6.5V10.5C10.25 10.5663 10.2237 10.6299 10.1768 10.6768C10.1299 10.7237 10.0663 10.75 10 10.75C9.9337 10.75 9.87011 10.7237 9.82322 10.6768C9.77634 10.6299 9.75 10.5663 9.75 10.5V6.5C9.75 6.4337 9.77634 6.37011 9.82322 6.32322C9.87011 6.27634 9.9337 6.25 10 6.25C10.0663 6.25 10.1299 6.27634 10.1768 6.32322C10.2237 6.37011 10.25 6.4337 10.25 6.5Z" fill="#969696"/>
            </svg>
            비우기
          </button>
        </div>
    </div>

    <!--추가할 회원 리스트-->
    <div v-if="members.length > 0" class="member-list">
      <div class="member-row" v-for="(member, index) in members" :key="index">
        <span class="member-name">{{ member.name }}</span>
        <span class="member-studentId">{{ member.studentId }}</span>
        <span class="member-phone">{{ member.phone }}</span>
        <select>
          <option disabled selected>단과대학 선택</option>
          <option value="college1">단과대학1</option>
          <option value="college2">단과대학2</option>
        </select>
        <select>
          <option disabled selected>학부(학과) 선택</option>
          <option value="department1">학부1</option>
          <option value="department2">학부2</option>
        </select>
      </div>
      <button class="addClubMember">동아리 회원 추가 완료</button>
    </div>


    <div v-if="isOverlappingMemberListsPopupVisible" class="popup-overlay1">
      <div class="popup">
        <h2>중복되는 회원 목록</h2>
        <p class="confirm-message">아래 목록은 타 동아리에도 소속되어 있는 회원입니다. 중복되는 회원을 파일에서 삭제하신 후 다시 업로드해주세요. <br>이후 ‘중복 회원 추가’를 통해 아래 회원을 추가하실 수 있습니다.</p>
        <button class="confirm-button" @click="Delete">확인</button>
      </div>
    </div>

    <div v-if="isSelectDepartmentPopupVisible" class="popup-overlay2">
      <div class="popup">
        <h3>동아리 회원 추가</h3>
        <div class="line2"></div>
        <p class="popup-message">학과를 모두 선택해주세요.</p>
        <button class="confirm-button" @click="SelectDepartment">확인</button>
      </div>
    </div>
  </div>
</template>

<script>
import * as XLSX from "xlsx";

export default {
  data() {
    return {
      members: [], // 업로드된 회원 정보를 저장

      isOverlappingMemberListsPopupVisible : true,  //임시로 보이게 설정
      isSelectDepartmentPopupVisible : true,  //임시로 보이게 설정
    };
  },
  methods: {
    // 파일 입력 필드를 트리거
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    // 파일 업로드 처리
    handleFileUpload(event) {
      console.log("엑셀 파일 업로드")
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // 첫 번째 시트의 데이터를 가져옵니다
        const sheetName = workbook.SheetNames[0];
        console.log(sheetName);
        const sheet = workbook.Sheets[sheetName];
        console.log(sheet);
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        console.log(jsonData);

        // JSON 데이터에서 필요한 항목만 추출
        this.members = jsonData.map((row) => ({
          name: row["이름"] || "",
          studentId: row["학번"] || "",
          phone: row["전화번호"] || "",
        }));

        console.log(this.members);
      };

      reader.readAsArrayBuffer(file);
    },
    // 리스트 초기화
    clearList() {
      this.members = [];
    },
    Delete(){
      this.isOverlappingMemberListsPopupVisible = false;
    },
    SelectDepartment(){
      this.isSelectDepartmentPopupVisible = false;
    }

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

svg{
  margin-right: 10px;
}

h2 {
  font-size: 20px;
  margin-bottom: 30px;
  color: #333;
  font-weight: 600;
}



.info-section {
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.info-section-col {
  flex-direction: column;
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
  padding: 10px 15px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.clear-btn:hover {
  background-color: #e0e0e0;
}

.member-list {
  margin-top: 20px;
  width: 860px;
}

.member-row {
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 8px;
}

.member-row span {
  text-align: center;
}

.member-name{
  margin-left: 100px;

}

.member-studentId{
  margin-left: 50px;
}

.member-phone{
  margin-left: 50px;
}

select {
  width: 160px;
  padding: 5px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  margin-left: 40px;
}

.addClubMember{
  width: 160px;
  height: 40px;
  margin-left: 700px;
  margin-top: 100px;
  background-color: #FFB052;
  border: none;
  border-radius: 4px;
  color: #FFFFFF;
}

/* Popup Overlay and Popup Window */
.popup-overlay1 {
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
  flex-direction: column;
}

.popup-overlay1 .popup {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  width: 840px;
  height: 402px;
  text-align: left;
  position: relative;
  margin-left: 300px;
}

.popup-overlay1 .confirm-message{
  font-size: 14px;
  font-weight: 300;
  line-height: 16.71px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  margin-left: 10px;
  color: #FF3535;
}

.popup-overlay1 .confirm-button{
  background-color: #FFB052;
  color: white;
  border: none;
  width: 124px;
  height: 40px;
  border-radius: 7px;
  cursor: pointer;
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-size: 12px;
  font-weight: 600;
  line-height: 14.32px;
  text-align: center;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
}

.popup-overlay1 .popup h2 {
  font-size: 16px;
  font-weight: 600;
  line-height: 12px;
  letter-spacing: -0.05em;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  margin-top: 20px;
  margin-left: 10px;
}

.popup-overlay2 {
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
  flex-direction: column;
}

.popup-overlay2 .popup {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  width: 452px;
  height: 184px;
  text-align: left;
  position: relative;
}

.popup-overlay2 .confirm-message{
  text-align: center;
  margin-top: 80px;
  font-size: 20px;
  font-weight: 500;
  line-height: 12px;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;

}

.popup-overlay2 .confirm-button{
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

.popup-overlay2 .popup h3 {
  font-size: 18px;
  font-weight: bold;
  color: black;
  margin: 0;
}

.popup-overlay2 .line2{
  border-bottom: 1px solid #d3d3d3;
  margin: 10px 0;
}

.popup-overlay2 .popup-message {
  font-size: 16px;
  font-weight: 500;
  line-height: 12px;
  color: #2F2F2F;
  margin-top: 40px;
}

.popup-overlay2 .confirm-button{
  background-color: #FFB052;
  color: white;
  border: none;
  width: 90px;
  height: 35px;
  border-radius: 7px;
  cursor: pointer;
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  text-align: center;
}

</style>
