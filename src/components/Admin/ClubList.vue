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
      <div class="list-item-container" v-for="(club, index) in clubs" :key="index">
      <div class="list-item-row" @click="openPopupClubInfo(club.clubName)">
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
    <div class="pagination">
  <button @click="prevPage" :disabled="currentPage === 1">
    <img src="@/assets/left.png" alt="Previous" />
  </button>
  <button
    v-for="page in totalPages"
    :key="page"
    @click="setPage(page)"
    :class="{ active: page === currentPage }"
  >
    {{ page }}
  </button>
  <button @click="nextPage" :disabled="currentPage === totalPages">
    <img src="@/assets/rigth.png" alt="Next" />
  </button>
</div>
  </div>
    


  <!-- 동아리 삭제 팝업 -->
  <div v-if="isPopupVisible" class="popup-overlay">
    <div class="popup">
      <h3>동아리 삭제</h3>
      <div class="line2"></div>
      <p class="popup-message">'{{ PopupClubName }}'을(를) 삭제하시겠습니까?</p>
      <input v-model="adminPw" type="password" placeholder="관리자 비밀번호" />
      <p class="popup-warning">{{ adminPwError }}</p>
      <button class="expel-button" @click="confirmDelete">확인</button>
      <button class="cancel-button" @click="cancelDelete">취소</button>
    </div>
  </div>

  <!-- 동아리 상세 정보 팝업 -->
  <div v-if="isClubInfoPopupVisible" ref="popup" class="ClubInfoPopup-overlay">
    
    <button class="close1-btn" @click="closePopup">✖</button>
  
    <div class="club-profile">
      <ImageSlider :images="images" />
      <div class="ClubInfo">
        <img :src="mainPhoto" alt="Flag Logo" class="logo" />
        <div class="Info">
          <div class="club-details">
            <p class="clubname"><strong>{{ data.clubName }}</strong></p>
            <p class="clubleader">
              동아리장 <span class="name"><strong>{{ data.leaderName }}</strong></span>
            </p>
            <div class="hashtags">
            <span v-for="tag in data.tags" :key="tag" class="hashtag">#{{ tag }}</span>
          </div>
          </div>
        </div>
        <!-- More Options Button -->
      <div class="more-options">
        <button @click="toggleContactInfo" class="dots-button">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <!-- Contact Information -->
        <div v-if="showContactInfo" class="contact-info-popup">
          <div class="popup-header">
            <p><strong>동아리 정보</strong></p>
            <button class="close-btn" @click="toggleContactInfo">✖</button>
          </div>
          <hr />
          <div class="location">
            <div class="icon location"></div>
            <span>동아리방|  {{ data.clubRoom }}</span>
          </div>
          <hr />
          <div class="phoneNum">
            <div class="icon phone"></div>
            <span>{{ formattedPhoneNumber }}</span>
          </div>
          <hr />
          <div class="instaName">
            <div class="icon insta"></div>
            <a :href="instagramLink" target="_blank">@{{ data.clubInsta }}</a>
          </div>
        </div>
      </div>
      </div>
      <div class="tabs-container">
        <div class="tabs">
          <button :class="{ active: activeTab === 'intro' }" @click="activeTab = 'intro'">
            동아리 소개 글
          </button>
          <button :class="{ active: activeTab === 'recruit' }" @click="activeTab = 'recruit'">
            동아리 모집 글
          </button>
        </div>
        <div class="tab-content">
          <div v-if="activeTab === 'intro'" class="description">
            <p v-html="convertNewlinesToBr(data.clubIntro)"></p>
          </div>
          <div v-if="activeTab === 'recruit'" class="description">
            <p v-html="convertNewlinesToBr(data.clubRecruit)"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImageSlider from "@/components/Admin/ImageSlider.vue";
import axios from "axios";
import store from "@/store/store"; // Vuex store

