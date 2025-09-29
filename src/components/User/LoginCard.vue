<template>
  <div class="content-container">
    <div class="top">
      <img src="../../assets/dongurami_logo.png" class="dongurami_logo" alt="Logo" />
      <p>수원대 동아리 다 모임</p>
    </div>
    <div class="middle">
      <div class="login_button">
        <p class="dongurami">동구라미</p>
        <p class="login">로그인</p>
      </div>
    </div>
    <div class="bottom">
      <a>비밀번호 찾기</a>
      <div class="line"></div>
      <a>아이디 찾기</a>
      <div class="line"></div>
      <a>회원가입</a>
    </div>
  </div>
</template>
<script setup>
</script>

<style scoped>
@font-face {
  font-family: 'yg-jalnan';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.2/JalnanOTF00.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'Pretendard-Regular';
  src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
}

.content-container{
  width: 220px;
  min-width: 390px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 4px;
  background: #FDFDFD;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
}

.top{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 5px
}

.top p {
  color: #8F8F8F;
  font-family: 'Pretendard-Regular', Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  letter-spacing: -0.25px;
}


.dongurami_logo{
  width: 20px;
  height: 17px;
  flex-shrink: 0;
  margin-bottom: 6px;
  margin-right: 5px;
}

.middle{
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.login_button{
  display: flex;
  width: 200px;
  height: 40px;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 4px;
  flex-direction: row;
  border-radius: 4px;
  background: #FFC700;
}

.dongurami{
  color: #FFF;
  font-family: 'yg-jalnan', Jalnan ;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: -0.329px;
}

.login{
  color: #FFF;
  font-family: 'Pretendard-Regular', Pretendard;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.bottom{
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  text-align: center;
  margin-left: 10px;
  margin-right: 10px;
}

.bottom a{
  width: 73.3333px;
  color: #868686;
  font-family: 'Pretendard-Regular', Pretendard;
  font-size: 7px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: -0.21px;
}

.bottom a:hover {
  text-decoration: underline;
}

.line {
  width: 1px;
  height: 7px;
  background-color: #bbbbbb;
  margin: 0px 15px 1px 15px;
}
</style>