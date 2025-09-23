<template>
  <div class="total">
    <FirstAgree v-if="!isTermsAgreed" @agreement-confirmed="handleAgreementConfirmed" />

    <div class="ClubInfo">
      <img :src="imageSrc" alt="Logo" class="clublogo" v-if="imageSrc" oncontextmenu="return false;" />
      <div class="Info">
        <div class="info">
          <p class="clubname">{{ data.clubName }}</p>
          <div class="line1"></div>
          <p class="clubleader">동아리 회장</p>
          <p class="name">{{ formattedLeaderName }}</p>
        </div>
        <div class="phoneNum">
          <div class="icon phone"></div>
          <p class="detail">{{ formattedPhoneNumber }}</p>
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
          <p class="detail">학생회관 {{ data.clubRoomNumber }}호</p>
        </div>
        <div class="clubroom">
          <div class="icon category"></div>
          <p class="room">카테고리</p>
          <div class="line2"></div>
          <p class="detail">{{ formattedCategory }}</p>
        </div>

        <div class="hashtags">
          <span v-for="(tag, index) in hashtagArray" :key="index" class="hashtag">#{{ tag }}</span>
        </div>
      </div>
    </div>
    <div class="Dashboardhead">
      <div>
        <p class="p1">동아리 회원 정보</p>
        <p class="p2">현재 회원 : {{ totalMemberCount }} 명</p>
      </div>
      <button @click="sheetDownload" class="spreadsheets">
        <svg v-if="!isLoading" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15.2379V3.21289" stroke="#545454" stroke-width="1.5" stroke-miterlimit="10"
            stroke-linecap="round" />
          <path
            d="M7.375 10.9941L11.341 14.9601C11.5164 15.1337 11.7532 15.231 12 15.231C12.2468 15.231 12.4836 15.1337 12.659 14.9601L16.625 10.9941"
            stroke="#545454" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path
            d="M2.75 13.8496V18.4746C2.75 19.0881 2.99369 19.6764 3.42746 20.1101C3.86123 20.5439 4.44955 20.7876 5.063 20.7876H18.937C19.5504 20.7876 20.1388 20.5439 20.5725 20.1101C21.0063 19.6764 21.25 19.0881 21.25 18.4746V13.8496"
            stroke="#545454" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span v-if="isLoading" class="loading-icon"></span>
        <p>{{ isLoading ? "다운로드 중" : "회원 명단 다운로드" }}</p>
      </button>
    </div>
    <div class="tab-menu">
      <button :class="['tab-button', { active: currentTab === 'alphabetical' }]" @click="changeTab('alphabetical')">
        가나다순
      </button>
      <button :class="['tab-button', { active: currentTab === 'nonMember' }]" @click="changeTab('nonMember')">
        비회원
      </button>
      <button :class="['tab-button', { active: currentTab === 'member' }]" @click="changeTab('member')">
        회원
      </button>
    </div>
    <div id="Dashboard" class="Dashboard">
      <div class="member-list">
        <ul>
          <li v-for="(member, index) in displayedMembers" :key="member.clubMemberId" class="member-item-li">
            <div v-if="editingIndex !== index" class="member-item-display">
              <span class="member-info-text">{{ member.userName }}</span>
              <span class="member-info-text">{{ member.studentNumber }}</span>
              <span class="member-info-text">{{ member.major }}</span>
              <span class="member-info-text">{{ member.userHp }}</span>
              <button v-if="(currentTab === 'nonMember' || (currentTab === 'alphabetical' && !member.isRegularMember))"
                @click="startEdit(index)" class="edit-btn">
                수정
              </button>
            </div>

            <div v-else class="member-item-edit" :class="{ 'has-error': hasError }">
              <div class="edit-form-box">
                <div class="input-row-group">
                  <div class="input-row">
                    <input v-model="editingMember.userName" type="text" placeholder="이름" class="edit-input"
                      :class="{ 'error': validationErrors.userName }" />
                    <input v-model="editingMember.studentNumber" type="text" placeholder="학번" class="edit-input"
                      :class="{ 'error': validationErrors.studentNumber }" />
                  </div>
                  <div class="input-row">
                    <select v-model="selectedCollege" @change="onCollegeChange" class="edit-input"
                      :class="{ 'error': !selectedCollege }">
                      <option value="">단과대학 선택</option>
                      <option v-for="college in colleges" :key="college.id" :value="college.id">
                        {{ college.name }}
                      </option>
                    </select>
                    <select v-model="editingMember.major" class="edit-input" :class="{ 'error': validationErrors.major }">
                      <option value="">학과 선택</option>
                      <option v-for="dept in departments" :key="dept" :value="dept">
                        {{ dept }}
                      </option>
                    </select>
                  </div>
                  <div class="input-row">
                    <input v-model="editingMember.userHp" type="tel" placeholder="전화번호" class="edit-input"
                      :class="{ 'error': validationErrors.userHp }" />
                  </div>
                </div>
              </div>
              <button @click="confirmEdit" class="save-btn">저장</button>
            </div>

            <div v-if="editingIndex === index && hasError" class="error-messages-container">
              <ul class="error-list">
                <li v-for="(message, key) in validationErrorList" :key="key" class="error-item">
                  {{ message }}
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <Popup401 v-if="show401Popup" />

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
  </div>
