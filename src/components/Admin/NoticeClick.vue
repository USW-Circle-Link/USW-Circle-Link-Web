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
          <span class="notice-title">{{ notice.noticeTitle }}</span>
          <span class="notice-meta">{{ notice.adminName }} | {{ formattedDate(notice.noticeCreatedAt) }}</span>
        </p>
      </div>
      <div class="notice-content" v-html="notice.noticeContent"></div>

      <div class="notice-images" v-if="images.length > 0">
        <div v-for="(image, index) in images" :key="index" class="image-container">
          <img
            :src="image.src"
            alt="Notice Image"
            class="notice-image"
            @error="handleImageError(index)"
          />
        </div>
      </div>
    </div>
    <div class="actions">
      <button class="edit-button" @click="editNotice" :disabled="!notice">수정</button>
      <button class="delete-button" @click="deleteNotice" :disabled="!notice">삭제</button>
    </div>
    <div class="notice-list">
      <table>
        <tbody>
          <tr v-for="notice in paginatedNotices" :key="notice.noticeId">
            <td>
              <button @click="goToNotice(notice.noticeId)">{{ notice.noticeTitle }}</button>
            </td>
            <td>{{ notice.adminName }}</td>
            <td>{{ formattedDate(notice.noticeCreatedAt) }}</td>
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
import store from '@/store/store';
import axios from 'axios';

export default {
  data() {
    return {
      notices: [],
      notice: null,
      currentPage: 1,
      itemsPerPage: 5,
      images: [], // Image array for notice photos
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
    },
  },
  created() {
    this.fetchNotices();
  },
  methods: {
    async fetchNotices() {
      try {
        const accessToken = store.state.accessToken;
        const response = await axios.get('http://15.164.246.244:8080/notices/paged', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.data && response.data._embedded && Array.isArray(response.data._embedded.noticeListResponseList)) {
          this.notices = response.data._embedded.noticeListResponseList;
        } else {
          this.notices = [];
          console.warn('Unexpected response format:', response.data);
        }
        this.fetchNotice(this.$route.params.id);
      } catch (error) {
        this.handleError(error, 'Error fetching notices');
      }
    },
    async fetchNotice(id) {
      try {
        const accessToken = store.state.accessToken;
        const response = await axios.get(`http://15.164.246.244:8080/notices/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.data && response.data.data) {
          this.notice = response.data.data;
          this.loadImages(response.data.data.noticePhotos);
        } else {
          throw new Error('Notice data not found');
        }
      } catch (error) {
        this.handleError(error, 'Error fetching notice');
      }
    },
    loadImages(photoUrls) {
      if (Array.isArray(photoUrls)) {
        this.images = photoUrls.map(photoUrl => {
          const isBase64 = photoUrl.startsWith('data:image/');
          const imageUrl = isBase64 ? photoUrl : `${photoUrl}`;
          return { src: imageUrl, isNew: false };
        });
      }
    },
    handleImageError(index) {
      // Fallback image for failed loads
      this.images[index].src = require('@/assets/rigth.png'); // 기본 이미지로 변경
    },
    handleError(error, message) {
      if (error.response && error.response.status === 404) {
        alert(`${message}: Resource not found.`);
        this.$router.push({ name: 'Notice' });
      } else if (error.response && error.response.status === 401) {
        alert('Unauthorized access. Please log in again.');
        this.$router.push({ name: 'Login' });
      } else {
        console.error(`${message}:`, error);
        alert(`${message}. Please try again later.`);
      }
    },
    prevNotice() {
      const currentIndex = this.notices.findIndex(notice => notice.noticeId == this.$route.params.id);
      const prevIndex = (currentIndex - 1 + this.notices.length) % this.notices.length;
      this.$router.push({ name: 'AdminNoticeClick', params: { id: this.notices[prevIndex].noticeId } });
    },
    nextNotice() {
      const currentIndex = this.notices.findIndex(notice => notice.noticeId == this.$route.params.id);
      const nextIndex = (currentIndex + 1) % this.notices.length;
      this.$router.push({ name: 'AdminNoticeClick', params: { id: this.notices[nextIndex].noticeId } });
    },
    goToNotice(id) {
      this.$router.push({ name: 'AdminNoticeClick', params: { id } });
    },
    changePage(page) {
      this.currentPage = page;
    },
    editNotice() {
      if (this.notice && this.notice.noticeId) {
        this.$router.push({ name: 'noticeedit', params: { id: this.notice.noticeId } });
      } else {
        console.error('No notice available to edit.');
      }
    },
    async deleteNotice() {
      if (this.notice && confirm('이 공지사항을 삭제하시겠습니까?')) {
        try {
          const accessToken = store.state.accessToken;
          const response = await axios.delete(`http://15.164.246.244:8080/notices/${this.notice.noticeId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.status === 200) {
            alert('공지사항이 삭제되었습니다.');
            this.notices = this.notices.filter(notice => notice.noticeId !== this.notice.noticeId);
            if (this.notices.length > 0) {
              this.$router.push({ name: 'AdminNoticeClick', params: { id: this.notices[0].noticeId } });
            } else {
              this.$router.push({ name: 'Notice' });
            }
          } else {
            alert('공지사항 삭제에 실패했습니다.');
          }
        } catch (error) {
          this.handleError(error, '공지사항 삭제 중 오류');
        }
      }
    },
    formattedDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
  },
  watch: {
    $route(to) {
      this.fetchNotice(to.params.id);
    },
  },
};
</script>



