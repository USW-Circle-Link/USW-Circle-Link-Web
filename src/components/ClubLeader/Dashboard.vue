<template>
  <div class="total">
    <FirstAgree v-if="!isTermsAgreed" @agreement-confirmed="handleAgreementConfirmed" />

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
          <p class="detail">학생회관 {{data.clubRoomNumber}}호</p>
        </div>
        <div class="clubroom">
          <div class="icon category"></div>
          <p class="room">카테고리</p>
          <div class="line2"></div>
          <p class="detail">{{formattedCategory}}</p>
        </div>

        <div class="hashtags">
          <span v-for="(tag, index) in hashtagArray" :key="index" class="hashtag">#{{tag}}</span>
        </div>
      </div>
    </div>
    <div class="Dashboardhead">
      <div>
        <p class="p1">동아리 회원 정보</p>
        <p class="p2">현재 회원 : {{totalMemberCount}} 명</p>
      </div>
      <button @click="sheetDownload" class="spreadsheets">
        <img v-if="!isLoading" alt="" src="../../assets/spreadsheets.png" oncontextmenu="return false;" />
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
      <div class="member-list">
        <ul>
          <li v-for="(member, index) in displayedMembers"
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
            <!-- 정회원이고 가나다순 탭일 때만 투명한 박스 표시 -->
            <div v-if="currentTab === 'alphabetical' && member.isRegularMember"
                 class="transparent-box">
            </div>
            <!-- 수정 버튼 - '회원' 탭이 아닐 때만 표시 -->
            <button v-if="(currentTab === 'nonMember' || (currentTab === 'alphabetical' && !member.isRegularMember)) && editingIndex !== index"
                    @click="startEdit(index)"
                    class="edit-btn">
              수정
            </button>
            <button v-if="(currentTab === 'nonMember' || (currentTab === 'alphabetical' && !member.isRegularMember)) && editingIndex === index"
                    @click="confirmEdit"
                    class="save-btn">
              수정
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- 401 팝업 컴포넌트 추가 -->
    <Popup401 v-if="show401Popup" />

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
import { colleges, departmentsByCollege } from '../departments.js'; // 학과 정보 가져오기
import FirstAgree from '../ClubLeader/policy/FirstAgree.vue';
import Popup401 from './401Popup.vue';

