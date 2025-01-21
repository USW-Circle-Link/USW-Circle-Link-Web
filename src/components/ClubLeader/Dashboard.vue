<template>
  <div>
    <div class="ClubInfo">
      <img :src="imageSrc" alt="Logo" class="clublogo" v-if="imageSrc" oncontextmenu="return false;"/>
      <div class="Info">
        <div class="info">
          <p class="clubname">{{data.clubName}}</p>
          <div class="line1"></div>
          <p class="clubleader">동아리 회장</p>
          <p class="name">{{data.leaderName}}</p>
        </div>
        <div class="phoneNum">
          <div class="icon phone"></div>
          <p class="detail">{{formattedPhoneNumber}}</p>
        </div>
        <div class="instaName">
          <div class="icon insta"></div>
          <a :href="data.clubInsta" target="_blank">인스타그램</a>
        </div>
        <div class="clubroom">
          <div class="icon map"></div>
          <p class="room">동아리방</p>
          <div class="line2"></div>
          <p class="detail">학생회관 {{formattedPhoneNumber}}</p>
        </div>
      </div>
    </div>
    <div class="Dashboardhead">
      <div>
        <p class="p1">동아리 회원 정보</p>
        <p class="p2">현재 회원 : {{memberCount}} 명</p>
      </div>
      <button @click="sheetDownload" class="spreadsheets">
        <img v-if="!isLoading" src="../../assets/spreadsheets.png" oncontextmenu="return false;" />
        <span v-if="isLoading" class="loading-icon"></span>
        <p>{{ isLoading ? "다운로드 중" : "회원 명단 다운로드" }}</p>
      </button>
    </div>
    <div class="tab-menu">
      <button
          :class="['tab-button', { active: currentTab === 'alphabetical' }]"
          @click="changeTab('alphabetical')">
        가나다순
      </button>
      <button
          :class="['tab-button', { active: currentTab === 'nonMember' }]"
          @click="changeTab('nonMember')">
        비회원
      </button>
      <button
          :class="['tab-button', { active: currentTab === 'member' }]"
          @click="changeTab('member')">
        회원
      </button>
    </div>
    <div id="Dashboard" class="Dashboard">
      <!-- 탭 메뉴 추가 -->
      <div class="member-list">
        <ul>
          <li v-for="(member, index) in formattedClubMembers"
              :key="member.clubMemberId"
              class="member-item"
              :class="{
          'editing': editingIndex === index,
          'has-error': editingIndex === index &&
            (validationErrors.userName || validationErrors.studentNumber ||
             validationErrors.major || validationErrors.userHp)
        }">

            <!-- 이름 입력 -->
            <div class="input-wrapper">
              <span v-if="editingIndex !== index">{{ member.userName }}</span>
              <input v-else
                     v-model="editingMember.userName"
                     :class="['edit-input', { error: validationErrors.userName }]"
                     type="text"
                     placeholder="이름">
              <div v-if="editingIndex === index && validationErrors.userName"
                   class="validation-error">
                {{ errorMessages.userName }}
              </div>
            </div>

            <!-- 학번 입력 -->
            <div class="input-wrapper">
              <span v-if="editingIndex !== index">{{ member.studentNumber }}</span>
              <input v-else
                     v-model="editingMember.studentNumber"
                     :class="['edit-input', 'narrow-input', { error: validationErrors.studentNumber }]"
                     type="text"
                     placeholder="학번">
              <div v-if="editingIndex === index && validationErrors.studentNumber"
                   class="validation-error">
                {{ errorMessages.studentNumber }}
              </div>
            </div>

            <!-- 학과 선택 -->
            <div class="input-wrapper">
              <span v-if="editingIndex !== index">{{ member.major }}</span>
              <div v-else class="major-selection">
                <select v-model="selectedCollege"
                        :class="['edit-select', { error: validationErrors.major }]"
                        @change="onCollegeChange">
                  <option value="">단과대학 선택</option>
                  <option v-for="college in colleges"
                          :key="college.id"
                          :value="college.id">
                    {{ college.name }}
                  </option>
                </select>
                <select v-model="editingMember.major"
                        :class="['edit-select', { error: validationErrors.major }]">
                  <option value="">학과 선택</option>
                  <option v-for="dept in departments"
                          :key="dept"
                          :value="dept">
                    {{ dept }}
                  </option>
                </select>
              </div>
              <div v-if="editingIndex === index && validationErrors.major"
                   class="validation-error">
                {{ errorMessages.major }}
              </div>
            </div>

            <!-- 전화번호 입력 -->
            <div class="input-wrapper">
              <span v-if="editingIndex !== index">{{ member.userHp }}</span>
              <input v-else
                     v-model="editingMember.userHp"
                     :class="['edit-input', 'narrow-input', { error: validationErrors.userHp }]"
                     type="tel"
                     placeholder="전화번호">
              <div v-if="editingIndex === index && validationErrors.userHp"
                   class="validation-error">
                {{ errorMessages.userHp }}
              </div>
            </div>

            <!-- 수정/저장 버튼 -->
            <button v-if="editingIndex !== index"
                    @click="startEdit(index)"
                    class="edit-btn">
              수정
            </button>
            <button v-else
                    @click="confirmEdit"
                    class="save-btn">
              수정
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <div class="custom-popup" v-if="showEditConfirmPopup">
    <div class="popup-content">
      <div class="popup-header">
        <p class="popup-title">동아리 회원 수정</p>
      </div>
      <div class="popup-separator"></div>
      <div class="popup-body">
        <p class="popup-message">해당 동아리 회원 정보를 수정하시겠습니까?</p>
      </div>
      <button @click="cancelEdit" class="cancel-button">취소</button>
      <button @click="saveEdit" class="expel-button">확인</button>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import store from '../../store/store'; // 일단 store.js에서 Vuex 상태를 가져옴
