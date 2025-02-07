
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

     // console.log("🔄 첫 방문이므로 새로고침 실행");
      window.location.reload(); // 강제 새로고침
    } else if (!reloaded) {
      sessionStorage.setItem("reloaded", "true");

      //console.log("🔄 새로고침 여부 확인 후 실행");
      window.location.reload(); // 강제 새로고침
    } else {
      //console.log("✅ 이미 새로고침 완료됨");
      sessionStorage.removeItem("reloaded");
    }
  },
    goToNotice(id, adminName) {
      this.$router.push({ name: 'NoticeClick', params: { id, adminName } });
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

    if (!response.ok) {
      if (response.status === 401) {
        alert('인증되지 않은 사용자입니다. 다시 로그인해주세요.');
        this.$router.push({ name: 'Login' });
        return;
      }
      throw new Error(`Failed to fetch notices: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Fetched data:', data);

    // 최신순으로 정렬
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
 //   alert('공지사항 목록을 불러오는 중 오류가 발생했습니다.');
    this.notices = []; // 오류 발생 시 목록 초기화
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
    this.fetchNotices(); // 페이지 변경 후 데이터 다시 로드
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
