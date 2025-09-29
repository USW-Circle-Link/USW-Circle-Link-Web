<template>
  <div class="sidebar">
    <div class="sidebar-content">
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
              <a @click="navigateTo('clubroom')">· 동아리 위치 정보 수정</a>
              <a @click="navigateTo('category')">· 동아리 카테고리 설정</a>
            </div>
          </li>
          <li class="list3" @click="navigateTo('AddClub')">
            <div class="top">
              <i class="icon check"></i>
              <p class="menu">동아리 관리</p>
              <div class="yellowLine"></div>
            </div>
          </li>
          <li class="list2">
            <div class="top" @click="navigateTo('Notice')">
              <i class="icon clipboard"></i>
              <p class="menu">공지사항</p>
              <div class="yellowLine"></div>
            </div>
            <div class="bottom">
              <a @click="navigateTo('Notice')">· 공지사항</a>
              <a @click="navigateTo('noticewrite')">· 공지사항 작성</a>
            </div>
          </li>
        </ul>
      </nav>
    </div>
    <div class="sidebar-footer">
      <div class="line1"></div>
      <div class="footer">
        <div class="links">
          <a @click.prevent="navigateTo('AdminTermsOfUse')" :class="{ selected: selectedLink === 'AdminTermsOfUse'}">이용약관</a>
          <div class="line2"></div>
          <a @click.prevent="navigateTo('privacy_policy_')" :class="{ selected: selectedLink === 'privacy_policy_', 'bold-text': true }">개인정보 처리방침</a>
        </div>
        <a @click.prevent="logout">로그아웃</a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import store from "@/store/store";

export default {
  name: 'SidebarMenu', // 구성요소 이름
  data(){
    return{
      clubname: '운영팀', // 동연회/개발팀 프로필 이름
      selectedLink: '', //선택된 메뉴라면 노란색으로 (footer)
    }
  },

  methods: {
    // 함수 실행 시 routeName의 컴포넌트로 이동
    navigateTo(routeName) {
      this.selectedLink = routeName; // 선택된 메뉴 
      this.$router.push({ name: routeName }).catch(err => {
        // 동일한 경로로 이동할 경우 오류 무시
        if (err.name !== 'NavigationDuplicated') {
          throw err;
        }
      });
    },
    // 로그아웃 처리 함수
    async logout() {
      try {
        const accessToken = this.$store.state.accessToken;

        // 백엔드 서버에 로그아웃 요청 보내기
        await axios.post(`${store.state.apiBaseUrl}/integration/logout`, {}, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        this.$store.dispatch('logout'); // 로컬 스토어에서 사용자 정보 제거
        this.$router.push({ name: 'login' }); // 로그인 페이지로 화면 이동

      } catch (error) {
        alert('로그아웃 처리 중 오류가 발생했습니다.'); // 오류가 발생해도 일단 로컬에서는 로그아웃 처리
        this.$store.dispatch('logout');
        this.$router.push({ name: 'login' });
      }
    },
  }
};
</script>


<style scoped>
.sidebar {
  width: 240px;
  min-width: 390px;
  height: 600px;
  color: #000;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  margin-left: 20px;
}

.sidebar-content {
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.sidebar-footer {
  position: sticky;
  bottom: 0;
  background-color: inherit;
  margin-top: 20px; /* 푸터와 컨텐츠 사이 간격 줄임 */
}

.profile {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 25px; /* 프로필과 내비게이션 사이 간격 늘림 */
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
  min-height: 320px; /* 기존 370px에서 줄임 */
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
  width: 60%;
  height: 1px;
  background-color: #999999;
  margin-bottom: 10px;
}

.footer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 12px;
  padding-left: 30px;
  padding-bottom: 15px;
}

.footer .links {
  display: flex;
  justify-content: center;
  margin: 10px 0 17px 0;
}

.footer a {
  color: #686868;
  text-decoration: none;
  cursor: pointer;
}

.footer a.selected {
  color: #FFB052;
}

.bold-text {
  font-weight: 800;
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

/* 모바일 반응형 스타일 */
@media (max-width: 1300px) {
  .sidebar {
    width: 240px;
    height: 100%;
    padding: 20px;
  }
  
  .sidebar-content {
    height: 100%;
    overflow-y: auto;
  }
  
  .profile {
    margin-bottom: 30px;
  }
  
  .profile-img {
    width: 60px;
    height: 60px;
  }
  
  .profile-info h2 {
    font-size: 20px;
  }
  
  nav {
    min-height: 300px;
  }
  
  nav li {
    height: 50px;
  }
  
  .menu {
    font-size: 16px;
  }
  
  .bottom a {
    font-size: 11px;
    margin: 8px 0 0 50px;
  }
  
  .sidebar-footer {
    position: sticky;
    bottom: 0;
    background-color: #fff;
    margin-top: auto;
    padding-top: 10px;
    flex-shrink: 0;
  }
  
  .footer {
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    font-size: 12px !important;
    padding-left: 30px !important;
    padding-bottom: 15px !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
  
  .footer .links {
    display: flex !important;
    justify-content: center !important;
    margin: 10px 0 17px 0 !important;
  }
  
  .footer a {
    color: #686868 !important;
    text-decoration: none !important;
    cursor: pointer !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
  
  .footer a.bold-text {
    font-weight: 800 !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
}
</style>