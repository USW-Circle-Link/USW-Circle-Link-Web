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
          <p class="name">{{formattedLeaderName}}</p>
        </div>
        <div class="phoneNum">
          <div class="icon phone"></div>
          <p class="detail">{{formattedPhoneNumber}}</p>
        </div>
        <div class="instaName">
          <div class="icon insta"></div>
          <a v-if="instagramLink.length" :href="instagramLink" target="_blank">인스타그램</a>
          <span v-else>정보 없음</span>
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
    formattedLeaderName() {
      return this.data.leaderName?.trim() || '정보 없음';
    },
    formattedPhoneNumber() {
      if (!this.data.leaderHp) return '정보 없음';
      return this.data.leaderHp.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
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
    instagramLink() {
      // Instagram 링크가 http로 시작하지 않으면 추가
      const instaUrl = this.data.clubInsta || '';
      if (instaUrl === '') return '';
      return instaUrl.startsWith('http') ? instaUrl : `https://${instaUrl}`;
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
            `${store.state.apiBaseUrl}/club-leader/${clubUUID}/members/${memberUUID}/non-member`,
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
        const response = await axios.get(`${store.state.apiBaseUrl}/club-leader/${clubUUID}/info`, {
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
          axios.get(`${store.state.apiBaseUrl}/club-leader/${clubUUID}/members?sort=regular-member`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }),
          axios.get(`${store.state.apiBaseUrl}/club-leader/${clubUUID}/members?sort=non-member`, {
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
        const response = await axios.get(`${store.state.apiBaseUrl}/club-leader/${clubUUID}/members/export`, {
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
/* ========== Global & Container ========== */
*,
*::before,
*::after { box-sizing: border-box; }

:root{
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --radius: 8px;
  --card: #fff;
  --muted: #f2f4f6;
  --muted-2: #F0F2F5;
  --text: #000;
  --text-2: #666;
  --text-3: #767676;
  --brand: #7FB08C;
  --brand-2: #6a9b7a;
  --accent: #FFB052;
  --accent-2: #f49421;
}

.total{
  max-width: 100%;
  width: 100%;
  margin: 0 auto;
  padding: clamp(10px, 2vw, 20px);
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 2vw, 20px);
  min-height: 100vh;
}

/* ========== ClubInfo ========== */
.ClubInfo{
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: clamp(12px, 3vw, 30px);
  background: var(--card);
  border-radius: var(--radius);
  padding: clamp(12px, 2vw, 20px);
  flex-shrink: 0;
}

.clublogo{
  width: clamp(120px, 25vw, 300px);
  height: clamp(90px, 19vw, 225px);
  object-fit: cover;
  border-radius: var(--radius);
  flex-shrink: 0;
}

.Info{
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  min-width: 0;
  gap: clamp(4px, 0.8vw, 8px);
}

.info{ 
  display: flex; 
  align-items: center; 
  flex-wrap: wrap; 
  gap: clamp(4px, 1vw, 8px);
  margin-bottom: clamp(4px, 0.8vw, 8px);
}

.clubname{
  color: var(--text);
  font-weight: 600;
  letter-spacing: -0.6px;
  margin-right: clamp(8px, 1.5vw, 12px);
  font-size: clamp(16px, 2.5vw, 24px);
  line-height: 1.2;
}

.clubleader,
.detail,
.room,
.name{ 
  font-size: clamp(12px, 1.8vw, 16px); 
  line-height: 1.2;
  margin: 0 clamp(4px, 0.8vw, 8px);
}

.clubleader{ color: var(--text-3); }
.detail{ color: var(--text-2); }
.room{ color: var(--text-2); }
.name{ color: #353549; font-weight: 600; }

.phone,
.insta,
.map,
.category{
  width: clamp(14px, 2vw, 16px);
  height: clamp(14px, 2vw, 16px);
  margin-right: clamp(4px, 0.8vw, 7px);
  background-size: contain;
  flex-shrink: 0;
}

.phone{ background: url('../../assets/phone.svg') no-repeat center center; }
.insta{ background: url('../../assets/insta.svg') no-repeat center center; }
.map{ background: url('../../assets/map.svg') no-repeat center center; }
.category{ background: url('../../assets/category-dash.svg') no-repeat center center; }

.line1{ 
  width: 1px; 
  height: clamp(10px, 1.5vw, 12px); 
  background: #DBDBDB; 
  margin-bottom: 4px; 
  flex-shrink: 0;
}

.line2{ 
  width: 1.5px; 
  height: clamp(12px, 1.8vw, 14px); 
  background: #666; 
  margin: 9px 5px 0; 
  flex-shrink: 0;
}

.phoneNum,
.clubroom,
.instaName{ 
  display: flex; 
  align-items: center; 
  gap: clamp(4px, 0.8vw, 7px); 
  min-height: clamp(24px, 3vw, 30px);
  flex-wrap: wrap;
}

.instaName a{
  font-size: clamp(12px, 1.8vw, 16px); 
  line-height: 1.2; 
  margin: 0;
  text-decoration: underline;
}

.hashtags{
  display: flex; 
  flex-wrap: wrap; 
  gap: clamp(4px, 1vw, 8px); 
  margin-top: clamp(4px, 1vw, 8px);
}

.hashtag{
  display: inline-block;
  padding: clamp(3px, 0.5vw, 5px) clamp(8px, 1.5vw, 12px);
  border-radius: var(--radius);
  background: #EAEAEA;
  color: #353535;
  font-size: clamp(10px, 1.5vw, 12px); 
  line-height: 1.4; 
  letter-spacing: -0.25px;
  white-space: nowrap;
}

/* ========== Dashboard Header ========== */
.Dashboardhead{
  width: 100%;
  border-radius: var(--radius);
  background: var(--card);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: clamp(12px, 2vw, 16px);
  padding: clamp(12px, 2vw, 20px);
  flex-wrap: wrap;
  flex-shrink: 0;
}

.Dashboardhead > div{
  flex: 1;
  min-width: 150px;
}

.Dashboardhead .p1{
  font-size: clamp(14px, 2vw, 18px);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.05em;
  text-align: left;
  margin: 0 0 4px 0;
}

.Dashboardhead .p2{
  font-size: clamp(11px, 1.5vw, 12px); 
  font-weight: 400; 
  line-height: 1.2; 
  letter-spacing: -0.05em; 
  margin: 0;
}

.spreadsheets{
  min-width: clamp(140px, 20vw, 180px);
  height: clamp(40px, 5vw, 48px);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: clamp(6px, 1vw, 9px);
  border-radius: var(--radius);
  background: var(--brand);
  border: none;
  padding: 0 clamp(12px, 2vw, 16px);
  cursor: pointer;
  white-space: nowrap;
}

.spreadsheets:hover{ background: var(--brand-2); }

.spreadsheets p{
  font-size: clamp(12px, 1.8vw, 16px); 
  font-weight: 600; 
  letter-spacing: -0.05em; 
  color: #fff; 
  margin: 0;
}

.spreadsheets img{ 
  display: block;
  width: clamp(14px, 2vw, 16px);
  height: clamp(14px, 2vw, 16px);
}

.loading-icon{
  width: clamp(14px, 2vw, 16px); 
  height: clamp(14px, 2vw, 16px); 
  border: 2px solid #f3f3f3; 
  border-top: 2px solid var(--brand);
  border-radius: 50%; 
  animation: spin 1s linear infinite;
}

@keyframes spin{ to{ transform: rotate(360deg);} }

/* ========== Tab ========== */
.tab-menu{
  display: inline-flex;
  padding: 0 var(--space-2);
  background: var(--card);
  border-bottom: 1px solid #eee;
  border-radius: 8px 8px 0 0;
  gap: 2px;
  flex-shrink: 0;
}

.tab-button{
  padding: clamp(8px, 1.5vw, 12px) clamp(12px, 2vw, 18px); 
  border: none; 
  background: none; 
  cursor: pointer;
  font-size: clamp(12px, 1.8vw, 14px); 
  color: #666; 
  position: relative;
  white-space: nowrap;
}

.tab-button.active{ color: #000; font-weight: 600; }

.tab-button.active::after{
  content: ''; 
  position: absolute; 
  bottom: -1px; 
  left: 0; 
  width: 100%; 
  height: 2px; 
  background: #000;
}

.tab-button:hover{ color: #232323; }

/* ========== Dashboard (List) ========== */
.Dashboard{
  width: 100%;
  background: var(--card);
  border-radius: 0 8px 8px 8px;
  text-align: center;
  padding: clamp(12px, 2vw, 16px) clamp(8px, 1.5vw, 12px) clamp(16px, 2.5vw, 20px);
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.member-list{
  width: 100%;
  height: 100%;
}

.member-list ul{
  width: 100%;
  padding-left: 0;
  list-style: none;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 1.5vw, 13px);
}

.member-item{
  display: grid;
  grid-template-columns: 1.2fr 0.9fr 1.6fr 1fr auto;
  align-items: center;
  gap: clamp(8px, 1.5vw, 12px);
  padding: clamp(8px, 1.5vw, 10px);
  background: var(--muted);
  border-radius: clamp(6px, 1vw, 10px);
  min-height: clamp(40px, 5vw, 46px);
}

.member-item.editing{ 
  background: #fff; 
  border: 1.5px solid var(--accent); 
}

.member-item.editing.has-error{ 
  border: 1.5px solid #ff0000; 
  background: rgba(255,0,0,0.08); 
}

.input-wrapper{ 
  position: relative; 
  width: 100%; 
  min-width: 0;
}

.member-item span{ 
  font-size: clamp(11px, 1.6vw, 14px); 
  text-align: center;
  word-break: break-word;
}

.edit-input,
.edit-select{
  width: 100%;
  padding: clamp(5px, 1vw, 8px);
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: clamp(11px, 1.6vw, 14px);
  text-align: center;
  background: #fff;
}

.edit-input.error,
.edit-select.error{ 
  border-color: #ff0000; 
  background: rgba(255,0,0,0.08); 
}

.narrow-input{ 
  max-width: clamp(100px, 15vw, 140px); 
  margin: 0 auto; 
}

.major-selection{ 
  display: flex; 
  gap: clamp(4px, 1vw, 8px); 
}

.edit-select{ 
  max-width: clamp(120px, 20vw, 180px); 
  text-overflow: ellipsis; 
  overflow: hidden; 
  white-space: nowrap; 
}

.validation-error{
  position: absolute; 
  left: 50%; 
  transform: translateX(-50%);
  white-space: nowrap; 
  font-size: clamp(10px, 1.4vw, 12px); 
  color: red; 
  margin-top: clamp(3px, 0.5vw, 6px);
  z-index: 1;
}

.edit-btn,
.save-btn{
  background: var(--accent);
  border: none; 
  border-radius: 5px; 
  color: #fff; 
  padding: clamp(6px, 1vw, 8px) clamp(10px, 1.5vw, 13px); 
  cursor: pointer; 
  justify-self: end;
  font-size: clamp(11px, 1.6vw, 14px);
  white-space: nowrap;
}

.save-btn{ background: var(--accent-2); }
.edit-btn:hover{ background: var(--accent-2); }
.save-btn:hover{ background: #c66f04; }

.transparent-box{ 
  width: clamp(40px, 6vw, 50px); 
  height: clamp(24px, 3vw, 30px); 
  opacity: 0; 
}

/* ========== Popup ========== */
.custom-popup{
  position: fixed; 
  inset: 0; 
  background: rgba(0,0,0,0.5);
  display: flex; 
  justify-content: center; 
  align-items: center; 
  z-index: 999;
  padding: 20px;
}

.popup-content{
  background: #fff; 
  padding: clamp(16px, 2.5vw, 20px); 
  border-radius: 8px; 
  box-shadow: 0 0 20px rgba(0,0,0,0.2);
  width: min(92vw, 460px); 
  height: auto; 
  text-align: left; 
  position: relative;
}

.popup-header{ margin-bottom: clamp(8px, 1.5vw, 10px); }

.popup-title{ 
  font-size: clamp(16px, 2.2vw, 18px); 
  font-weight: 700; 
  color: #000; 
  margin: 0; 
}

.popup-separator{ 
  border-bottom: 1px solid #d3d3d3; 
  margin: clamp(8px, 1.5vw, 10px) 0; 
}

.popup-body{ margin: clamp(14px, 2vw, 18px) 0; }

.popup-message{ 
  font-size: clamp(14px, 2vw, 16px); 
  color: #333; 
  margin: 0; 
}

.expel-button,
.cancel-button{
  position: static; 
  margin-top: var(--space-4);
}

.expel-button{
  background: var(--accent); 
  color: #fff; 
  border: none; 
  padding: clamp(6px, 1vw, 7px) clamp(14px, 2vw, 18px); 
  border-radius: 7px; 
  font-size: clamp(14px, 2vw, 16px); 
  font-weight: 500; 
  cursor: pointer;
}

.expel-button:hover{ background: #e6953e; }

.cancel-button{
  background: #ccc; 
  color: #fff; 
  border: none; 
  padding: clamp(6px, 1vw, 7px) clamp(14px, 2vw, 18px); 
  border-radius: 7px; 
  font-size: clamp(14px, 2vw, 16px); 
  font-weight: 500; 
  cursor: pointer; 
  margin-right: var(--space-3);
}

.cancel-button:hover{ background: #999; }

/* ========== Responsive Breakpoints ========== */

/* Tablet View */
@media (max-width: 768px){
  .ClubInfo{
    flex-direction: column;
    align-items: center;
  }
  
  .clublogo{
    width: 100%;
    max-width: 400px;
    height: auto;
    aspect-ratio: 4/3;
  }
  
  .member-item{
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: auto;
    row-gap: clamp(6px, 1vw, 10px);
  }
  
  .member-item > .input-wrapper:nth-child(1){ grid-column: 1 / -1; }
  .member-item > .input-wrapper:nth-child(2){ grid-column: 1 / 2; }
  .member-item > .input-wrapper:nth-child(3){ grid-column: 2 / 3; }
  .member-item > .input-wrapper:nth-child(4){ grid-column: 1 / 2; }
  
  .member-item > .edit-btn,
  .member-item > .save-btn,
  .member-item > .transparent-box{ 
    grid-column: 2 / 3; 
    justify-self: end; 
  }
  
  .narrow-input{ max-width: 100%; }
  
  .major-selection{
    flex-direction: column;
  }
  
  .edit-select{
    max-width: 100%;
  }
}

/* Mobile View */
@media (max-width: 480px){
  .total{
    padding: clamp(8px, 1.5vw, 12px);
    gap: clamp(8px, 1.5vw, 12px);
  }
  
  .Dashboardhead{
    flex-direction: column;
    align-items: stretch;
  }
  
  .Dashboardhead > div{
    min-width: 100%;
  }
  
  .spreadsheets{
    width: 100%;
    min-width: unset;
  }
  
  .member-item{
    grid-template-columns: 1fr;
    padding: clamp(6px, 1vw, 8px);
  }
  
  .member-item > *{
    grid-column: 1 / -1;
  }
  
  .member-item > .edit-btn,
  .member-item > .save-btn{
    justify-self: stretch;
    width: 100%;
    margin-top: clamp(4px, 0.8vw, 6px);
  }
  
  .tab-button{
    padding: clamp(6px, 1vw, 8px) clamp(8px, 1.5vw, 12px);
  }
  
  .hashtags{
    justify-content: flex-start;
  }
  
  .hashtag{
    font-size: clamp(9px, 1.3vw, 11px);
    padding: clamp(2px, 0.4vw, 4px) clamp(6px, 1vw, 8px);
  }
}

/* Very Small Screens */
@media (max-width: 360px){
  .clubname{
    font-size: clamp(14px, 4vw, 18px);
  }
  
  .member-item span,
  .edit-input,
  .edit-select{
    font-size: clamp(10px, 3vw, 12px);
  }
  
  .validation-error{
    font-size: clamp(9px, 2.5vw, 10px);
  }
  
  .phoneNum,
  .clubroom,
  .instaName{
    flex-direction: column;
    align-items: flex-start;
  }
}

/* Large Screens */
@media (min-width: 1440px){
  .total{
    max-width: 1280px;
    margin: 0 auto;
  }
}

/* Ultra Wide Screens */
@media (min-width: 1920px){
  .total{
    max-width: 1600px;
  }
  
  .clublogo{
    max-width: 350px;
    max-height: 262px;
  }
}

/* Height-based adjustments for landscape mode */
@media (max-height: 600px) and (orientation: landscape){
  .total{
    padding: 8px;
    gap: 8px;
  }
  
  .ClubInfo{
    padding: 10px;
  }
  
  .Dashboard{
    padding: 8px;
  }
  
  .member-item{
    min-height: 36px;
    padding: 6px;
  }
}
</style>