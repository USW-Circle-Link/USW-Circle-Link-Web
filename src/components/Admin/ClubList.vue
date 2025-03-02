<template>
  <div class="title">소속 동아리 리스트</div>
  <!-- 소속 동아리 리스트 -->
  <div class="header">
    <div class="header-row">
      <div class="header-item-department">분과</div>
      <div class="header-item-clubname">동아리 이름</div>
      <div class="header-item-clubleader">동아리 회장</div>
      <div class="header-item-numberOfClubMembers">인원</div>
      <div class="header-item-delete"></div>
    </div>
  </div>

  <div class="container">
    <!-- 동아리 리스트 -->
    <div class="list">
      <div class="list-item-container" v-for="(club, index) in clubs" :key="index">
        <div class="list-item-row" @click="openPopupClubInfo(club)">
          <div class="list-item-department">{{ club.department }}</div>
          <div class="list-item-clubname">{{ club.clubName }}</div>
          <div class="list-item-clubleader">{{ club.leaderName }}</div>
          <div class="list-item-numberOfClubMembers">{{ club.numberOfClubMembers }}</div>
        </div>
        <div class="list-item-delete">
          <button class="delete-btn" @click="openPopup(club.clubUUID, index, club.clubName)">삭제</button>
        </div>
      </div>
    </div>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">
        <img src="@/assets/left.png" alt="Previous" />
      </button>
      <button
          v-for="page in totalPages"
          :key="page"
          @click="setPage(page)"
          :class="{ active: page === currentPage }"
      >
        {{ page }}
      </button>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        <img src="@/assets/rigth.png" alt="Next" />
      </button>
    </div>
  </div>



  <!-- 동아리 삭제 팝업 -->
  <div v-if="isPopupVisible" class="popup-overlay">
    <div class="popup">
      <h3>동아리 삭제</h3>
      <div class="line2"></div>
      <p class="popup-message">'{{ PopupClubName }}'을(를) 삭제하시겠습니까?</p>
      <input v-model="adminPw" type="password" placeholder="관리자 비밀번호" />
      <p class="popup-warning">{{ adminPwError }}</p>
      <button class="expel-button" @click="confirmDelete">확인</button>
      <button class="cancel-button" @click="cancelDelete">취소</button>
    </div>
  </div>

  <Popup401 v-if="show401Popup" />

</template>

<script>
import axios from "axios";
import store from "@/store/store";
import Popup401 from "@/components/Admin/401Popup.vue"; // Vuex store

