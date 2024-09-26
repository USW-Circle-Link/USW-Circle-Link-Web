admin/clublist

<template>
  <div class="title">소속 동아리 리스트</div>
  <!-- Header Section -->
  <div class="header">
    <div class="header-row">
      <div class="header-item">소속 분과</div>
      <div class="header-item">동아리명</div>
      <div class="header-item">동아리장</div>
      <div class="header-item">인원</div>
      <div class="header-item"></div>
    </div>
  </div>

  <div class="container">
    <!-- List Items Section -->
    <div class="list">
      <div class="list-item-container" v-for="(club, index) in displayedClubs" :key="index">
        <div class="list-item-row">
          <div class="list-item">{{ club.department }}</div>
          <div class="list-item">{{ club.clubName }}</div>
          <div class="list-item">{{ club.leaderName }}</div>
          <div class="list-item">{{ club.numberOfClubMembers }}</div>
        </div>
        <div class="delete-container">
          <button class="delete-btn" @click="openPopup(club.clubId, index)">삭제</button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button @click="prevPage">
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
      <button @click="nextPage">
        <img src="@/assets/rigth.png" alt="Next" />
      </button>
    </div>
  </div>

  <!-- Popup for Deletion Confirmation -->
  <div v-if="isPopupVisible" class="popup-overlay">
    <div class="popup">
      <h3>삭제 확인</h3>
      <p>이 동아리를 삭제하시겠습니까?</p>
      <input v-model="adminPw" type="password" placeholder="관리자 비밀번호" />
      <div class="popup-buttons">
        <button @click="confirmDelete">확인</button>
        <button @click="cancelDelete">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import store from "@/store/store"; // Ensure Vuex store is imported

export default {
  data() {
    return {
      currentPage: 1,
      clubsPerPage: 10,
      clubs: [], // Array to store fetched clubs
      isPopupVisible: false, // Popup visibility flag
      adminPw: '', // Input password for deletion
      clubToDelete: null, // ID of the club to delete
      deleteIndex: null, // Index of the club in the array
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.clubs.length / this.clubsPerPage);
    },
    displayedClubs() {
      const start = (this.currentPage - 1) * this.clubsPerPage;
      return this.clubs.slice(start, start + this.clubsPerPage);
    }
  },
  methods: {
    async fetchClubs() {
      try {
        const response = await axios.get('http://15.164.246.244:8080/admin/clubs', {
          headers: {
            'Authorization': `Bearer ${store.state.accessToken}` // Correct usage of the store
          }
        });
        this.clubs = response.data.data; // Store the fetched clubs in the data array
      } catch (error) {
        console.error('Error fetching clubs:', error);
        alert('동아리 리스트를 불러오는데 실패했습니다.');
      }
    },
    openPopup(clubId, index) {
      this.clubToDelete = clubId;
      this.deleteIndex = index;
      this.isPopupVisible = true; // Open popup
    },
    cancelDelete() {
      this.isPopupVisible = false; // Close popup
      this.adminPw = ''; // Reset password
    },
    async confirmDelete() {
      if (!this.adminPw) {
        alert('관리자 비밀번호를 입력하세요.');
        return;
      }

      try {
        const response = await axios.delete(`http://15.164.246.244:8080/admin/clubs/${this.clubToDelete}`, {
          headers: {
            'Authorization': `Bearer ${store.state.accessToken}` // Correct usage of the store
          },
          data: { adminPw: this.adminPw } // Send password as part of the request
        });
        console.log('Club deleted successfully:', response.data);
        alert('동아리가 성공적으로 삭제되었습니다.');
        this.clubs.splice(this.deleteIndex, 1); // Remove club from the list
        this.isPopupVisible = false; // Close popup
      } catch (error) {
        console.error('Error deleting club:', error);
        alert('동아리 삭제에 실패했습니다.');
      }
    },
    setPage(page) {
      this.currentPage = page;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  },
  created() {
    this.fetchClubs(); // Fetch clubs when the component is created
  }
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
}

.title {
  color: black;
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 10px;
}

/* Header Section */
.header {
  margin-bottom: 10px;
  background-color: white;
  border-radius: 5px;
  margin-top: 20px; /* 헤더를 아래로 20px 내림 */
}

.header-row {
  display: flex;
  text-align: center;
  background-color: white;
  font-weight: bold;
  width: 800px;
}

.header-item {
  flex: 1;
  text-align: end; /* 왼쪽 정렬 */
  padding: 10px 0; /* 헤더의 상하 여백을 조정 */
  line-height: 1.5; /* 줄 높이를 조정하여 텍스트의 세로 위치 조정 */
}

.header-item-row .header-item:nth-child(3), /* 동아리장 컬럼 */
.header-item-row .header-item:nth-child(4)  /* 인원 컬럼 */ {
  padding-left: 20px; /* 왼쪽으로 20px 옮기기 */
}

/* List Items Section */
.list {
  margin-bottom: 20px;
  margin-top: 20px; /* 리스트를 아래로 20px 내림 */
}

.list-item {
  flex: 1;
  display: flex;
  align-items: center; /* 세로 중앙 정렬 */
  padding-left: 60px; /* 데이터 항목의 좌측 여백 조정 */
  font-size: 18px; /* 리스트 아이템의 글자 크기 키움 */
}

.list-item-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.list-item-row {
  display: flex;
  padding: 10px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #e0e0e0;
  width: 730px; /* 줄여진 너비 */
  border-radius: 5px;
  height: 26px;
}

.delete-container {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.delete-btn {
  background-color: #e57373;
  color: #ffffff;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s, opacity 0.2s ease-in-out;
}

.list-item-container:hover .delete-btn {
  visibility: visible;
  opacity: 1;
}

/* Pagination */
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.pagination button {
  background: none;
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
  border: none;
}

.pagination button.active {
  color: #ffc700;
}
* Popup Overlay and Popup Window */
.popup-overlay {
  position: fixed; /* 화면 전체를 덮음 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 화면 상단에 표시 */
}

.popup {
  background-color: #fff;
  padding: 30px; /* 팝업 패딩을 조금 더 여유롭게 */
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 450px; /* 1.5배 키움 */
  z-index: 1001; /* 팝업창을 오버레이보다 위에 배치 */
}

.popup h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5em; /* 글씨 크기를 더 크게 */
}

.popup p {
  margin-bottom: 20px;
  font-size: 1.2em; /* 글씨 크기를 더 크게 */
}

.popup input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px; /* 입력 칸과 버튼 사이 간격 추가 */
  font-size: 1.2em; /* 입력 칸의 글씨 크기를 더 크게 */
  border: 1px solid #ccc;
  border-radius: 5px;
}

.popup-buttons {
  display: flex;
  justify-content: space-between;
}

.popup-buttons button {
  background-color: #ffc107; /* 확인 버튼 색상 변경 */
  color: #fff;
  border: none;
  padding: 10px 30px; /* 버튼 크기를 더 크게 */
  border-radius: 5px;
  font-size: 1.2em; /* 버튼 글씨 크기를 더 크게 */
  cursor: pointer;
  transition: background-color 0.3s;
}

.popup-buttons button:hover {
  background-color: #e0a800;
}

.popup-buttons button:last-child {
  background-color: #b0bec5;
}

.popup-buttons button:last-child:hover {
  background-color: #90a4ae;
}
</style>

