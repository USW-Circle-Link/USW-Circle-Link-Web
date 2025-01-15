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
import store from "@/store/store";

export default {
  data() {
    return {
      notices: [], // 공지사항 목록
      currentPage: 1, // 현재 페이지 번호
      itemsPerPage: 12, // 페이지당 항목 수
      totalPages: 1, // 전체 페이지 수
    };
  },
  mounted() {
    const reloadKey = "mainNoticeReloaded";
    const firstVisitKey = "firstVisitToNoticePage";

    // 처음 방문인지 확인
    if (!localStorage.getItem(firstVisitKey)) {
      localStorage.setItem(firstVisitKey, "true");
      sessionStorage.setItem(reloadKey, "true");
    }

    // 세션 스토리지에 리로드 키가 없으면 강제 새로고침
    if (!sessionStorage.getItem(reloadKey)) {
      sessionStorage.setItem(reloadKey, "true");
      location.reload(); // 강제 새로고침
    } else {
      sessionStorage.removeItem(reloadKey); // 새로고침 후 리로드 키 제거
      this.restorePageState(); // 페이지 상태 복원
    }
  },
  computed: {
    paginatedNotices() {
      return this.notices; // 서버에서 받은 데이터를 그대로 사용
    },
    totalPagesArray() {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    },
  },
  methods: {
    async fetchNotices() {
      try {
        const accessToken = store.state.accessToken;
        const response = await fetch(
          `http://15.164.246.244:8080/notices?page=${
            this.currentPage - 1
          }&size=${this.itemsPerPage}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            alert("인증되지 않은 사용자입니다. 다시 로그인해주세요.");
            this.$router.push({ name: "Login" });
            return;
          }
          throw new Error(`Failed to fetch notices: ${response.statusText}`);
        }

        const data = await response.json();
        if (data && data.data && Array.isArray(data.data.content)) {
          this.notices = data.data.content.sort(
            (a, b) => new Date(b.noticeCreatedAt) - new Date(a.noticeCreatedAt)
          );
          this.totalPages = data.data.totalPages;
          this.currentPage = data.data.pageable.pageNumber + 1;
        } else {
          console.warn("Unexpected response format:", data);
          this.notices = [];
        }
      } catch (error) {
        console.error("Error fetching notices:", error);
        alert("공지사항 목록을 불러오는 중 오류가 발생했습니다.");
        this.notices = [];
      }
    },
    restorePageState() {
      // 로컬 스토리지에서 이전 페이지 상태 복원
      const savedPage = localStorage.getItem("currentPage");
      if (savedPage) {
        this.currentPage = parseInt(savedPage, 10);
      }
      this.fetchNotices(); // 데이터 로드
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        localStorage.setItem("currentPage", page); // 현재 페이지 저장
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
    },
    goToNotice(id, adminName) {
      this.$router.push({ name: "NoticeClick", params: { id, adminName } });
    },
  },
};
</script>


<style scoped>
.title {
  color: black;
  font-size: 25px;
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

th {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: center;
  background-color: white;
}

td {
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
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  cursor: pointer;
  margin: 0 5px;
  padding: 5px;
}

.pagination button.active {
  color: #FFC700;
}

.pagination img {
  width: 10px;
  height: 10px;
}

th {
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 700;
  line-height: 23.87px;
  text-align: center;
  color: #393939;
  padding: 10px;
  border-bottom: 2px solid #ddd;
}
</style>
