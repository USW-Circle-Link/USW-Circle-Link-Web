<template>
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
  </div>
</template>


<script>
import ImageSlider from "@/components/ClubLeader/ImageSlider.vue";
import axios from 'axios';
import store from "@/store/store";

export default {
  name: 'ClubProfile',
  components: {
    ImageSlider
  },
  data() {
    return {
      images: [],  // 동아리 활동 사진을 담을 배열
      data: {},  // 동아리 기본 정보를 담을 객체
      mainPhoto:  require('@/assets/profile.png')  // 메인 사진 URL, 없을 경우 기본이미지
    };
  },
  computed: {
    formattedPhoneNumber() {
      return this.data.leaderHp ? this.data.leaderHp.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3') : '';
    }
  },
  mounted() {
    this.pageLoadFunction();
  },
  methods: {
    async pageLoadFunction() {
      console.log('Page has been loaded!');
      const accessToken = store.state.accessToken; // 저장된 accessToken 가져오기
      const clubId = store.state.clubId; // 저장된 clubId 가져오기

      try {
        const response = await axios.get(`http://15.164.246.244:8080/club-leader/${clubId}/intro`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`, // 헤더에 accessToken 추가
            'Content-Type': 'application/json'
          }
        });

        this.data = response.data.data;  // 동아리 기본 정보 설정

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
    convertNewlinesToBr(text) {
      return text ? text.replace(/\n/g, '') : '';
    }
  }
};
</script>








<style scoped>

.club-profile {
  max-width: 584px;
  height: 200px;
  margin: auto;
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

</style>
