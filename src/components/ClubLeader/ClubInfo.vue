<template>
  <div class="ClubInfo">
    <img :src="imageSrc" alt="Flag Logo" class="logo" v-if="imageSrc" oncontextmenu="return false;"/>
    <div class="Info">
      <div class="info">
        <p class="clubname">{{data.clubName}}</p>
        <div class="line1"></div>
        <p class="clubleader">동아리장</p>
        <p class="name">{{data.leaderName}}</p>
      </div>
      <div class="phoneNum">
        <div class="icon phone"></div>
        <p>{{formattedPhoneNumber}}</p>
      </div>
      <div class="instaName">
        <div class="icon insta"></div>
        <p>@{{data.clubInsta}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store/store";
import axios from "axios";

export default {
  name: 'ClubInfo',
  data() {
    return {
      data: {},
      imageSrc: '', // 이미지를 저장할 변수 추가
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
        const response = await axios.get(`http://15.164.246.244:8080/club-leader/${clubId}/info`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`, // 헤더에 accessToken 추가
            'Content-Type': 'application/json'
          }
        });

        this.data = response.data.data;

        // mainPhotoUrl로부터 이미지 로드
        if (this.data.mainPhotoUrl) {
          const imageResponse = await axios.get(this.data.mainPhotoUrl, {
            responseType: 'blob' // 이미지를 blob으로 받기 위해 responseType을 설정
          });

          // 이미지 URL을 생성하여 이미지 src에 할당
          this.imageSrc = URL.createObjectURL(imageResponse.data);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        this.error = error.message;
      }
    }
  }
};
</script>

<style scoped>
@media screen and (max-width:600px) {
  .ClubInfo {
    width: 590px;
  }
}

.ClubInfo {
  width: 886px;
  height: 276px;
  display: flex;
  background: #fff;
  margin-bottom: 30px;
  border-radius: 8px;
}

.logo {
  width: 302px;
  object-fit: fill;
  border-radius: 8px;
  margin-right: 30px; /* 이미지와 텍스트 사이 간격 추가 */
}

.Info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  vertical-align: middle;
}

.info {
  display: flex;
  align-items: center;
}

.clubname {
  color: #000;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px; /* 100% */
  letter-spacing: -0.6px;
  margin-right: 15px;
}

.clubleader {
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

.name {
  color: #353549;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: -0.4px;
}

.phone {
  width: 16px;
  margin-right: 7px;
  background: url('@/assets/phone.svg') no-repeat center center;
}

.insta {
  width: 16px;
  margin-right: 7px;
  background: url('@/assets/insta.svg') no-repeat center center;
}

.line1 {
  width: 1px;
  height: 12px;
  background: #DBDBDB;
  margin-bottom: 4px;
}

.phoneNum {
  display: flex;
  height: 30px;
}

.phoneNum p {
  font-size: 16px;
  text-align: center;
  line-height: 30px;
  margin: 0;
}

.instaName {
  display: flex;
  height: 30px;
}

.instaName p {
  font-size: 16px;
  text-align: center;
  line-height: 30px;
  margin: 0;
}
</style>
