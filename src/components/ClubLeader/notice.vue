<template>
  <div class="container">
    <div class="contents">
      <h2 class="title">공지사항</h2>
      <div class="notices">
        <table>
          <thead>
            <tr>
              <th class="title-column">제목</th>
              <th class="author-column">작성자</th>
              <th class="date-column">작성일</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="notices.length === 0">
              <td colspan="3">공지사항이 없습니다.</td>
            </tr>
            <tr v-for="notice in notices" :key="notice.noticeUUID">
              <td class="title-column">
                <button @click="goToNotice(notice.noticeUUID, notice.adminName)" class="title-button">
                  {{ notice.noticeTitle }}
                </button>
              </td>
              <td class="author-column">{{ notice.adminName }}</td>
              <td class="date-column">{{ new Date(notice.noticeCreatedAt).toLocaleDateString('ko-KR') }}</td>
            </tr>
          </tbody>
        </table>

        <div class="notice-cards">
          <div v-if="notices.length === 0" class="no-notices-card">
            공지사항이 없습니다.
          </div>
          <div v-for="notice in notices" :key="notice.noticeUUID" class="notice-card" @click="goToNotice(notice.noticeUUID, notice.adminName)">
            <div class="card-title">{{ notice.noticeTitle }}</div>
            <div class="card-meta">
              <span class="card-author">{{ notice.adminName }}</span>
              <span class="card-date">{{ new Date(notice.noticeCreatedAt).toLocaleDateString('ko-KR') }}</span>
            </div>
          </div>
        </div>

        <div class="pagination">
          <button
            @click="prevPageGroup"
            :disabled="!showPrevGroup"
            class="arrow-button"
          >
            <img src="@/assets/left.png" alt="Previous" />
          </button>
          <button
            v-for="page in totalPagesArray"
            :key="page"
            @click="changePage(page)"
            :class="{ active: currentPage === page }"
          >
            {{ page }}
          </button>
          <button
            @click="nextPageGroup"
            :disabled="!showNextGroup"
            class="arrow-button"
          >
            <img src="@/assets/rigth.png" alt="Next" />
          </button>
        </div>
      </div>
    </div>
  </div>
  <Popup401 v-if="show401Popup" />
</template>

<script>
import store from '@/store/store';
import Popup401 from './401Popup.vue';

export default {
  components: {
    Popup401
  },
  data() {
    return {
      notices: [],
      currentPage: 1,
      itemsPerPage: 12,
      totalPages: 1,
      show401Popup: false,
      pageGroupSize: 5
    };
  },
  computed: {
    currentPageGroup() {
      return Math.ceil(this.currentPage / this.pageGroupSize);
    },
    startPage() {
      return (this.currentPageGroup - 1) * this.pageGroupSize + 1;
    },
    endPage() {
      const end = this.startPage + this.pageGroupSize - 1;
      return Math.min(end, this.totalPages);
    },
    totalPagesArray() {
      let pages = [];
      for (let i = this.startPage; i <= this.endPage; i++) {
        pages.push(i);
      }
      return pages;
    },
    showNextGroup() {
      return this.endPage < this.totalPages;
    },
    showPrevGroup() {
      return this.startPage > 1;
    }
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
    async fetchNotices() {
      try {
        const accessToken = store.state.accessToken;
        const response = await fetch(
            `${store.state.apiBaseUrl}/notices?page=${this.currentPage - 1}&size=${this.itemsPerPage}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
              },
            }
        );

        if (response.status === 401) {
          this.show401Popup = true;
          return;
        }

        const data = await response.json();

        if (data && data.data) {
          this.notices = Array.isArray(data.data.content) ? data.data.content : [];
          if (data.data.totalElements) {
            this.totalPages = Math.ceil(data.data.totalElements / this.itemsPerPage);
          }
        }
      } catch (error) {
        console.error('❌ Error fetching notices:', error);
        this.notices = [];
      }
    },
    goToNotice(noticeUUID) {
      // 라우팅 로직은 기존과 동일하게 유지
      this.$router.push({ name: 'NoticeClick', params: { noticeUUID: noticeUUID } });
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchNotices();
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.changePage(this.currentPage - 1);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.changePage(this.currentPage + 1);
      }
    },
    nextPageGroup() {
      if (this.showNextGroup) {
        this.changePage(this.endPage + 1);
      }
    },
    prevPageGroup() {
      if (this.showPrevGroup) {
        this.changePage(this.startPage - 1);
      }
    }
  },
  created() {
    this.fetchNotices();
  }
};
</script>

<style scoped>
/* 공통 및 데스크톱 스타일 */
* {
  box-sizing: border-box;
}

.container {
  display: flex;
  width: 100%;
  justify-content: center; /* 콘텐츠를 중앙에 배치 */
  padding: 0 auto; /* 좌우 여백 추가 */
}

.contents {
  width: 100%;
  max-width: 820px; /* 최대 너비 설정 */
}

.title {
  color: black;
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 10px;
}

.notices {
  width: 100%; /* 부모 요소에 맞춰 너비 조정 */
  height: auto;
  border-radius: 10px;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.title-column { width: 60%; }
.author-column { width: 20%; }
.date-column { width: 20%; }

th {
  padding: 10px;
  border-bottom: 2px solid #ddd;
  text-align: center;
  font-family: Pretendard, sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #393939;
}

td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: center;
  word-wrap: break-word;
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 제목 셀은 줄바꿈이 필요할 수 있으므로 nowrap 해제 */
td.title-column {
  white-space: normal;
  text-align: left; /* 제목은 좌측 정렬이 가독성이 좋음 */
}

.title-button {
  width: 100%;
  text-align: left;
  line-height: 1.4;
  padding: 5px 0;
  white-space: normal;
}

button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-family: inherit;
}

button:hover {
  text-decoration: underline;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination .arrow-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination button {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  padding: 5px;
  transition: all 0.3s ease;
}

.pagination button.active {
  color: #FFC700;
  font-weight: bold;
  transform: scale(1.2);
}

.pagination img {
  width: 10px;
  height: 10px;
}

h2 {
  margin-top: -15px;
}

/* 모바일 카드 뷰 스타일 (초기에는 숨김) */
.notice-cards {
  display: none;
}

/* 반응형 디자인: 화면 너비 768px 이하 */
@media (max-width: 768px) {
  .notices {
    padding: 15px;
  }
  
  /* 테이블 숨기기 */
  table {
    display: none;
  }

  /* 카드 목록 보이기 */
  .notice-cards {
    display: block;
  }
  
  .notice-card {
    padding: 15px 10px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
  }

  .notice-card:last-child {
    border-bottom: none;
  }
  
  .card-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
  }
  
  .card-meta {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #777;
  }
  
  .no-notices-card {
    padding: 20px;
    text-align: center;
    color: #888;
  }
  
  .title {
    font-size: 22px;
  }

  /* 페이지네이션 버튼 간격 조정 */
  .pagination button {
    margin: 0 2px;
  }
}
</style>