<template>
  <div class="club-profile">
    <div class="centered-container">
      <div class="image-slider-container">
        <button class="close1-btn" @click="closeWindow">
          <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none">
            <path d="M19.1491 18.3524C19.2044 18.4039 19.2487 18.466 19.2794 18.535C19.3102 18.604 19.3267 18.6785 19.328 18.754C19.3294 18.8295 19.3155 18.9045 19.2872 18.9746C19.2589 19.0446 19.2168 19.1082 19.1634 19.1617C19.11 19.2151 19.0463 19.2572 18.9763 19.2855C18.9063 19.3138 18.8312 19.3277 18.7557 19.3263C18.6802 19.325 18.6057 19.3085 18.5367 19.2777C18.4677 19.247 18.4056 19.2027 18.3541 19.1474L12.0016 12.7958L5.64909 19.1474C5.54246 19.2467 5.40143 19.3008 5.2557 19.2983C5.10998 19.2957 4.97094 19.2367 4.86788 19.1336C4.76482 19.0305 4.70578 18.8915 4.70321 18.7458C4.70064 18.6001 4.75473 18.459 4.85409 18.3524L11.2057 11.9999L4.85409 5.64739C4.75473 5.54075 4.70064 5.39972 4.70321 5.25399C4.70578 5.10827 4.76482 4.96923 4.86788 4.86617C4.97094 4.76311 5.10998 4.70407 5.2557 4.7015C5.40143 4.69893 5.54246 4.75302 5.64909 4.85238L12.0016 11.2039L18.3541 4.85238C18.4607 4.75302 18.6018 4.69893 18.7475 4.7015C18.8932 4.70407 19.0323 4.76311 19.1353 4.86617C19.2384 4.96923 19.2974 5.10827 19.3 5.25399C19.3025 5.39972 19.2485 5.54075 19.1491 5.64739L12.7975 11.9999L19.1491 18.3524Z" fill="black"/>
          </svg>
        </button>
        <ImageSlider :images="images" />
      </div>

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
        <div class="more-options">
          <button @click="toggleContactInfo" class="dots-button">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div v-if="showContactInfo" class="contact-info-popup">
            <div class="popup-header">
              <p><strong>동아리 정보</strong></p>
              <button class="close-btn" @click="toggleContactInfo">✖</button>
            </div>
            <hr />
            <div class="location">
              <div class="icon location"></div>
              <span>동아리방| {{ data.clubRoom }}</span>
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

export default {
  name: "ClubPopupWindow",
  components: {
    ImageSlider,
  },
  data() {
    return {
      images: [],
      data: {},
      mainPhoto: require("@/assets/profile.png"),
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
      return this.data.clubInsta ? `https://instagram.com/${this.data.clubInsta}` : "#";
    },
  },
  async created() {
    // URL에서 clubId만 가져오기
    const params = new URLSearchParams(window.location.search);
    const clubId = params.get('clubId');

    if (clubId) {
      await this.fetchClubData(clubId);
    }
  },
  methods: {
    async fetchClubData(clubId) {
      try {
        // store에서 토큰 가져오기
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`http://15.164.246.244:8080/adminmain/clubs/${clubId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
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
    toggleContactInfo() {
      this.showContactInfo = !this.showContactInfo;
    },
    convertNewlinesToBr(text) {
      return text ? text.replace(/\n/g, "<br>") : "";
    },
    closeWindow() {
      window.close();
    }
  },
};
</script>

<style scoped>
.club-profile {
  width: 720px;
  height: 1074px;
  margin: 0;
  padding: 32px;
  background: #F0F2F5;
  position: relative;
  box-sizing: border-box;
  align-items: center;
  min-width: 720px;
}

.image-slider-container {
  position: relative;
  width: 100%;
}

.close1-btn {
  position: absolute;
  top: -47px;
  right: 22px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1000;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ClubInfo {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 597px; /* 고정된 너비 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  margin: 24px auto 0;
  flex-shrink: 0; /* 크기 고정 */
  margin-top: 10px;
}

.club-details .clubname {
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
  flex-grow: 1;
}

.hashtags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
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
  padding: 8px;
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
  padding: 16px;
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
  margin: 12px 0;
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
  padding: 4px 0;
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
  padding: 4px;
}

.tabs-container {
  width: 635px;
  margin: 4px auto 0;
  display: flex;
  flex-direction: column;
  margin-top: 30px;
}

.tabs {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  margin: 0;
  align-items: flex-start;
}

.tabs button {
  width: 174px;
  padding: 10px 0;
  text-align: center;
  background-color: #EEEEEE;
  color: #C3C3C3;
  border: 1px solid #C3C3C3;
  border-radius: 0 8px 0 0;
  cursor: pointer;
  align-items: flex-start;
  margin-bottom: -0.6px;
}

.tabs button.active {
  background-color: #FFB052;
  color: #FFFFFF;
  border: 1px solid #C3C3C3;
  border-bottom: none;
}

.tabs button:first-child {
  border-radius: 0 0 0 0;
}

.tab-content {
  width: 635px;
  margin: 0 auto;
  padding: 25px;
  background-color: #fff;
  border: 1px solid #C3C3C3;
  border-radius: 0 0 8px 8px;
  box-sizing: border-box;
  overflow-y: auto;
  max-height: 500px;
}

.tabs button:first-child {
  border-radius: 8px 0 0 0; /* Top-left corner rounded */
}

.description {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.location {
  color: #9A9A9A;
}

@media screen and (min-width: 720px) {
  .club-profile {
    width: 100%; /* 창 크기에 맞춰 늘어남 */
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>