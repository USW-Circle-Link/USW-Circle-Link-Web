<template>
  <div class="title">소속 동아리 리스트</div>
  <!-- 소속 동아리 리스트 -->
  <div class="header">
    <div class="header-row">
      <div class="header-item-department">분과</div>
      <div class="header-item-clubname">동아리 이름</div>
      <div class="header-item-clubleader">동아리 회장</div>
      <div class="header-item-numberOfClubMembers">인원</div>
      <div class="header-item-delete"></div>
    </div>
  </div>

  <div class="container">
    <!-- 동아리 리스트 -->
    <div class="list">
      <div class="list-item-container" v-for="(club, index) in displayedClubs" :key="index">
        <div class="list-item-row" @click= openPopupClubInfo(club.clubName)>
          <div class="list-item-department">{{ club.department }}</div>
          <div class="list-item-clubname">{{ club.clubName }}</div>
          <div class="list-item-clubleader">{{ club.leaderName }}</div>
          <div class="list-item-numberOfClubMembers">{{ club.numberOfClubMembers }}</div>
        </div>
        <div class="list-item-delete">
          <button class="delete-btn" @click="openPopup(club.clubId, index, club.clubName)">삭제</button>
        </div>
      </div>
    </div>

    <!-- 페이지네이션 -->
    <div class="pagination">
      <!-- 이전 페이지 -->
      <button @click="prevPage">
        <img src="@/assets/left.png" alt="Previous" />
      </button>
      <!-- 페이지 번호 -->
      <button
        v-for="page in totalPages"
        :key="page"
        @click="setPage(page)"
        :class="{ active: page === currentPage }"
      >
        {{ page }}
      </button>
      <!-- 다음 페이지 -->
      <button @click="nextPage">
        <img src="@/assets/rigth.png" alt="Next" />
      </button>
    </div>
  </div>

  <!-- 동아리 삭제 팝업창  -->
  <div v-if="isPopupVisible" class="popup-overlay">
    <div class="popup">
      <h3>동아리 삭제</h3>
      <div class="line2"></div>
      <p class="popup-message">'{{PopupClubName}}'을(를) 삭제하시겠습니까?</p>
      <input v-model="adminPw" type="password" placeholder="관리자 비밀번호" />
      <p class="popup-warning">{{adminPwError}}</p>
      <button class="expel-button" @click="confirmDelete">확인</button>
      <button class="cancel-button" @click="cancelDelete">취소</button>
    </div>
  </div>

  <!-- 동아리 상세 정보 팝업창 -->
  <div v-if="isClubInfoPopupVisible" ref="popup" class="ClubInfoPopup-overlay">
    <div class="club-profile">
      <ImageSlider :images="images" oncontextmenu="return false;"/>
      <div class="ClubInfo">
        <img :src="mainPhoto" alt="Flag Logo" class="logo" oncontextmenu="return false;"/>
        <div class="Info">
          <div class="info">
            <p class="clubname">{{ data.clubName }}</p>
            <div class="line1"></div>
            <p class="clubleader">동아리장</p>
            <p class="name">{{ data.leaderName }}</p>
          </div>
          <div class="phoneNum">
            <div class="icon phone"></div>
            <p>{{ formattedPhoneNumber }}</p>
          </div>
          <div class="instaName">
            <div class="icon insta"></div>
            <p>@{{ data.clubInsta }}</p>
          </div>
        </div>
      </div>
      <div class="description">
        <h3>동아리 소개</h3>
        <div>
          <p v-html="convertNewlinesToBr(data.clubIntro)"></p>
        </div>
      </div>
      <!-- 서버 응답값을 화면에 표시  <pre>{{ data }}</pre>-->
      <button class="popup-button" @click="closePopup">닫기</button>
    </div>
  </div>
</template>

<script>
import ImageSlider from "@/components/Admin/ImageSlider.vue";
import axios from "axios";
import store from "@/store/store"; // Ensure Vuex store is imported