export default {
  name: "ClubProfile",
  components:
      {
        Popup401
      },

  data() {
    return {
      currentPage: 1, // 페이지네이션 현재 페이지
      clubsPerPage: 10, // 페이지당 표시할 동아리 수
      clubs: [], // 현재 페이지에 표시할 클럽 리스트
      totalPages: 1, // 전체 페이지 수
      isPopupVisible: false, // 삭제 팝업 가시성
      isClubInfoPopupVisible: false, // 상세 팝업 가시성
      adminPw: "", // 삭제를 위한 비밀번호
      adminPwError: "",
      clubToDelete: null, // 삭제할 클럽 ID
      deleteIndex: null, // 삭제할 클럽의 인덱스
      PopupClubName: null, // 삭제할 클럽 이름
      show401Popup: false  // 401 팝업
    };
  },

  created() {
    this.fetchClubs(); // 페이지 로드 시 동아리 리스트 가져오기
  },

  methods: {
    // 401 에러 처리를 위한 공통 함수
    handle401Error(error) {
      if (error.response && error.response.status === 401) {
        this.show401Popup = true;
        return true;
      }
      return false;
    },
    // 클럽 리스트 가져오기
    async fetchClubs() {
      try {
        const response = await axios.get("https://api.donggurami.net/admin/clubs", {
          headers: {
            Authorization: `Bearer ${store.state.accessToken}`,
          },
          params: {
            page: this.currentPage - 1, // 백엔드는 0부터 시작
            size: this.clubsPerPage, // 페이지당 클럽 개수
          },
        });

        // 응답 처리
        const { content, totalPages } = response.data.data;
        this.clubs = content || []; // 현재 페이지 클럽 리스트
        this.totalPages = totalPages || 1; // 전체 페이지 수
      } catch (error) {
        if (!this.handle401Error(error)) {
          console.error('Error updating member:', error);
        }
      }
    },

    // 페이지 설정
    async setPage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page; // 현재 페이지 업데이트
        await this.fetchClubs(); // 새로운 데이터 가져오기
      }
    },

    // 이전 페이지
    async prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        await this.fetchClubs();
      }
    },

    // 다음 페이지
    async nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        await this.fetchClubs();
      }
    },

    // 삭제 팝업 열기
    openPopup(clubUUID, index, clubName) {
      this.PopupClubName = clubName;
      this.clubToDelete = clubUUID;
      this.deleteIndex = index;
      this.isPopupVisible = true;
    },

    // 삭제 팝업 닫기
    cancelDelete() {
      this.isPopupVisible = false;
      this.adminPw = ""; // 비밀번호 초기화
    },

    // 클럽 삭제 확인
    async confirmDelete() {
      if (!this.adminPw) {
        alert("관리자 비밀번호를 입력하세요.");
        return;
      }
      try {
        await axios.delete(`https://api.donggurami.net/admin/clubs/${this.clubToDelete}`, {
          headers: {
            Authorization: `Bearer ${store.state.accessToken}`,
          },
          data: { adminPw: this.adminPw },
        });
        this.clubs.splice(this.deleteIndex, 1); // 삭제된 클럽 리스트에서 제거
        this.isPopupVisible = false;
        alert("동아리가 성공적으로 삭제되었습니다.");
      } catch (error) {
        if (!this.handle401Error(error)) {
          console.error('Error updating member:', error);
        }
        if(error.response.status === 400){
          this.adminPwError = "* 비밀번호를 다시 확인해주세요."
        }
      }
    },

    // 상세 정보 팝업 열기
    openPopupClubInfo(club) {
      // 토큰을 localStorage에 저장
      localStorage.setItem('accessToken', store.state.accessToken);

      // 새 창의 크기와 위치 설정
      const width = 712;
      const height = 960;

      // clubId만 URL 파라미터로 전달
      window.open(
          `/club-popup?clubId=${club.clubUUID}`,
          "ClubInfo",
          `width=${width},height=${height},scrollbars=yes,resizable=yes`
      );
    },
  },
};
</script>



<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  margin: 0;
  padding: 20px;
}

.container {
  width: 820px;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 620px;
  /* 페이지네이션을 하단에 고정 */
  justify-content: space-between;
  margin-bottom: 30px;
}

.title {
  color: black;
  font-size: 25px;
  font-weight: bold;
  position: relative; /* 상대 위치 설정 */
  display: inline-block;
  z-index: 1; /* 텍스트가 배경색 위에 오도록 설정 */
  width: 830px;
  margin: 0 auto;
  box-sizing: border-box;
}


/* Header Section */
.header {
  width: 820px;
  background-color: #ffffff;
  border-radius: 8px;
  margin: 20px auto;
  padding: 0 20px 0 20px;
}

.header-row {
  display: flex;
  text-align: center;
  background-color: white;
  font-weight: bold;
  border-radius: 8px;
}

.header-item-department{
  flex: 1;
  padding: 10px 0; /* 헤더의 상하 여백을 조정 */
  line-height: 1.5; /* 줄 높이를 조정하여 텍스트의 세로 위치 조정 */
}

.header-item-clubname{
  flex: 1;
  padding: 10px 0; /* 헤더의 상하 여백을 조정 */
  line-height: 1.5; /* 줄 높이를 조정하여 텍스트의 세로 위치 조정 */
}

.header-item-clubleader{
  flex: 1;
  padding: 10px 0; /* 헤더의 상하 여백을 조정 */
  line-height: 1.5; /* 줄 높이를 조정하여 텍스트의 세로 위치 조정 */
}

.header-item-numberOfClubMembers{
  flex: 1;
  padding: 10px 0; /* 헤더의 상하 여백을 조정 */
  line-height: 1.5; /* 줄 높이를 조정하여 텍스트의 세로 위치 조정 */
}

.header-item-delete{
  flex: 0.4;
  padding: 10px 0; /* 헤더의 상하 여백을 조정 */
  line-height: 1.5; /* 줄 높이를 조정하여 텍스트의 세로 위치 조정 */
}

/* List Items Section */
.list {
  margin-bottom: 10px;
  background-color: white;
  border-radius: 5px;
  margin-top: 10px; /* 리스트를 아래로 20px 내림 */
  width: 800px;
}

