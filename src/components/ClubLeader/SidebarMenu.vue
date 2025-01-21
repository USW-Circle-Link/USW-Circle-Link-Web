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
            <a @click.prevent="navigateTo('addMember')">- 동아리 회원 추가</a>
            <a @click.prevent="navigateTo('duplicate-member')">- 중복 회원 추가</a>
            <a @click.prevent="navigateTo('remove-member')">- 회원 퇴출</a>
            <a @click.prevent="navigateTo('Accept')">- 동아리 회원 가입 요청 관리</a>

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
      <div class="links">
        <a @click.prevent="navigateTo('TermsOfUse')" :class="{ selected: selectedLink === 'TermsOfUse' }">이용약관</a>
        <div class="line2"></div>
        <a @click.prevent="navigateTo('privacy_policy')" :class="{ selected: selectedLink === 'privacy_policy', 'bold-text': true }">개인정보 처리방침</a>
      </div>
      <a @click.prevent="logout">로그아웃</a>
    </div>
  </div>
</template>

<script>
import store from "@/store/store";
import axios from "axios";
// eslint-disable-next-line no-unused-vars

export default {
  name: 'SidebarMenu',
  data() {
    return {
      imageSrc: require('@/assets/profile.png'),
      data: '',
      department: '',
      selectedLink: '', //선택 중이라면 노란색으로 (footer)
    }
  },
  mounted() {
    this.pageLoadFunction();
  },
  methods: {
    navigateTo(routeName) {
      this.selectedLink = routeName; // Add this line
      this.$router.push({ name: routeName }).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          throw err;
        }
      });
    },
    openNewWindow1() {
      const path = '/ClubProfile'; // 이동할 경로
      const url = `${path}`; // 상대 경로만 지정
      const windowName = '_blank';
      const windowFeatures = 'width=712,height=960,resizable=no,scrollbars=no';
      window.open(url, windowName, windowFeatures);
    },
    logout() {
      this.$store.dispatch('logout');
      this.$router.push({ name: 'login' });
    },
    async pageLoadFunction() {
      console.log('Page has been loaded!');
      const accessToken = store.state.accessToken;
      const clubId = store.state.clubId;

      try {
        const response = await axios.get(`http://15.164.246.244:8080/club-leader/${clubId}/info`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        this.data = response.data.data;
        this.department = this.getDepartmentName(this.data.department);

        if (this.data.mainPhotoUrl) {
          const imageResponse = await axios.get(this.data.mainPhotoUrl, {
            responseType: 'blob'
          });
          if(imageResponse.data !== ''){
            this.imageSrc = URL.createObjectURL(imageResponse.data);
          }
        }
      } catch (error) {
        console.error('Fetch error:', error);
        this.error = error.message;
      }
    },
    getDepartmentName(departmentCode) {
      const departmentMapping = {
        'ACADEMIC': '학술',
        'RELIGION': '종교',
        'ART': '예술',
        'SPORT': '체육',
        'SHOW': '공연',
        'VOLUNTEER': '봉사'
      };
      return departmentMapping[departmentCode] || '';
    }
  }
};
</script>

<style scoped>
.bold-text {
  font-weight: 800;
}

.sidebar {
  width: 240px;
  height: 800px;
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
  margin-bottom: 30px;
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
  margin: 0px 0px 12px 0px;
}

nav {
  height: 570px;
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
  z-index: 2;
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
  height: 200px;
  box-shadow: 0px 2px 4px -2px rgba(0, 0, 0, 0.25);
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

.list2 .bottom {
  width: 240px;
  height: 88px;
  display: flex;
  flex-direction: column;
  margin-top: 7px;
  pointer-events: none;
}

.list2 a{
  pointer-events: all;
}

.list3 {
  position: relative;
  z-index: 1;
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
  margin-bottom: 20px;
}


.footer {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Change from center to flex-start */
  font-size: 12px;
  padding-left: 30px; /* Add padding to align with other elements */
}

.footer .links {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.footer a {
  color: #686868;
  text-decoration: none;
  cursor: pointer;
}

.footer a.selected {
  color: #FFB052; /* Yellow color for selected link */
}

.line2 {
  width: 1px;
  height: 13px;
  background-color: #bbbbbb;
  margin: 0px 30px;
}

.footer a:hover {
  text-decoration: underline;
}
</style>
