<template>
  <div class="title">동아리 리스트</div>
  <!-- 동아리 리스트 -->
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
          <button class="delete-btn" @click.stop="openPopup(club.clubUUID, index, club.clubName)">삭제</button>
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
      <input v-model="adminPw" type="password" placeholder="관리자 비밀번호를 입력해 주세요." />
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
      currentPage: 1,
      clubsPerPage: 10,
      clubs: [],
      totalPages: 1,
      isPopupVisible: false,
      isClubInfoPopupVisible: false,
      adminPw: "",
      adminPwError: "",
      clubToDelete: null,
      deleteIndex: null,
      PopupClubName: null,
      show401Popup: false
    };
  },

  created() {
    this.fetchClubs();
  },

  methods: {
    handle401Error(error) {
      if (error.response && error.response.status === 401) {
        this.show401Popup = true;
        return true;
      }
      return false;
    },
    async fetchClubs() {
      try {
        const response = await axios.get(`${store.state.apiBaseUrl}/admin/clubs`, {
          headers: {
            Authorization: `Bearer ${store.state.accessToken}`,
          },
          params: {
            page: this.currentPage - 1,
            size: this.clubsPerPage,
          },
        });

        const { content, totalPages } = response.data.data;
        this.clubs = content || [];
        this.totalPages = totalPages || 1;
      } catch (error) {
        if (!this.handle401Error(error)) {
          console.error('Error updating member:', error);
        }
      }
    },

    async setPage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
        await this.fetchClubs();
      }
    },

    async prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        await this.fetchClubs();
      }
    },

    async nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        await this.fetchClubs();
      }
    },

    openPopup(clubUUID, index, clubName) {
      this.PopupClubName = clubName;
      this.clubToDelete = clubUUID;
      this.deleteIndex = index;
      this.isPopupVisible = true;
    },

    cancelDelete() {
      this.isPopupVisible = false;
      this.adminPw = "";
      this.adminPwError = "";
    },

    async confirmDelete() {
      if (!this.adminPw) {
        alert("관리자 비밀번호를 입력하세요.");
        return;
      }
      try {
        await axios.delete(`${store.state.apiBaseUrl}/admin/clubs/${this.clubToDelete}`, {
          headers: {
            Authorization: `Bearer ${store.state.accessToken}`,
          },
          data: { adminPw: this.adminPw },
        });
        this.clubs.splice(this.deleteIndex, 1);
        this.isPopupVisible = false;
        alert("동아리가 성공적으로 삭제되었습니다.");
      } catch (error) {
        const { code } = error.response?.data || {};
        if (!this.handle401Error(error)) {
          if(code === 'ADM-202'){
            this.adminPwError = "* 비밀번호를 다시 확인해주세요."
          } else if(code === 'CLUB-201'){
            alert("존재하지않는 동아리 입니다.");
          } else if(code === 'INVALID_UUID_FORMAT'){
            alert("유효하지 않은 UUID 형식입니다. 올바른 UUID를 입력하세요.");
          } else {
            alert("예기치 못한 오류 발생");
          }
        }
      }
    },

    openPopupClubInfo(club) {
      localStorage.setItem('accessToken', store.state.accessToken);
      const width = 715;
      const height = 820;
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
/* 전체 박스 사이징을 border-box로 */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* 기본 바디 */
body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  margin: 0;
  padding: 20px;
  min-width: 370px; /* 최소 viewport 고려 */
  overflow-x: hidden;
}

/* 컨테이너: clamp으로 반응형 폭 제어 (최소 370px, 최대 820px) */
.container {
  width: clamp(370px, 92vw, 820px);
  margin: 0 auto 30px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* 타이틀: 고정 830 제거, 반응형으로 중앙 배치 */
.title {
  color: black;
  font-size: clamp(18px, 4vw, 25px);
  font-weight: bold;
  display: block;
  text-align: center;
  margin: 0 0 16px;
  width: clamp(370px, 92vw, 830px);
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}

/* Header Section: clamp로 폭 제어, 중앙 배치 */
.header {
  width: clamp(370px, 92vw, 820px);
  margin: 20px auto;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 0 12px;
  box-sizing: border-box;
}

/* header-row: flex로 칸 분배 */
.header-row {
  display: flex;
  text-align: center;
  background-color: white;
  font-weight: bold;
  border-radius: 8px;
  align-items: center;
}

/* 헤더 항목: flex 기준으로 비율 조정 (필요시 조정) */
.header-item-department{ flex: 1; padding: 10px 6px; line-height: 1.4; }
.header-item-clubname{ flex: 2; padding: 10px 6px; line-height: 1.4; }
.header-item-clubleader{ flex: 1.2; padding: 10px 6px; line-height: 1.4; }
.header-item-numberOfClubMembers{ flex: 0.8; padding: 10px 6px; line-height: 1.4; }
.header-item-delete{ flex: 0.6; padding: 10px 6px; line-height: 1.4; }

/* List */
.list {
  margin-bottom: 10px;
  background-color: white;
  border-radius: 5px;
  margin-top: 10px;
  width: 100%;
}

/* 각 항목 컨테이너: 전체 폭, min-width 제거로 모바일에서 잘림 방지 */
.list-item-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  width: 100%;
  max-width: 100%;
  min-width: 0; /* overflow 방지 */
  gap: 8px;
}

