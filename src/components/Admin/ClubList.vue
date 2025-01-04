<template>
  <div class="title">소속 동아리 리스트</div>
  <!-- Header Section -->
  <div class="header">
    <div class="header-row">
      <div class="header-item">소속 분과</div>
      <div class="header-item">동아리명</div>
      <div class="header-item">동아리장</div>
      <div class="header-item">인원</div>
      <div class="header-item"></div>
    </div>
  </div>

  <div class="container">
    <!-- List Items Section -->
    <div class="list">
      <div class="list-item-container" v-for="(club, index) in displayedClubs" :key="index">
        <div class="list-item-row" @click="openPopupClubInfo(club.clubName)">
          <div class="list-item">{{ club.department }}</div>
          <div class="list-item">{{ club.clubName }}</div>
          <div class="list-item">{{ club.leaderName }}</div>
          <div class="list-item">{{ club.numberOfClubMembers }}</div>
        </div>
        <div class="delete-container">
          <button class="delete-btn" @click="openPopup(club.clubId, index)">삭제</button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button @click="prevPage">
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
      <button @click="nextPage">
        <img src="@/assets/rigth.png" alt="Next" />
      </button>
    </div>
  </div>

  <!-- Popup for Deletion Confirmation -->
  <div v-if="isPopupVisible" class="popup-overlay">
    <div class="popup">
      <h3>삭제 확인</h3>
      <p>이 동아리를 삭제하시겠습니까?</p>
      <input v-model="adminPw" type="password" placeholder="관리자 비밀번호" />
      <div class="popup-buttons">
        <button @click="confirmDelete">확인</button>
        <button @click="cancelDelete">취소</button>
      </div>
    </div>
  </div>

  <div v-if="isClubInfoPopupVisible" ref="popup" class="ClubInfoPopup-overlay">
    <div class="club-profile">
      <button @click="closePopup" class="close-popup-btn">✖</button>
      <ImageSlider :images="images" oncontextmenu="return false;" />

      <!-- Club Information Section -->
      <div class="ClubInfo">
        <img :src="mainPhoto" alt="Flag Logo" class="logo" oncontextmenu="return false;" />
        <div class="Info">
          <div class="club-details">
            <p class="clubname"><strong>{{ data.clubName }}</strong></p>
            <p class="clubleader">동아리장 <span class="name"><strong>{{ data.leaderName }}</strong></span></p>
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
              <span>동아리방 | {{ data.clubRoom }}</span>
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

      <!-- Tabs Section -->
      <div class="tabs-container">
        <div class="tabs-and-content">
          <div class="tabs">
            <button :class="{ active: activeTab === 'intro' }" @click="activeTab = 'intro'">동아리 소개 글</button>
            <button :class="{ active: activeTab === 'recruit' }" @click="activeTab = 'recruit'">동아리 모집 글</button>
          </div>

          <!-- Dynamic Content Section -->
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
  </div>
</template>

<script>
import axios from "axios";
import store from "@/store/store";
import ImageSlider from "@/components/ClubLeader/ImageSlider.vue";

const API_BASE_URL = "http://15.164.246.244:8080";