<style scoped>


* {
  box-sizing: border-box;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  margin-top: 20px;
  margin-bottom: 40px;
}

.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1000px;
  margin-bottom: 20px;
}

.nav-button {
  background: none;
  border: none;
  color: black;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.nav-icon {
  width: 12px;
  height: 12px;
  margin: 0 5px;
}

.notice-details {
  width: 817px;
  min-height: 626px; /* 최소 높이를 설정하여 기본 높이는 유지하되 */
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  /* height: 626px; 고정 높이를 제거하여 자동으로 늘어나게 합니다. */
}


.notice-title {
  color: #333;
  font-size: 20px;
  font-family: Pretendard;
  font-weight: 700;
  margin-bottom: 10px;
}

.notice-meta {
  font-size: 14px;
  color: #999;
  margin-left: 10px;
}

.notice-content {
  font-size: 14px;
  color: #333;
  margin-top: 20px;
  line-height: 1.0;
  border-top: 0.5px solid  #868686; /* 회색 구분선 추가 */
  padding-top: 10px; /* 텍스트와 구분선 사이에 여백 추가 */
}

.notice-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* 자동으로 열을 채워줍니다 */
  grid-gap: 10px; /* 이미지 사이 간격 */
  margin-top: 20px;
}

.notice-image {
  width: 100%;
  height: 200px; /* 고정된 높이 설정 */
  object-fit: cover; /* 이미지 비율을 유지하면서 잘 맞추어 줍니다 */
  border-radius: 8px;
}


.image-container {
  width: 100%;
  max-width: 300px;
}

.actions {
  display: flex;
  margin-bottom: 20px;
  margin-left: 670px;
}

.edit-button, .delete-button {
  background: #f0f0f0;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  margin: 0 5px;
  cursor: pointer;
  font-size: 14px;
}

.edit-button {
  width: 65px;
  height: 37px;
  background-color: #5b9bd5;
  color: white;
}

.delete-button {
  width: 65px;
  height: 37px;
  background-color: #ed7d31;
  color: white;
}

.notice-list {
  width: 817px;
  height: auto;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

td:nth-child(1),
td:nth-child(2),
td:nth-child(3) {
  background-color: #FFFFFF;
}

th {
  background-color: #FFFFFF;
  font-weight: bold;
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
