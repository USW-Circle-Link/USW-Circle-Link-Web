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
    padding: 20px 15% 0% 20px; /* 좌우 패딩을 %로 설정 */
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
  max-width: 500px; /* 이미지 최대 너비 */
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
  background-color: white;
  padding: 10px 20px 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
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
}

/* 모바일 카드 뷰 (기본 숨김) */
.notice-cards {
  display: none;
}


/* --- 반응형 디자인: 화면 너비 768px 이하 --- */
@media (max-width: 768px) {
  .notice-details {
    padding: 20px;
    min-height: auto;
  }

  .notice-title {
    font-size: 20px;
  }
  .meta-line {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  /* 목록: 테이블 숨기고 카드 보이기 */
  table {
    display: none;
  }
  .notice-cards {
    display: block;
  }

  .notice-card {
    padding: 15px 10px;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
  }
  .notice-card:last-child {
    border-bottom: none;
  }
  .notice-card.current-notice {
    background-color: #FFFBEF;
    border-radius: 4px;
  }
  .card-title {
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 8px;
    color: #333;
  }
  .card-meta {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #777;
  }
  .notice-card.current-notice .card-title,
  .notice-card.current-notice .card-meta {
    color: #D97706;
  }
  
  .pagination-number {
    padding: 4px 8px;
  }
}
</style>
