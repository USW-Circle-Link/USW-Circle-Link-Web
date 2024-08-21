<template>
  <div class="sidebar">
    <div class="profile">
      <img :src="imageSrc" alt="Logo" class="profile-img" />
      <div class="profile-info">
        <div class="profile-name">
          <h2>{{data.clubName}}</h2>
        </div>
        <p>{{department}}</p>
      </div>
    </div>
    <nav>
      <ul>
        <li class="list1">
          <div class="top" @click="navigateTo('dashboard')">
            <i class="icon home"></i>
            <p class="menu">홈(회원관리)</p>
            <div class="yellowLine"></div>
          </div>
          <div class="bottom">
            <a @click.prevent="navigateTo('profileedit')">- 동아리 정보 수정</a>
          </div>
        </li>
        <li class="list2">
          <div class="top" @click="navigateTo('intro')">
            <i class="icon mail"></i>
            <p class="menu">동아리 소개&모집</p>
            <div class="yellowLine"></div>
          </div>
          <div class="bottom">
            <a @click="openNewWindow1">- 동아리소개/모집글</a>
            <a @click="navigateTo('intro')">- 소개/모집글작성</a>
            <a @click="navigateTo('passer-management')">- 지원자 합격 처리</a>
            <a @click="navigateTo('morepass')">- 지원자 추가 합격 처리</a>
          </div>
        </li>
        <li class="list3" @click="navigateTo('notice')">
          <div class="top">
            <i class="icon clipboard"></i>
            <p class="menu">공지사항</p>
            <div class="yellowLine"></div>
          </div>
        </li>
      </ul>
    </nav>
    <div class="empty"></div>
    <div class="line1"></div>
    <div class="footer">
      <a @click="openNewWindow2">이용약관</a>
      <div class="line2"></div>
      <a @click.prevent="logout">로그아웃</a>
    </div>
  </div>
</template>

<script>
import store from "@/store/store";
import axios from "axios";

export default {
  name: 'SidebarMenu',
  data(){
    return{
      imageSrc : '',
      data : '',
      department : ''
    }
  },
  mounted() {
    this.pageLoadFunction();
  },
  methods: {
    navigateTo(routeName) {
      this.$router.push({ name: routeName }).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          throw err;
        }
      });
    },
    openNewWindow1() {
      const url = 'http://localhost:8080/new-page'; // 열고자 하는 URL을 입력하세요.
      const windowName = '_blank'; // 새 창을 의미하는 특수 문자열
      const windowFeatures = 'width=600,height=800,resizable=no,scrollbars=no'; // 창의 크기와 같은 특성 정의
      window.open(url, windowName, windowFeatures);
    },
    openNewWindow2() {
      const url = 'http://localhost:8080/TermsOfUse'; // 열고자 하는 URL을 입력하세요.
      const windowName = '_blank'; // 새 창을 의미하는 특수 문자열
      const windowFeatures = 'width=600,height=800,resizable=no,scrollbars=no'; // 창의 크기와 같은 특성 정의
      window.open(url, windowName, windowFeatures);
    },
    // 로그아웃 메서드
    logout() {
      this.$store.dispatch('logout'); // Vuex 스토어에서 로그아웃 액션 호출
      this.$router.push({ name: 'login' }); // 로그인 페이지로 리다이렉트
    },
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
        if(this.data.department === 'ACADEMIC'){
          this.department = '학술'
        }
        if(this.data.department === 'RELIGION'){
          this.department = '종교'
        }
        if(this.data.department === 'ART'){
          this.department = '예술'
        }
        if(this.data.department === 'SPORT'){
          this.department = '체육'
        }
        if(this.data.department === 'SHOW'){
          this.department = '공연'
        }
        if(this.data.department === 'VOLUNTEER'){
          this.department = '봉사'
        }
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
@import url('https://webfontworld.github.io/goodchoice/Jalnan.css');

.sidebar {
  width: 240px;
  height: 700px;
  color: #000;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  border-radius: 16px;
}

.profile {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.profile-img {
  width: 79px;
  height: 79px;
  flex-shrink: 0;
  border-radius: 50%;
  margin: 10px 0px 10px 0px;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
}

.profile-name {
  display: flex;
}

.profile-info h2 {
  color: #000;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 16px;
  text-alin: center;
  margin: 20px 0px 15px 0px;
}

.profile-info p {
  color: #000;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  text-align: center;
  line-height: 6px;
  letter-spacing: -0.3px;
  margin: 0px 0px 12px 0px;
}

nav {
  height: 370px;
}

nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

nav li {
  display: flex;
  align-items: center;
  align-content: center;
  cursor: pointer;
  margin: 0px 0px 0px 0px;
  height: 55px;
}

.list1 {
  width: 240px;
  height: 55px;
  display: flex;
  flex-direction: column;
  transition-property: height;
  transition-duration: 0.2s;
}

.list1 a {
  visibility: hidden;
}

.list1:hover {
  height: 100px;
}

.list1:hover a {
  visibility: visible;
}

.list2 {
  width: 240px;
  height: 55px;
  display: flex;
  flex-direction: column;
  transition-property: height;
  transition-duration: 0.2s;
  position: relative;
  z-index: 1;
}

.list2 a {
  visibility: hidden;
}

.list2:hover {
  height: 170px;
}

.list2:hover a {
  visibility: visible;
}

.list3 {
  position: relative;
  z-index: 100;
}

.top {
  width: 240px;
  height: 55px;
  display: flex;
  align-content: center;
  align-items: center;
}

.bottom {
  width: 240px;
  height: 88px;
  display: flex;
  flex-direction: column;
  margin-top: 7px;
}

.bottom a{
  text-decoration: none;
  color: #000000;
}

router-link{
  text-decoration: none;
}

.bottom a{
  font-size: 12px;
  margin: 10px 0 0 60px;
}

.bottom a:hover {
  text-decoration: underline;
}

.menu {
  width: 173px;
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 500;
  line-height: 16px;
  text-align: left;
}

nav li:hover {
  background-color: #fff;
}

nav li:hover .yellowLine {
  background-color: #FFC700;
}

.first-item .yellowLine {
  background-color: #FFC700;
}

nav .list2:hover .top {
  box-shadow: 0px 2px 4px -2px rgba(0, 0, 0, 0.25);
}

nav .list1:hover .top {
  box-shadow: 0px 2px 4px -2px rgba(0, 0, 0, 0.25);
}

nav li .yellowLine {
  width: 7px;
  height: 55px;
}

nav .icon {
  width: 20px;
  height: 20px;
  margin: 0px 15px 3.5px 30px;
}

.home {
  background: url('@/assets/home.svg') no-repeat center center;
}

.mail {
  background: url('@/assets/mail.svg') no-repeat center center;
}

.clipboard {
  background: url('@/assets/clipboard.svg') no-repeat center center;
}

.empty {
  height: 10px;
}

.line1 {
  width: 100%;
  height: 1px;
  background-color: #999999;
}

.footer {
  display: flex;
  justify-content: center;
  font-size: 12px;
  align-items: center;
}

.footer a {
  color: #999999;
  text-decoration: none;
}

.line2 {
  width: 1px;
  height: 13px;
  background-color: #bbbbbb;
  margin: 0px 20px 0px 20px;
}

.footer a:hover {
  text-decoration: underline;
}
</style>
