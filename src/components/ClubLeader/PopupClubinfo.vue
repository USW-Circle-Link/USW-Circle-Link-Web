<template>
  <div class="club-profile">
    <div class="content-container">
      <div class="header-section">
        <!-- 창닫기 -->
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
            <!-- 동아리 이름 -->
            <p class="clubname"><strong>{{ data.clubName }}</strong></p>
            <!-- 동아리 회장 이름 -->
            <p class="clubleader"><span class="leader-label">동아리 회장</span> <span class="leader-name">{{ displayLeaderName }}</span></p>
            <!-- 카테고리 -->
            <div class="clubroom">
              <div class="icon category"></div>
              <p class="room">카테고리 | {{formattedCategory}} </p>
            </div>
            <!-- 해시태그 -->
            <div class="hashtags">
              <span v-for="tag in data.clubHashtag" :key="tag" class="hashtag">#{{ tag }}</span>
            </div>
          </div>
        </div>
        <!-- 동아리 정보 -->
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
              <span class="phone-number">{{ formattedPhoneNumber }}</span>
            </div>
            <hr />
            <div class="instaName">
              <div class="icon insta"></div>
              <a v-if="instagramLink.length" :href="instagramLink" target="_blank">인스타그램</a>
              <span v-else>정보 없음</span>
            </div>
            <hr />
            <div class="instaName">
              <div class="icon vector"></div>
              <a v-if="formLink.length" :href="formLink" target="_blank">지원서 링크</a>
              <span v-else>정보 없음</span>
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
        clubHashtag: [], // 해시태그 기본값 추가
        tags: [], // 필요 없는 경우 제거 가능
        leaderName: '', // 동아리장 이름 기본값 추가
        leaderHp: '', // 전화번호 기본값 추가
      },
      mainPhoto: defaultProfileImage,
      activeTab: "intro",
      showContactInfo: false,
    };
  },
  computed: {
    // 동아리장 이름 표시 computed 속성 추가
    displayLeaderName() {
      return this.data.leaderName ? this.data.leaderName : "정보 없음";
    },
    // 전화번호 표시 computed 속성 수정
    formattedPhoneNumber() {
      if (!this.data.leaderHp) {
        return "정보 없음";
      }
      return this.data.leaderHp.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    },
    formattedCategory() {
      if (!this.data.clubCategories || this.data.clubCategories.length === 0) {
        return "카테고리 없음";
      }
      return this.data.clubCategories.join(', ');  // 쉼표 뒤에 공백 추가
    },
    instagramLink() {
      // Instagram 링크가 http로 시작하지 않으면 추가
      const instaUrl = this.data.clubInsta || '';
      if (instaUrl === '') return '';
      return instaUrl.startsWith('http') ? instaUrl : `https://${instaUrl}`;
    },
    formLink() {
      // Google Form 링크가 http로 시작하지 않으면 추가
      const formUrl = this.data.googleFormUrl || '';
      if (formUrl === '') return '';
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
    this.pageLoadFunction();
    console.log("API 응답 데이터!!:", this.data);
    console.log("해시태그 데이터:", this.data.clubHashtag);
    console.log("해시태그 데이터:", this.data.clubRoomNumber);
    console.log("해시태그 데이터:", this.data.clubRecruitment);
    console.log("해시태그 데이터:", this.data.clubCategories);
  },
  methods: {
    // 이미지 슬라이드
    async pageLoadFunction() {
      const accessToken = store.state.accessToken;
      const clubUUID = store.state.clubUUID;

      try {
        const response = await axios.get(
            `${store.state.apiBaseUrl}/club-leader/${clubUUID}/summary`,
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
        this.data = response?.data?.data || {};

        if (this.data.mainPhoto) {
          this.mainPhoto = this.data.mainPhoto;
        }

        const introPhotosPromises = this.data.introPhotos.map(async (url) => {
          try {
            const response = await axios.get(url, { responseType: "blob" });
            // 정상적으로 응답
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
    closeProfile() {
      window.close();
    }
  },
};
</script>
<style scoped>
/* ===== 전체 레이아웃 ===== */
.club-profile {
  width: 100%;
  min-height: 100vh;
  background: var(--background-light);
  display: flex;
  justify-content: center;
  align-items: flex-start; /* [수정] 위쪽 정렬로 변경 */
  padding: clamp(16px, 5vw, 32px); /* [반응형] 패딩 */
  box-sizing: border-box;
  padding-top: 100px;
  --brand-color: #FFB052;
  --text-primary: #333;
  --text-secondary: #555;
  --text-tertiary: #767676;
  --border-color: #C3C3C3;
  --background-light: #F0F2F5;
  --background-white: #fff;
  --tab-inactive-bg: #EEEEEE;
  --tab-inactive-text: #C3C3C3;
}

.content-container {
  width: 100%; /* [반응형] 너비를 100%로 */
  max-width: 665px; /* [반응형] 최대 너비 설정 */
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
}

/* ===== 상단 이미지 슬라이더 ===== */
.header-section {
  width: 100%;
  position: relative;
}

.slider-wrapper {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.close-button {
  position: absolute;
  top: -10px; /* 위치 조정 */
  right: 16px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.close-button svg {
  width: 16px;
  height: 16px;
}

/* ===== 동아리 정보 섹션 ===== */
.ClubInfo {
  width: 100%;
  background-color: var(--background-white);
  border-radius: 8px;
  padding: clamp(16px, 3vw, 24px); /* [반응형] 패딩 */
  display: flex;
  align-items: center;
  gap: clamp(16px, 3vw, 30px); /* [반응형] 간격 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  box-sizing: border-box;
}

.logo {
  width: clamp(90px, 15vw, 110px); /* [반응형] 로고 크기 */
  height: clamp(100px, 17vw, 120px);
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.Info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.club-details .clubname {
  font-size: clamp(1.25rem, 4vw, 1.5rem); /* [반응형] 폰트 */
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.club-details .clubleader {
  margin: 0 0 8px 0;
  font-size: clamp(0.875rem, 2.5vw, 1rem); /* [반응형] 폰트 */
}

.leader-label {
  color: var(--text-tertiary);
}

.leader-name {
  font-weight: 500;
  color: var(--text-primary);
}

.clubroom {
  display: flex;
  align-items: center;
  gap: 8px;
}
.clubroom p {
  font-size: clamp(0.8125rem, 2.2vw, 0.875rem); /* [반응형] 폰트 */
  color: var(--text-tertiary);
  margin: 0;
}

.hashtags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.hashtag {
  padding: 6px 12px;
  font-size: clamp(0.75rem, 2vw, 0.875rem); /* [반응형] 폰트 */
  color: var(--text-secondary);
  background-color: var(--background-white);
  border: 1px solid #ddd;
  border-radius: 12px;
}

/* 더보기(...) 버튼 및 팝업 */
.more-options {
  position: absolute;
  top: clamp(16px, 3vw, 20px);
  right: clamp(16px, 3vw, 20px);
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

/* ===== 탭 메뉴 및 컨텐츠 ===== */
.tabs-container {
  width: 100%;
}

.tabs-wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid var(--border-color);
}

.tabs {
  display: flex;
  flex-grow: 1; /* [개선] 남는 공간 차지 */
}

.tabs button {
  flex: 1; /* [개선] 탭 버튼이 공간을 균등하게 차지 */
  padding: 14px 10px;
  text-align: center;
  background-color: var(--tab-inactive-bg);
  color: var(--tab-inactive-text);
  border: 1px solid var(--border-color);
  border-bottom: none;
  cursor: pointer;
  font-size: clamp(0.875rem, 2.5vw, 1rem); /* [반응형] 폰트 */
  font-weight: 500;
  white-space: nowrap; /* 줄바꿈 방지 */
}
.tabs button:first-child { border-top-left-radius: 8px; }
.tabs button:last-child { border-top-right-radius: 8px; }
.tabs button.single-tab { border-top-right-radius: 8px; }

.tabs button.active {
  background-color: var(--brand-color);
  color: var(--background-white);
  border-color: var(--brand-color);
}

.recruitment-status {
  display: flex;
  align-items: block;
  gap: 6px;
  padding: 0 16px;
  background: var(--tab-inactive-bg);
  height: 100%;
  border-top: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
  border-top-right-radius: 8px;
}

.tab-content {
  width: 100%;
  padding: 24px;
  background-color: var(--background-white);
  border: 1px solid var(--border-color);
  border-top: none;
  border-radius: 0 0 8px 8px;
  box-sizing: border-box;
  min-height: 200px;
}

/* ===== 아이콘 스타일 ===== */
.icon {
  width: 16px;
  height: 16px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.icon.category { background-image: url('@/assets/category-dash.svg'); }
.icon.location { background-image: url('@/assets/location.svg'); }
.icon.phone { background-image: url('@/assets/phone.svg'); }
.icon.insta { background-image: url('@/assets/insta.svg'); }
.icon.vector { background-image: url('@/assets/link.svg'); }


/* ===== [반응형] 모바일 화면 최적화 ===== */
@media (max-width: 768px) {
  .close-button {
    margin-top: -30px;
    margin-right: 0px;
  }
  .club-profile {
    padding: 0; /* 모바일에서는 패딩 제거 */
    padding-top: 200px;
    align-items: flex-start;
  }
  .content-container {
    gap: 0; /* 섹션 사이 간격 제거 */
  }

  /* 동아리 정보 섹션 세로 정렬 */
  .ClubInfo {
    flex-direction: column;
    align-items: flex-start; /* 왼쪽 정렬 */
    border-radius: 0;
    box-shadow: none;
  }
  .logo {
    align-self: center; /* 로고만 중앙 정렬 */
  }

  /* 슬라이더/탭 컨텐츠 radius 조정 */
  .slider-wrapper, .tab-content {
    border-radius: 0;
    border-left: none;
    border-right: none;
  }

  /* 탭 헤더 조정 */
  .tabs-wrapper {
    flex-direction: column;
    align-items: stretch;
  }
  .tabs {
    width: 100%;
  }
  .recruitment-status {
    border-radius: 0;
    padding: 8px 16px;
    justify-content: right;
    border-top: none;
    border-left: none;
  }
}
</style>