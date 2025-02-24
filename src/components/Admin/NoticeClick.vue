<template>
  <div class="container">
    <!-- 이전 공지 / 다음 공지 -->
    <div class="header">
      <button class="nav-button" @click="prevNotice">
        <img src="@/assets/left.png" alt="Previous" class="nav-icon" />
        이전 공지
      </button>
      <button class="nav-button" @click="nextNotice">
        다음 공지
        <img src="@/assets/rigth.png" alt="Next" class="nav-icon" />
      </button>
    </div>


    <!-- 삭제 팝업창 -->
    <div v-if="showDeletePopup" class="delete-popup-overlay">
      <div class="delete-popup">
        <p class="popup-title">공지사항 삭제</p>
        <div class="popup-divider"></div>

        <p>
          <span class="popup-highlight">작성된 공지사항을 삭제하시겠습니까?</span><br /><br />
          삭제된 글은 복구할 수 없습니다.
        </p>
        <div class="popup-buttons">
          <button @click="cancelDelete" class="cancel-button">취소</button>
          <button @click="confirmDelete" class="confirm-button">삭제</button>
        </div>
      </div>
    </div>

    

    <!-- 공지사항 상세보기 -->
    <div v-if="notice" class="notice-details">
      <div class="meta-info">
        <p>
          <span class="notice-title">{{ notice.noticeTitle }}</span>
          <span class="notice-meta">{{ notice.adminName }} | </span>
          <span class="notice-date"> {{ formattedDate(notice.noticeCreatedAt) }} </span> 
        </p>
      </div>
      <div class="notice-content" v-html="convertNewlinesToBr(notice.noticeContent)"></div>

      <div class="notice-images" v-if="images.length > 0">
        <div v-for="(image, index) in images" :key="index" class="image-container">
        <img
          :src="image.src"
          alt="Notice Image"
          class="notice-image"
          @error="handleImageError(index)" />
      </div>

      </div>
    </div>



    <div class="actions">
      <button class="edit-button" @click="editNotice">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="edit-icon">
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M14.44 5.78L4.198 16.02a2 2 0 0 0-.565 1.125l-.553 3.774l3.775-.553A2 2 0 0 0 7.98 19.8L18.22 9.56m-3.78-3.78l2.229-2.23a1.6 1.6 0 0 1 2.263 0l1.518 1.518a1.6 1.6 0 0 1 0 2.263l-2.23 2.23M14.44 5.78l3.78 3.78"
          />
        </svg>
        수정
      </button>

      <button class="delete-button" @click="showDeletePopup = true" :disabled="!notice">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="delete-icon">
          <path
            fill="#FF6F6F"
            d="M7.616 20q-.672 0-1.144-.472T6 18.385V6H5V5h4v-.77h6V5h4v1h-1v12.385q0 .69-.462 1.153T16.384 20zM17 6H7v12.385q0 .269.173.442t.443.173h8.769q.23 0 .423-.192t.192-.424zM9.808 17h1V8h-1zm3.384 0h1V8h-1zM7 6v13z"
          />
        </svg>
        삭제
      </button>
    </div>


    <!-- 공지사항 목록 -->
    <div class="notice-list">
      <table>
        <thead>
        <tr>
          <th class="title-col">제목</th>
          <th class="author-col">작성자</th>
          <th class="date-col">작성일</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="notice in notices" :key="notice.noticeUUID">
          <td class="title-col">
            <button @click="goToNotice(notice.noticeUUID)" class="title-button">
              {{ notice.noticeTitle }}
            </button>
          </td>
          <td class="author-col">{{ notice.adminName }}</td>
          <td class="date-col">{{ formattedDate(notice.noticeCreatedAt) }}</td>
        </tr>
        </tbody>
      </table>

      <!-- 페이지네이션 -->
      <div class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="pagination-button">
          <img src="@/assets/left.png" alt="Previous" class="pagination-icon" />
        </button>
        <span
          v-for="page in totalPages"
          :key="page"
          @click="changePage(page)"
          :class="{ active: page === currentPage }"
          class="pagination-number"
        >
          {{ page }}
        </span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="pagination-button">
          <img src="@/assets/rigth.png" alt="Next" class="pagination-icon" />
        </button>
      </div>
    </div>
  </div>

  <Popup401 v-if="show401Popup" />

</template>

<script>
import store from '@/store/store';
import axios from 'axios';
import Popup401 from "@/components/Admin/401Popup.vue";