/* row는 flex로 내부 칸들을 분배 */
.list-item-row {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #F0F2F5;
  border-radius: 5px;
  flex: 1 1 auto; /* 남은 공간 차지 */
  min-width: 0; /* 텍스트 오버플로우 방지 */
  cursor: pointer;
  gap: 8px;
  height: auto;
}

/* 호버 스타일 */
.list-item-row:hover {
  background-color: #e3e3e3;
}

/* 리스트 내부 칸: header와 같은 비율로 맞춤 */
.list-item-department { flex: 1; display:flex; justify-content:center; align-items:center; font-size: clamp(12px, 2.5vw, 15px); font-weight:500; }
.list-item-clubname { flex: 2; display:flex; justify-content:center; align-items:center; font-size: clamp(12px, 2.5vw, 15px); font-weight:500; word-break:break-word; }
.list-item-clubleader { flex: 1.2; display:flex; justify-content:center; align-items:center; font-size: clamp(12px, 2.5vw, 15px); font-weight:500; }
.list-item-numberOfClubMembers { flex: 0.8; display:flex; justify-content:center; align-items:center; font-size: clamp(12px, 2.5vw, 15px); font-weight:500; }

/* 삭제 버튼 칸: 고정 너비가 너무 크면 축소되도록 수정 */
.list-item-delete {
  width: 74px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 64px;
}

/* 삭제 버튼: 크기를 반응형으로 */
.delete-btn {
  background-color: #e57373;
  color: #ffffff;
  width: 100%;
  max-width: 84px;
  height: 36px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

/* 버튼 hover */
.delete-btn:hover { background-color: #e34141; }

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 6px;
}

/* pagination 버튼 */
.pagination button {
  background: none;
  border: none;
  cursor: pointer;
  margin: 0 4px;
  font-size: 14px;
  color: #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  padding: 4px;
  border-radius: 6px;
}
.pagination button img { width: 18px; height: 18px; }

/* active page */
.pagination .active {
  font-weight: bold;
  color: #ffc700;
}

/* disabled */
.pagination button:disabled { opacity: 0.5; cursor: not-allowed; }

/* 팝업 스타일: input 등 반응형으로 */
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
  padding: 20px;
  box-sizing: border-box;
}

.popup {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  text-align: left;
  position: relative;
}

.popup h3 { font-size: 18px; font-weight: bold; margin: 0; }
.line2 { border-bottom: 1px solid #d3d3d3; margin: 10px 0; }
.popup-message { font-size: 16px; font-weight: 500; color: #2F2F2F; margin-top: 16px; }

.popup input {
  width: 100%;
  max-width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #C6C6C6;
  border-radius: 8px;
  margin-top: 12px;
  box-sizing: border-box;
}

.popup-warning { font-size: 12px; color: #FF4B4B; margin-top: 8px; }

/* 팝업 버튼 위치 조정 (반응형) */
.expel-button {
  background-color: #FFB052;
  color: white;
  border: none;
  padding: 8px 22px;
  border-radius: 7px;
  font-size: 16px;
  cursor: pointer;
  position: absolute;
  bottom: 16px;
  right: 16px;
}
.cancel-button {
  background-color: #cccccc;
  color: white;
  border: none;
  padding: 8px 22px;
  border-radius: 7px;
  font-size: 16px;
  cursor: pointer;
  position: absolute;
  bottom: 16px;
  right: 116px;
}

/* 반응형 미디어 쿼리: 아주 작은 화면에서 레이아웃 보정 */
@media (max-width: 420px) {
  .container {
    width: 96%;
    padding: 12px;
  }
  .title { font-size: clamp(16px, 6vw, 22px); width: 100%; }
  .header { padding: 0 8px; }
  .header-row { font-size: 14px; }
  .list-item-row { padding: 8px; gap: 6px; }
  .delete-btn { height: 34px; }
  .expel-button, .cancel-button { bottom: 12px; right: 12px; padding: 6px 14px; font-size: 14px; }
}

/* 필요시 긴 텍스트 줄바꿈 보장 */
.list-item-clubname, .list-item-clubleader {
  word-break: break-word;
  white-space: normal;
}
</style>