import { colleges, departmentsByCollege } from '../departments'; // 학과 정보 가져오기

export default {
  name: 'Dashboard',
  data() {
    return {
      validationErrors: {
        userName: false,
        studentNumber: false,
        major: false,
        userHp: false
      },
      errorMessages: {
        userName: '* 이름(특수 기호 제외 문자)을 입력해주세요.',
        studentNumber: '* 학번(8자리 숫자)을 입력해주세요.',
        major: '* 학과를 선택해주세요.',
        userHp: '* -제외 11자리 숫자를 입력해주세요.'
      },
      data: {},
      imageSrc: '', // 이미지를 저장할 변수 추가
      ExelFileName: '',
      sheetData: [],
      sheet: null,
      message: '',
      clubMembers: [],
      memberCount: 0,
      isLoading: false, // 로딩 상태를 나타내는 변수
      showExpulsionPopup: false,
      memberToExpel: null,
      currentTab: 'alphabetical', // 현재 선택된 탭
      editingIndex: -1,
      editingMember: null,
      showEditConfirmPopup: false,
      selectedCollege: '',
      colleges, // 가져온 단과대학 정보 사용
      departmentsByCollege, // 가져온 학과 정보 사용
      departments: [],
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
    async saveEdit() {
      const accessToken = this.$store.state.accessToken;
      const clubId = this.$store.state.clubId;
      const memberId = this.clubMembers[this.editingIndex].clubMemberId;

      try {
        await axios.put(
            `http://15.164.246.244:8080/club-leader/${clubId}/members/${memberId}`,
            this.editingMember,
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            }
        );

        // 성공적으로 수정되면 로컬 데이터 업데이트
        this.clubMembers[this.editingIndex] = { ...this.editingMember };
        this.showEditConfirmPopup = false;
        this.editingIndex = -1;
        this.editingMember = null;
      } catch (error) {
        console.error('Error updating member:', error);
      }
    },
    onCollegeChange() {
      this.departments = this.departmentsByCollege[this.selectedCollege] || [];
      this.editingMember.major = ''; // 단과대학이 변경되면 학과 선택 초기화
    },

    confirmEdit() {
      if (this.validateInput()) {
        this.showEditConfirmPopup = true;
      }
    },

    cancelEdit() {
      this.showEditConfirmPopup = false;
      this.editingIndex = -1;
      this.editingMember = null;
    },
    startEdit(index) {
      this.editingIndex = index;
      this.editingMember = { ...this.clubMembers[index] };
      // 유효성 검사 초기화
      Object.keys(this.validationErrors).forEach(key => {
        this.validationErrors[key] = false;
      });

      // 현재 학과에 해당하는 단과대학 찾기
      for (const [collegeId, depts] of Object.entries(this.departmentsByCollege)) {
        if (depts.includes(this.editingMember.major)) {
          this.selectedCollege = collegeId;
          this.departments = depts;
          break;
        }
      }
    },
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
        } else {
          // mainPhotoUrl이 없을 경우 기본 프로필 이미지 설정
          this.imageSrc = require('@/assets/profile.png');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        this.error = error.message;
      }
    },
    async fetchData(memberType = 'alphabetical') {
      const accessToken = store.state.accessToken;
      const clubId = store.state.clubId;

      try {
        let url = `http://15.164.246.244:8080/club-leader/${clubId}/members`;

        // 탭에 따라 다른 엔드포인트 사용
        if (memberType === 'nonMember') {
          url += '/non-members';
        } else if (memberType === 'member') {
          url += '/members';
        }

        url += '?page=0&size=500';

        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        const responseData = response.data;
        this.message = responseData.message;
        this.clubMembers = responseData.data.content;










        // Add the default member if the list is empty
        if (this.clubMembers.length === 0) {
          this.clubMembers.push({
                clubMemberId: 1,
                userName: '김철수',
                studentNumber: '20518068',
                major: '정보보호학과',
                userHp: '010-2285-6733'
              },
              {
                clubMemberId: 2,
                userName: '김철수',
                studentNumber: '20518068',
                major: '컴퓨터공학과',
                userHp: '010-2285-6733'
              });
        }







        this.memberCount = this.clubMembers.length;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    async changeTab(tab) {
      this.currentTab = tab;
      await this.fetchData(tab);
    },

    removeMember(index) {
      this.memberToExpel = index;
      this.showExpulsionPopup = true;
    },
    async expelMember() {
      if (this.memberToExpel !== null) {
        const index = this.memberToExpel;
        const accessToken = store.state.accessToken;
        const clubId = store.state.clubId;
        const clubMemberId = this.clubMembers[index].clubMemberId;

        try {
          const response = await axios.delete(`http://15.164.246.244:8080/club-leader/${clubId}/members/${clubMemberId}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          });
          this.clubMembers.splice(index, 1);
          this.memberCount = this.clubMembers.length;
        } catch (error) {
          console.error('Error deleting member:', error);
        } finally {
          this.showExpulsionPopup = false;
          this.memberToExpel = null;
        }
      }
    },
    async sheetDownload(){
      this.isLoading = true; // 로딩 시작
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
      } finally {
        this.isLoading = false; // 로딩 종료
      }
    },
    validateInput() {
      // 이름 검증 - 특수문자 제외
      this.validationErrors.userName = !/^[가-힣a-zA-Z\s]+$/.test(this.editingMember.userName);

      // 학번 검증 - 8자리 숫자
      this.validationErrors.studentNumber = !/^\d{8}$/.test(this.editingMember.studentNumber);

      // 학과 검증
      this.validationErrors.major = !this.editingMember.major;

      // 전화번호 검증 - 숫자만 11자리
      const phoneNumber = this.editingMember.userHp.replace(/-/g, '');
      this.validationErrors.userHp = !/^\d{11}$/.test(phoneNumber);

      // 하나라도 에러가 있으면 false 반환
      return !Object.values(this.validationErrors).some(error => error);
    },

  }
};
</script>

<style>
.custom-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  width: 460px;
  height: 152px;
  text-align: left;
  position: relative;
}

.popup-header {
  margin-bottom: 10px;
}

.popup-title {
  font-size: 18px;
  font-weight: bold;
  color: black;
  margin: 0;
}

.popup-separator {
  border-bottom: 1px solid #d3d3d3;
  margin: 10px 0;
}

.popup-body {
  margin-bottom: 0px;
  margin-top: 22px;
}

.popup-message {
  font-size: 16px;
  color: #333333;
  margin: 0;
}

.popup-warning {
  font-size: 14px;
  color: #888888;
  margin-top: 5px;
}

.expel-button {
  background-color: #FFB052;
  color: white;
  border: none;
  padding: 7px 30px;
  border-radius: 7px;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.expel-button:hover {
  background-color: #e6953e;
}

.cancel-button {
  background-color: #cccccc;
  color: white;
  border: none;
  padding: 7px 30px;
  border-radius: 7px;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  position: absolute;
  bottom: 20px;
  right: 120px;
}

.cancel-button:hover {
  background-color: #999999;
}


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
  margin-bottom: 20px;
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

.detail {
  color: #666;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 100% */
  letter-spacing: -0.4px;
  margin-left: 15px;
  margin-right: 5px;
}

.room {
  color: #666;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 100% */
  letter-spacing: -0.4px;
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

.map {
  width: 16px;
  margin-right: 7px;
  background: url('../../assets/map.svg') no-repeat center center;
}

.line1 {
  width: 1px;
  height: 12px;
  background: #DBDBDB;
  margin-bottom: 4px;
}

.line2 {
  width: 1px;
  height: 12px;
  background: #DBDBDB;
  margin-top: 10px;
  margin-left: 5px;
  margin-right: 5px;
}

.phoneNum {
  display: flex;
  height: 30px;
}

.phoneNum p {
  font-size: 16px;
  text-align: center;
  line-height: 33px;
  margin: 0;
}

.clubroom {
  display: flex;
  height: 30px;
}

.clubroom p {
  font-size: 16px;
  text-align: center;
  line-height: 33px;
  margin: 0;
}

.instaName {
  display: flex;
  height: 30px;
}

.instaName a {
  font-size: 16px;
  text-align: center;
  line-height: 32px;
  margin: 0;
}
.Dashboard{
  width: 886px;
  background: #fff;
  border-radius: 0 8px 8px 8px;
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

.Dashboardhead .p1{
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: -0.05em;
  text-align: left;
  margin-left: 45px;
  margin-bottom: 0;
}

.Dashboardhead .p2{
  font-family: Pretendard;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: -0.05em;
  text-align: left;
  margin-left: 45px;
  margin-top: 5px;
}

.spreadsheets{
  width: 180px;
  height: 60px;
  display: flex;
  flex-shrink: 0;
  border-radius: 8px;
  background: #7FB08C;
  justify-content: center;
  border: none;
  align-items: center;
  align-content: center;
  margin-right: 60px;
  cursor: pointer;
}

.spreadsheets p{
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.05em;
  text-align: left;
  color: #FFFFFF;
  margin-bottom: 13px;
}

.spreadsheets img{
  margin-right: 9px;
}

.loading-icon {
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3; /* 흰색 회색 */
  border-top: 2px solid #7FB08C; /* 초록색 */
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 14px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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

.member-list ul{
  width: 858px;
  padding-left: 15px;
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

.member-item.editing {
  background-color: white;
  border: 1.5px solid #FFB052;
}

.member-item.editing.has-error {
  border: 1.5px solid #ff0000;
  background-color: rgba(255, 0, 0, 0.1);
}

.edit-input.error {
  border-color: #ff0000;
  background-color: rgba(255, 0, 0, 0.1);
  margin-top: 18px;
}

.edit-select.error {
  border-color: #ff0000;
  background-color: rgba(255, 0, 0, 0.1);
  margin-top: 18px;
}

.validation-error {
  color: #ff0000;
  font-size: 10px;
  margin-top: 6px;
  width: 100%;
  text-align: left;
  top: 100%;
  padding-left: 10px;
}

.input-wrapper {
  position: relative;
  width: 100%;
  flex: 1;
}

.edit-input {
  flex: 1;
  padding: 8px;
  margin: 0 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
}

/* 학번과 전화번호 입력칸을 위한 새로운 클래스 */
.narrow-input {
  max-width: 100px; /* 더 좁은 너비 설정 */
  width: 100px;
}

.major-selection {
  display: flex;
  gap: 8px;
  width: 100%;
}

.edit-select {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  max-width: 150px; /* 적절한 최대 너비 설정 */
  width: 150px;
  text-overflow: ellipsis; /* 말줄임표 처리 */
  overflow: hidden; /* 오버플로우 숨김 */
  white-space: nowrap; /* 줄바꿈 방지 */
}

.edit-select option {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.edit-btn {
  background-color: #FFB052;
  border: none;
  border-radius: 5px;
  color: white;
  padding: 8px 13px;
  cursor: pointer;
}

.save-btn {
  background-color: #f49421;
  border: none;
  border-radius: 5px;
  color: white;
  padding: 8px 13px;
  cursor: pointer;
}

.edit-btn:hover {
  background-color: #f49421;
}

.save-btn:hover {
  background-color: #c66f04;
}

.member-item span {
  flex: 1;
  text-align: center;
  font-size: 14px;
}

.remove-btn {
  background-color: #FFB052;
  border: none;
  border-radius: 5px;
  color: white;
  padding: 8px 13px;
  cursor: pointer;
}

.remove-btn:hover {
  background-color: #f49421;
}
.tab-menu {
  display: inline-flex;
  padding: 0;
  background: #fff;
  border-bottom: 1px solid #eee;
  border-radius: 8px 8px 0 0;
}

.tab-button {
  padding: 12px 24px;
  border: none;
  background: none;
  cursor: pointer;
  font-family: Pretendard;
  font-size: 14px;
  color: #666;
  position: relative;
}

.tab-button.active {
  color: #000000;
  font-weight: 600;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #000000;
}

.tab-button:hover {
  color: #232323;
}

</style>