export default {
  components: { Popup401 },
  data() {
    return {
      notices: [], // 공지사항 목록
      notice: null, // 현재 선택된 공지사항
      showDeletePopup: false, // 삭제 팝업 상태
      currentPage: 1, // 현재 페이지 번호
      totalPages: 1, // 전체 페이지 수
      itemsPerPage: 5, // 페이지당 항목 수
      images: [], // 이미지 배열
      show401Popup: false, // 401 팝업
      totalNotices: 0, // 전체 공지사항 수
      currentNoticeIndex: 0 // 현재 공지사항의 전체 인덱스
    };
  },
  created() {
    this.fetchNotices();
    this.fetchNotice(this.$route.params.noticeUUID);
  },
  mounted() {
    this.initializePage();
  },
  methods: {
    initializePage() {
      const isFirstVisit = localStorage.getItem("firstVisit") === null;
      const reloaded = sessionStorage.getItem("reloaded");

      if (isFirstVisit) {
        localStorage.setItem("firstVisit", "true");
        sessionStorage.setItem("reloaded", "true");
        window.location.reload();
      } else if (!reloaded) {
        sessionStorage.setItem("reloaded", "true");
        window.location.reload();
      } else {
        sessionStorage.removeItem("reloaded");
      }
    },
    handle401Error(error) {
      if (error.response && error.response.status === 401) {
        this.show401Popup = true;
        return true;
      }
      return false;
    },
    convertNewlinesToBr(text) {
      return text ? text.replace(/\n/g, '<br>') : '';
    },
    async fetchNotices() {
      try {
        const accessToken = store.state.accessToken;
        const response = await axios.get(
            `http://15.164.246.244:8080/notices?page=${this.currentPage - 1}&size=${this.itemsPerPage}`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
        );
        this.notices = response.data.data.content || [];
        this.totalPages = response.data.data.totalPages || 1;
        this.totalNotices = response.data.data.totalElements || 0; // 전체 공지사항 수 저장
      } catch (error) {
        if (!this.handle401Error(error)) {
          console.error('Error fetching notices:', error);
        }
      }
    },
    async fetchNotice(noticeUUID) {
      try {
        const response = await axios.get(`http://15.164.246.244:8080/notices/${noticeUUID}`, {
          headers: { Authorization: `Bearer ${store.state.accessToken}` },
        });

        if (response.data && response.data.data) {
          this.notice = response.data.data;

          // 현재 공지사항의 전체 인덱스 찾기
          const allNoticesResponse = await axios.get(
              `http://15.164.246.244:8080/notices?page=0&size=${this.totalNotices}`,
              {
                headers: { Authorization: `Bearer ${store.state.accessToken}` },
              }
          );

          const allNotices = allNoticesResponse.data.data.content;
          this.currentNoticeIndex = allNotices.findIndex(n => n.noticeUUID === noticeUUID);

          // 현재 페이지 계산 및 업데이트
          const newPage = Math.floor(this.currentNoticeIndex / this.itemsPerPage) + 1;
          if (this.currentPage !== newPage) {
            this.currentPage = newPage;
            this.fetchNotices();
          }

          if (response.data.data.noticePhotos && response.data.data.noticePhotos.length > 0) {
            this.images = response.data.data.noticePhotos.map(photoUrl => ({
              src: photoUrl
            }));
          } else {
            this.images = [];
          }
        }
      } catch (error) {
        console.error("공지사항 불러오기 실패:", error);
      }
    },
    handleImageError(index) {
      this.images[index].src = require('@/assets/rigth.png');
    },
    async prevNotice() {
      const prevIndex = (this.currentNoticeIndex - 1 + this.totalNotices) % this.totalNotices;
      const allNoticesResponse = await axios.get(
          `http://15.164.246.244:8080/notices?page=0&size=${this.totalNotices}`,
          {
            headers: { Authorization: `Bearer ${store.state.accessToken}` },
          }
      );
      const allNotices = allNoticesResponse.data.data.content;
      this.goToNotice(allNotices[prevIndex].noticeUUID);
    },
    async nextNotice() {
      const nextIndex = (this.currentNoticeIndex + 1) % this.totalNotices;
      const allNoticesResponse = await axios.get(
          `http://15.164.246.244:8080/notices?page=0&size=${this.totalNotices}`,
          {
            headers: { Authorization: `Bearer ${store.state.accessToken}` },
          }
      );
      const allNotices = allNoticesResponse.data.data.content;
      this.goToNotice(allNotices[nextIndex].noticeUUID);
    },
    async changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        await this.fetchNotices();
      }
    },
    goToNotice(noticeUUID) {
      this.$router.push({ name: 'AdminNoticeClick', params: { noticeUUID } });
    },
    // 기존 관리자 기능 유지
    cancelDelete() {
      this.showDeletePopup = false;
    },
    async confirmDelete() {
      try {
        if (!this.notice || !this.notice.noticeUUID) {
          alert('삭제할 공지사항 정보가 없습니다.');
          return;
        }

        const accessToken = store.state.accessToken;
        const deleteUrl = `http://15.164.246.244:8080/notices/${this.notice.noticeUUID}`;

        const response = await axios.delete(deleteUrl, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.status === 200) {
          alert('공지사항이 성공적으로 삭제되었습니다.');
          this.notices = this.notices.filter((n) => n.noticeId !== this.notice.noticeUUID);
          this.showDeletePopup = false;
          this.$router.push({ name: 'Notice' });
        } else {
          alert(`삭제 실패: 상태 코드 ${response.status}`);
        }
      } catch (error) {
        if (!this.handle401Error(error)) {
          console.error('Error deleting notice:', error);
        }
      }
    },
    editNotice() {
      if (this.notice && this.notice.noticeUUID) {
        this.$router.push({ name: 'noticeedit', params: { noticeUUID: this.notice.noticeUUID } });
      } else {
        console.error('No notice available to edit.');
      }
    },
    formattedDate(dateString) {
      return new Date(dateString).toLocaleDateString();
    },
  },
  watch: {
    $route(to) {
      this.fetchNotice(to.params.noticeUUID);
    },
  },
};
</script>