export default {
  components: {
    ImageSlider
  },
  data() {
    return {
      currentPage: 1, // 페이지네이션 현재 페이지
      clubsPerPage: 10, // 화면에 나타내는 동아리 최대 개수
      clubs: [], // 서버에서 가져온 클럽을 저장할 배열
      isPopupVisible: false, // 동아리 삭제 확인 팝업창 가시성 플래그
      isClubInfoPopupVisible: false, // 동아리 상세 정보 팝업창 가시성 플래그
      adminPw: '', // 삭제를 위한 비밀번호 입력
      clubToDelete: null, // 삭제할 클럽 ID
      deleteIndex: null, // 배열의 클럽 인덱스
      images: [],  // 동아리 활동 사진을 담을 배열
      data: {},  // 동아리 기본 정보를 담을 객체
      mainPhoto:  require('@/assets/profile.png'),  // 메인 사진 URL, 없을 경우 기본이미지
      adminPwError: '', // 정보 입력 값 에러 메세지 변수
      PopupClubName: null, // 삭제할 동아리 이름
      // 영어 -> 한글 매핑 객체
      DepartmentTypeMap: {
        ACADEMIC: "학술",
        RELIGION: "종교",
        ART: "예술",
        SPORT: "체육",
        SHOW: "공연",
        VOLUNTEER: "봉사",
      },
    };
  },
  created() {
    this.fetchClubs(); // 구성 요소가 생성되면 클럽 정보를 서버로부터 가져옵니다.
  },
  computed: {
    // 총 페이지 수 계산
    totalPages() {
      return Math.ceil(this.clubs.length / this.clubsPerPage);
    },
    // 페이지 나태내기
    displayedClubs() {
      const start = (this.currentPage - 1) * this.clubsPerPage;
      return this.clubs.slice(start, start + this.clubsPerPage);
    },
    // 전화번호 000-0000-0000 으로 변환
    formattedPhoneNumber() {
      return this.data.leaderHp ? this.data.leaderHp.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3') : '';
    },
  },
  methods: {
    // 서버로부터 동아리 정보 불러오기
    async fetchClubs() {
      try {
        const response = await axios.get('http://15.164.246.244:8080/admin/clubs', {
          headers: {
            'Authorization': `Bearer ${store.state.accessToken}`
          }
        });
        this.clubs = response.data.data; // 가져온 클럽을 데이터 배열에 저장
        console.log(this.clubs);
      } catch (error) {
        console.error('Error fetching clubs:', error);
        alert('동아리 리스트를 불러오는데 실패했습니다.');
      }
    },
    // 동아리 삭제 팝업창 열기
    openPopup(clubId, index, clubName) {
      this.PopupClubName = clubName;
      this.clubToDelete = clubId;
      this.deleteIndex = index;
      this.isPopupVisible = true; // Open popup
    },
    // 동아리 삭제 팝업창 "취소" 버튼
    cancelDelete() {
      this.isPopupVisible = false; // Close popup
      this.adminPw = ''; // Reset password
    },
    closePopup(){
      this.isClubInfoPopupVisible = false;
    },
    // 동아리 삭제 팝업창 "확인" 버튼
    async confirmDelete() {
      if (!this.adminPw) {
        alert('관리자 비밀번호를 입력하세요.');
        return;
      }

      try {
        const response = await axios.delete(`https://api.donggurami.net/admin/clubs/${this.clubToDelete}`, {
          headers: {
            'Authorization': `Bearer ${store.state.accessToken}` // Correct usage of the store
          },
          data: { adminPw: this.adminPw } // Send password as part of the request
        });
        console.log('Club deleted successfully:', response.data);
        alert('동아리가 성공적으로 삭제되었습니다.');
        this.clubs.splice(this.deleteIndex, 1); // Remove club from the list
        this.isPopupVisible = false; // Close popup
      } catch (error) {
        console.error('Error deleting club:', error);
        if (error.response.status === 400) {
          this.adminPwError = '* 비밀번호를 다시 확인해주세요.';
        }
      }
    },
    // 현재 페이지 설정
    setPage(page) {
      this.currentPage = page;
    },
    // 이전 페이지
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    // 다음 페이지
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    // 동아리 상세 정보 팝업창 열기
    async openPopupClubInfo(clubName) {
      const club = this.clubs.find(club => club.clubName === clubName);
      console.log(club.clubId);
      console.log('Popup has been loaded!');
      this.isClubInfoPopupVisible = true;

      // 동아리 정보를 불러오기 전에 일단 mainPhoto를 기본 이미지로 초기화
      this.mainPhoto = require('@/assets/profile.png');
      this.images = []; //images도 일단 초기화
      const accessToken = store.state.accessToken; // 저장된 accessToken 가져오기

      try {
        const response = await axios.get(`http://15.164.246.244:8080/admin/clubs/${club.clubId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`, // 헤더에 accessToken 추가
            'Content-Type': 'application/json'
          }
        });

        this.data = response.data.data;  // 동아리 기본 정보 설정
        console.log(this.data);
        // 사진 URL이 들어오면 mainPhoto에 사진 URL 저장
        if (this.data.mainPhoto) {
          this.mainPhoto = this.data.mainPhoto;
        }

        // 활동 사진들을 비동기로 가져오며, 오류가 있는 경우 해당 URL은 제외
        const introPhotosPromises = this.data.introPhotos.map(async (url) => {
          try {
            const response = await axios.get(url, { responseType: 'blob' });
            if (response.status === 200 && response.data.type.startsWith('image')) {
              return URL.createObjectURL(response.data); // Blob을 URL로 변환
            }
          } catch (error) {
            console.error(`Failed to load image from URL: ${url}`, error);
            return null;  // 실패한 경우 null을 반환
          }
        });

        // null이 아닌 값들만 필터링하여 images에 저장
        this.images = (await Promise.all(introPhotosPromises)).filter(image => image !== null);

      } catch (error) {
        console.error('Fetch error:', error);
        this.error = error.message;
      }
    },
    // 줄바꿈 변환
    convertNewlinesToBr(text) {
      return text ? text.replace(/\n/g, '') : '';
    },
  },
};
</script>


