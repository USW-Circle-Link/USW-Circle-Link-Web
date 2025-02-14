<template>
  <div class="container">
    <div class="contents">
      <h2 class="title">공지사항</h2>
      <div class="notices">
        <table>
          <thead>
          <tr>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="notices.length === 0">
            <td colspan="3">공지사항이 없습니다.</td>
          </tr>
          <tr v-for="notice in paginatedNotices" :key="notice.noticeId">
            <td>
              <button @click="goToNotice(notice.noticeId, notice.adminName)">
                {{ notice.noticeTitle }}
              </button>
            </td>
            <td>{{ notice.adminName }}</td>
            <td>{{ new Date(notice.noticeCreatedAt).toLocaleDateString('ko-KR') }}</td>
          </tr>
          </tbody>
        </table>
        <div class="pagination">
          <button @click="previousPage" :disabled="currentPage === 1">
            <img src="@/assets/left.png" alt="Previous" />
          </button>
          <button
              v-for="page in totalPagesArray"
              :key="page"
              @click="changePage(page)"
              :class="{ active: page === currentPage }"
          >
            {{ page }}
          </button>
          <button @click="nextPage" :disabled="currentPage >= totalPages">
            <img src="@/assets/rigth.png" alt="Next" />
          </button>
        </div>
      </div>
    </div>

  </div>

  <!-- 401 팝업 컴포넌트 추가 -->
  <Popup401 v-if="show401Popup" />
</template>

<script>
import store from '@/store/store';
import Popup401 from './401Popup.vue';  // 401 팝업 컴포넌트 import

export default {
  components: {
    Popup401  // 컴포넌트 등록
  },
  data() {
    return {
      notices: [],
      currentPage: 1,
      itemsPerPage: 12,
      totalPages: 1,
      show401Popup: false  // 401 팝업 표시 여부
    };
  },
  computed: {
    paginatedNotices() {
      return this.notices;
    },
    totalPagesArray() {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
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
            `http://15.164.246.244:8080/notices?page=${this.currentPage - 1}&size=${this.itemsPerPage}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
              },
            }
        );

        // if (!response.ok) { //HTTP 응답의 상태가 200-299 범위에 있는지 확인하는 boolean 값
          if (response.status === 401) { //HTTP 응답의 상태 코드가 401로 "Unauthorized"(인증 실패)일 때
            this.show401Popup = true;  // 401 에러 시 팝업 표시
            return; //함수 실행을 여기서 종료
          }
        //   throw new Error(`오류: ${response.statusText}`); //401이 아닌 다른 에러의 경우 에러를 throw
        // }

        const data = await response.json();

        if (data && data.data && Array.isArray(data.data.content)) {
          this.notices = data.data.content.sort((a, b) => new Date(b.noticeCreatedAt) - new Date(a.noticeCreatedAt));
          this.totalPages = data.data.totalPages;
          this.currentPage = data.data.pageable.pageNumber + 1;
        } else {
          console.warn('Unexpected response format:', data);
          this.notices = [];
        }
      } catch (error) {
        console.error('Error fetching notices:', error);
        this.notices = [];
      }
    },
    goToNotice(noticeId) {
      const currentPath = this.$route.path;
      if (currentPath.startsWith('/main')) {
        this.$router.push({ name: 'NoticeClick', params: { id: noticeId } });
      } else {
        this.$router.push({ name: 'NoticeClick', params: { id: noticeId } });
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
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 10px;
  position: relative; /* 상대 위치 설정 */
  display: inline-block;
  z-index: 1; /* 텍스트가 배경색 위에 오도록 설정 */
}



/* 모든 요소에 박스 사이징 설정 */
* {
  box-sizing: border-box;
}

/* 전체 컨테이너 설정 */
.container {
  display: flex;
}

/* 콘텐츠 영역 설정 */
.contents {
  flex: 1;
}

/* 타이틀 스타일 */
.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

/* 공지사항 박스 설정 */
.notices {
  width: 820px;
  height: auto;
  border-radius: 10px;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 테이블 스타일 */
table {
  width: 100%;
  border-collapse: collapse;
}

/* 테이블 헤더 스타일 */
th {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: center;
  background-color: white;
}

/* 테이블 데이터 셀 스타일 */
td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: center;
  background-color: white;
}

/* 버튼 스타일 */
button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

/* 버튼 호버 스타일 */
button:hover {
  text-decoration: underline;
}

/* 페이지네이션 영역 스타일 */
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* 페이지네이션 버튼 스타일 */
.pagination button {
  width: 30px;
  height: 30px;
  /* 테두리 회색 */
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  cursor: pointer;
  margin: 0 5px;
  padding: 5px;
}

/* 활성화된 페이지 버튼 스타일 */
.pagination button.active {
  color: #FFC700;
}

/* 페이지네이션 이미지 스타일 */
.pagination img {
  width: 10px;
  height: 10px;
}

th {
  font-family: Pretendard; /* 글씨체 설정 */
  font-size: 20px; /* 글씨 크기 */
  font-weight: 700; /* 글씨 두께 */
  line-height: 23.87px; /* 줄 간격 */
  text-align: center; /* 텍스트 정렬 */
  color: #393939; /* 글씨 색상 */
 
  padding: 10px; /* 내부 여백 */
  border-bottom: 2px solid #ddd; /* 아래쪽 테두리 */
}

h2 {
  margin-top:-15px;
}
</style>