<style scoped>


* {
  box-sizing: border-box;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  margin-top: 20px;
  margin-bottom: 40px;
}

.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 20px;
}

.nav-button {
  background: none;
  border: none;
  color: black;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.nav-icon {
  width: 12px;
  height: 12px;
  margin: 0 5px;
}

.notice-details {
  width: 817px;
  min-height: 626px; /* 최소 높이를 설정하여 기본 높이는 유지하되 */
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  /* height: 626px; 고정 높이를 제거하여 자동으로 늘어나게 합니다. */
  top: -50px; /* 위로 올리기 */
}


.notice-title {
  color: #333;
  font-size: 20px;
  font-family: Pretendard;
  font-weight: 700;
  margin-bottom: 10px;
}

.notice-meta {
  font-size: 14px;
  color: black;
  margin-left: 10px;
}

.notice-date {
  font-size: 14px;
  color: #868686; /* 날짜 배경색 */
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
}

.notice-content {
  word-wrap: break-word;  /* 긴 단어 줄바꿈 */
  overflow-wrap: break-word; /* 단어 단위로 줄바꿈 */
  white-space: normal; /* 기본 줄바꿈 허용 */
  max-width: 100%; /* 최대 너비 제한 */
}


.notice-images { 
  display: flex;
  flex-direction: column; /* 이미지를 세로로 배치 */
  align-items: center; /* 이미지들이 가운데 정렬되도록 설정 */
  grid-gap: 10px; /* 이미지 사이 간격 */
  margin-top: 20px;
}

.notice-image {
  width: 100%;
  height: 100%; /* 고정된 높이 설정 */
  object-fit: cover; /* 이미지 비율을 유지하면서 잘 맞추어 줍니다 */
  border-radius: 8px;
}

.popup-highlight {
  color: black;
  font-weight: bold;
}
.image-container {
  width: 100%;
  max-width: 300px;
}

.actions {
  display: flex;
  justify-content: flex-start; /* 왼쪽으로 정렬 */
  margin-top: 5px; /* 위에서 여백 추가 */
  margin-left: 550px; /* 왼쪽 정렬 */
}

.edit-button, .delete-button {
  background: #f0f0f0;
  border: none;
  border-radius: 4px;
  padding: 8px 20px 15px 20px; /* 위 5px, 오른쪽 20px, 아래 15px, 왼쪽 20px */
  margin: 0 5px;
  cursor: pointer;
  font-size: 16px;
  pointer-events: auto; /* 클릭 이벤트 허용 */
}

.edit-button {
  width: 95px;
  height: 37px;
  background-color: white;
  color: #8E8E8E;
  border: 1px solid #8E8E8E;
}

.delete-button {
  width: 95px;
  height: 37px;
  background-color: white;
  color: #FF6F6F;
  border: 1px solid #FF6F6F;
}
.delete-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명한 검은 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* 다른 요소 위에 보이게 설정 */
}

