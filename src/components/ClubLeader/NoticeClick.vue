<template>
  <div class="container">
    <div class="header">
      <button class="nav-button" @click="prevNotice">
        <img src="@/assets/left.png" alt="Previous" class="nav-icon" />
        <span class="nav-text">이전 공지</span>
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
    <span class="notice-meta">
  <span class="author-name">{{ notice.adminName }}</span>
    |   {{ formattedDate(notice.noticeCreatedAt) }}
</span>

  </p>
</div>

      <!-- noticeContent를 HTML로 렌더링하고 줄바꿈을 처리 -->
      <div class="notice-content" v-html="convertNewlinesToBr(notice.noticeContent)"></div>

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
  <button @click="previousPage" class="pagination-button">
    <img src="@/assets/left.png" alt="Previous" class="pagination-icon" />
    
  </button>
  <span v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }" @click="changePage(page)">
    {{ page }}
  </span>
  <button @click="nextPage" class="pagination-button">
    
    <img src="@/assets/rigth.png" alt="Next" class="pagination-icon" />
  </button>
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
    //총 페이지 수 계산
    totalPages() {
      return Math.ceil(this.notices.length / this.itemsPerPage);
    },
    //현재 페이지에 맞는 공지사항 데이터만 반환
    paginatedNotices() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.notices.slice(start, end);
    }
  },
  created() {
    //공지사항 목록 불러옴
    this.fetchNotices();
  },
  //공지사항 목록 서버에서 가져오기
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
        //서버에서 받은 데이터가 맞는 지 확인 후 공지사항 배열에 저장
        if (response.data && response.data._embedded && Array.isArray(response.data._embedded.noticeListResponseList)) {
          this.notices = response.data._embedded.noticeListResponseList;
        } else {
          this.notices = [];
          //console.warn(':', response.data);
        }
        //현재 url에 있는 공지사항 id로 해당 공지사항 세부정보
        this.fetchNotice(this.$route.params.id);
      } catch (error) {
       // console.error('Error fetching notices:', error);
        if (error.response && error.response.status === 401) {
          alert('인증되지 않은 사용자입니다. 다시 로그인해주세요.');
          this.$router.push({ name: 'Login' }); 
        } else {
          this.notices = [];
        }
      }
    },
    //선택한 공지사항의 세부정보를 보기 위해 서버에서 가져옴
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
          throw new Error('공지사항을 불러오는 데 실패하였습니다.');
        }
        const data = response.data.data;
        this.notice = data;

        // 기존 이미지 로드 및 추가된 이미지를 가져와서 보여주기
        this.images = data.noticePhotos.map(photoUrl => ({ src: photoUrl, isNew: false }));
      } catch (error) {
        //console.error(':', error);
        if (error.response && error.response.status === 404) {
          alert('공지사항이 존재하지 않습니다.');
          this.$router.push({ name: 'NoticeList' }); 
        } else {
          this.notice = null;
        }
      }
    },
    //이전 공지사항 세부정보로 이동
    prevNotice() {
      const currentIndex = this.notices.findIndex(notice => notice.noticeId == this.$route.params.id);
      const prevIndex = (currentIndex - 1 + this.notices.length) % this.notices.length;
      this.$router.push({ name: 'NoticeClick', params: { id: this.notices[prevIndex].noticeId } });
    },
    //다음 공지사항 세부정보로 이동
    nextNotice() {
      const currentIndex = this.notices.findIndex(notice => notice.noticeId == this.$route.params.id);
      const nextIndex = (currentIndex + 1) % this.notices.length;
      this.$router.push({ name: 'NoticeClick', params: { id: this.notices[nextIndex].noticeId } });
    },
    //클릭한 공지사항의 세부정보 페이지로 이동
    goToNotice(id) {
      this.$router.push({ name: 'NoticeClick', params: { id } });
    },
    //페이지 변경 시 현재 페이지 번호 바뀜
    changePage(page) {
      this.currentPage = page;
    },
    // 줄바꿈 문자를 <br>로 변환하는 함수
    convertNewlinesToBr(text) {
      return text ? text.replace(/\n/g, '<br>') : '';
    },
    //날짜 보여주는 함수
    formattedDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    //이미지 로드 실패시 띄우는 대체 이미지
    handleImageError(index) {
      this.images[index].src = '@/assets/placeholder.png'; // 이미지 로드 실패 시 대체 이미지
    },
  },
  //라우트가 변경될 떄마다 공지사항 정보를 다시 가져옴
  watch: {
    $route(to) {
      this.fetchNotice(to.params.id);
    }
  }
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
  display: flex; /* 아이콘과 텍스트를 정렬 */
  align-items: center; /* 수직 가운데 정렬 */
  background: none;
  border: none;
  color: black;
  cursor: pointer;
  font-size: 14px;
}

.nav-icon {
  width: 12px; /* 아이콘 크기 */
  height: 12px;
  margin: 0 5px; /* 아이콘과 텍스트 사이 간격 */
}

.nav-text {
  display: inline-block; /* 글씨만 별도로 이동 가능 */
margin-top: 0.8px;/* 글씨를 아래로 내림 */
  font-size: 14px;
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

.author-name {
 
  font-family: Pretendard; /* 폰트 */
  font-size: 14px; /* 글씨 크기 */
  font-weight: 400; /* 글씨 굵기 */
  line-height: 14px; /* 줄 간격 */
  letter-spacing: -0.025em; /* 글자 간격 조정 */
  text-align: left; /* 왼쪽 정렬 */
  text-underline-position: from-font; /* 밑줄 위치 */
  text-decoration-skip-ink: none; /* 밑줄 효과 설정 */
  color:  #000000; /* 텍스트 색상 (추가) */
  padding: 2px 4px; /* 배경색과 텍스트 사이 여백 추가 (선택사항) */
}


.notice-divider {
  width: 764px; /* 구분선의 너비 */
  height: 0px; /* 구분선의 높이 */
  position: absolute; /* 위치 지정 */
  top: 241px; /* 상단에서 241px 아래로 */
  left: 490px; /* 왼쪽에서 490px 오른쪽으로 */
  gap: 0px; /* 요소 간 간격 */
  border: 0.5px solid #868686; /* 구분선 스타일: 얇은 회색 선 */
  opacity: 0; /* 구분선 투명도 */
  transform: rotate(0deg); /* 회전각도 */
}
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center; /* 수직 정렬 */
  gap: 10px; /* 버튼 사이 간격 */
}

.pagination span {
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 400;
  line-height: 14px;
  letter-spacing: -0.025em;
  color: #000000;
  cursor: pointer;
  padding: 5px 10px;
}

.pagination span.active {
  font-weight: 700;
  color: #FFB052; /* 활성화된 페이지 색상 */
}

.pagination-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 400;
  line-height: 14px;
  color: #000000;
  cursor: pointer;
}

.pagination-button:hover {
  text-decoration: underline; /* 호버 효과 */
}

.pagination-icon {
  width: 12px; /* 아이콘 크기 */
  height: 12px;
  margin: 0 5px; /* 텍스트와 아이콘 간격 */
}

</style>
