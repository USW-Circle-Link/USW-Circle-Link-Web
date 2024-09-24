<template>
  <div>
    <ClubInfo />
    <div class="Dashboardhead">
      <p>소속 동아리 회원 정보</p>
      <button @click="sheetDownload" class="spreadsheets">
        <p>엑셀 파일 다운로드</p>
        <img src="../../assets/spreadsheets.png" oncontextmenu="return false;"/>
      </button>
    </div>
    <div id="Dashboard" class="Dashboard">
      <div class="member-list">
        <ul>
          <li v-for="(member, index) in formattedClubMembers" :key="member.clubMemberId" class="member-item">
            <span>{{ member.userName }}</span>
            <span>{{ member.studentNumber }}</span>
            <span>{{ member.major }}</span>
            <span>{{ member.userHp }}</span>
            <button @click="removeMember(index)" class="remove-btn">퇴출</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ClubInfo from "@/components/ClubLeader/ClubInfo.vue";
import store from '@/store/store'; // 일단 store.js에서 Vuex 상태를 가져옴

export default {
  name: 'Dashboard',
  components: {
    ClubInfo,
  },
  data() {
    return {
      sheetData: [],
      sheet: null,
      message: '',
      clubMembers: [],
    }
  },
  computed: {
    formattedClubMembers() {
      return this.clubMembers.map(member => {
        return {
          ...member,
          userHp: member.userHp.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')  // 전화번호 형식 변경
        };
      });
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const accessToken = store.state.accessToken; // 저장된 accessToken 가져오기채
      console.log(accessToken + '토큰값');
      const clubId = store.state.clubId; // 저장된 clubId 가져오기
      console.log(clubId + '클럽 ID')
      console.log('Page has been loaded!');
      try {
        const response = await axios.get(`http://15.164.246.244:8080/club-leader/${clubId}/members?page=0&size=2`, { //${clubId}
          headers: {
            'Authorization': `Bearer ${accessToken}`, // 헤더에 accessToken 추가해야 함
            'Content-Type': 'application/json'
          }
        });
        const responseData = response.data;

        this.message = responseData.message;
        this.clubMembers = responseData.data.content;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    async removeMember(index) {
      this.clubMembers.splice(index, 1);
      const accessToken = store.state.accessToken; // 저장된 accessToken 가져오기채
      const clubId = store.state.clubId; // 저장된 clubId 가져오기
      try {
        const response = await axios.delete(`http://15.164.246.244:8080/club-leader/${clubId}/members/2`, { //
          headers: {
            'Authorization': `Bearer ${accessToken}`, // 헤더에 accessToken 추가해야 함
            'Content-Type': 'application/json'
          }
        });
        const responseData = response.data;
        this.message = responseData.message;
        this.clubMembers = responseData.data.content;
        alert("동아리원 퇴출이 완료되었습니다.");
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    // async pageLoadFunction() {
    //   console.log('Page has been loaded!');
    //   // 여기에 원하는 초기화 작업을 수행합니다.
    //   try {
    //     const response = await axios.get('http://43.200.140.186:8080/club-leader/members?leaderUUID=9a4c8754-6368-4757-a781-422ae23b5ee8&page=0&size=2', {
    //       timeout: 5000, // 타임아웃을 5초로 설정
    //     });
    //     this.sheetData = response.data;
    //     console.log(this.sheetData)
    //   } catch (error) {
    //     console.error('Fetch error:', error);
    //     this.error = error.message;
    //   }
    // },
    async sheetDownload(){
      try {
        const accessToken = store.state.accessToken; // 저장된 accessToken 가져오기채
        const clubId = store.state.clubId; // 저장된 clubId 가져오기
        const response = await axios.get(`http://15.164.246.244:8080/club-leader/${clubId}/members/export`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`, // 헤더에 accessToken 추가해야 함
            'Content-Type': 'application/json'
          }
        });
        console.log("엑셀파일 다운로드");
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'example.xlsx'); // 파일 이름 설정
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Fetch error:', error);
        this.error = error.message;
      }
    }
  }
};
</script>

<style>
.Dashboard{
  width: 886px;
  background: #fff;
  border-radius: 8px;
  align-items: center;
  align-content: center;
  text-align: center;
}

.Dashboard p {
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  padding: 20px;
}

.Dashboardhead{
  width: 886px;
  height: 76px;
  flex-shrink: 0;
  border-radius: 8px;
  background: #FFF;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.Dashboardhead p{
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: -0.05em;
  text-align: left;
  margin-left: 60px;
}

.spreadsheets{
  width: 170px;
  height: 60px;
  display: flex;
  flex-shrink: 0;
  border-radius: 8px;
  background: #7FB08C;
  justify-content: space-between;
  border: none;
  align-items: center;
  margin-right: 60px;
}

.spreadsheets p{
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.05em;
  text-align: left;
  color: #FFFFFF;
  margin-left: 7px;
  margin-bottom: 13px;
}

.spreadsheets img{
  margin-right: 7px;
}

.Dashboard h1{
  text-align: center;
}

.Dashboard div{
  align-items: center;
}

table {
  width: 860px;
  border-spacing: 0px 8px;
  margin: 0 auto;
}

td {
  text-align: center;
  height: 46px;
  width: 215px;
}

td:first-child{
  border-radius: 8px 0px 0px 8px;
  background-color: #F0F2F5;
}

td:nth-last-child(4){
  background-color: #F0F2F5;
}

td:nth-last-child(3){
  background-color: #F0F2F5;
}

td:nth-last-child(2){
  border-radius: 0px 8px 8px 0px;
  padding-right: 20px;
  background-color: #F0F2F5;
}

td:last-child{
  background-color: #ffffff;
  width: 56px;
}

.Expulsion{
  background-color: #e57373;
  width: 56px;
  height: 46px;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-left: 8px;
}

.member-list {
  max-width: 850px;
}

.member-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f8f8f8;
  border-radius: 10px;
  margin-bottom: 10px;
}

.member-item span {
  flex: 1;
  text-align: center;
}

.remove-btn {
  background-color: #e57373;
  border: none;
  border-radius: 5px;
  color: white;
  padding: 5px 10px;
  cursor: pointer;
}

.remove-btn:hover {
  background-color: #d32f2f;
}

</style>
