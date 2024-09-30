<template>
  <div>
    <div class="ClubInfo">
      <img :src="imageSrc" alt="Logo" class="clublogo" v-if="imageSrc" oncontextmenu="return false;"/>
      <div class="Info">
        <div class="info">
          <p class="clubname">{{data.clubName}}</p>
          <div class="line1"></div>
          <p class="clubleader">동아리장</p>
          <p class="name">{{data.leaderName}}</p>
        </div>
        <div class="phoneNum">
          <div class="icon phone"></div>
          <p>{{formattedPhoneNumber}}</p>
        </div>
        <div class="instaName">
          <div class="icon insta"></div>
          <p>@{{data.clubInsta}}</p>
        </div>
      </div>
    </div>
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
import store from '../../store/store'; // 일단 store.js에서 Vuex 상태를 가져옴

export default {
  name: 'Dashboard',
  data() {
    return {
      data: {},
      imageSrc: '', // 이미지를 저장할 변수 추가
      ExelFileName: '',
      sheetData: [],
      sheet: null,
      message: '',
      clubMembers: [],
    }
  },
  computed: {
    formattedPhoneNumber() {
      return this.data.leaderHp ? this.data.leaderHp.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3') : '';
    },
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
    this.pageLoadFunction();
    this.getCurrentTime();
  },
  methods: {
    getCurrentTime() {
      const now = new Date();

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
      const day = String(now.getDate()).padStart(2, '0');

      return ` [${year}-${month}-${day}]`;
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
        this.ExelFileName = response.data.data.clubName + ' 동아리 명단' + this.getCurrentTime();

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
    },
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
    async sheetDownload(){
      try {
        const accessToken = store.state.accessToken; // 저장된 accessToken 가져오기채
        const clubId = store.state.clubId; // 저장된 clubId 가져오기
        const response = await axios.get(`http://15.164.246.244:8080/club-leader/${clubId}/members/export`, {
          responseType: 'blob', // Blob 형태로 응답을 받기 위해 설정
          headers: {
            'Authorization': `Bearer ${accessToken}`, // 헤더에 accessToken 추가해야 함
          }
        });
        console.log("엑셀파일 다운로드");
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${this.ExelFileName}.xlsx`); // 파일 이름 설정
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
@media screen and (max-width:600px) {
  .ClubInfo {
    width: 590px;
  }
}

.ClubInfo {
  width: 886px;
  height: 276px;
  display: flex;
  background: #fff;
  margin-bottom: 30px;
  border-radius: 8px;
}

.clublogo {
  width: 302px;
  object-fit: fill;
  border-radius: 8px;
  margin-right: 30px; /* 이미지와 텍스트 사이 간격 추가 */
}

.Info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  vertical-align: middle;
}

.info {
  display: flex;
  align-items: center;
}

.clubname {
  color: #000;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px; /* 100% */
  letter-spacing: -0.6px;
  margin-right: 15px;
}

.clubleader {
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

.name {
  color: #353549;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: -0.4px;
}

.phone {
  width: 16px;
  margin-right: 7px;
  background: url('../../assets/phone.svg') no-repeat center center;
}

.insta {
  width: 16px;
  margin-right: 7px;
  background: url('../../assets/insta.svg') no-repeat center center;
}

.line1 {
  width: 1px;
  height: 12px;
  background: #DBDBDB;
  margin-bottom: 4px;
}

.phoneNum {
  display: flex;
  height: 30px;
}

.phoneNum p {
  font-size: 16px;
  text-align: center;
  line-height: 30px;
  margin: 0;
}

.instaName {
  display: flex;
  height: 30px;
}

.instaName p {
  font-size: 16px;
  text-align: center;
  line-height: 30px;
  margin: 0;
}
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
