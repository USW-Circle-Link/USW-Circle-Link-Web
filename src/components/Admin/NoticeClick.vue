admin/noticeclick
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
          <span class="notice-meta">{{ formattedDate(notice.noticeCreatedAt) }}</span>
        </p>
      </div>
      <!-- noticeContent를 HTML로 렌더링 -->
      <div class="notice-content" v-html="notice.noticeContent"></div>

      <!-- 이미지를 렌더링 -->
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
        <thead>
          <!-- 헤더 추가 가능 -->
        </thead>
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
import store from '@/store/store'; // Vuex store 가져오기
import axios from 'axios';

export default {
  data() {
    return {
      notices: [],
      notice: null,
      currentPage: 1,
      itemsPerPage: 5,
      images: [],  // 이미지 배열 추가
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
    this.fetchNotices();
  },
  methods: {
    async fetchNotices() {
      try {
        const accessToken = store.state.accessToken;
        const response = await axios.get('http://15.164.246.244:8080/notices/paged', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
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
        console.error('Error fetching notices:', error);
        this.notices = [];
      }
    },
    async fetchNotice(id) {
      try {
        const accessToken = store.state.accessToken;
        const response = await axios.get(`http://15.164.246.244:8080/notices/${id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.data || !response.data.data) {
          throw new Error('Failed to fetch notice');
        }
        const data = response.data.data;
        console.log('Fetched notice:', data);
        this.notice = data;

        // noticePhotos 배열의 URL을 이미지로 로드하여 images 배열에 저장
        this.images = data.noticePhotos.map(photoUrl => ({ src: photoUrl, isNew: false }));

      } catch (error) {
        console.error('Error fetching notice:', error);
        this.notice = null;
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
      if (this.notice && confirm("이 공지사항을 삭제하시겠습니까?")) {
        try {
          const accessToken = store.state.accessToken;
          const response = await axios.delete(`http://15.164.246.244:8080/notices/${this.notice.noticeId}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
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
          console.error('공지사항 삭제 중 오류가 발생했습니다:', error);
          alert('공지사항 삭제 중 오류가 발생했습니다.');
        }
      }
    },
    formattedDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    onImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        this.images.push({ src: imageUrl, file, isNew: true }); // 새로 추가된 이미지는 isNew: true
      }
    },
    handleImageError(index) {
      this.images[index].src = '@/assets/rigth.png'; // 이미지 로드 실패 시 대체 이미지
    },
  },
  watch: {
    $route(to) {
      this.fetchNotice(to.params.id);
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
  padding-top: 20px;
  margin-top: 20px;
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
  height: 626px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
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
  line-height: 1.6;
}

.notice-images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.image-container {
  width: 100%;
  max-width: 300px;
}

.notice-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
}

.actions {
  display: flex;
  justify-content: flex-end;
  width: 1000px;
  margin-bottom: 20px;
  margin-right: 180px;
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
  background-color: #5b9bd5;
  color: white;
}

.delete-button {
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