</template>

<script>
import axios from 'axios';
import store from '../../store/store';
import { colleges, departmentsByCollege } from '../departments.js';
import FirstAgree from '../ClubLeader/policy/FirstAgree.vue';
import Popup401 from './401Popup.vue';

export default {
  name: 'Dashboard',
  components: {
    FirstAgree,
    Popup401,
  },
  props: {
    isAgreedTerms: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      showTermsPopup: false,
      validationErrors: {
        userName: false,
        studentNumber: false,
        major: false,
        userHp: false,
      },
      errorMessages: {
        userName: '* 이름(특수 문자 제외 2~30자)을 입력해주세요.',
        studentNumber: '* 학번(숫자 8자)을 입력해주세요.',
        major: '* 학과를 선택해주세요.',
        userHp: '* 전화번호(-제외 11자리 숫자)를 입력해주세요.',
      },
      data: {},
      imageSrc: '',
      ExelFileName: '',
      sheetData: [],
      sheet: null,
      message: '',
      clubMembers: [],
      memberCount: 0,
      isLoading: false,
      showExpulsionPopup: false,
      memberToExpel: null,
      currentTab: 'alphabetical',
      editingIndex: -1,
      editingMember: null,
      showEditConfirmPopup: false,
      selectedCollege: '',
      colleges,
      departmentsByCollege,
      departments: [],
      totalMemberCount: 0,
      regularMembers: [],
      nonRegularMembers: [],
      isTermsAgreed: this.$store.state.isAgreedTerms,
      show401Popup: false,
    };
  },
  computed: {
    formattedLeaderName() {
      return this.data.leaderName?.trim() || '정보 없음';
    },
    formattedPhoneNumber() {
      if (!this.data.leaderHp) return '정보 없음';
      return this.data.leaderHp.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    },
    instagramLink() {
      const instaUrl = this.data.clubInsta || '';
      if (instaUrl === '') return '';
      return instaUrl.startsWith('http') ? instaUrl : `https://${instaUrl}`;
    },
    displayedMembers() {
      let sortedMembers = [];
      switch (this.currentTab) {
        case 'alphabetical':
          sortedMembers = [...this.regularMembers, ...this.nonRegularMembers].sort((a, b) =>
            a.userName.localeCompare(b.userName, 'ko')
          );
          break;
        case 'nonMember':
          sortedMembers = this.nonRegularMembers.sort((a, b) =>
            a.userName.localeCompare(b.userName, 'ko')
          );
          break;
        case 'member':
          sortedMembers = this.regularMembers.sort((a, b) =>
            a.userName.localeCompare(b.userName, 'ko')
          );
          break;
      }
      return sortedMembers;
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
        const categories = Array.isArray(this.data.clubCategoryName)
          ? this.data.clubCategoryName
          : JSON.parse(this.data.clubCategoryName);
        if (categories.length === 0) return '없음';
        return categories.join(', ');
      } catch (e) {
        return this.data.clubCategoryName || '없음';
      }
    },
    hasError() {
      return Object.values(this.validationErrors).some((error) => error);
    },
    validationErrorList() {
      const errors = [];
      if (this.validationErrors.userName) errors.push(this.errorMessages.userName);
      if (this.validationErrors.studentNumber) errors.push(this.errorMessages.studentNumber);
      if (this.validationErrors.major) errors.push(this.errorMessages.major);
      if (this.validationErrors.userHp) errors.push(this.errorMessages.userHp);
      return errors;
    },
  },
  async mounted() {
    this.showTermsPopup = !this.isAgreedTerms;
    this.currentTab = 'alphabetical';
    await this.fetchData();
    await this.pageLoadFunction();
  },
  methods: {
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

      const updateData = {
        userName: this.editingMember.userName.trim(),
        studentNumber: this.editingMember.studentNumber.trim(),
        userHp: this.editingMember.userHp.replace(/[^0-9]/g, ''),
        major: this.editingMember.major.trim(),
      };

      try {
        await axios.patch(
          `${store.state.apiBaseUrl}/club-leader/${clubUUID}/members/${memberUUID}/non-member`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        this.showEditConfirmPopup = false;
        this.editingIndex = -1;
        this.editingMember = null;
        await this.fetchData();
      } catch (error) {
        const { code } = error.response?.data || {};

        if (code === 'CMEM-201') {
          alert('클럽멤버가 존재하지 않습니다.');
        } else if (code === 'PFL-206') {
          alert('비회원만 수정할 수 있습니다.');
        } else {
          alert(
            '예기치 못한 오류가 발생했습니다.\n' +
            '문제가 계속될 시, 관리자에게 문의해 주세요.'
          );
        }

        if (!this.handle401Error(error)) {
          console.error('Error updating member:', error);
        }
      }
    },
    onCollegeChange() {
      this.departments = this.departmentsByCollege[this.selectedCollege] || [];
      this.editingMember.major = '';
    },
    confirmEdit() {
      if (!this.validateInput()) {
        return;
      }
      this.showEditConfirmPopup = true;
    },
    cancelEdit() {
      this.showEditConfirmPopup = false;
      this.editingIndex = -1;
      this.editingMember = null;
    },
    startEdit(index) {
      this.editingIndex = index;
      const currentMember = this.displayedMembers[index];

      this.editingMember = { ...currentMember
      };

      for (const [collegeId, depts] of Object.entries(this.departmentsByCollege)) {
        if (depts.includes(currentMember.major)) {
          this.selectedCollege = collegeId;
          this.departments = depts;
          break;
        }
      }

      this.validationErrors = {
        userName: false,
        studentNumber: false,
        major: false,
        userHp: false,
      };
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
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        this.data = response.data.data;
        this.ExelFileName = `${response.data.data.clubName} 동아리 명단 ${this.getCurrentTime()}`;

        if (this.data.mainPhotoUrl) {
          const imageResponse = await axios.get(this.data.mainPhotoUrl, {
            responseType: 'blob',
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
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }),
          axios.get(`${store.state.apiBaseUrl}/club-leader/${clubUUID}/members?sort=non-member`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }),
        ]);

        this.regularMembers = regularResponse.data.data.map((member) => ({
          ...member,
          isRegularMember: true,
          userHp: member.userHp.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'),
        }));

        this.nonRegularMembers = nonRegularResponse.data.data.map((member) => ({
          ...member,
          isRegularMember: false,
          userHp: member.userHp.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'),
        }));

        this.totalMemberCount = this.regularMembers.length + this.nonRegularMembers.length;
      } catch (error) {
        if (!this.handle401Error(error)) {
          console.error('Error fetching data:', error);
        }

        const { code } = error.response?.data || {};
        if (code === 'PFL-208') {
          alert('유효하지 않은 회원 종류입니다.');
        }
      }
    },
    async changeTab(tab) {
      this.currentTab = tab;
      this.editingIndex = -1;
      this.editingMember = null;
    },
    async sheetDownload() {
      this.isLoading = true;
      try {
        const accessToken = store.state.accessToken;
        const clubUUID = store.state.clubUUID;
        const response = await axios.get(`${store.state.apiBaseUrl}/club-leader/${clubUUID}/members/export`, {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const blob = new Blob([response.data], {
          type: 'application/vnd.ms-excel'
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${this.ExelFileName}.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        if (!this.handle401Error(error)) {
          console.error('Fetch error:', error);
        }
      } finally {
        this.isLoading = false;
      }
    },
    validateInput() {
      this.validationErrors.userName = !this.editingMember.userName || !/^[가-힣a-zA-Z\s]+$/.test(this.editingMember.userName.trim());
      this.validationErrors.studentNumber = !this.editingMember.studentNumber || !/^\d{8}$/.test(this.editingMember.studentNumber.trim());
      this.validationErrors.major = !this.editingMember.major;
      const phoneNumber = this.editingMember.userHp.replace(/[^0-9]/g, '');
      this.validationErrors.userHp = !phoneNumber || phoneNumber.length !== 11;
      return !Object.values(this.validationErrors).some((error) => error);
    },
  },
};
</script>

<style>
/* ========== Global & Container ========== */
*,
*::before,
*::after {
  box-sizing: border-box;
}

:root {
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

.total {
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
.ClubInfo {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: clamp(12px, 3vw, 30px);
  background: var(--card);
  border-radius: var(--radius);
  padding: clamp(12px, 2vw, 20px);
  flex-shrink: 0;
}

.clublogo {
  width: clamp(120px, 25vw, 300px);
  height: clamp(90px, 19vw, 225px);
  object-fit: cover;
  border-radius: var(--radius);
  flex-shrink: 0;
}

.Info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  min-width: 0;
  gap: clamp(4px, 0.8vw, 8px);
}

.info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: clamp(4px, 1vw, 8px);
  margin-bottom: clamp(4px, 0.8vw, 8px);
}

.clubname {
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
.name {
  font-size: clamp(12px, 1.8vw, 16px);
  line-height: 1.2;
  margin: 0 clamp(4px, 0.8vw, 8px);
}

.clubleader {
  color: var(--text-3);
}

.detail {
  color: var(--text-2);
}

.room {
  color: var(--text-2);
}

.name {
  color: #353549;
  font-weight: 600;
}

.phone,
.insta,
.map,
.category {
  width: clamp(14px, 2vw, 16px);
  height: clamp(14px, 2vw, 16px);
  margin-right: clamp(4px, 0.8vw, 7px);
  background-size: contain;
  flex-shrink: 0;
}

.phone {
  background: url('../../assets/phone.svg') no-repeat center center;
}

.insta {
  background: url('../../assets/insta.svg') no-repeat center center;
}

.map {
  background: url('../../assets/map.svg') no-repeat center center;
}

.category {
  background: url('../../assets/category-dash.svg') no-repeat center center;
}

.line1 {
  width: 1px;
  height: clamp(10px, 1.5vw, 12px);
  background: #DBDBDB;
  margin-bottom: 4px;
  flex-shrink: 0;
}

.line2 {
  width: 1.5px;
  height: clamp(12px, 1.8vw, 14px);
  background: #666;
  margin: 9px 5px 0;
  flex-shrink: 0;
}

.phoneNum,
.clubroom,
.instaName {
  display: flex;
  align-items: center;
  gap: clamp(4px, 0.8vw, 7px);
  min-height: clamp(24px, 3vw, 30px);
  flex-wrap: wrap;
}

.instaName a {
  font-size: clamp(12px, 1.8vw, 16px);
  line-height: 1.2;
  margin: 0;
  text-decoration: underline;
}

.hashtags {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(4px, 1vw, 8px);
  margin-top: clamp(4px, 1vw, 8px);
}

.hashtag {
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
.Dashboardhead {
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

.Dashboardhead>div {
  flex: 1;
  min-width: 150px;
}

.Dashboardhead .p1 {
  font-size: clamp(14px, 2vw, 18px);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.05em;
  text-align: left;
  margin: 0 0 4px 0;
}

.Dashboardhead .p2 {
  font-size: clamp(11px, 1.5vw, 12px);
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: -0.05em;
  margin: 0;
}

.spreadsheets {
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

.spreadsheets:hover {
  background: var(--brand-2);
}

.spreadsheets p {
  font-size: clamp(12px, 1.8vw, 16px);
  font-weight: 600;
  letter-spacing: -0.05em;
  color: #fff;
  margin: 0;
}

.spreadsheets svg {
  width: clamp(14px, 2vw, 16px);
  height: clamp(14px, 2vw, 16px);
  fill: none;
  stroke: #545454;
}

.loading-icon {
  width: clamp(14px, 2vw, 16px);
  height: clamp(14px, 2vw, 16px);
  border: 2px solid #f3f3f3;
  border-top: 2px solid var(--brand);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ========== Tab ========== */
.tab-menu {
  display: inline-flex;
  padding: 0 var(--space-2);
  background: var(--card);
  border-bottom: 1px solid #eee;
  border-radius: 8px 8px 0 0;
  gap: 2px;
  flex-shrink: 0;
}

.tab-button {
  padding: clamp(8px, 1.5vw, 12px) clamp(12px, 2vw, 18px);
  border: none;
  background: none;
  cursor: pointer;
  font-size: clamp(12px, 1.8vw, 14px);
  color: #666;
  position: relative;
  white-space: nowrap;
}

.tab-button.active {
  color: #000;
  font-weight: 600;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #000;
}

.tab-button:hover {
  color: #232323;
}

/* ========== Dashboard (List) ========== */
.Dashboard {
  width: 100%;
  background: var(--card);
  border-radius: 0 8px 8px 8px;
  text-align: center;
  padding: clamp(12px, 2vw, 16px) clamp(8px, 1.5vw, 12px) clamp(16px, 2.5vw, 20px);
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.member-list {
  width: 100%;
}

.member-list ul {
  width: 100%;
  padding-left: 0;
  list-style: none;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 1.5vw, 13px);
}

.member-item-li {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.member-item-display {
  display: grid;
  grid-template-columns: repeat(4, 1fr) auto;
  align-items: center;
  gap: 15px;
  padding: 10px 15px;
  background: var(--muted);
  border-radius: 10px;
}

.member-info-text {
  font-size: 14px;
  text-align: center;
  word-break: break-all;
}

.member-item-edit {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: var(--muted);
  border-radius: 10px;
}

.edit-form-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--card);
  border: 1px solid var(--accent);
  border-radius: 8px;
  padding: 10px;
}

.input-row-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-row {
  display: flex;
  gap: 10px;
  width: 100%;
}

.edit-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
}

.edit-select {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
}

.save-btn {
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  width: 100px;
  height: 100px;
  padding: 0;
  margin: 0;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
}

.save-btn:hover {
  background: var(--accent-2);
}

.error-messages-container {
  width: 100%;
  margin-top: 10px;
  padding-left: 15px;
}

.error-list {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.error-item {
  font-size: 13px;
  color: red;
  line-height: 1.5;
}

.error-item::before {
  content: '* ';
  color: red;
}

.edit-btn {
  background: var(--accent);
  border: none;
  border-radius: 5px;
  color: #fff;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
}

.edit-btn:hover {
  background: var(--accent-2);
}

.transparent-box {
  width: 50px;
  height: 30px;
  opacity: 0;
}

/* ========== Responsive Breakpoints ========== */

/* 데스크탑 뷰 */
@media (min-width: 769px) {
  .member-item-li {
    width: 100%;
  }

  .member-item-display {
    grid-template-columns: 1.2fr 0.9fr 1.6fr 1fr auto;
    align-items: center;
    gap: 15px;
    padding: 10px 15px;
    background: var(--muted);
    border-radius: 10px;
  }
  
  .member-info-text {
    text-align: center;
  }

  .member-item-edit {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: flex-start;
    gap: 10px;
    padding: 10px;
    background: var(--muted);
    border: none;
    border-radius: 10px;
  }
  
  .edit-form-box {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid var(--accent);
  }

  .input-row-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .input-row {
    display: flex;
    flex-wrap: nowrap;
    gap: 10px;
  }
  
  .edit-input, .edit-select {
    width: 100%;
  }
  
  .save-btn {
    align-self: center;
    width: 100px;
    height: 100px;
    padding: 0;
    margin: 0;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .error-messages-container {
    grid-column: 1 / -1;
    margin-top: 5px;
  }
  
  .edit-btn {
    align-self: center;
    justify-self: end;
  }
}

/* 모바일 뷰 (768px 이하) */
@media (max-width: 768px) {
  .total {
    padding: clamp(8px, 1.5vw, 12px);
    gap: clamp(8px, 1.5vw, 12px);
  }

  .Dashboardhead {
    flex-direction: column;
    align-items: stretch;
  }

  .Dashboardhead > div {
    min-width: 100%;
  }

  .spreadsheets {
    width: 100%;
    min-width: unset;
  }

  .member-item-li {
    width: 100%;
    padding: 10px;
    background-color: var(--muted);
    border-radius: 10px;
  }

  .member-item-display {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    padding: 0;
    background: none;
    border: none;
  }

  .member-info-text {
    text-align: left;
  }
  
  .edit-btn {
    width: 100%;
    margin-top: 10px;
  }

  .member-item-edit {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
    padding: 0;
  }

  .edit-form-box {
    border-width: 1px;
    padding: 15px;
  }
  
  .input-row {
    flex-direction: column;
  }
  
  .edit-input, .edit-select {
    width: 100%;
  }

  .save-btn {
    width: 100%;
    height: 38px;
    max-width: none;
    margin-top: 10px;
  }
  
  .error-messages-container {
    margin-top: 10px;
    text-align: left;
  }
}
</style>