<template>
  <div class="club-profile">
    <div class="content-container">
      <div class="header-section">

        <button @click="closeProfile" class="close-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19.1491 18.3524C19.2044 18.4039 19.2487 18.466 19.2794 18.535C19.3102 18.604 19.3267 18.6785 19.328 18.754C19.3294 18.8295 19.3155 18.9045 19.2872 18.9746C19.2589 19.0446 19.2168 19.1082 19.1634 19.1617C19.11 19.2151 19.0463 19.2572 18.9763 19.2855C18.9063 19.3138 18.8312 19.3277 18.7557 19.3263C18.6802 19.325 18.6057 19.3085 18.5367 19.2777C18.4677 19.247 18.4056 19.2027 18.3541 19.1474L12.0016 12.7958L5.64909 19.1474C5.54246 19.2467 5.40143 19.3008 5.2557 19.2983C5.10998 19.2957 4.97094 19.2367 4.86788 19.1336C4.76482 19.0305 4.70578 18.8915 4.70321 18.7458C4.70064 18.6001 4.75473 18.459 4.85409 18.3524L11.2057 11.9999L4.85409 5.64739C4.75473 5.54075 4.70064 5.39972 4.70321 5.25399C4.70578 5.10827 4.76482 4.96923 4.86788 4.86617C4.97094 4.76311 5.10998 4.70407 5.2557 4.7015C5.40143 4.69893 5.54246 4.75302 5.64909 4.85238L12.0016 11.2039L18.3541 4.85238C18.4607 4.75302 18.6018 4.69893 18.7475 4.7015C18.8932 4.70407 19.0323 4.76311 19.1353 4.86617C19.2384 4.96923 19.2974 5.10827 19.3 5.25399C19.3025 5.39972 19.2485 5.54075 19.1491 5.64739L12.7975 11.9999L19.1491 18.3524Z" fill="black"/>
          </svg>
        </button>

        <!-- Image Slider Section -->
        <div class="slider-wrapper">
          <ImageSlider :images="images" class="rounded-slider" oncontextmenu="return false;" />
        </div>
      </div>
      <!-- Club Information Section -->
      <div class="ClubInfo">
        <img :src="mainPhoto" alt="Flag Logo" class="logo with-border" oncontextmenu="return false;" />
        <div class="Info">
          <div class="club-details">
            <p class="clubname"><strong>{{ data.clubName }}</strong></p>
            <p class="clubleader">동아리장 <span class="name" style="color: #353549;"><strong>{{ data.leaderName }}</strong></span></p>
            <div class="clubroom">
              <div class="icon category"></div>
              <p class="room">카테고리 | {{formattedCategory}} </p>
            </div>
            <div class="hashtags">
              <span v-for="tag in data.clubHashtag" :key="tag" class="hashtag">#{{ tag }}</span>
            </div>
          </div>
        </div>

        <div class="more-options">
          <button @click="toggleContactInfo" class="dots-button">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div v-if="showContactInfo" class="contact-info-popup">
            <div class="popup-header">
              <p><strong>동아리 정보</strong></p>
              <button class="popup-close-btn" @click="toggleContactInfo">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M19.1491 18.3524C19.2044 18.4039 19.2487 18.466 19.2794 18.535C19.3102 18.604 19.3267 18.6785 19.328 18.754C19.3294 18.8295 19.3155 18.9045 19.2872 18.9746C19.2589 19.0446 19.2168 19.1082 19.1634 19.1617C19.11 19.2151 19.0463 19.2572 18.9763 19.2855C18.9063 19.3138 18.8312 19.3277 18.7557 19.3263C18.6802 19.325 18.6057 19.3085 18.5367 19.2777C18.4677 19.247 18.4056 19.2027 18.3541 19.1474L12.0016 12.7958L5.64909 19.1474C5.54246 19.2467 5.40143 19.3008 5.2557 19.2983C5.10998 19.2957 4.97094 19.2367 4.86788 19.1336C4.76482 19.0305 4.70578 18.8915 4.70321 18.7458C4.70064 18.6001 4.75473 18.459 4.85409 18.3524L11.2057 11.9999L4.85409 5.64739C4.75473 5.54075 4.70064 5.39972 4.70321 5.25399C4.70578 5.10827 4.76482 4.96923 4.86788 4.86617C4.97094 4.76311 5.10998 4.70407 5.2557 4.7015C5.40143 4.69893 5.54246 4.75302 5.64909 4.85238L12.0016 11.2039L18.3541 4.85238C18.4607 4.75302 18.6018 4.69893 18.7475 4.7015C18.8932 4.70407 19.0323 4.76311 19.1353 4.86617C19.2384 4.96923 19.2974 5.10827 19.3 5.25399C19.3025 5.39972 19.2485 5.54075 19.1491 5.64739L12.7975 11.9999L19.1491 18.3524Z" fill="black"/>
                </svg>
              </button>
            </div>
            <hr />
            <div class="location">
              <div class="icon location"></div>
              <span>동아리방 | 학생회관 {{ data.clubRoomNumber }}호</span>
            </div>
            <hr />
            <div class="phoneNum">
              <div class="icon phone"></div>
              <span>{{ formattedPhoneNumber }}</span>
            </div>
            <hr />
            <div class="instaName">
              <div class="icon insta"></div>
              <a :href="instagramLink" target="_blank">인스타그램</a>
            </div>
            <hr />
            <div class="instaName">
              <div class="icon vector"></div>
              <a :href="formLink" target="_blank">지원서 링크</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs Section -->
      <div class="tabs-container">
        <div class="tabs-wrapper">
          <div class="tabs">
            <button
                :class="{
            active: activeTab === 'intro',
            'single-tab': data.recruitmentStatus !== 'OPEN'
          }"
                @click="activeTab = 'intro'"
            >동아리 소개 글</button>

            <button
                v-if="data.recruitmentStatus === 'OPEN'"
                :class="{ active: activeTab === 'clubRecruitment' }"
                @click="activeTab = 'clubRecruitment'"
            >동아리 모집 글</button>
          </div>

          <!-- 모집 상태 표시 -->
          <div class="recruitment-status">
            <img :src="recruitmentIcon" alt="recruitment status" class="status-icon" />
            <span class="status-text">{{ recruitmentText }}</span>
          </div>
        </div>

        <div class="tab-content">
          <div v-if="activeTab === 'intro'" class="description">
            <p v-html="convertNewlinesToBr(data.clubIntro)"></p>
          </div>
          <div v-if="activeTab === 'clubRecruitment'" class="description">
            <p v-html="convertNewlinesToBr(data.clubRecruitment)"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImageSlider from "@/components/Admin/ImageSlider_Admin.vue";
