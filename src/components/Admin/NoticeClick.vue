<template>
  <div class="container">
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

    <div v-if="notice" class="notice-details">
      <div class="meta-info">
        <h1 class="notice-title">{{ notice.noticeTitle }}</h1>
        <div class="meta-line">
          <span class="notice-meta">{{ notice.adminName }}</span>
          <span class="notice-date"> {{ formattedDate(notice.noticeCreatedAt) }} </span>
        </div>
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

    <div class="notice-list">
      <table>
        <tbody>
        <tr v-for="n in notices" :key="n.noticeUUID" @click="goToNotice(n.noticeUUID)" :class="{ 'current-notice': notice && n.noticeUUID === notice.noticeUUID }">
          <td class="title-col">
              {{ n.noticeTitle }}
          </td>
          <td class="author-col">{{ n.adminName }}</td>
          <td class="date-col">{{ formattedDate(n.noticeCreatedAt) }}</td>
        </tr>
        </tbody>
      </table>
      
      <div class="notice-cards">
        <div v-for="n in notices" :key="n.noticeUUID" class="notice-card" @click="goToNotice(n.noticeUUID)" :class="{ 'current-notice': notice && n.noticeUUID === notice.noticeUUID }">
          <div class="card-title">{{ n.noticeTitle }}</div>
          <div class="card-meta">
            <span class="card-author">{{ n.adminName }}</span>
            <span class="card-date">{{ formattedDate(n.noticeCreatedAt) }}</span>
          </div>
        </div>
      </div>


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
// 스크립트 부분은 변경사항이 없으므로 기존 코드를 그대로 사용하시면 됩니다.
import store from '@/store/store';
import axios from 'axios';
import Popup401 from "@/components/Admin/401Popup.vue";

export default {
  components: { Popup401 },
  data() {
    return {
      notices: [], // 공지사항 목록
      notice: null, // 현재 선택된 공지사항
      currentPage: 1, // 현재 페이지 번호
      totalPages: 1, // 전체 페이지 수
      itemsPerPage: 5, // 페이지당 항목 수
      images: [], // 이미지 배열
      show401Popup: false, // 401 팝업
      totalNotices: 1, // 전체 공지사항 수
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
        const page = Math.max(this.currentPage - 1, 0);
        const size = this.itemsPerPage;

        const response = await axios.get(
            `${store.state.apiBaseUrl}/notices?page=${page}&size=${size}`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
        );

        if (response.data.data && response.data.data.content) {
          this.notices = response.data.data.content;
          this.totalPages = response.data.data.totalPages || 1;
          this.totalNotices = response.data.data.totalElements || 1;
        } else {
          this.notices = [];
        }
      } catch (error) {
        if (!this.handle401Error(error)) {
          // alert("공지사항 목록을 불러오는 데 실패했습니다.");
        }
      }
    },
    async fetchNotice(noticeUUID) {
      try {
        const response = await axios.get(`${store.state.apiBaseUrl}/notices/${noticeUUID}`, {
          headers: { Authorization: `Bearer ${store.state.accessToken}` },
        });

        if (response.data && response.data.data) {
          this.notice = response.data.data;

          const allNoticesResponse = await axios.get(
              `${store.state.apiBaseUrl}/notices?page=0&size=${this.totalNotices || 999}`, // totalNotices가 0일 경우 대비
              {
                headers: { Authorization: `Bearer ${store.state.accessToken}` },
              }
          );

          if(allNoticesResponse.data.data.content) {
            const allNotices = allNoticesResponse.data.data.content;
            this.currentNoticeIndex = allNotices.findIndex(n => n.noticeUUID === noticeUUID);

            const newPage = Math.floor(this.currentNoticeIndex / this.itemsPerPage) + 1;
            if (this.currentPage !== newPage) {
              this.currentPage = newPage;
              this.fetchNotices();
            }
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
        console.error("공지사항 상세 정보를 불러오기 실패:", error);
      }
    },
    handleImageError(index) {
      this.images[index].src = require('@/assets/rigth.png');
    },
    async fetchAndGoToNotice(index) {
        try {
            const allNoticesResponse = await axios.get(
                `${store.state.apiBaseUrl}/notices?page=0&size=${this.totalNotices || 999}`,
                { headers: { Authorization: `Bearer ${store.state.accessToken}` } }
            );
            const allNotices = allNoticesResponse.data.data.content;
            if (allNotices && allNotices[index]) {
                this.goToNotice(allNotices[index].noticeUUID);
            }
        } catch(error) {
            console.error("이전/다음 공지사항 로드 실패", error);
        }
    },
    prevNotice() {
      const prevIndex = (this.currentNoticeIndex - 1 + this.totalNotices) % this.totalNotices;
      this.fetchAndGoToNotice(prevIndex);
    },
    nextNotice() {
      const nextIndex = (this.currentNoticeIndex + 1) % this.totalNotices;
      this.fetchAndGoToNotice(nextIndex);
    },
    async changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        await this.fetchNotices();
      }
    },
    goToNotice(noticeUUID) {
      this.$router.push({ name: 'NoticeClick', params: { noticeUUID } });
    },
    formattedDate(dateString) {
      return new Date(dateString).toLocaleDateString('ko-KR');
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
/* --- 공통 및 데스크톱 스타일 --- */
* {
  box-sizing: border-box;
}

/* 수정 후 CSS */
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px auto; /* 좌우 패딩을 %로 설정 */
    margin: 20px auto 40px; /* 마진을 auto로 설정해 중앙 정렬 */
    max-width: 817px; /* 컨텐츠 최대 너비 설정 */
    width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 800px; /* 상세/목록 너비와 맞춤 */
  margin-bottom: 20px;
}

.nav-button {
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 12px;
  color: #555;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
}
.nav-button:hover {
  background-color: #f5f5f5;
}

.nav-icon {
  width: 12px;
  height: 12px;
  margin: 0 5px;
}

/* --- 공지사항 상세 --- */
.notice-details {
  width: 100%;
  max-width: 817px;
  min-height: 400px; /* 최소 높이 조정 */
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
  border: 1px solid #eee;
}

.meta-info {
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 20px;
}

.notice-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
  line-height: 1.4;
  color: #333;
}

