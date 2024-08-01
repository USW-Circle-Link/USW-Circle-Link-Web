<template>
  <div class="club-profile">
    <ImageSlider :images="images" />
    <div class="ClubInfo">
      <img src="@/assets/Flag.svg" alt="Flag Logo" class="logo" />
      <div class="Info">
        <div class="info">
          <p class="clubname">FLAG</p>
          <div class="line1"></div>
          <p class="clubleader">동아리장</p>
          <p class="name">홍길동</p>
        </div>
        <div class="phoneNum">
          <div class="icon phone"></div>
          <p>010-1234-5678</p>
        </div>
        <div class="instaName">
          <div class="icon insta"></div>
          <p>@INSTAGRAM</p>
        </div>
      </div>
    </div>
    <div class="description">
      <h3>동아리 소개</h3>
      <div>
        <p>{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import ImageSlider from "@/components/ImageSlider.vue";

export default {
  name: 'ClubProfile',
  components: {
    ImageSlider
  },
  data() {
    return {
      images: [
        require('@/assets/flag_logo.jpeg'),
        require('@/assets/flag_logo.jpeg'),
        require('@/assets/flag_logo.jpeg'),
      ],
      description: '동아리 소개 ----'
    };
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
  width: 104px;
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
}

.description p{
  width: 460px;
  height: 247px;
  margin-left: 20px;
}

</style>
