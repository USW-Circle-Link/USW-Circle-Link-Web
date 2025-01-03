<template>
  <div class="club-profile">
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
</template>

<script>
import ImageSlider from "@/components/ClubLeader/ImageSlider.vue";
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
        tags: ["개발", "프로그래밍", "협업", "학습"], // Example hashtags for direct testing
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
    instagramLink() {
    // 사용자가 입력한 값을 그대로 반환하여 일반 링크로 사용
    return this.data.clubInsta || "#";
  },
  },
  mounted() {
    this.pageLoadFunction();
  },
  methods: {
    async pageLoadFunction() {
      const accessToken = store.state.accessToken;
      const clubId = store.state.clubId;

      try {
        const response = await axios.get(
          `http://15.164.246.244:8080/club-leader/${clubId}/intro`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        this.data = response?.data?.data || {};

        if (this.data.mainPhoto) {
          this.mainPhoto = this.data.mainPhoto;
        }

        const introPhotosPromises = this.data.introPhotos.map(async (url) => {
          try {
            const response = await axios.get(url, { responseType: "blob" });
            if (response.status === 200) {
              return URL.createObjectURL(response.data);
            }
          } catch (error) {
            console.error("Image fetch error:", error);
            return null;
          }
        });

        const introPhotosResults = await Promise.allSettled(
          introPhotosPromises
        );

        this.images = introPhotosResults
          .filter((result) => result.status === "fulfilled" && result.value)
          .map((result) => result.value);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    },
    convertNewlinesToBr(text) {
      return text ? text.replace(/\n/g, "<br>") : "";
    },
    toggleContactInfo() {
      this.showContactInfo = !this.showContactInfo;
    },
  },
};
</script>

<style scoped>
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
</style>
