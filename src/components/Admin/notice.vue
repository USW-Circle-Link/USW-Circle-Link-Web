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
                <button @click="goToNotice(notice.noticeId)">{{ notice.noticeTitle }}</button>
              </td>
              <td>{{ notice.adminName }}</td>
              <td>{{ new Date(notice.noticeCreatedAt).toLocaleDateString() }}</td>
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
</template>

<script>
import store from '@/store/store';

export default {
  data() {
    return {
      notices: [], // 공지사항 목록
      currentPage: 1, // 현재 페이지 번호
      itemsPerPage: 12, // 페이지당 항목 수
      totalPages: 1, // 전체 페이지 수, 초기값 설정
    };
  },
  computed: {
    paginatedNotices() {
      return this.notices; // 이미 서버에서 페이징된 데이터를 가져오기 때문에 그대로 사용
    },
    totalPagesArray() {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }
  },
  methods: {
    async fetchNotices() {
      try {
        const accessToken = store.state.accessToken;

        const response = await fetch(`http://15.164.246.244:8080/notices/paged?page=${this.currentPage - 1}&size=${this.itemsPerPage}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });

        // If the response is not OK, handle different error cases
        if (!response.ok) {
          // Check for 401 Unauthorized error
          if (response.status === 401) {
            alert('인증되지 않은 사용자입니다. 다시 로그인해주세요.');
            this.$router.push({ name: 'Login' }); // Redirect to login page
            return;
          }
          throw new Error('Failed to fetch notices');
        }

        const data = await response.json();
        console.log('Fetched data:', data); // 응답 데이터 확인

        if (data && data._embedded && Array.isArray(data._embedded.noticeListResponseList)) {
          this.notices = data._embedded.noticeListResponseList.reverse();
          this.totalPages = data.page.totalPages;
          this.currentPage = data.page.number + 1; // 페이지 번호는 0부터 시작하므로 1을 더함
        } else {
          this.notices = []; // 데이터를 가져오지 못한 경우 빈 배열 설정
          console.warn('Unexpected response format:', data);
        }
      } catch (error) {
        console.error('Error fetching notices:', error);
        this.notices = [];
      }
    },
    goToNotice(noticeId) {
      const currentPath = this.$route.path;
      if (currentPath.startsWith('/adminmain')) {
        this.$router.push({ name: 'AdminNoticeClick', params: { id: noticeId } });
      } else {
        this.$router.push({ name: 'AdminNoticeClick', params: { id: noticeId } });
      }
    },
    changePage(page) {
      this.currentPage = page;
      this.fetchNotices(); // 페이지 변경 시 데이터를 다시 가져옴
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
    this.fetchNotices(); // 컴포넌트가 생성될 때 공지사항 목록을 가져옴
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

.title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 2px; /* 텍스트 아래쪽 위치 조정 */
  width: 100%;
  height: 19px; /* 형광펜 두께 */
  background-color: #FFB052;
; /* 노란색 배경 */
  z-index: -1; /* 텍스트 뒤에 위치하도록 설정 */
  transform: skew(-12deg); /* 기울기 효과 추가 */
}
* {
  box-sizing: border-box;
}

.container {
  display: flex;
}

.contents {
  flex: 1;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.notices {
  width: 820px;
  height: auto;
  border-radius: 10px;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: center;
  background-color: white;
}

button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  text-decoration: underline;
}

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
  color: #FFC700;
}

.pagination img {
  width: 20px;
  height: 20px;
}
</style>