.delete-popup {
  background: #fff; /* 배경색 */
  padding: 24px; /* 내부 여백 */
  border-radius: 8px; /* 둥근 모서리 */
  width: 452px; /* 팝업 너비 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); /* 그림자 효과 */
  text-align: left; /* 텍스트 왼쪽 정렬 */
  display: flex;
  flex-direction: column;
  gap: 15px; /* 요소 간 여백 */
}

.popup-divider {
  border-top: 1px solid #ddd; /* 연한 회색 가로줄 */
  margin: 10px 0; /* 위아래 여백 설정 */
}


.popup-title {
  font-size: 18px;
  font-weight: bold;
  color: black;
  margin-bottom: 10px;
}

.delete-popup p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.popup-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px; /* 버튼 사이 여백 */
  margin-top: 10px;
}

.cancel-button,
.confirm-button {
  font-size: 14px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-button {
  background-color: #e0e0e0; /* 연한 회색 */
  color: #666;
}

.confirm-button {
  background-color: #FFB052; /* 강조 색상 */
  color: #fff; /* 글자색 흰색 */
}

.cancel-button:hover {
  background-color: #d5d5d5; /* 호버 시 색상 변경 */
}

/* .confirm-button:hover {
  background-color: #e09b4d;
} */

.cancel-button,
.confirm-button {
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.cancel-button {
  background-color: #ddd;
  color: #333;
}

.confirm-button {
  background-color:  #FFB052;
  color: #fff;
}
.notice-list {
  width: 817px;
  height: auto;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

td:nth-child(1),
td:nth-child(2),
td:nth-child(3) {
  background-color: #FFFFFF;
}

th {
  background-color: #FFFFFF;
  font-weight: bold;
}

button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center; /* 수직 정렬 */
  gap: 5px; /* 버튼 사이 간격 */
}

.pagination span {
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 400;
  line-height: 14px;
  letter-spacing: -0.025em;
  color: #000000;
  cursor: pointer;
  padding: 5px 5px;
}

.pagination span.active {
  font-weight: 700;
  color: #FFB052; /* 활성화된 페이지 색상 */
}

.pagination-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 400;
  line-height: 14px;
  color: #000000;
  cursor: pointer;
}

.pagination-button:hover {
  text-decoration: underline; /* 호버 효과 */
}

.pagination-icon {
  width: 12px; /* 아이콘 크기 */
  height: 12px;
  margin: 0 5px; /* 텍스트와 아이콘 간격 */
}

.author-name {
 
 font-family: Pretendard; /* 폰트 */
 font-size: 14px; /* 글씨 크기 */
 font-weight: 400; /* 글씨 굵기 */
 line-height: 14px; /* 줄 간격 */
 letter-spacing: -0.025em; /* 글자 간격 조정 */
 text-align: left; /* 왼쪽 정렬 */
 text-underline-position: from-font; /* 밑줄 위치 */
 text-decoration-skip-ink: none; /* 밑줄 효과 설정 */
 color:  #000000; /* 텍스트 색상 (추가) */
 padding: 2px 4px; /* 배경색과 텍스트 사이 여백 추가 (선택사항) */
}

.notice-list {
  width: 817px;
  height: auto;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed; /* 테이블 레이아웃을 고정으로 설정 */
}

/* 컬럼 너비 설정 */
.title-col {
  width: 60%; /* 제목 열의 너비를 60%로 설정 */
  text-align: center; /* 제목 열 중앙 정렬 */
}

.author-col {
  width: 20%; /* 작성자 열의 너비를 20%로 설정 */
}

.date-col {
  width: 20%; /* 작성일 열의 너비를 20%로 설정 */
}

th, td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  vertical-align: top; /* 상단 정렬 */
}

/* th 태그 전체 중앙 정렬 */
th {
  text-align: center;
}

td.title-col {
  overflow: hidden; /* 내용이 넘치면 숨김 */
  text-align: center; /* 제목 열 내용 중앙 정렬 */
}

.title-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  text-align: center; /* 버튼 텍스트 중앙 정렬 */
  width: 100%;
  white-space: normal; /* 자동 줄바꿈 허용 */
  word-break: break-word; /* 긴 단어도 줄바꿈 */
  line-height: 1.4; /* 줄 간격 설정 */
  padding: 0;
}

td.author-col, td.date-col {
  white-space: nowrap; /* 작성자와 날짜는 줄바꿈 방지 */
  overflow: hidden;
  text-overflow: ellipsis; /* 내용이 넘치면 ... 표시 */
  text-align: center; /* 중앙 정렬 추가 */
}

</style> 