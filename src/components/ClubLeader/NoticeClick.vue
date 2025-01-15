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
            @error="handleImageError(index)"
          />
        </div>
      </div>
    </div>



    

    <!-- 공지사항 목록 -->
    <div class="notice-list">
      <table>
        <tbody>
          <tr v-for="notice in notices" :key="notice.noticeId">
            <td>
              <button @click="goToNotice(notice.noticeId)">{{ notice.noticeTitle }}</button>
            </td>
            <td>{{ notice.adminName }}</td>
            <td>{{ formattedDate(notice.noticeCreatedAt) }}</td>
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
</template>

<script>
import store from '@/store/store';
import axios from 'axios';

export default {
  data() {
    return {
      notices: [], // 공지사항 목록
      notice: null, // 현재 선택된 공지사항
      currentPage: 1, // 현재 페이지 번호
      totalPages: 1, // 전체 페이지 수
      itemsPerPage: 5, // 페이지당 항목 수
      images: [], // 이미지 배열
    };
  },
  created() {
    this.fetchNotices(); // 공지사항 목록 가져오기
    this.fetchNotice(this.$route.params.id); // 현재 공지사항 정보 가져오기
  },
  methods: {
    convertNewlinesToBr(text) {
      return text ? text.replace(/\n/g, '<br>') : ''; // 줄바꿈을 <br> 태그로 변환
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
        this.notices = response.data.data.content || []; // 공지사항 목록 설정
        this.totalPages = response.data.data.totalPages || 1; // 전체 페이지 수 설정
      } catch (error) {
        console.error('공지사항 목록을 가져오는 중 오류:', error);
      }
    },
    async fetchNotice(id) {
      try {
        const accessToken = store.state.accessToken;
        const response = await axios.get(`http://15.164.246.244:8080/notices/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        this.notice = response.data.data; // 공지사항 정보 설정
        this.loadImages(response.data.data.noticePhotos); // 이미지 설정
      } catch (error) {
        console.error('공지사항을 가져오는 중 오류:', error);
      }
    },
    loadImages(photoUrls) {
      if (Array.isArray(photoUrls)) {
        this.images = photoUrls.map((photoUrl) => ({ src: photoUrl }));
      }
    },
    handleImageError(index) {
      this.images[index].src = require('@/assets/rigth.png');
    },
    cancelDelete() {
      this.showDeletePopup = false;
    },
    
    handleError(error, message) {
      console.error(message, error);
      alert(`${message}: ${error.message}`);
    },
    prevNotice() {
      const currentIndex = this.notices.findIndex((n) => n.noticeId === this.notice.noticeId);
      const prevIndex = (currentIndex - 1 + this.notices.length) % this.notices.length;
      this.goToNotice(this.notices[prevIndex].noticeId); // 이전 공지 이동
    },
    nextNotice() {
      const currentIndex = this.notices.findIndex((n) => n.noticeId === this.notice.noticeId);
      const nextIndex = (currentIndex + 1) % this.notices.length;
      this.goToNotice(this.notices[nextIndex].noticeId); // 다음 공지 이동
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchNotices(); // 페이지 변경 시 공지사항 목록 다시 로드
      }
    },
    goToNotice(id) {
      this.$router.push({ name: 'NoticeClick', params: { id } }); // 공지사항 상세보기로 이동
    },
    
    formattedDate(dateString) {
      return new Date(dateString).toLocaleDateString();
    },
  },
  watch: {
    $route(to) {
      this.fetchNotice(to.params.id);
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
  font-size: 14px;
  color: #333;
  margin-top: 20px;
  line-height: 1.0;
  border-top: 0.5px solid  #868686; /* 회색 구분선 추가 */
  padding-top: 10px; /* 텍스트와 구분선 사이에 여백 추가 */
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

</style> 
