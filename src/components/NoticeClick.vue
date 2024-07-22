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
        <p>
          <span class="notice-title">{{ notice.title }}</span>
          <span>{{ notice.author }} | {{ notice.date }}</span>
        </p>
      </div>
      <p class="notice-content">본문 14px</p>
    </div>
    <div class="notice-list">
      <table>
        <thead>
        <!-- Table header -->
        </thead>
        <tbody>
        <tr v-for="notice in paginatedNotices" :key="notice.id">
          <td>
            <button @click="goToNotice(notice.id)">{{ notice.title }}</button>
          </td>
          <td>{{ notice.author }}</td>
          <td>{{ notice.date }}</td>
        </tr>
        </tbody>
      </table>
      <div class="pagination">
          <span @click="changePage(page)" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
            {{ page }}
          </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoticeClick',
  props: ['id'],
  data() {
    return {
      notice: null,
      notices: [
        // 공지사항 데이터 리스트
        { id: 1, title: '벚꽃축제 동아리 관련 공지사항 1', author: '동아리 연합회', date: '2024.05.14' },
        { id: 2, title: '벚꽃축제 동아리 관련 공지사항 2', author: '동아리 연합회', date: '2024.05.14' },
        { id: 3, title: '벚꽃축제 동아리 관련 공지사항 3', author: '동아리 연합회', date: '2024.05.14' },
        { id: 4, title: '벚꽃축제 동아리 관련 공지사항 4', author: '동아리 연합회', date: '2024.05.14' },
        { id: 5, title: '벚꽃축제 동아리 관련 공지사항 5', author: '동아리 연합회', date: '2024.05.14' },
        { id: 6, title: '벚꽃축제 동아리 관련 공지사항 6', author: '동아리 연합회', date: '2024.05.14' },
        { id: 7, title: '벚꽃축제 동아리 관련 공지사항 7', author: '동아리 연합회', date: '2024.05.14' },
        { id: 8, title: '벚꽃축제 동아리 관련 공지사항 8', author: '동아리 연합회', date: '2024.05.14' },
        { id: 9, title: '벚꽃축제 동아리 관련 공지사항 9', author: '동아리 연합회', date: '2024.05.14' },
        { id: 10, title: '벚꽃축제 동아리 관련 공지사항 10', author: '동아리 연합회', date: '2024.05.14' },
        { id: 11, title: '벚꽃축제 동아리 관련 공지사항 11', author: '동아리 연합회', date: '2024.05.14' },
        { id: 12, title: '벚꽃축제 동아리 관련 공지사항 12', author: '동아리 연합회', date: '2024.05.14' },
        { id: 13, title: '벚꽃축제 동아리 관련 공지사항 13', author: '동아리 연합회', date: '2024.05.14' },
        { id: 14, title: '벚꽃축제 동아리 관련 공지사항 14', author: '동아리 연합회', date: '2024.05.14' },
        { id: 15, title: '벚꽃축제 동아리 관련 공지사항 15', author: '동아리 연합회', date: '2024.05.14' },
        { id: 16, title: '벚꽃축제 동아리 관련 공지사항 16', author: '동아리 연합회', date: '2024.05.14' },
        { id: 17, title: '벚꽃축제 동아리 관련 공지사항 17', author: '동아리 연합회', date: '2024.05.14' },
        { id: 18, title: '벚꽃축제 동아리 관련 공지사항 18', author: '동아리 연합회', date: '2024.05.14' },
        { id: 19, title: '벚꽃축제 동아리 관련 공지사항 19', author: '동아리 연합회', date: '2024.05.14' },
        { id: 20, title: '벚꽃축제 동아리 관련 공지사항 20', author: '동아리 연합회', date: '2024.05.14' },
        { id: 21, title: '벚꽃축제 동아리 관련 공지사항 21', author: '동아리 연합회', date: '2024.05.14' },
        { id: 22, title: '벚꽃축제 동아리 관련 공지사항 22', author: '동아리 연합회', date: '2024.05.14' },
        { id: 23, title: '벚꽃축제 동아리 관련 공지사항 23', author: '동아리 연합회', date: '2024.05.14' },
        { id: 24, title: '벚꽃축제 동아리 관련 공지사항 24', author: '동아리 연합회', date: '2024.05.14' },
        { id: 25, title: '벚꽃축제 동아리 관련 공지사항 25', author: '동아리 연합회', date: '2024.05.14' },
        { id: 26, title: '벚꽃축제 동아리 관련 공지사항 26', author: '동아리 연합회', date: '2024.05.14' },
        { id: 27, title: '벚꽃축제 동아리 관련 공지사항 27', author: '동아리 연합회', date: '2024.05.14' },
        { id: 28, title: '벚꽃축제 동아리 관련 공지사항 28', author: '동아리 연합회', date: '2024.05.14' },
        { id: 29, title: '벚꽃축제 동아리 관련 공지사항 29', author: '동아리 연합회', date: '2024.05.14' },
        { id: 30, title: '벚꽃축제 동아리 관련 공지사항 30', author: '동아리 연합회', date: '2024.05.14' },
        { id: 31, title: '벚꽃축제 동아리 관련 공지사항 31', author: '동아리 연합회', date: '2024.05.14' },
        { id: 32, title: '벚꽃축제 동아리 관련 공지사항 32', author: '동아리 연합회', date: '2024.05.14' },
        { id: 33, title: '벚꽃축제 동아리 관련 공지사항 33', author: '동아리 연합회', date: '2024.05.14' },
        { id: 34, title: '벚꽃축제 동아리 관련 공지사항 34', author: '동아리 연합회', date: '2024.05.14' },
        { id: 35, title: '벚꽃축제 동아리 관련 공지사항 35', author: '동아리 연합회', date: '2024.05.14' },
        { id: 36, title: '벚꽃축제 동아리 관련 공지사항 36', author: '동아리 연합회', date: '2024.05.14' },
        { id: 37, title: '벚꽃축제 동아리 관련 공지사항 37', author: '동아리 연합회', date: '2024.05.14' },
        { id: 38, title: '벚꽃축제 동아리 관련 공지사항 38', author: '동아리 연합회', date: '2024.05.14' },
        { id: 39, title: '벚꽃축제 동아리 관련 공지사항 39', author: '동아리 연합회', date: '2024.05.14' },
        { id: 40, title: '벚꽃축제 동아리 관련 공지사항 40', author: '동아리 연합회', date: '2024.05.14' },
        { id: 41, title: '벚꽃축제 동아리 관련 공지사항 1', author: '동아리 연합회', date: '2024.05.14' },
        { id: 42, title: '벚꽃축제 동아리 관련 공지사항 2', author: '동아리 연합회', date: '2024.05.14' },
        { id: 43, title: '벚꽃축제 동아리 관련 공지사항 3', author: '동아리 연합회', date: '2024.05.14' },
        { id: 44, title: '벚꽃축제 동아리 관련 공지사항 4', author: '동아리 연합회', date: '2024.05.14' },
        { id: 45, title: '벚꽃축제 동아리 관련 공지사항 5', author: '동아리 연합회', date: '2024.05.14' },
        { id: 46, title: '벚꽃축제 동아리 관련 공지사항 6', author: '동아리 연합회', date: '2024.05.14' },
        { id: 47, title: '벚꽃축제 동아리 관련 공지사항 7', author: '동아리 연합회', date: '2024.05.14' },
        { id: 48, title: '벚꽃축제 동아리 관련 공지사항 8', author: '동아리 연합회', date: '2024.05.14' },
        { id: 49, title: '벚꽃축제 동아리 관련 공지사항 9', author: '동아리 연합회', date: '2024.05.14' },
        { id: 50, title: '벚꽃축제 동아리 관련 공지사항 10', author: '동아리 연합회', date: '2024.05.14' },
        { id: 51, title: '벚꽃축제 동아리 관련 공지사항 11', author: '동아리 연합회', date: '2024.05.14' },
        { id: 52, title: '벚꽃축제 동아리 관련 공지사항 12', author: '동아리 연합회', date: '2024.05.14' },
        { id: 53, title: '벚꽃축제 동아리 관련 공지사항 13', author: '동아리 연합회', date: '2024.05.14' },
        { id: 54, title: '벚꽃축제 동아리 관련 공지사항 14', author: '동아리 연합회', date: '2024.05.14' },
        { id: 55, title: '벚꽃축제 동아리 관련 공지사항 15', author: '동아리 연합회', date: '2024.05.14' },
        { id: 56, title: '벚꽃축제 동아리 관련 공지사항 16', author: '동아리 연합회', date: '2024.05.14' },
        { id: 57, title: '벚꽃축제 동아리 관련 공지사항 17', author: '동아리 연합회', date: '2024.05.14' },
        { id: 58, title: '벚꽃축제 동아리 관련 공지사항 18', author: '동아리 연합회', date: '2024.05.14' },
        { id: 59, title: '벚꽃축제 동아리 관련 공지사항 19', author: '동아리 연합회', date: '2024.05.14' },
        { id: 60, title: '벚꽃축제 동아리 관련 공지사항 20', author: '동아리 연합회', date: '2024.05.14' },
        { id: 61, title: '벚꽃축제 동아리 관련 공지사항 21', author: '동아리 연합회', date: '2024.05.14' },
        { id: 62, title: '벚꽃축제 동아리 관련 공지사항 22', author: '동아리 연합회', date: '2024.05.14' },
        { id: 63, title: '벚꽃축제 동아리 관련 공지사항 23', author: '동아리 연합회', date: '2024.05.14' },
        { id: 64, title: '벚꽃축제 동아리 관련 공지사항 24', author: '동아리 연합회', date: '2024.05.14' },
        { id: 65, title: '벚꽃축제 동아리 관련 공지사항 25', author: '동아리 연합회', date: '2024.05.14' },
        { id: 66, title: '벚꽃축제 동아리 관련 공지사항 26', author: '동아리 연합회', date: '2024.05.14' },
        { id: 67, title: '벚꽃축제 동아리 관련 공지사항 27', author: '동아리 연합회', date: '2024.05.14' },
        { id: 68, title: '벚꽃축제 동아리 관련 공지사항 28', author: '동아리 연합회', date: '2024.05.14' },
        { id: 69, title: '벚꽃축제 동아리 관련 공지사항 29', author: '동아리 연합회', date: '2024.05.14' },
        { id: 70, title: '벚꽃축제 동아리 관련 공지사항 30', author: '동아리 연합회', date: '2024.05.14' },
        { id: 71, title: '벚꽃축제 동아리 관련 공지사항 31', author: '동아리 연합회', date: '2024.05.14' },
        { id: 72, title: '벚꽃축제 동아리 관련 공지사항 32', author: '동아리 연합회', date: '2024.05.14' },
        { id: 73, title: '벚꽃축제 동아리 관련 공지사항 33', author: '동아리 연합회', date: '2024.05.14' },
        { id: 74, title: '벚꽃축제 동아리 관련 공지사항 34', author: '동아리 연합회', date: '2024.05.14' },
        { id: 75, title: '벚꽃축제 동아리 관련 공지사항 35', author: '동아리 연합회', date: '2024.05.14' },
        { id: 76, title: '벚꽃축제 동아리 관련 공지사항 36', author: '동아리 연합회', date: '2024.05.14' },
        { id: 77, title: '벚꽃축제 동아리 관련 공지사항 37', author: '동아리 연합회', date: '2024.05.14' },
        { id: 78, title: '벚꽃축제 동아리 관련 공지사항 38', author: '동아리 연합회', date: '2024.05.14' },
        { id: 79, title: '벚꽃축제 동아리 관련 공지사항 39', author: '동아리 연합회', date: '2024.05.14' },
        { id: 80, title: '벚꽃축제 동아리 관련 공지사항 40', author: '동아리 연합회', date: '2024.05.14' },
        { id: 81, title: '벚꽃축제 동아리 관련 공지사항 1', author: '동아리 연합회', date: '2024.05.14' },
        { id: 82, title: '벚꽃축제 동아리 관련 공지사항 2', author: '동아리 연합회', date: '2024.05.14' },
        { id: 83, title: '벚꽃축제 동아리 관련 공지사항 3', author: '동아리 연합회', date: '2024.05.14' },
        { id: 84, title: '벚꽃축제 동아리 관련 공지사항 4', author: '동아리 연합회', date: '2024.05.14' },
        { id: 85, title: '벚꽃축제 동아리 관련 공지사항 5', author: '동아리 연합회', date: '2024.05.14' },
        { id: 86, title: '벚꽃축제 동아리 관련 공지사항 6', author: '동아리 연합회', date: '2024.05.14' },
        { id: 87, title: '벚꽃축제 동아리 관련 공지사항 7', author: '동아리 연합회', date: '2024.05.14' },
        { id: 88, title: '벚꽃축제 동아리 관련 공지사항 8', author: '동아리 연합회', date: '2024.05.14' },
        { id: 89, title: '벚꽃축제 동아리 관련 공지사항 9', author: '동아리 연합회', date: '2024.05.14' },
        { id: 90, title: '벚꽃축제 동아리 관련 공지사항 10', author: '동아리 연합회', date: '2024.05.14' },
        { id: 91, title: '벚꽃축제 동아리 관련 공지사항 11', author: '동아리 연합회', date: '2024.05.14' },
        { id: 92, title: '벚꽃축제 동아리 관련 공지사항 12', author: '동아리 연합회', date: '2024.05.14' },
        { id: 93, title: '벚꽃축제 동아리 관련 공지사항 13', author: '동아리 연합회', date: '2024.05.14' },
        { id: 94, title: '벚꽃축제 동아리 관련 공지사항 14', author: '동아리 연합회', date: '2024.05.14' },
        { id: 95, title: '벚꽃축제 동아리 관련 공지사항 15', author: '동아리 연합회', date: '2024.05.14' },
        { id: 96, title: '벚꽃축제 동아리 관련 공지사항 16', author: '동아리 연합회', date: '2024.05.14' },
        { id: 97, title: '벚꽃축제 동아리 관련 공지사항 17', author: '동아리 연합회', date: '2024.05.14' },
        { id: 98, title: '벚꽃축제 동아리 관련 공지사항 18', author: '동아리 연합회', date: '2024.05.14' },
        { id: 99, title: '벚꽃축제 동아리 관련 공지사항 19', author: '동아리 연합회', date: '2024.05.14' },
        { id: 100, title: '벚꽃축제 동아리 관련 공지사항 20', author: '동아리 연합회', date: '2024.05.14' }
      ],
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.notices.length / this.itemsPerPage);
    },
    paginatedNotices() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.notices.slice(start, end);
    }
  },
  created() {
    this.fetchNotice(this.id);
  },
  methods: {
    fetchNotice(id) {
      this.notice = this.notices.find(notice => notice.id == id);
    },
    prevNotice() {
      const currentIndex = this.notices.findIndex(notice => notice.id == this.id);
      const prevIndex = (currentIndex - 1 + this.notices.length) % this.notices.length;
      this.$router.push({ name: 'NoticeClick', params: { id: this.notices[prevIndex].id } });
    },
    nextNotice() {
      const currentIndex = this.notices.findIndex(notice => notice.id == this.id);
      const nextIndex = (currentIndex + 1) % this.notices.length;
      this.$router.push({ name: 'NoticeClick', params: { id: this.notices[nextIndex].id } });
    },
    goToNotice(id) {
      this.$router.push({ name: 'NoticeClick', params: { id } });
    },
    changePage(page) {
      this.currentPage = page;
    }
  },
  watch: {
    id: {
      handler(newId) {
        this.fetchNotice(newId);
      },
      immediate: true
    }
  }
};
</script>