import axios from "axios";
import store from "@/store/store";
import defaultProfileImage from "@/assets/profile.png";

export default {
  name: "ClubProfile",
  components: {
    ImageSlider,
  },
  data() {
    return {
      images: [],
      data: {
        clubHashtag: [], // 해시태그 기본값 추가
        tags: [], // 필요 없는 경우 제거 가능
      },
      mainPhoto: defaultProfileImage,
      activeTab: "intro",
      showContactInfo: false,
    };
  },
  computed: {
    formattedPhoneNumber() {
      return this.data.leaderHp
        ? this.data.leaderHp.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")
        : "";
    },
    formattedCategory() {
      if (!this.data.clubCategories || this.data.clubCategories.length === 0) {
        return "카테고리 없음";
      }
      return this.data.clubCategories.join(', ');  // 쉼표 뒤에 공백 추가
    },
    instagramLink() {
      return this.data.clubInsta || "#";
    },
    formLink() {
      // Google Form 링크가 http로 시작하지 않으면 추가
      const formUrl = this.data.googleFormUrl || '#';
      return formUrl.startsWith('http') ? formUrl : `https://${formUrl}`;
    },
    recruitmentIcon() {
      return this.data.recruitmentStatus === "OPEN"
          ? require("@/assets/green.svg") // 모집 중
          : require("@/assets/red.svg"); // 모집 마감
    },
    recruitmentText() {
      return this.data.recruitmentStatus === "OPEN" ? "모집 중" : "모집 마감";
    }
  },
  mounted() {
    console.log("API 응답 데이터:", this.data);
    console.log("해시태그 데이터:", this.data.clubHashtag);

    const urlParams = new URLSearchParams(window.location.search);
    const clubUUID = urlParams.get("clubId");

    if (!clubUUID) {
      console.error("URL에서 clubUUID를 가져오지 못했습니다.");
      return;
    }

    store.commit("SET_CLUB_ID", clubUUID); // 상태 업데이트
    this.pageLoadFunction(clubUUID);
  },
  methods: {
    async pageLoadFunction(clubUUID) {
      const accessToken = store.state.accessToken;

      try {
        const response = await axios.get(
          `http://15.164.246.244:8080/admin/clubs/${clubUUID}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          console.log("API 응답 데이터:", response.data);
          this.data = response?.data?.data || {};
        } else {
          console.error(`API 오류: ${response.status} - ${response.statusText}`);
        }

        if (this.data.mainPhoto) {
          this.mainPhoto = this.data.mainPhoto;
        }

        const introPhotosPromises = (this.data.introPhotos || []).map(async (url) => {
          try {
            const response = await axios.get(url, { responseType: "blob" });
            if (response.status === 200) {
              return URL.createObjectURL(response.data);
            }
          } catch (error) {
            console.error("Image fetch error:", url, error);
            return null;
          }
        });

        const introPhotosResults = await Promise.allSettled(introPhotosPromises);
        this.images = introPhotosResults
          .filter((result) => result.status === "fulfilled" && result.value)
          .map((result) => result.value);
      } catch (error) {
        console.error("API 호출 오류:", error.response || error.message);
        alert("데이터를 불러오는 데 실패했습니다. 다시 시도하세요.");
      }
    },
    convertNewlinesToBr(text) {
      return text ? text.replace(/\n/g, "<br>") : "";
    },
    toggleContactInfo() {
      this.showContactInfo = !this.showContactInfo;
    },
    closeProfile() {
      window.close();
    }
  },
};
</script>


<style scoped>
.club-profile {
  width: 100%;
  min-height: 100vh;
  background: #F0F2F5;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px;
  box-sizing: border-box;
}

.content-container {
  width: 665px; /* 모든 섹션의 너비를 665px로 통일 */
  display: flex;
  flex-direction: column;
  gap: 24px; /* 모든 섹션 사이의 간격을 일관되게 설정 */
  align-items: center;
}

.slider-wrapper {
  width: 100%;
  overflow: hidden;
}

.rounded-slider {
  border-radius: 8px;
  overflow: hidden;
}

.ClubInfo {
  width: 626px;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.ClubInfo .logo {
  margin-left: 20px; /* Adjust the value as needed */
}

.club-details .clubname {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.logo {
  width: 110px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 35px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.Info {
  flex-grow: 1;
  margin-top: -5px;
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

.icon.vector{
  background: url('@/assets/link.svg') no-repeat center center;
}

.contact-info-popup .close-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
}


/* 🔹 모집 상태 스타일 추가 */
.recruitment-status {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-right: 20px;
}

.status-icon {
  width: 16px;
  height: 16px;
}

.status-text {
  font-size: 14px;
  font-weight: 600;
  color: #767676;
}

.tabs-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.tabs-wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}
.tabs-header {
  width: 100%;
  position: relative;
}


/* 탭 */

.tabs {
  display: flex;
  gap: 0;
}

/* 탭 버튼 */
.tabs button {
  width: 174px;
  height: 45px;
  padding: 10px 0;
  text-align: center;
  background-color: #EEEEEE;
  color: #C3C3C3;
  border: 1px solid #C3C3C3;
  border-bottom: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 18px;
  font-weight: 500;
}

/* 왼쪽 탭 버튼 스타일 */
.tabs button:first-child {
  border-top-left-radius: 8px;
}

/* 두 번째 탭 버튼 스타일 */
.tabs button:nth-child(2) {
  border-top-right-radius: 8px;
  border-left: none;
}

.status-icon {
  width: 10px;
  height: 10px;
}

.status-icon.open {
  background-color: #4CAF50; /* 초록색 (모집 중) */
}

.status-icon.closed {
  background-color: #D9534F; /* 빨간색 (모집 마감) */
}

.status-text {
  font-size: 14px;
  font-weight: 600;
  color: #767676;
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

/* 탭 내용 */
.tab-content {
  width: 100%;
  padding: 24px;
  background-color: #fff;
  border: 1px solid #C3C3C3;
  border-radius: 0 8px 8px 8px;
  box-sizing: border-box;
  min-height: 200px;
  max-height: 500px;
  overflow-y: auto;
}

.description {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.location {
  color: #9A9A9A; /* 텍스트 색상을 배경에 맞게 흰색으로 변경 */
}

.header-section {
  width: 665px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
}

.close-button {
  position: absolute;
  top: -30px;
  right: 0;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  transition: opacity 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.close-button:hover {
  opacity: 0.8;
}

.clubroom p {
  color: #767676;  /* 🔹 글씨 색상 변경 */
}


.popup-close-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease;
}

.category {
  width: 16px;
  margin-right: 7px;
  background: url('../../assets/category-dash.svg') no-repeat center center;
}

.club-details .clubname,
.club-details .clubleader,
.club-details .clubroom,
.club-details .hashtags {
  margin-bottom: -10px; /* Adjust the value as needed to reduce spacing */
}

.contact-info-popup a {
  color: #4A90E2;
  text-decoration: none;
  font-size: 14px;
}

.contact-info-popup a:hover {
  text-decoration: underline;
}

.tabs button.single-tab {
  border-top-right-radius: 8px;
}
</style>