export default {
  name: 'Dashboard',
  components: {
    FirstAgree,
    Popup401  // 컴포넌트 등록
  },
  props: {
    isAgreedTerms: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      showTermsPopup: false,
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
      totalMemberCount: 0, // 전체 회원 수를 저장할 새로운 변수
      regularMembers: [], // 정회원 목록
      nonRegularMembers: [], // 비회원 목록
      isTermsAgreed: this.$store.state.isAgreedTerms,
      show401Popup: false  // 401 팝업 표
    }
  },
  computed: {
    formattedPhoneNumber() {
      return this.data.leaderHp ? this.data.leaderHp.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3') : '';
    },
    formattedClubMembers() {
      if (!this.clubMembers) return []; // clubMembers가 undefined일 경우 빈 배열 반환
      return this.clubMembers.map(member => {
        return {
          ...member,
          userHp: member.userHp.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
        };
      });
    },
    displayedMembers() {
      switch(this.currentTab) {
        case 'alphabetical':
          // 정회원과 비회원 목록을 합치고 가나다순으로 정렬함
          // eslint-disable-next-line no-case-declarations
          const allMembers = [...this.regularMembers, ...this.nonRegularMembers];
          return allMembers.sort((a, b) => a.userName.localeCompare(b.userName, 'ko'));
        case 'nonMember':
          return this.nonRegularMembers.sort((a, b) => a.userName.localeCompare(b.userName, 'ko'));
        case 'member':
          return this.regularMembers.sort((a, b) => a.userName.localeCompare(b.userName, 'ko'));
        default:
          return [];
      }
    },
    hashtagArray() {
      if (!this.data.clubHashtag) return [];
      if (Array.isArray(this.data.clubHashtag)) return this.data.clubHashtag;
      try {
        return JSON.parse(this.data.clubHashtag);
      } catch (e) {
        return [this.data.clubHashtag];
      }
    },
    formattedCategory() {
      if (!this.data.clubCategoryName) return '없음';

      try {
        // 문자열로 온 경우 배열로 파싱
        const categories = Array.isArray(this.data.clubCategoryName)
            ? this.data.clubCategoryName
            : JSON.parse(this.data.clubCategoryName);

        // 배열이 비어있는 경우
        if (categories.length === 0) return '없음';

        // 배열 요소들을 쉼표로 구분하여 문자열로 변환
        return categories.join(', ');
      } catch (e) {
        // JSON 파싱 실패 시 원본 반환
        return this.data.clubCategoryName || '없음';
      }
    }
  },
  // 페이지 첫 로드 시 가나다순 데이터 로드와 전체 회원 수 설정
  async mounted() {
    // 약관 동의 상태 확인 및 팝업 표시
    this.showTermsPopup = !this.isAgreedTerms;
    this.currentTab = 'alphabetical';
    await this.fetchData();
    await this.pageLoadFunction();
  },
  methods: {
    // 401 에러 처리를 위한 공통 함수
    handle401Error(error) {
      if (error.response && error.response.status === 401) {
        this.show401Popup = true;
        return true;
      }
      return false;
    },
    handleAgreementConfirmed() {
      this.isTermsAgreed = true;
    },
    async saveEdit() {
      if (!this.validateInput()) {
        return;
      }

      const accessToken = this.$store.state.accessToken;
      const clubUUID = this.$store.state.clubUUID;
      const memberUUID = this.displayedMembers[this.editingIndex].clubMemberUUID;

      // 수정된 데이터 로깅
      console.log('Modified member data:', this.editingMember);

      const updateData = {
        userName: this.editingMember.userName.trim(),
        studentNumber: this.editingMember.studentNumber.trim(),
        userHp: this.editingMember.userHp.replace(/-/g, ''),
        major: this.editingMember.major.trim()
      };

      // 요청 데이터 로깅
      console.log('Request payload:', updateData);

      try {
        const response = await axios.patch(
            `http://15.164.246.244:8080/club-leader/${clubUUID}/members/${memberUUID}/non-member`,
            updateData,
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            }
        );

        console.log('Server response:', response);

        this.showEditConfirmPopup = false;
        this.editingIndex = -1;
        this.editingMember = null;

        await this.fetchData();
      } catch (error) {
        if (error.response) {
          console.error('Error response data:', error.response.data);
        }
        if (!this.handle401Error(error)) {
          console.error('Error updating member:', error);
        }
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
      const currentMember = this.displayedMembers[index];

      // 깊은 복사를 통해 현재 멤버 정보를 새로운 객체로 복사
      this.editingMember = {
        clubMemberUUID: currentMember.clubMemberUUID,
        userName: currentMember.userName,
        studentNumber: currentMember.studentNumber,
        major: currentMember.major,
        userHp: currentMember.userHp.replace(/-/g, ''),
        isRegularMember: currentMember.isRegularMember
      };

      // 현재 학과에 해당하는 단과대학 찾기
      for (const [collegeId, depts] of Object.entries(this.departmentsByCollege)) {
        if (depts.includes(currentMember.major)) {
          this.selectedCollege = collegeId;
          this.departments = depts;
          break;
        }
      }

      // 유효성 검사 초기화
      Object.keys(this.validationErrors).forEach(key => {
        this.validationErrors[key] = false;
      });
    },
    getCurrentTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `[${year}-${month}-${day}]`;
    },

    async pageLoadFunction() {
      const accessToken = store.state.accessToken;
      const clubUUID = store.state.clubUUID;

      try {
        const response = await axios.get(`http://15.164.246.244:8080/club-leader/${clubUUID}/info`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        this.data = response.data.data;
        this.ExelFileName = `${response.data.data.clubName} 동아리 명단 ${this.getCurrentTime()}`;

        if (this.data.mainPhotoUrl) {
          const imageResponse = await axios.get(this.data.mainPhotoUrl, {
            responseType: 'blob'
          });
          this.imageSrc = URL.createObjectURL(imageResponse.data);
        } else {
          this.imageSrc = require('@/assets/profile.png');
        }
      } catch (error) {
        if (!this.handle401Error(error)) {
          console.error('Fetch error:', error);
        }
      }
    },

    async fetchData() {
      const accessToken = store.state.accessToken;
      const clubUUID = store.state.clubUUID;

      try {
        const [regularResponse, nonRegularResponse] = await Promise.all([
          axios.get(`http://15.164.246.244:8080/club-leader/${clubUUID}/members?sort=regular-member`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }),
          axios.get(`http://15.164.246.244:8080/club-leader/${clubUUID}/members?sort=non-member`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          })
        ]);

        // clubMemberId 대신 clubMemberUUID를 사용하도록 매핑 수정
        this.regularMembers = regularResponse.data.data.map(member => ({
          ...member,
          isRegularMember: true,
          userHp: member.userHp.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
        }));

        this.nonRegularMembers = nonRegularResponse.data.data.map(member => ({
          ...member,
          isRegularMember: false,
          userHp: member.userHp.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
        }));

        this.totalMemberCount = this.regularMembers.length + this.nonRegularMembers.length;
      } catch (error) {
        if (!this.handle401Error(error)) {
          console.error('Error fetching data:', error);
        }
      }
    },

    async changeTab(tab) {
      this.currentTab = tab;
      // 편집 모드 초기화
      this.editingIndex = -1;
      this.editingMember = null;
    },

    async sheetDownload(){
      this.isLoading = true; // 로딩 시작
      try {
        const accessToken = store.state.accessToken; // 저장된 accessToken 가져오기채
        const clubUUID = store.state.clubUUID; // 저장된 clubUUID 가져오기
        const response = await axios.get(`http://15.164.246.244:8080/club-leader/${clubUUID}/members/export`, {
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
        if (!this.handle401Error(error)) {
          console.error('Fetch error:', error);
        }
      }  finally {
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
    }

  }
};
</script>

<style>
.total {
  margin-bottom: 30px;
}
.transparent-box {
  width: 50px; /* 수정 버튼의 너비와 비슷하게 설정 */
  height: 30px; /* 수정 버튼의 높이와 비슷하게 설정 */
  opacity: 0; /* 투명도 설정 */
}
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
  margin-bottom: 0;
  margin-top: 22px;
}

