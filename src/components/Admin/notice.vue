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
      pageGroupSize: 5  // 페이지 그룹 크기 추가
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
       //최소 `size=1`로 설정하여 백엔드 에러 방지
    const pageSize = Math.max(this.itemsPerPage, 1); // 최소값 보장
    const currentPage = Math.max(this.currentPage - 1, 0); // 최소값 보장

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
      const currentPath = this.$route.path;
      if (currentPath.startsWith('/adminmain')) {
        this.$router.push({ name: 'AdminNoticeClick', params: { noticeUUID: noticeUUID } });
      } else {
        this.$router.push({ name: 'AdminNoticeClick', params: { noticeUUID: noticeUUID } });
      }
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
.title {
  color: black;
  font-size: clamp(18px, 4vw, 25px);
  font-weight: bold;
  margin-bottom: 10px;
  position: relative;
  display: inline-block;
  z-index: 1;
}

* {
  box-sizing: border-box;
}

.container {
  display: flex;
  min-width: 390px;
  overflow-x: hidden;
}

.contents {
  flex: 1;
}

.notices {
  width: 100%;
  max-width: 820px;
  min-width: 390px;
  height: auto;
  border-radius: 10px;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.title-column {
  width: 60%;
  font-size: clamp(15px, 3.24vw, 21.6px);
}

.author-column {
  width: 20%;
  font-size: clamp(13px, 2.76vw, 18.4px);
}

.date-column {
  width: 20%;
  font-size: clamp(13px, 2.76vw, 18.4px);
}

th {
  padding: 10px;
  border-bottom: 2px solid #ddd;
  text-align: center;
  background-color: white;
  font-family: Pretendard;
  font-size: clamp(14px, 3vw, 20px);
  font-weight: 700;
  line-height: 23.87px;
  color: #393939;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: center;
  background-color: white;
  word-wrap: break-word;
  vertical-align: middle;
}

td.title-column {
  font-size: clamp(15px, 3.24vw, 21.6px);
}

td.author-column {
  font-size: clamp(13px, 2.76vw, 18.4px);
}

td.date-column {
  font-size: clamp(13px, 2.76vw, 18.4px);
}

.title-button {
  width: 100%;
  text-align: center;
  white-space: normal;
  line-height: 1.4;
  padding: 5px 0;
}

button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: clamp(12px, 2.5vw, 16px);
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

.pagination .arrow-button {
  opacity: 1;
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
  background: none;
  cursor: pointer;
  margin: 0 5px;
  padding: 5px;
  transition: all 0.3s ease;
}

.pagination button.active {
  color: #FFC700;
  transform: scale(1.2);
}

.pagination img {
  width: 10px;
  height: 10px;
}

</style>