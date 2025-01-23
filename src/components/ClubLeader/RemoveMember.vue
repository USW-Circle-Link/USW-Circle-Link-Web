<template>
  <div>
    <h2 class="title">회원 퇴출하기</h2>
    <div id="RemoveMemberDashboard" class="RemoveMemberDashboard">
      <div class="member-list">
        <ul>
          <li v-for="(member, index) in formattedClubMembers" :key="member.clubMemberId" class="member-item">
            <label class="custom-checkbox">
              <input
                  type="checkbox"
                  :checked="selectedMembers.includes(member)"
                  @change="toggleMemberSelection(member)"
                  class="hidden-checkbox"
              >
              <span class="checkbox-mark"></span>
            </label>
            <span>{{ member.userName }}</span>
            <span>{{ member.studentNumber }}</span>
            <span>{{ member.major }}</span>
            <span>{{ member.userHp }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 퇴출 섹션 헤더 -->
    <div class="expulsion-header">
      <span class="selected-count">퇴출 선택 인원 <span class="selected-count-bold">총 {{ selectedMembers.length }}명</span></span>
      <button
          @click="showExpulsionPopup = true"
          class="expulsion-button"
          :disabled="!selectedMembers.length"
      >
        퇴출하기
      </button>
    </div>
    <!-- 퇴출 선택 인원 -->
    <div class="expulsion-section">
      <div class="expulsion-list">
        <ul>
          <li v-for="(member, index) in selectedMembers" :key="member.clubMemberId" class="member-item">
            <span>{{ member.userName }}</span>
            <span>{{ member.studentNumber }}</span>
            <span>{{ member.major }}</span>
            <span>{{ member.userHp }}</span>
          </li>
        </ul>
      </div>
    </div>


    <div class="custom-popup1" v-if="showExpulsionPopup">
      <div class="popup-content1">
        <div class="popup-header1">
          <p class="popup-title1">동아리 회원 퇴출</p>
        </div>
        <div class="popup-separator1"></div>
        <div class="popup-body1">
          <p class="popup-message1"> <span class="red-text1">총 {{ selectedMembers.length }}명</span>입니다.</p>
          <p class="popup-message1">해당 동아리원들을 퇴출하시겠습니까?</p>
          <p class="popup-warning1">퇴출 후 되돌릴 수 없으니 신중하게 선택해 주세요.</p>
        </div>
        <button @click="showExpulsionPopup = false" class="cancel-button">취소</button>
        <button @click="expelMember" class="expel-button">확인</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import store from '../../store/store';

export default {
  name: 'RemoveMemberDashboard',
  data() {
    return {
      clubMembers: [],
      showExpulsionPopup: false,
      memberToExpel: null,
      selectedMembers: [],
    }
  },
  computed: {
    formattedClubMembers() {
      return this.clubMembers.map(member => {
        return {
          ...member,
          userHp: member.userHp.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
        };
      });
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const accessToken = store.state.accessToken;
      const clubId = store.state.clubId;
      console.log(clubId + '클럽 ID');
      console.log('Page has been loaded!');
      try {
        const response = await axios.get(`http://15.164.246.244:8080/club-leader/${clubId}/members?page=0&size=500`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        const responseData = response.data;
        this.message = responseData.message;
        this.clubMembers = response.data.data.content;

        if (this.clubMembers.length === 0) {
          this.clubMembers = [
            {
              clubMemberId: 1,
              userName: 'John Doe',
              studentNumber: '20210001',
              major: 'Computer Science',
              userHp: '010-1234-5678'
            },
            {
              clubMemberId: 2,
              userName: 'Jane Smith',
              studentNumber: '20210002',
              major: 'Mechanical Engineering',
              userHp: '010-8765-4321'
            },
            {
              clubMemberId: 3,
              userName: 'John Doe',
              studentNumber: '20210001',
              major: 'Computer Science',
              userHp: '010-1234-5678'
            },
            {
              clubMemberId: 4,
              userName: 'Jane Smith',
              studentNumber: '20210002',
              major: 'Mechanical Engineering',
              userHp: '010-8765-4321'
            },
            {
              clubMemberId: 5,
              userName: 'John Doe',
              studentNumber: '20210001',
              major: 'Computer Science',
              userHp: '010-1234-5678'
            },
            {
              clubMemberId: 6,
              userName: 'Jane Smith',
              studentNumber: '20210002',
              major: 'Mechanical Engineering',
              userHp: '010-8765-4321'
            },
            {
              clubMemberId: 7,
              userName: 'John Doe',
              studentNumber: '20210001',
              major: 'Computer Science',
              userHp: '010-1234-5678'
            },
            {
              clubMemberId: 8,
              userName: 'Jane Smith',
              studentNumber: '20210002',
              major: 'Mechanical Engineering',
              userHp: '010-8765-4321'
            },
            {
              clubMemberId: 9,
              userName: 'John Doe',
              studentNumber: '20210001',
              major: 'Computer Science',
              userHp: '010-1234-5678'
            },
            {
              clubMemberId: 10,
              userName: 'Jane Smith',
              studentNumber: '20210002',
              major: 'Mechanical Engineering',
              userHp: '010-8765-4321'
            },
          ];
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    toggleMemberSelection(member) {
      const index = this.selectedMembers.findIndex(m => m.clubMemberId === member.clubMemberId);
      if (index === -1) {
        this.selectedMembers.push(member);
      } else {
        this.selectedMembers.splice(index, 1);
      }
    },
    removeMember(index) {
      this.memberToExpel = index;
      this.showExpulsionPopup = true;
    },
    async expelMember() {
      const accessToken = store.state.accessToken;
      const clubId = store.state.clubId;

      try {
        // 선택된 모든 회원에 대해 퇴출 요청 보내기
        await Promise.all(
            this.selectedMembers.map(member =>
                axios.delete(`http://15.164.246.244:8080/club-leader/${clubId}/members/${member.clubMemberId}`, {
                  headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                  }
                })
            )
        );

        // 퇴출된 회원들을 목록에서 제거
        this.clubMembers = this.clubMembers.filter(
            member => !this.selectedMembers.some(selected => selected.clubMemberId === member.clubMemberId)
        );
        this.selectedMembers = [];
        this.showExpulsionPopup = false;
      } catch (error) {
        console.error('Error expelling members:', error);
      }
    }
  }
};
</script>

<style>
.title {
  font-size: 20px;
  font-weight: 600;
}

.RemoveMemberDashboard {
  width: 886px;
  background: #fff;
  border-radius: 8px;
  align-items: center;
  align-content: flex-start;
  text-align: center;
  height: 450px;
  overflow-y: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 20px auto 0 auto;
}

.member-list ul {
  width: 858px;
  padding-left: 15px;
  list-style: none;
}

.member-item {
  display: flex;
  justify-content: space-between;
  align-items: center; /* 수직 중앙 정렬 */
  padding: 10px 25px;
  background-color: #F0F2F5;
  border-radius: 10px;
  margin-bottom: 10px;
  height: 32px;
}

.member-item span {
  flex: 1;
  text-align: center;
}

.custom-checkbox {
  position: relative;
  display: inline-flex; /* flex로 변경하여 정렬 개선 */
  align-items: center; /* 수직 중앙 정렬 */
  width: 18px; /* 크기 감소 */
  height: 18px; /* 크기 감소 */
  margin-right: 15px;
  cursor: pointer;
}

.hidden-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkbox-mark {
  position: absolute;
  top: 0;
  left: 0;
  width: 15px;
  height: 15px;
  background-color: white;
  border: 2px solid #767676;
  border-radius: 4px;
}

/* 체크되지 않은 상태 호버 효과 */
.custom-checkbox:hover .checkbox-mark {
  border-color: #999;
}

/* 체크된 상태 */
.hidden-checkbox:checked + .checkbox-mark {
  background-color: #FFB052;
  border-color: #FFB052;
}

/* 체크 마크 */
.checkbox-mark:after {
  content: "";
  position: absolute;
  display: none;
  left: 3.4px; /* 위치 조정 */
  bottom: 3.5px;
  width: 6px; /* 너비 증가 */
  height: 10px;
  border: solid white;
  border-width: 0 2.5px 2.5px 0; /* 테두리 두께 증가 */
  transform: rotate(45deg);
}

/* 체크된 상태일 때 체크 마크 표시 */
.hidden-checkbox:checked + .checkbox-mark:after {
  display: block;
}

.expulsion-header {
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin: 40px 0 0px 0;
  padding: 0;
  width: 886px;
}

.selected-count {
  font-weight: 500;
  margin-right: 10px; /* Adjust the margin as needed */
}

.selected-count-bold {
  font-weight: 300;
  margin-left: 5px; /* Adjust the margin as needed */
}

.expulsion-section {
  margin-top: 13px;
  width: 886px;
  background: #fff;
  border-radius: 8px;
  position: relative;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
  margin-bottom: 10px;
}

.expulsion-list {
  height: 200px;
  overflow-y: auto;
}

.expulsion-list ul {
  list-style: none;
  padding-left: 15px;
  width: 858px;
}

.expulsion-button {
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 6px 18px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
}

.expulsion-button:hover {
  background-color: #e55a5a; /* Darker shade of the original color */
}

.expulsion-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.custom-popup1 {
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

.popup-content1 {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  width: 420px;
  height: 152px;
  text-align: left;
  position: relative;
}

.popup-header1 {
  margin-bottom: 10px;
}

.popup-title1 {
  font-size: 18px;
  font-weight: bold;
  color: black;
  margin: 0;
}

.popup-separator1 {
  border-bottom: 1px solid #d3d3d3;
  margin: 10px 0;
}

.popup-body1 {
  margin-bottom: 0px;
  margin-top: 22px;
}

.popup-message1 {
  font-size: 15px;
  color: #333333;
  margin: 2px 0;
}

.red-text1 {
  color: #FF5C5C;
  font-weight: 600;
}

.popup-warning1 {
  font-size: 12px;
  color: #FF5C5C;
  margin: 4px 0;
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
  line-height: 20px;
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
  line-height: 20px;
}

.expel-button:hover {
  background-color: #e6953e;
}

.cancel-button:hover {
  background-color: #999999;
}
</style>