<template>
    <div class="ClubInfo">
        <img src="@/assets/flag_logo.jpeg" alt="Flag Logo" class="logo" />
        <div class="Info">
            <div class="info">
                <p class="clubname">{{clubName}}</p>
                <div class="line1"></div>
                <p class="clubleader">동아리장</p>
                <p class="name">{{leader}}</p>
            </div>
            <div class="phoneNum">
                <div class="icon phone"></div>
                <p>010-1234-5678</p>
            </div>
            <div class="instaName">

                <div class="icon insta"></div>
                <p>{{instagram}}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'ClubInfo',
  data() {
    return {
      clubName: 'FLAG',
      leader: '홍길동',
      phoneNumber: '010-1234-5678',
      instagram: '@INSTAGRAM'
    };
  },

};

</script>

<style scoped>

.ClubInfo{
    width: 886px;
    height: 276px;
    display: flex;
    background: #fff;
    margin-bottom: 30px;
    border-radius: 8px;
}

.logo{
    width: 302px;
    object-fit: fill;
    border-radius: 8px;
}

.Info{
    display: flex;
    flex-direction: column;
    justify-content: center;
    vertical-align: middle;
    margin-left: 30px;
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
</style>