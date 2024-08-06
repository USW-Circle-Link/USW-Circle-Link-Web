<template>
  <div class="sidebar">
    <div class="profile">
      <img src="../../assets/flag_logo.jpeg" alt="FLAG Logo" class="profile-img" />
      <div class="profile-info">
        <div class="profile-name">
          <h2>{{clubname}}</h2>
        </div>
        <p>{{clubtype}}</p>
      </div>
    </div>
    <nav>
      <ul>
        <li class="list3">
          <div class="top" @click="navigateTo('')">
            <i class="icon home"></i>
            <p class="menu">소속 동아리</p>
            <div class="yellowLine"></div>
          </div>
        </li>
        <li class="list3" @click="navigateTo('')">
          <div class="top">
            <i class="icon clipboard"></i>
            <p class="menu">동아리 추가</p>
            <div class="yellowLine"></div>

          </div>
        </li>
        <li class="list2">
          <div class="top" @click="navigateTo('')">
            <i class="icon mail"></i>
            <p class="menu">공지사항</p>
            <div class="yellowLine"></div>
          </div>
          <div class="bottom">
            <a @click="openNewWindow">- 공지사항</a>
            <!--            <router-link :to="{ path: 'main/new-page' }" target="_blank">- 동아리소개/모집글</router-link>-->
            <a @click="navigateTo('')">- 공지사항 작성</a>
          </div>
        </li>

      </ul>
    </nav>
    <div class="empty"></div>
    <div class="line1"></div>
    <div class="footer">
      <a href="#">이용약관</a>
      <div class="line2"></div>
      <a href="#">로그아웃</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SidebarMenu',
  data(){
    return{
      clubname: 'FLAG',
      clubtype: '학술'
    }
  },
  methods: {
    navigateTo(routeName) {
      this.$router.push({ name: routeName }).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          throw err;
        }
      });
    },
    openNewWindow() {
      const url = 'http://localhost:8088/new-page'; // 열고자 하는 URL을 입력하세요.
      const windowName = '_blank'; // 새 창을 의미하는 특수 문자열
      const windowFeatures = 'width=600,height=800,resizable=no,scrollbars=no'; // 창의 크기와 같은 특성 정의
      window.open(url, windowName, windowFeatures);
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