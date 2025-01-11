<template>
  <div class="sidebar">
    <div class="profile">
      <img src="../../assets/FLAG.jpg" alt="FLAG Logo" class="profile-img" />
      <div class="profile-info">
        <div class="profile-name">
          <h2>{{clubname}}</h2>
        </div>
      </div>
    </div>
    <nav>
      <ul>
        <li class="list2">
          <div class="top" @click="navigateTo('clublist')">
            <i class="icon home"></i>
            <p class="menu">동아리 관리</p>
            <div class="yellowLine"></div>
          </div>
          <div class="bottom">
            <a @click="navigateTo('clubroom')">- 동아리 위치 정보 수정</a>
            <a @click="navigateTo('category')">- 동아리 카테고리 설정</a>
          </div>
        </li>
        <li class="list3" @click="navigateTo('AddClub')">
          <div class="top">
            <i class="icon check"></i>
            <p class="menu">동아리 추가</p>
            <div class="yellowLine"></div>
          </div>
        </li>
        <li class="list2">
          <div class="top">
            <i class="icon clipboard"></i>
            <p class="menu">공지사항</p>
            <div class="yellowLine"></div>
          </div>
          <div class="bottom">
            <a @click="navigateTo('Notice')">- 공지사항</a>
            <a @click="navigateTo('noticewrite')">- 공지사항 작성</a>
          </div>
        </li>
      </ul>
    </nav>
    <div class="empty"></div>
    <div class="line1"></div>
    <div class="footer">
      <a @click.prevent="navigateTo('AdminTermsOfUse')">이용약관</a>
      <div class="line2"></div>
      <a @click.prevent="logout">로그아웃</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SidebarMenu', // 구성요소 이름
  data(){
    return{
      clubname: '운영팀', // 동연회/개발팀 프로필 이름
    }
  },
  methods: {
    // 함수 실행 시 routeName의 컴포넌트로 이동
    navigateTo(routeName) {
      this.$router.push({ name: routeName }).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          throw err;
        }
      });
    },
    // 로그아웃
    logout() {
      this.$store.dispatch('logout');
      this.$router.push({ name: 'login' });
    }
  }
};
</script>


<style scoped>
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
  margin: 10px 0 10px 0;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
}

.profile-name {
  display: flex;
}

.profile-info h2 {
  color: #000;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 16px;
  text-align: center;
  margin: 20px 0 15px 0;
}

.profile-info p {
  color: #000;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  text-align: center;
  line-height: 6px;
  letter-spacing: -0.3px;
  margin: 0 0 12px 0;
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
  margin: 0;
  height: 55px;
}

.list1 a {
  visibility: hidden;
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
  height: 130px;
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
  box-shadow: 0 2px 4px -2px rgba(0, 0, 0, 0.25);
}

nav .list1:hover .top {
  box-shadow: 0 2px 4px -2px rgba(0, 0, 0, 0.25);
}

nav li .yellowLine {
  width: 7px;
  height: 55px;
}

nav .icon {
  width: 20px;
  height: 20px;
  margin: 0 15px 3.5px 30px;
}

.home {
  background: url('@/assets/home.svg') no-repeat center center;
}

.check {
  background: url('@/assets/check.svg') no-repeat center center;
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
  cursor: pointer;
}

.line2 {
  width: 1px;
  height: 13px;
  background-color: #bbbbbb;
  margin: 0 20px 0 20px;
}

.footer a:hover {
  text-decoration: underline;
}
</style>