export default {
  name: "ClubProfile",
  components: {
    ImageSlider,
  },
  data() {
    return {
      currentPage: 1, // 페이지네이션 현재 페이지
      clubsPerPage: 10, // 화면에 나타내는 동아리 최대 개수
      clubs: [], // 서버에서 가져온 클럽 리스트
      isPopupVisible: false, // 동아리 삭제 확인 팝업창 가시성
      isClubInfoPopupVisible: false, // 동아리 상세 정보 팝업창 가시성
      adminPw: "", // 삭제를 위한 비밀번호
      clubToDelete: null, // 삭제할 클럽 ID
      deleteIndex: null, // 삭제할 클럽의 인덱스
      images: [], // 동아리 활동 사진 배열
      data: {}, // 동아리 기본 정보
      mainPhoto: require("@/assets/profile.png"), // 메인 사진 URL, 기본값
      adminPwError: "", // 비밀번호 에러 메시지
      PopupClubName: null, // 삭제할 동아리 이름
      activeTab: "intro", // 활성화된 탭
      showContactInfo: false, // 연락처 팝업 가시성
      tags: ["개발", "프로그래밍", "협업", "학습"],
    };
  },
  created() {
    this.fetchClubs(); // 페이지 로드 시 클럽 정보 가져오기
  },
  computed: {
    // 총 페이지 수 계산
    totalPages() {
      return Math.ceil(this.clubs.length / this.clubsPerPage);
    },
    // 현재 페이지 클럽 리스트 계산
    displayedClubs() {
      const start = (this.currentPage - 1) * this.clubsPerPage;
      return this.clubs.slice(start, start + this.clubsPerPage);
    },
    // 전화번호 포맷팅
    formattedPhoneNumber() {
      return this.data.leaderHp
        ? this.data.leaderHp.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")
        : "";
    },
    // Instagram 링크 생성
    instagramLink() {
      return this.data.clubInsta || "#";
    },
  },
  methods: {
    // 서버에서 클럽 데이터 가져오기
    async fetchClubs() {
      try {
        const response = await axios.get("http://15.164.246.244:8080/admin/clubs?page=0&size=5", {
          headers: {
            Authorization: `Bearer ${store.state.accessToken}`,
          },
          params: {
          page: this.currentPage - 1, // 백엔드 페이지는 0부터 시작
          size: this.clubsPerPage,  // 한 페이지에 표시할 클럽 수
          },
        });
        // API 응답 데이터 처리
      const { content, totalPages } = response.data.data;
      this.clubs = content || []; // 현재 페이지의 클럽 리스트 저장
      this.totalPages = totalPages || 1; // 전체 페이지 수 저장
    } catch (error) {
      console.error("Error fetching clubs:", error);
      alert("동아리 리스트를 불러오는데 실패했습니다.");
    }
  },
  async setPage(page) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page; // 현재 페이지 업데이트
      await this.fetchClubs(); // 새로운 데이터 가져오기
    }
  },
  async prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      await this.fetchClubs(); // 이전 페이지 데이터 가져오기
    }
  },
  async nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      await this.fetchClubs(); // 다음 페이지 데이터 가져오기
    }
  },

    // 삭제 팝업 열기
    openPopup(clubId, index, clubName) {
      this.PopupClubName = clubName;
      this.clubToDelete = clubId;
      this.deleteIndex = index;
      this.isPopupVisible = true;
    },
    // 삭제 팝업 닫기
    cancelDelete() {
      this.isPopupVisible = false;
      this.adminPw = ""; // 비밀번호 초기화
    },
    // 상세 정보 팝업 닫기
    closePopup() {
      this.isClubInfoPopupVisible = false;
    },
    // 클럽 삭제 확인
    async confirmDelete() {
      if (!this.adminPw) {
        alert("관리자 비밀번호를 입력하세요.");
        return;
      }
      try {
        await axios.delete(`http://15.164.246.244:8080/admin/clubs/${this.clubToDelete}`, {
          headers: {
            Authorization: `Bearer ${store.state.accessToken}`,
          },
          data: { adminPw: this.adminPw },
        });
        this.clubs.splice(this.deleteIndex, 1); // 삭제된 클럽 리스트에서 제거
        this.isPopupVisible = false;
        alert("동아리가 성공적으로 삭제되었습니다.");
      } catch (error) {
        console.error("Error deleting club:", error);
        this.adminPwError = "* 비밀번호를 다시 확인해주세요.";
      }
    },
    // 상세 정보 팝업 열기
    async openPopupClubInfo(clubName) {
      const club = this.clubs.find((club) => club.clubName === clubName);
      if (!club) return;
      this.isClubInfoPopupVisible = true;
      this.mainPhoto = require("@/assets/profile.png"); // 기본 이미지 초기화
      this.images = [];
      try {
        const response = await axios.get(`http://15.164.246.244:8080/adminmain/clubs/${club.clubId}`, {
          headers: {
            Authorization: `Bearer ${store.state.accessToken}`,
          },
        });
        this.data = response.data.data || {};
        if (this.data.mainPhoto) this.mainPhoto = this.data.mainPhoto;

        const introPhotosPromises = this.data.introPhotos.map(async (url) => {
          try {
            const response = await axios.get(url, { responseType: "blob" });
            if (response.status === 200) {
              return URL.createObjectURL(response.data);
            }
          } catch (error) {
            console.error(`Failed to load image: ${url}`, error);
            return null;
          }
        });

        const results = await Promise.all(introPhotosPromises);
        this.images = results.filter(Boolean);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    },
    // 페이지네이션 설정
    setPage(page) {
      this.currentPage = page;
    },
    // 이전 페이지
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    // 다음 페이지
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    // 텍스트 줄바꿈 변환
    convertNewlinesToBr(text) {
      return text ? text.replace(/\n/g, "<br>") : "";
    },
    // 연락처 팝업 토글
    toggleContactInfo() {
      this.showContactInfo = !this.showContactInfo;
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
   justify-content: space-between; 
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

.contact-info-popup .popup-header p {
  text-align: left; /* 텍스트를 왼쪽 정렬 */
  margin-right: 200px; /* 오른쪽 여백 */
  margin-top: -20px; /* 위로 여백 조정 */
  font-size: 16px; /* 기존 폰트 크기 유지 */
  font-weight: bold;
  line-height: 10.2; /* 줄 높이를 줄여서 위로 이동 */
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px; /* 위 리스트와의 간격 */
}

.pagination button{
  background: none;
  border: none;
  cursor: pointer;
  margin: 0 8px; /* 좌우 간격 */
  font-size: 14px; /* 텍스트 크기 */
  color: #aaa; /* 기본 색상 */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px; /* 버튼 크기 */
  height: 24px; /* 버튼 크기 */
}
.pagination span {
  border: none;
  background: none;
  cursor: pointer;
  margin: 0 8px; /* 각 버튼 간 간격 */
  font-size: 14px;
  font-weight: 400;
  color: #555; /* 기본 색상 */

}



.pagination button:disabled {
  opacity: 0.5; /* 비활성화된 버튼의 투명도 */
  cursor: not-allowed; /* 클릭 불가 */
}

.pagination .active {
  font-weight: bold;
  color: #ffc700; /* 활성화된 페이지의 색상 */
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.club-profile {
  width: 700px;
  height: 1085px;
  margin: auto;
  background: #F0F2F5;
  border-radius: 8px;
}

.socials a {
  margin: 0 10px;
}

.ClubInfo {
  display: flex;
  align-items: flex-start; /* 상단 정렬 */
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 626px; /* 전체 너비 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  margin-bottom: 30px; /* 소개/모집글 탭과의 간격 추가 */
  margin-left: 30px;
  margin-right: 30px;
  width: 595px;
}


.clubname {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.logo {
  width: 104px;
  height: 112px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
  margin-left: 60px;
}

.Info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  margin-left: 35px;
}

.hashtags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hashtag {
  padding: 6px 12px;
  font-size: 14px;
  color: #555555;
  background-color: #FFFFFF;
  border: 1px solid #C3C3C3;
  border-radius: 12px;
  cursor: default;
  text-align: center;
}

.more-options {
  position: absolute;
  top: 20px;
  right: 20px;
}

.dots-button {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dots-button span {
  width: 5px;
  height: 5px;
  background: #767676;
  border-radius: 50%;
}

.contact-info-popup {
  position: absolute;
  top: 30px;
  right: 0;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 10px;
  width: 280px;
  z-index: 100;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.popup-header p {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
}

.contact-info-popup hr {
  margin: 10px 0;
  border: none;
  border-top: 1px solid #ddd;
}

.contact-info-popup .location,
.contact-info-popup .phoneNum,
.contact-info-popup .instaName {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.contact-info-popup .icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  background-size: contain;
}

.icon.location {
  background: url('@/assets/location.svg') no-repeat center center;
}

.icon.phone {
  background: url('@/assets/phone.svg') no-repeat center center;
}

.icon.insta {
  background: url('@/assets/insta.svg') no-repeat center center;
}

.contact-info-popup .close-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
}

/* 탭 컨테이너 */
.tabs-container {
  width: 626px; /* ClubInfo와 동일한 너비 */
  margin: 0 auto; /* 중앙 정렬 */
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 탭을 왼쪽 정렬로 변경 */
}

/* 탭 */
.tabs {
  display: flex;
  justify-content: flex-start; /* 탭 버튼 왼쪽 정렬 */
  border-bottom: 1px solid #C3C3C3; /* 하단 테두리 */
  width: 100%; /* 부모 컨테이너에 맞춤 */
  margin: 0; /* 불필요한 여백 제거 */
  align-items: flex-start; /* 탭을 왼쪽 정렬로 변경 */
}

/* 탭 버튼 */
.tabs button {
  width: 174px; /* 각 탭의 너비를 동일하게 설정 (컨테이너 너비의 절반) */
  padding: 10px 0; /* 상하 여백 */
  text-align: center;
  background-color: #EEEEEE;
  color: #C3C3C3;
  border: 1px solid #C3C3C3;
  border-radius: 0 8px 0 0; /* 둥근 모서리 */
  cursor: pointer;
  align-items: flex-start; /* 전체를 왼쪽 정렬 */
  
}

/* 활성화된 탭 */
.tabs button.active {
  background-color: #FFB052;
  color: #FFFFFF;
  border: 1px solid #C3C3C3;
  border-bottom: none; /* 하단 테두리를 제거하여 탭 내용과 연결 */
}

/* 비활성화된 탭 */
.tabs button.inactive {
  background-color: #EEEEEE;
  color: #C3C3C3;
  border: 1px solid #C3C3C3;
}

.tabs button:first-child {
  border-radius: 0 0 0 0; /* 왼쪽 상단과 하단 둥글게 안 함 */
}

/* 탭 내용 */
.tab-content {
  width: 665px; /* ClubInfo와 동일한 너비 */
  margin: 0 auto;
  padding: 25px;
  background-color: #fff;
  border: 1px solid #C3C3C3;
  border-radius: 0 0 8px 8px;
  box-sizing: border-box;
  overflow-y: auto;
  max-height: 500px;
  
  margin-right: 30px;
  width: 630px;
}

.description {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.location {
  color: #9A9A9A; /* 텍스트 색상을 배경에 맞게 흰색으로 변경 */
}
.popup-header {
  
  width: 100%;
  height: 40px; /* 헤더 높이 */
  display: flex;
  justify-content: flex-end; /* 닫기 버튼 오른쪽 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  padding: 0 15px; /* 좌우 여백 */
  position: absolute;
  top: 0;
  left: 0;
  border-top-left-radius: 8px; /* 상단 좌우 모서리 둥글게 */
  border-top-right-radius: 8px;

}

.close-btn {
  position: absolute; /* 절대 위치 설정 */
  
  background: none; /* 배경 없음 */
  border: none; /* 테두리 없음 */
  color: black; /* 닫기 버튼 흰색 */
  font-size: 15px; /* 버튼 크기 */
  cursor: pointer; /* 클릭 가능한 포인터 */
  top: -5px;
  left: 262px;
}


/* 닫기 버튼 위치 조정 */
.close1-btn {
  position: absolute; /* 부모 요소를 기준으로 배치 */
  top: 35px;         /* 상단에서 20px 내려옴 */
  right: 740px;       /* 오른쪽에서 20px 떨어짐 */
  background: none;  /* 배경 없음 */
  border: none;      /* 테두리 없음 */
  color: black;      /* 닫기 버튼 색상 */
  font-size: 18px;   /* 버튼 크기 */
  cursor: pointer;   /* 클릭 가능 표시 */
}


/* 오른쪽 상단에 추가된 닫기 버튼 */
.close-btn1-top-right {
  position: absolute;
  top: 15px; /* 팝업 상단에서 15px 내려옴 */
  right: 105px; /* 팝업 오른쪽에서 15px 떨어짐 */
  background: none;
  border: none;
  color: black;
  font-size: 18px; /* 닫기 버튼 크기 */
  cursor: pointer;
}



</style>
