<template>
  <div class="sidebar">
    <div class="sidebar-content">
      <div class="profile">
        <img :src="imageSrc" alt="Logo" class="profile-img" />
        <div class="profile-info">
          <div class="profile-name">
            <h2>{{ data.clubName || '운영팀' }}</h2>
          </div>
          <p>{{ department }}</p>
        </div>
      </div>

      <nav>
        <ul>
          <li class="list1">
            <div class="top" @click="navigateTo('clublist')">
              <i class="icon home"></i>
              <p class="menu">동아리 관리</p>
              <div class="yellowLine"></div>
            </div>
            <div class="bottom">
              <a @click.prevent="navigateTo('clubroom')">· 동아리 위치 정보 수정</a>
              <a @click.prevent="navigateTo('category')">· 동아리 카테고리 설정</a>
              <a @click.prevent="navigateTo('AddClub')">· 동아리 생성/관리</a>
            </div>
          </li>
          <li class="list2">
            <div class="top" @click="navigateTo('Notice')">
              <i class="icon clipboard"></i>
              <p class="menu">공지사항</p>
              <div class="yellowLine"></div>
            </div>
            <div class="bottom">
              <a @click="navigateTo('Notice')">· 공지사항 목록</a>
              <a @click="navigateTo('noticewrite')">· 공지사항 작성</a>
            </div>
          </li>
        </ul>
      </nav>
    </div>

    <div class="footer-container">
      <div class="line1"></div>
      <div class="footer">
        <div class="links">
          <a @click.prevent="navigateTo('AdminTermsOfUse')" :class="{ selected: selectedLink === 'AdminTermsOfUse' }">이용약관</a>
          <div class="line2"></div>
          <a @click.prevent="navigateTo('privacy_policy_')" :class="{ selected: selectedLink === 'privacy_policy_', 'bold-text': true }">개인정보 처리방침</a>
        </div>
        <a @click.prevent="logout">로그아웃</a>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store/store";
import axios from "axios";