.popup-message {
  font-size: 16px;
  color: #333333;
  margin: 0;
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
  margin-right: 30px;
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
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px; /* 100% */
  letter-spacing: -0.6px;
  margin-right: 15px;
}

.clubleader {
  color: #767676;
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
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 100% */
  letter-spacing: -0.4px;
}

.name {
  color: #353549;
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

.category {
  width: 16px;
  margin-right: 7px;
  background: url('../../assets/category-dash.svg') no-repeat center center;
}

.line1 {
  width: 1px;
  height: 12px;
  background: #DBDBDB;
  margin-bottom: 4px;
}

.line2 {
  width: 1.5px;
  height: 14px;
  background: #666666;
  margin-top: 9px;
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
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.Dashboardhead .p1{
  font-size: 18px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: -0.05em;
  text-align: left;
  margin-left: 45px;
  margin-bottom: 0;
}

.Dashboardhead .p2{
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
  margin-right: 10px;
  cursor: pointer;
}

.spreadsheets:hover {
  background-color: #6a9b7a; /* Change to your desired hover color */
}

.spreadsheets p{
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
  border: 2px solid #f3f3f3;
  border-top: 2px solid #7FB08C;
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
  border-spacing: 0 8px;
  margin: 0 auto;
}

td {
  text-align: center;
  height: 46px;
  width: 215px;
}

td:first-child{
  border-radius: 8px 0 0 8px;
  background-color: #F0F2F5;
}

td:nth-last-child(4){
  background-color: #F0F2F5;
}

td:nth-last-child(3){
  background-color: #F0F2F5;
}

td:nth-last-child(2){
  border-radius: 0 8px 8px 0;
  padding-right: 20px;
  background-color: #F0F2F5;
}

td:last-child{
  background-color: #ffffff;
  width: 56px;
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
  background-color: #f2f4f6;
  border-radius: 10px;
  margin-bottom: 10px;
  height: 30px;
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

.hashtags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 7.5px;
}

.hashtag {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 8px;
  background: #EAEAEA;
  font-weight: 400;
  color: #353535;
  font-size: 12px;
  font-style: normal;
  line-height: 14px; /* 140% */
  letter-spacing: -0.25px;
}
</style>