.meta-line {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
}

.notice-meta {
  font-size: 14px;
  color: #555;
}

.notice-date {
  font-size: 14px;
  color: #888;
}

.notice-content {
  font-size: 16px;
  line-height: 1.7;
  color: #444;
  word-wrap: break-word;
  white-space: pre-wrap; /* v-html과 함께 사용 시 줄바꿈 유지 */
}

.notice-images {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-top: 30px;
}

.image-container {
  width: 100%;
  max-width: 300px;
}

.actions {
  display: flex;
  justify-content: center;  /* 가운데 정렬로 변경 */
  margin-top: -30px;        /* 버튼과 위 요소 간 거리 */
  margin-left: 0;           /* 왼쪽 여백 제거 */
}

.notice-image {
  width: 100%;
  height: auto; /* 이미지 비율 유지 */
  border-radius: 8px;
  object-fit: cover;
}


/* --- 공지사항 목록 --- */
.notice-list {
  width: 100%;
  max-width: 817px;
  height: auto;
  background-color: white;
  padding: 10px 20px 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 20px auto 0 auto;
  display: flex;
  justify-content: center;
  overflow-x: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
table tr {
  cursor: pointer;
  transition: background-color 0.2s;
}
table tr:hover {
  background-color: #f9f9f9;
}

.title-col { width: 60%; }
.author-col { width: 20%; }
.date-col { width: 20%; }

td {
  padding: 15px 10px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  font-size: 15px;
}

td.title-col {
  text-align: left;
  white-space: nowrap;
}

tr.current-notice td {
  background-color: #FFFBEF;
  font-weight: bold;
  color: #D97706;
}

/* --- 페이지네이션 --- */
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.pagination-number {
  font-size: 14px;
  color: #555;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
}
.pagination-number:hover {
  background-color: #f0f0f0;
}
.pagination-number.active {
  font-weight: bold;
  color: #FFB052;
  background-color: #FFFBEF;
}

.pagination-button {
  background: none;
  border: none;
  cursor: pointer;
}
.pagination-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-icon {
  width: 12px;
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
  display: flex;
  justify-content: center;
  overflow-x: hidden;
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

.popup {
  position: fixed; /* 고정 위치 */
  top: 50%;         /* 수직 중앙 */
  left: 50%;        /* 수평 중앙 */
  transform: translate(-50%, -50%); /* 정확한 중앙 배치 */
  
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 500px;
  height: 180px;
  z-index: 1001; /* overlay보다 높게 */
}

.popup h2 {
  margin-top: 0;
  text-align: left;
  font-size: 16px; /* 👈 여기서 줄이세요 (기존 24px → 18px 추천) */
  font-weight: 500; /* 굵기도 조절 가능 */
}

hr {
  border: none;
  border-top: 1px solid #ccc;
  margin: 10px 0;
}
.confirm-message {
  text-align: left;
}
.popup-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 40px;
}
/* .popup-buttons button {
  width: 80px;
  height: 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-left: 10px;
  background: #ffb052;
  color: white;
} */


/* 팝업 전체 화면 덮는 반투명 배경 */
.popup-overlay {
  position: fixed;
  top: 0; 
  left: 0;
  width: 100%; 
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

/* 팝업 박스: 452x182 고정 크기, 중앙 정렬 */
.write-popup {
  position: absolute;
  width: 452px;
  height: 182px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  box-sizing: border-box;
  padding: 20px; /* 내부 여백 */
  
  display: flex;
  flex-direction: column; /* 위->아래로 배치 */
}

/* 제목: 왼쪽 정렬, 폰트 크기/두께 조정 */
.popup-title {
  margin: 0;
  font-size: 16px; /* 필요 시 조정 */
  font-weight: 700;
  text-align: left;
  color: #333;
}

/* 구분선 */
.popup-divider {
  width: 100%;
  height: 1px;
  background-color: #ECECEC; /* 연한 회색 */
  margin: 8px 0;
}

/* 메시지: 왼쪽 정렬 */
.popup-message {
  margin: 0;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: left;
  color: #666;
  line-height: 1.4;
  /* flex: 1;  // 필요한 경우 버튼을 하단으로 밀고 싶으면 사용 */
}

/* 버튼 컨테이너: 오른쪽 정렬 */
.popup-buttons {
  display: flex;
  justify-content: flex-end;
}



</style> 