export default {
  name: 'SidebarMenu',
  data() {
    return {
      // 기본 프로필 이미지 설정
      imageSrc: require('@/assets/profile.png'), 
      data: '',
      department: '',
      // 선택된 메뉴 스타일링을 위한 데이터
      selectedLink: '', 
    }
  },
  computed: {
    // Vuex 상태 감지를 위한 computed 속성
    shouldUpdateSidebar() {
      return this.$store.state.shouldUpdateSidebar;
    }
  },
  // 컴포넌트가 마운트될 때 데이터 로드 함수 실행
  mounted() {
    this.pageLoadFunction();
  },
  watch: {
    // shouldUpdateSidebar 상태가 변경되면 데이터 다시 로드
    shouldUpdateSidebar(newValue) {
      if (newValue) {
        this.pageLoadFunction();
        this.$store.commit('SET_SIDEBAR_UPDATE', false); // 플래그 초기화
      }
    }
  },
  methods: {
    // 페이지 이동 함수
    navigateTo(routeName) {
      this.selectedLink = routeName;
      this.$router.push({ name: routeName }).catch(err => {
        // 동일 경로 이동 시 발생하는 에러는 무시
        if (err.name !== 'NavigationDuplicated') {
          throw err;
        }
      });
    },
    // 로그아웃 함수
    async logout() {
      try {
        const accessToken = this.$store.state.accessToken;
        // 백엔드에 로그아웃 요청
        await axios.post(`${store.state.apiBaseUrl}/integration/logout`, {}, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        this.$store.dispatch('logout'); // Vuex 스토어에서 로그아웃 처리
        this.$router.push({ name: 'login' }); // 로그인 페이지로 이동
      } catch (error) {
        console.error('로그아웃 오류:', error);
        alert('로그아웃 처리 중 오류가 발생했습니다.');
        // 오류 발생 시에도 로컬에서는 로그아웃 처리
        this.$store.dispatch('logout');
        this.$router.push({ name: 'login' });
      }
    },
    // 동아리 정보(이름, 사진 등)를 가져오는 함수
    async pageLoadFunction() {
      const accessToken = store.state.accessToken;
      const clubUUID = store.state.clubUUID;

      if (!clubUUID) return; // clubUUID가 없으면 함수 종료

      try {
        const response = await axios.get(`${store.state.apiBaseUrl}/club-leader/${clubUUID}/info`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        this.data = response.data.data;
        this.department = this.data.department;

        // 프로필 이미지가 있으면 가져와서 표시
        if (this.data.mainPhotoUrl) {
          const imageResponse = await axios.get(this.data.mainPhotoUrl, {
            responseType: 'blob'
          });
          if(imageResponse.data.size > 0){
            this.imageSrc = URL.createObjectURL(imageResponse.data);
          }
        }
      } catch (error) {
        console.error('사이드바 정보 로딩 오류:', error);
      }
    },
  }
};
</script>

<style scoped>
.bold-text {
  font-weight: 800;
}
.sidebar {
  width: 240px;
  height: 77%;
  color: #000;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  border-radius: 16px;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  background-color: #fff; /* [수정] 사이드바 전체 배경을 흰색으로 설정 */
}
.sidebar::-webkit-scrollbar {
  display: none; /* Webkit browsers */
}
.sidebar-content {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
}
.sidebar-content::-webkit-scrollbar {
  display: none; /* Webkit browsers */
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
  margin: 10px 0 10px 0;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
  object-fit: cover; /* 이미지가 잘리지 않도록 추가 */
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
  min-height: 200px;
  margin-bottom: 20px;
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
.list1 {
  width: 240px;
  height: 55px;
  display: flex;
  flex-direction: column;
  transition: height 0.2s ease-in-out;
  margin-bottom: 7px;
  z-index: 2; /* 다른 요소 위에 오도록 z-index 추가 */
}
.list1 .bottom,
.list2 .bottom {
  pointer-events: none; /* 부모 hover 시 자식 이벤트 방지 */
}
.list1 a,
.list2 a {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  pointer-events: none; /* 기본적으로 클릭 안되게 */
}
.list1:hover {
  height: 155px; /* 콘텐츠 높이에 맞게 조절 */
}
.list2:hover {
  height: 110px; /* 콘텐츠 높이에 맞게 조절 */
}
.list1:hover .bottom,
.list2:hover .bottom {
  pointer-events: auto; /* hover 시 하위 메뉴 클릭 가능하게 */
}
.list1:hover a,
.list2:hover a {
  visibility: visible;
  opacity: 1;
  pointer-events: auto; /* hover 시 하위 메뉴 클릭 가능하게 */
}
.list2 {
  width: 240px;
  height: 55px;
  display: flex;
  flex-direction: column;
  transition: height 0.2s ease-in-out;
  position: relative;
  z-index: 1;
  margin-bottom: 7px;
}
.top {
  width: 240px;
  height: 55px;
  display: flex;
  align-items: center;
}
.bottom {
  width: 240px;
  display: flex;
  flex-direction: column;
  margin-top: 7px;
}
.bottom a{
  text-decoration: none;
  color: #000000;
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
nav .list1:hover .top,
nav .list2:hover .top {
  box-shadow: 0 2px 4px -2px rgba(0, 0, 0, 0.25);
}
nav li .yellowLine {
  width: 7px;
  height: 55px;
  transition: background-color 0.2s; /* 부드러운 색상 전환 효과 */
}
nav .icon {
  width: 20px;
  height: 20px;
  margin: 0 15px 3.5px 30px;
}
.home { background: url('@/assets/home.svg') no-repeat center center; }
.clipboard { background: url('@/assets/clipboard.svg') no-repeat center center; }

.footer-container {
  margin-top: auto;
  position: sticky;
  bottom: 0;
  background: #fff; /* [수정] 푸터 배경을 흰색으로 변경 */
  padding-bottom: 10px;
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
  align-items: flex-start;
  font-size: 12px;
  padding-left: 30px;
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
  color: #FFB052;
}
.line2 {
  width: 1px;
  height: 13px;
  background-color: #bbbbbb;
  margin: 0 30px;
}
.footer a:hover {
  text-decoration: underline;
}
</style>