<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  margin: 0;
  padding: 20px;
}

.container {
  width: 820px;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 620px;
   /* 페이지네이션을 하단에 고정 */
}

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
  width: 22%;
  height: 19px; /* 형광펜 두께 */
  background-color: #FFB052;
; /* 노란색 배경 */
  z-index: -1; /* 텍스트 뒤에 위치하도록 설정 */
  transform: skew(-12deg); /* 기울기 효과 추가 */
}

/* Header Section */
.header {
  width: 820px;
  background-color: #ffffff;
  border-radius: 8px;
  margin: 20px 0 30px 0;
  padding: 0 20px 0 20px;
}

.header-row {
  display: flex;
  text-align: center;
  background-color: white;
  font-weight: bold;
  border-radius: 8px;
}

.header-item-department{
  flex: 1;
  padding: 10px 0; /* 헤더의 상하 여백을 조정 */
  line-height: 1.5; /* 줄 높이를 조정하여 텍스트의 세로 위치 조정 */
}

.header-item-clubname{
  flex: 1;
  padding: 10px 0; /* 헤더의 상하 여백을 조정 */
  line-height: 1.5; /* 줄 높이를 조정하여 텍스트의 세로 위치 조정 */
}

.header-item-clubleader{
  flex: 1;
  padding: 10px 0; /* 헤더의 상하 여백을 조정 */
  line-height: 1.5; /* 줄 높이를 조정하여 텍스트의 세로 위치 조정 */
}

.header-item-numberOfClubMembers{
  flex: 1;
  padding: 10px 0; /* 헤더의 상하 여백을 조정 */
  line-height: 1.5; /* 줄 높이를 조정하여 텍스트의 세로 위치 조정 */
}

.header-item-delete{
  flex: 0.4;
  padding: 10px 0; /* 헤더의 상하 여백을 조정 */
  line-height: 1.5; /* 줄 높이를 조정하여 텍스트의 세로 위치 조정 */
}

/* List Items Section */
.list {
  margin-bottom: 10px;
  background-color: white;
  border-radius: 5px;
  margin-top: 10px; /* 리스트를 아래로 20px 내림 */
  width: 800px;
}

.list-item-department {
  flex: 1;
  display: flex;
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: center; /* 가로 가운데 정렬 */
  font-size: 15px; /* 리스트 아이템의 글자 크기 키움 */
  font-weight: 500;
  cursor: pointer;
}

.list-item-clubname {
  flex: 1;
  display: flex;
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: center; /* 가로 가운데 정렬 */
  font-size: 15px; /* 리스트 아이템의 글자 크기 키움 */
  font-weight: 500;
  cursor: pointer;
}

.list-item-clubleader {
  flex: 1;
  display: flex;
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: center; /* 가로 가운데 정렬 */
  font-size: 15px; /* 리스트 아이템의 글자 크기 키움 */
  font-weight: 500;
  cursor: pointer;
}

.list-item-numberOfClubMembers {
  flex: 1;
  display: flex;
  align-items: center; /* 세로 중앙 정렬 */
  justify-content: center; /* 가로 가운데 정렬 */
  font-size: 15px; /* 리스트 아이템의 글자 크기 키움 */
  font-weight: 500;
  cursor: pointer;
}

.list-item-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  width: 820px;
}

.list-item-row {
  display: flex;
  padding: 10px 0 10px 0;
  background-color: #F0F2F5;
  width: 745.44px; /* 줄여진 너비 */
  border-radius: 5px;
  height: 26px;
}

