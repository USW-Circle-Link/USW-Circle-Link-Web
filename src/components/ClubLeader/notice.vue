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
      return this.notices; //  서버에서 받은 페이징된 데이터를 그대로 반환
    },
    totalPagesArray() {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);//totalPages의 값에 맞춰 각 페이지 번호를 배열 형태로 생성하여 반환
    }
  },
  methods: {
    //작성된 공지사항 리스트 불러오기
    async fetchNotices(page = 1) { // 기본 페이지를 1로 설정
      try {
        const accessToken = store.state.accessToken;
        const response = await fetch(`http://15.164.246.244:8080/notices/paged?page=${page - 1}&size=${this.itemsPerPage}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (response.status === 401) { // 인증되지 않은 경우 처리
          alert('인증되지 않은 사용자입니다. 다시 로그인해주세요.');
          this.$router.push({ name: 'Login' }); // 로그인 페이지로 리다이렉트
          return;
        }

        if (!response.ok) {
          throw new Error('인증되지 않은 사용자입니다. 다시 로그인해주세요.');
        }

        const data = await response.json();

        //작성된 공지사항 데이터 최근 순으로 불러오기
        if (data && data._embedded && Array.isArray(data._embedded.noticeListResponseList)) {
          this.notices = data._embedded.noticeListResponseList.reverse();
          this.totalPages = data.page.totalPages; // 전체 페이지 수를 설정
          this.currentPage = data.page.number + 1; // 현재 페이지를 설정 (0부터 시작하므로 1을 더함)

          // 디버깅 로그 추가
         // console.log(':', this.notices);
         // console.log(':', this.currentPage);
         // console.log(':', this.totalPages);
        } else {
          this.notices = []; // 데이터를 가져오지 못한 경우 빈 배열 설정
        }
      } catch (error) {
        console.error('공지사항을 불러오는데 실패하였습니다.', error);
        this.notices = [];
      }
    },
    //NoticeClick 페이지 이동
    goToNotice(noticeId) {
      this.$router.push({ name: 'NoticeClick', params: { id: noticeId } });
    },
    changePage(page) {
      this.currentPage = page;
      localStorage.setItem('currentPage', page); // 페이지 변경 시 현재 페이지를 localStorage에 저장
      this.fetchNotices(page); // 페이지 변경 시 해당 페이지의 데이터를 가져옴
    },
    //이전페이지 이동
    previousPage() {
      if (this.currentPage > 1) {
        this.changePage(this.currentPage - 1);
      }
    },
    //다음 페이지 이동
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.changePage(this.currentPage + 1);
      }
    }
  },
  mounted() {
    const reloadKey = 'mainNoticeReloaded';
    const firstVisitKey = 'firstVisitToNoticePage';

    // 처음 방문인지 확인하기 위해 로컬 스토리지에서 값 가져오기
    const isFirstVisit = localStorage.getItem(firstVisitKey) === null;

    if (isFirstVisit) {
        // 처음 방문 시, 새로고침을 하지 않은 상태로 로컬 스토리지에 방문 기록 저장
        localStorage.setItem(firstVisitKey, 'true');
        // 페이지가 처음으로 로드되었음을 세션 스토리지에 저장
        sessionStorage.setItem(reloadKey, 'true');
    }

    // 세션 스토리지에 리로드 키가 없으면, 새로고침
    if (!sessionStorage.getItem(reloadKey)) {
        sessionStorage.setItem(reloadKey, 'true');
        window.location.reload();
    } else {
        sessionStorage.removeItem(reloadKey); 
        const savedPage = localStorage.getItem('currentPage');
        if (savedPage) {
            this.currentPage = parseInt(savedPage, 10);
        }
        this.fetchNotices(this.currentPage || 0); // 페이지를 불러옴, 기본값은 1페이지
    }
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
</style>
