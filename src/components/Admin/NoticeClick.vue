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
      <!-- noticeContent를 HTML로 렌더링하고 줄바꿈을 처리 -->
      <div class="notice-content" v-html="convertNewlinesToBr(notice.noticeContent)"></div>

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
      notices: [],//공지사항 목록을 저장하는 배열
      notice: null,//선택된 공지사항 상세 정보
      currentPage: 1,//현재 페이지 번호
      itemsPerPage: 5,//한 페이지에 표시할 공지사항 수
      images: [], // 공지사항에 포함된 이미지 배열
    };
  },
  computed: {
    //총 페이지 수 계산
    totalPages() {
      return Math.ceil(this.notices.length / this.itemsPerPage);
    },
    //현재 페이지에 맞는 공지사항 데이터만 반환
    paginatedNotices() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.notices.slice(start, end);
    },
  },
  //공지사항 목록 불러오기
  created() {
    this.fetchNotices();
  },
  //공지사항목록 서버에서 가져오기 
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
        //서버에서 받은 데이터가 맞는 지 확인 후 공지사항 배열에 저장
        if (response.data && response.data._embedded && Array.isArray(response.data._embedded.noticeListResponseList)) {
          this.notices = response.data._embedded.noticeListResponseList;
        } else {
          this.notices = [];
         // console.warn('기대한 응답이 아닙니다:', response.data);
        }
        //현재 url에 있는 공지사항 id로 해당 공지사항 세부정보
        this.fetchNotice(this.$route.params.id);
      } catch (error) {
        //this.handleError(error, '공지사항을 불러오는 데 오류가 발생했습니다');
      }
    },
    //선택한 공지사항의 세부정보를 보기 위해 서버에서 가져옴
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
          throw new Error('공지사항을 찾을 수 없습니다.');
        }
      } catch (error) {
        this.handleError(error, '공지사항을 불러오는 데 오류가 있습니다.');
      }
    },
    //이미지 목록을 로드하는 함수
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
      // 이미지 가져오지 못 했을 때 기본 이미지 띄우기
      this.images[index].src = require('@/assets/rigth.png'); // 기본 이미지로 변경
    },
    //오류 처리 함수
    handleError(error, message) {
      if (error.response && error.response.status === 404) {
        alert(`${message}: 공지사항이 존재하지 않습니다.`);
        this.$router.push({ name: 'Notice' });
      } else if (error.response && error.response.status === 401) {
        alert('인증되지 않은 사용자입니다. 다시 로그인해주세요.');
        this.$router.push({ name: 'Login' });
      } else {
        console.error(`${message}:`, error);
        alert(`${message}. 다시 시도해주세요.`);
      }
    },
    //이전 공지사항
    prevNotice() {
      const currentIndex = this.notices.findIndex(notice => notice.noticeId == this.$route.params.id);
      const prevIndex = (currentIndex - 1 + this.notices.length) % this.notices.length;
      this.$router.push({ name: 'AdminNoticeClick', params: { id: this.notices[prevIndex].noticeId } });
    },
    //다음 공지사항
    nextNotice() {
      const currentIndex = this.notices.findIndex(notice => notice.noticeId == this.$route.params.id);
      const nextIndex = (currentIndex + 1) % this.notices.length;
      this.$router.push({ name: 'AdminNoticeClick', params: { id: this.notices[nextIndex].noticeId } });
    },
    //해당 공지사항id의 AdminNoticeClick(공지사항 세부정보페이지)로 이동
    goToNotice(id) {
      this.$router.push({ name: 'AdminNoticeClick', params: { id } });
    },
    //페이지 변경 시 현재 페이지 번호 바뀜
    changePage(page) {
      this.currentPage = page;
    },
    //줄바꿈
    convertNewlinesToBr(text) {
      return text ? text.replace(/\n?<br>\n\?/gi, '<br>') : '';
    },
    //공지사항 수정버튼 클릭 시 noticeedit로 이동
    editNotice() {
      if (this.notice && this.notice.noticeId) {
        this.$router.push({ name: 'noticeedit', params: { id: this.notice.noticeId } });
      } else {
       // console.error('수정할 수 없습니다');
      }
    },
    //공지사항 삭제버튼 클릭 시 
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
    //날짜 보여주는 함수
    formattedDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
  },
  //라우트가 변경될 떄마다 공지사항 정보를 다시 가져옴
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
  display: flex;
  flex-direction: column; /* 이미지를 세로로 배치 */
  align-items: center; /* 이미지들이 가운데 정렬되도록 설정 */
  grid-gap: 10px; /* 이미지 사이 간격 */
  margin-top: 20px;
}

.notice-image {
  width: 100%;
  height: 100%; /* 고정된 높이 설정 */
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
  font-size: 12px;
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