.list-item-delete {
  width: 74.55px;
  display: flex;
  align-items: center;
}

.delete-btn {
  background-color: #e57373;
  color: #ffffff;
  width: 70.55px;
  height: 44px;
  margin: 0 4px 0 4px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  visibility: visible;
  transition: visibility 0s, opacity 0.2s ease-in-out;
}

/* Pagination */
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
  color: #ffc700;
}
/* Popup Overlay and Popup Window */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  flex-direction: column;
}

.popup {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  width: 452px;
  height: 184px;
  text-align: left;
  position: relative;
}

.popup h3 {
  font-size: 18px;
  font-weight: bold;
  color: black;
  margin: 0;
}

.line2{
  border-bottom: 1px solid #d3d3d3;
  margin: 10px 0;
}

.popup-message {
  font-size: 16px;
  font-weight: 500;
  line-height: 12px;
  color: #2F2F2F;
  margin-top: 20px;
}

.popup input {
  width: 430px;
  padding: 10px;
  font-size: 14px; /* 입력 칸의 글씨 크기를 더 크게 */
  border: 1px solid #C6C6C6;
  border-radius: 8px;
}

.popup-warning {
  font-size: 12px;
  font-weight: 300;
  color: #FF4B4B;
  margin-left: 10px;
}

.expel-button {
  background-color: #FFB052;
  color: white;
  border: none;
  padding: 7px 30px;
  border-radius: 7px;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.expel-button:hover {
  background-color: #e6953e;
}

.cancel-button {
  background-color: #cccccc;
  color: white;
  border: none;
  padding: 7px 30px;
  border-radius: 7px;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  position: absolute;
  bottom: 20px;
  right: 120px;
}

.cancel-button:hover {
  background-color: #999999;
}

.ClubInfoPopup-overlay {
  position: fixed; /* 화면 전체를 덮음 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 화면 상단에 표시 */
  overflow-y: auto;
}

.club-profile {
  max-width: 600px;
  height: 825px;
  margin: auto;
  background: #F0F2F5;
  border-radius: 8px;
}

.socials a {
  margin: 0 10px;
}

.ClubInfo {
  width: 584px;
  height: 150px;
  display: flex;
  margin-bottom: 30px;
  border-radius: 8px;
}

.ClubInfo img{
  height: 150px;
}

.logo{
  max-width:100%;
  max-height:100%;
  width:auto;
  height:auto;
  background-size: contain;
  object-fit: fill;
  border-radius: 8px;
  margin: 0 40px 0 40px;
}

.Info{
  display: flex;
  flex-direction: column;
  justify-content: center;
  vertical-align: middle;
}

.info{
  display: flex;
  align-items: center;
}

.clubname{
  color: #000;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px; /* 100% */
  letter-spacing: -0.6px;
  margin-right: 15px;
}

.clubleader{
  color: #767676;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 100% */
  letter-spacing: -0.4px;
  margin-left: 15px;
  margin-right: 5px;
}

.name{
  color: #353549;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: -0.4px;
}

.phone{
  width: 16px;
  margin-right: 7px;
  background: url('@/assets/phone.svg') no-repeat center center;
}

.insta{
  width: 16px;
  margin-right: 7px;
  background: url('@/assets/insta.svg') no-repeat center center;
}

.line1{
  width: 1px;
  height: 12px;
  background: #DBDBDB;
  margin-bottom: 4px;
}

.phoneNum{
  display: flex;
  height: 30px;
}

.phoneNum p{
  font-size: 16px;
  text-align: center;
  line-height: 30px;
  margin: 0;
}

.instaName{
  display: flex;
  height: 30px;
}

.instaName p{
  font-size: 16px;
  text-align: center;
  line-height: 30px;
  margin: 0;
}

.description {
  text-align: left;
  margin-left: 40px;
}

.description div{
  width: 500px;
  height: 287px;
  border-radius: 8px;
  align-items: center;
  align-content: center;
  background-color: #fff;
  overflow-y: auto;
}

.description p{
  width: 460px;
  height: 247px;
  margin-left: 20px;
}

.popup-button{
  margin-left: 445px;
  margin-top: 20px;
  border: none;
  border-radius: 8px;
  justify-content: space-between;
  background-color: #ffc107; /* 확인 버튼 색상 변경 */
  color: #fff;
  padding: 10px 30px; /* 버튼 크기를 더 크게 */
  font-size: 1.2em; /* 버튼 글씨 크기를 더 크게 */
  cursor: pointer;
  transition: background-color 0.3s;
}

</style>