.list-item-department {
  flex: 1;
  display: flex;
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: center; /* 가로 가운데 정렬 */
  font-size: 15px; /* 리스트 아이템의 글자 크기 키움 */
  font-weight: 500;
  cursor: pointer;
}

.list-item-clubname {
  flex: 1;
  display: flex;
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: center; /* 가로 가운데 정렬 */
  font-size: 15px; /* 리스트 아이템의 글자 크기 키움 */
  font-weight: 500;
  cursor: pointer;
}

.contact-info-popup .popup-header p {
  text-align: left; /* 텍스트를 왼쪽 정렬 */
  margin-right: 200px; /* 오른쪽 여백 */
  margin-top: -20px; /* 위로 여백 조정 */
  font-size: 16px; /* 기존 폰트 크기 유지 */
  font-weight: bold;
  line-height: 10.2; /* 줄 높이를 줄여서 위로 이동 */
}

.list-item-clubleader {
  flex: 1;
  display: flex;
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: center; /* 가로 가운데 정렬 */
  font-size: 15px; /* 리스트 아이템의 글자 크기 키움 */
  font-weight: 500;
  cursor: pointer;
}

.list-item-numberOfClubMembers {
  flex: 1;
  display: flex;
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: center; /* 가로 가운데 정렬 */
  font-size: 15px; /* 리스트 아이템의 글자 크기 키움 */
  font-weight: 500;
  cursor: pointer;
}

.list-item-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  width: 820px;
}

.list-item-row {
  display: flex;
  padding: 10px 0 10px 0;
  background-color: #F0F2F5;
  width: 745.44px; /* 줄여진 너비 */
  border-radius: 5px;
  height: 26px;
}

.list-item-row:hover {
  background-color: #e3e3e3; /* Change to gray on hover */
}

.list-item-delete {
  width: 74.55px;
  display: flex;
  align-items: center;
}

.delete-btn {
  background-color: #e57373;
  color: #ffffff;
  width: 70.55px;
  height: 44px;
  margin: 0 4px 0 4px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  visibility: visible;
  transition: visibility 0s, opacity 0.2s ease-in-out;
}

.delete-btn:hover {
  background-color: #e34141; /* Change to a darker red on hover */
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px; /* 위 리스트와의 간격 */
}

.pagination button{
  background: none;
  border: none;
  cursor: pointer;
  margin: 0 8px; /* 좌우 간격 */
  font-size: 14px; /* 텍스트 크기 */
  color: #aaa; /* 기본 색상 */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px; /* 버튼 크기 */
  height: 24px; /* 버튼 크기 */
}
.pagination span {
  border: none;
  background: none;
  cursor: pointer;
  margin: 0 8px; /* 각 버튼 간 간격 */
  font-size: 14px;
  font-weight: 400;
  color: #555; /* 기본 색상 */

}



.pagination button:disabled {
  opacity: 0.5; /* 비활성화된 버튼의 투명도 */
  cursor: not-allowed; /* 클릭 불가 */
}

.pagination .active {
  font-weight: bold;
  color: #ffc700; /* 활성화된 페이지의 색상 */
}

/* Popup Overlay and Popup Window */
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

.popup h3 {
  font-size: 18px;
  font-weight: bold;
  color: black;
  margin: 0;
}

.line2{
  border-bottom: 1px solid #d3d3d3;
  margin: 10px 0;
}

.popup-message {
  font-size: 16px;
  font-weight: 500;
  line-height: 12px;
  color: #2F2F2F;
  margin-top: 20px;
}

.popup input {
  width: 430px;
  padding: 10px;
  font-size: 14px; /* 입력 칸의 글씨 크기를 더 크게 */
  border: 1px solid #C6C6C6;
  border-radius: 8px;
}

.popup-warning {
  font-size: 12px;
  font-weight: 400;
  color: #FF4B4B;
  margin-left: 10px;
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

.cancel-button {
  background-color: #cccccc;
  color: white;
  border: none;
  padding: 7px 30px;
  border-radius: 7px;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  position: absolute;
  bottom: 20px;
  right: 120px;
}

.cancel-button:hover {
  background-color: #999999;
}

.socials a {
  margin: 0 10px;
}

.dots-button span {
  width: 5px;
  height: 5px;
  background: #767676;
  border-radius: 50%;
}


</style>