export default {
  name: "ClubList",
  components: {
    ImageSlider,
  },
  data() {
    return {
      images: [],
      data: {
        clubIntro: "",
        clubRecruit: "",
        tags: ["개발", "프로그래밍"], // Example tags
      },
      mainPhoto: require("@/assets/profile.png"),
      currentPage: 1,
      clubsPerPage: 10,
      clubs: [],
      isPopupVisible: false,
      isClubInfoPopupVisible: false,
      adminPw: "",
      clubToDelete: null,
      deleteIndex: null,
      activeTab: "intro",
      showContactInfo: false,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.clubs.length / this.clubsPerPage);
    },
    displayedClubs() {
      const start = (this.currentPage - 1) * this.clubsPerPage;
      return this.clubs.slice(start, start + this.clubsPerPage);
    },
    formattedPhoneNumber() {
      return this.data.leaderHp
        ? this.data.leaderHp.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")
        : "";
    },
    instagramLink() {
      return this.data.clubInsta || "#";
    },
  },
  methods: {
    convertNewlinesToBr(text) {
      return text ? text.replace(/\n/g, "<br>") : "";
    },
    async fetchClubs() {
      const accessToken = store.state.accessToken;
      if (!accessToken) {
        alert("로그인이 필요합니다.");
        return;
      }
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/clubs`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        this.clubs = response.data.data || [];
      } catch (error) {
        console.error("Error fetching clubs:", error);
        alert("동아리 리스트를 불러오는데 실패했습니다.");
      }
    },
    async openPopupClubInfo(clubName) {
  const club = this.clubs.find((club) => club.clubName === clubName);
  if (!club) return;

  this.isClubInfoPopupVisible = true;
  this.mainPhoto = require("@/assets/profile.png");
  this.images = [];

  try {
    const response = await axios.get(`${API_BASE_URL}/admin/clubs/${club.clubId}`, {
      headers: {
        Authorization: `Bearer ${store.state.accessToken}`,
      },
    });
    this.data = response.data.data || {};
    if (this.data.mainPhoto) this.mainPhoto = this.data.mainPhoto;

    // Load introPhotos
    const introPhotosPromises = this.data.introPhotos.map(async (url) => {
      try {
        const imageResponse = await axios.get(url, { responseType: "blob" });
        return URL.createObjectURL(imageResponse.data);
      } catch (error) {
        console.error("Failed to load image:", error);
        return null;
      }
    });

    this.images = (await Promise.all(introPhotosPromises)).filter(Boolean);
  } catch (error) {
    console.error("Error fetching club info:", error);
    alert("동아리 정보를 가져오는데 실패했습니다.");
  }
},
    openPopup(clubId, index) {
      this.clubToDelete = clubId;
      this.deleteIndex = index;
      this.isPopupVisible = true;
    },
    closePopup() {
  this.isClubInfoPopupVisible = false;
},
    cancelDelete() {
      this.isPopupVisible = false;
      this.adminPw = "";
    },
    async confirmDelete() {
      if (!this.adminPw) {
        alert("관리자 비밀번호를 입력하세요.");
        return;
      }
      try {
              await axios.delete(`${API_BASE_URL}/admin/clubs/${this.clubToDelete}`, {
        headers: {
          Authorization: `Bearer ${store.state.accessToken}`,
        },
        data: { adminPw: this.adminPw },
      });
        this.clubs.splice(this.deleteIndex, 1);
        this.isPopupVisible = false;
        alert("동아리가 성공적으로 삭제되었습니다.");
      } catch (error) {
        console.error("Error deleting club:", error);
        alert("동아리를 삭제하는데 실패했습니다.");
      }
    },
    setPage(page) {
      this.currentPage = page;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    toggleContactInfo() {
      this.showContactInfo = !this.showContactInfo;
    },
  },
  mounted() {
    this.fetchClubs();
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
  
; /* 노란색 배경 */
  z-index: -1; /* 텍스트 뒤에 위치하도록 설정 */
  transform: skew(-12deg); /* 기울기 효과 추가 */
}

/* Header Section */
.header {
  margin-bottom: 10px;
  background-color: white;
  border-radius: 5px;
  margin-top: 20px; /* 헤더를 아래로 20px 내림 */
}

.header-row {
  display: flex;
  text-align: center;
  background-color: white;
  font-weight: bold;
  width: 800px;
}

.header-item {
  flex: 1;
  text-align: end; /* 왼쪽 정렬 */
  padding: 10px 0; /* 헤더의 상하 여백을 조정 */
  line-height: 1.5; /* 줄 높이를 조정하여 텍스트의 세로 위치 조정 */
}

.header-item-row .header-item:nth-child(3), /* 동아리장 컬럼 */
.header-item-row .header-item:nth-child(4)  /* 인원 컬럼 */ {
  padding-left: 20px; /* 왼쪽으로 20px 옮기기 */
}

/* List Items Section */
.list {
  margin-bottom: 20px;
  margin-top: 20px; /* 리스트를 아래로 20px 내림 */
}

.list-item {
  flex: 1;
  display: flex;
  align-items: center; /* 세로 중앙 정렬 */
  padding-left: 60px; /* 데이터 항목의 좌측 여백 조정 */
  font-size: 18px; /* 리스트 아이템의 글자 크기 키움 */
  cursor: pointer;
}

.list-item-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.list-item-row {
  display: flex;
  padding: 10px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #e0e0e0;
  width: 730px; /* 줄여진 너비 */
  border-radius: 5px;
  height: 26px;
}

.delete-container {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.delete-btn {
  background-color: #e57373;
  color: #ffffff;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s, opacity 0.2s ease-in-out;
}

.list-item-container:hover .delete-btn {
  visibility: visible;
  opacity: 1;
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
}

.popup {
  background-color: #fff;
  padding: 30px; /* 팝업 패딩을 조금 더 여유롭게 */
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 450px; /* 1.5배 키움 */
  z-index: 1001; /* 팝업창을 오버레이보다 위에 배치 */
}

.popup h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.5em; /* 글씨 크기를 더 크게 */
}

.popup p {
  margin-bottom: 20px;
  font-size: 1.2em; /* 글씨 크기를 더 크게 */
}

.popup input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px; /* 입력 칸과 버튼 사이 간격 추가 */
  font-size: 1.2em; /* 입력 칸의 글씨 크기를 더 크게 */
  border: 1px solid #ccc;
  border-radius: 5px;
}

.popup-buttons {
  display: flex;
  justify-content: space-between;
}

.popup-buttons button {
  background-color: #ffc107; /* 확인 버튼 색상 변경 */
  color: #fff;
  border: none;
  padding: 10px 30px; /* 버튼 크기를 더 크게 */
  border-radius: 5px;
  font-size: 1.2em; /* 버튼 글씨 크기를 더 크게 */
  cursor: pointer;
  transition: background-color 0.3s;
}

.popup-buttons button:hover {
  background-color: #e0a800;
}

.popup-buttons button:last-child {
  background-color: #b0bec5;
}

.popup-buttons button:last-child:hover {
  background-color: #90a4ae;
}

.club-profile {
  max-width: 630px;
  margin: auto;
  padding: 20px;
}

.ClubInfo {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.club-details .clubname {
  font-size: 24px; /* 폰트 크기 */
  font-weight: 600; /* 폰트 두께 */
  margin: 0;
  color: #333; /* 텍스트 색상 */
}

.logo {
  width: 104px;
  height: 112px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
  margin-left: 60px; /* Add spacing between the logo and the text */
}

.Info {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Ensure proper text alignment */
  gap: 10px; /* Space between the club name and leader name */
  margin-left: 35px;
}

.hashtags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hashtag {
  background-color: #f1f1f1;
  color: #555;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 15px;
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

/* Contact Info Popup */
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

/* Styles for Tabs */
.tabs-container {
  margin-top: 20px;
}

.tabs-and-content {
  /* background: #fff; */
}

.tabs {
  display: flex;
  justify-content: flex-start;
  width: 330px; /* 탭 너비 고정 */
  height: 44px; 
  
}

.tabs button {
  flex: 1;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  background-color: #EEEEEE;
  color: #C3C3C3;
  border-radius: 3px;
}

.tabs button.active {
  background-color: #FFB052;
  color: #FFFFFF;
  
}

.tab-content {
  padding: 25px;
  background-color: #fff;
  border-radius: 0 0 8px 8px;
  width: 640px; /* 원하는 넓이 */
  height: 510px; /* 원하는 높이 */
  margin: 0 auto; /* 가운데 정렬 */
  overflow-y: auto;
}

.description {

  font-size: 14px;
  color: #333;
  line-height: 1.5;
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
}

.club-profile {
  max-width: 630px;
  margin: auto;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 그림자 효과 */
  overflow-y: auto;
  max-height: 90%; /* 화면 높이에 맞게 제한 */
  z-index: 1001;
}

</style>