<style scoped>
@import url('https://webfontworld.github.io/goodchoice/Jalnan.css');

* {
  box-sizing: border-box;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
}

.nav-button {
  background: none;
  border: none;
  color: black;
  cursor: pointer;
  font-size: 14px;
}

.nav-icon {
  width: 12px;
  height: 12px;
  margin: 0 5px;
}

.notice-details {
  width: 817px;
  height: 423px;
  border-radius: 8px 0px 0px 0px;
  opacity: 1;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.notice-title {
  color: black;
  font-size: 20px;
  font-family: Pretendard;
  font-weight: 700;
  line-height: 18px;
  word-wrap: break-word;
}

.meta-info p {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
}

.notice-content {
  font-size: 14px;
}

.notice-list {
  width: 820px;
  height: 500px;
  background-color: white;
  padding: 20px;
  border-radius: 10px 0px 0px 0px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 15px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
}

th, td {
  padding: 10px;
  border-bottom: 2px solid #ddd;
  background-color: white; /* Set background color to white */
  text-align: center; /* Center align text */
}


td:nth-last-child(3) {
  background-color: white;

}
td:nth-last-child(2) {
  background-color: white;


}
td {
  text-align: center; /* Center align text */
  background-color: white
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
}

.pagination span {
  margin: 0 5px;
  cursor: pointer;

}

.pagination span.active {
  font-weight: bold;
  color: #000;
}
</style>