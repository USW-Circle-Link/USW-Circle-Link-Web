<template>
  <div>
    <h2 class="title">회원 퇴출하기</h2>
    <div id="RemoveMemberDashboard" class="RemoveMemberDashboard">
      <div class="member-list">
        <ul>
          <li
            v-for="member in formattedClubMembers"
            :key="member.clubMemberUUID"
            class="member-item"
          >
            <label class="custom-checkbox">
              <input
                type="checkbox"
                :checked="selectedMembers.includes(member)"
                @change="toggleMemberSelection(member)"
                class="hidden-checkbox"
              />
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
      <span class="selected-count"
        >퇴출 선택 인원
        <span class="selected-count-bold"
          >총 {{ selectedMembers.length }}명</span
        ></span
      >
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
          <li
            v-for="member in selectedMembers"
            :key="member.clubMemberUUID"
            class="member-item"
          >
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
          <p class="popup-message1">
            <span class="red-text1">총 {{ selectedMembers.length }}명</span
            >입니다.
          </p>
          <p class="popup-message1">해당 동아리원들을 퇴출하시겠습니까?</p>
          <p class="popup-warning1">
            퇴출 후 되돌릴 수 없으니 신중하게 선택해 주세요.
          </p>
        </div>
        <button @click="showExpulsionPopup = false" class="cancel-button">
          취소
        </button>
        <button @click="expelMember" class="expel-button">확인</button>
      </div>
    </div>
  </div>
  <Popup401 v-if="show401Popup" />
</template>

<script>
import axios from 'axios';
import store from '../../store/store';
import Popup401 from './401Popup.vue';

export default {
  name: 'RemoveMemberDashboard',
  components: {
    Popup401,
  },
  data() {
    return {
      clubMembers: [],
      showExpulsionPopup: false,
      selectedMembers: [],
      show401Popup: false, // 401 팝업 상태 추가
    };
  },
  computed: {
    formattedClubMembers() {
      if (!this.clubMembers) return [];
      return this.clubMembers.map((member) => {
        return {
          ...member,
          userHp: member.userHp.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'),
        };
      });
    },
  },
  mounted() {
    this.fetchData();
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
    async fetchData() {
      const accessToken = store.state.accessToken;
      const clubUUID = store.state.clubUUID;

      try {
        const response = await axios.get(
          `${store.state.apiBaseUrl}/club-leader/${clubUUID}/members?=null`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        this.clubMembers = response.data.data;
      } catch (error) {
        if (!this.handle401Error(error)) {
          console.error('동아리 정보를 불러오는데 실패했습니다.', error);
          alert('동아리 정보를 불러오는데 실패했습니다.');
        }
      }
    },

    toggleMemberSelection(member) {
      const index = this.selectedMembers.findIndex(
        (m) => m.clubMemberUUID === member.clubMemberUUID
      );
      if (index === -1) {
        this.selectedMembers.push(member);
      } else {
        this.selectedMembers.splice(index, 1);
      }
    },

    async expelMember() {
      const accessToken = store.state.accessToken;
      const clubUUID = store.state.clubUUID;

      try {
        // 선택된 회원들의 clubMemberUUID 추출하여 요청 데이터 생성
        const expelData = this.selectedMembers.map((member) => ({
          clubMemberUUID: member.clubMemberUUID,
        }));

        // DELETE 요청 보내기
        await axios.delete(
          `${store.state.apiBaseUrl}/club-leader/${clubUUID}/members`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            data: expelData, // DELETE 요청의 body에 데이터 포함
          }
        );

        // 퇴출된 회원들을 목록에서 제거
        this.clubMembers = this.clubMembers.filter(
          (member) =>
            !this.selectedMembers.some(
              (selected) => selected.clubMemberUUID === member.clubMemberUUID
            )
        );

        // 선택된 회원 목록 초기화 및 팝업 닫기
        this.selectedMembers = [];
        this.showExpulsionPopup = false;
      } catch (error) {
        if (!this.handle401Error(error)) {
          console.error('동아리 정보를 불러오는데 실패했습니다.', error);
          alert('동아리 정보를 불러오는데 실패했습니다.');
        }
      }
    },
  },
};
</script>

<style>


/* ===== 공통 컨테이너: 고정폭 제거, 유동폭 적용 ===== */
/* 전체 페이지 컨테이너 */
.content {
  flex: 1;
  min-width: 0;
  padding: 0 16px; /* ← 좌우 동일 여백 */
  box-sizing: border-box;
}
.title,
.RemoveMemberDashboard,
.expulsion-header,
.expulsion-section {
  max-width: 1200px;           /* 늘릴 수 있는 최대폭 */
  width: min(100%, 1200px);    /* 화면에 맞게 넓이 채우기 */
  margin: 0 auto;
  box-sizing: border-box;
}
.title { font-size:20px; font-weight:600; padding: 0 16px; }

/* 카드(회원 목록) */
.RemoveMemberDashboard {
  background:#fff;
  border-radius: 12px;
  text-align:center;
  height: 450px;
  overflow-y:auto;
  box-shadow: 0 0 10px rgba(0,0,0,.1);
  margin: 20px auto 0;
  padding: 8px 12px;
}

/* ul 폭 고정 제거 -> 부모에 맞춰 늘어남 */
.member-list ul,
.expulsion-list ul {
  list-style:none;
  padding:0;
  margin:0;
  width: 100%;
}

/* 리스트 아이템을 그리드로(칼럼은 넓이에 따라 자동 적응) */
.member-item {
  display:grid;
  grid-template-columns: auto 1.2fr 0.9fr 1fr 1fr; /* 체크 + 이름 + 학번 + 전공 + 연락처 */
  align-items:center;
  gap:10px;
  padding:10px 14px;
  background:#f0f2f5;
  border-radius:10px;
  margin:10px 0;
  min-height:42px;
  box-sizing:border-box;
}
.member-item span {
  text-align:left;
  font-size:14px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}

/* 선택 인원 헤더 */
.expulsion-header {
  display:flex;
  justify-content:space-between;
  align-items:flex-end;
  padding: 0 16px;
  margin: 24px auto 0;
}
.selected-count { font-weight:500; font-size:14px; }
.selected-count-bold { font-weight:600; margin-left:6px; }

.expulsion-section {
  margin: 12px auto 10px;
  background:#fff;
  border-radius:12px;
  box-shadow:0 0 4px rgba(0,0,0,.25);
  padding: 8px 12px;
}
.expulsion-list { height:200px; overflow-y:auto; }

/* 퇴출 목록(체크박스 없음) */
.expulsion-list .member-item {
  grid-template-columns: 1.2fr 0.9fr 1fr 1fr;
}

/* 체크박스 */
.custom-checkbox{position:relative;display:inline-flex;align-items:center;width:18px;height:18px;cursor:pointer;}
.hidden-checkbox{position:absolute;opacity:0;cursor:pointer;}
.checkbox-mark{position:absolute;top:0;left:0;width:18px;height:18px;background:#fff;border:2px solid #767676;border-radius:4px;}
.custom-checkbox:hover .checkbox-mark{border-color:#999;}
.hidden-checkbox:checked + .checkbox-mark{background:#ffb052;border-color:#ffb052;}
.checkbox-mark:after{content:'';position:absolute;display:none;left:5px;bottom:3px;width:6px;height:10px;border:solid #fff;border-width:0 2px 2px 0;transform:rotate(45deg);}
.hidden-checkbox:checked + .checkbox-mark:after{display:block;}

.expulsion-button{background:#ff6b6b;color:#fff;border:none;padding:8px 18px;border-radius:8px;cursor:pointer;font-size:14px;}
.expulsion-button:hover{background:#e55a5a;}
.expulsion-button:disabled{background:#ccc;cursor:not-allowed;}

.custom-popup1{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;justify-content:center;align-items:center;z-index:999;padding:16px;box-sizing:border-box;}
.popup-content1{background:#fff;padding:20px;border-radius:12px;box-shadow:0 0 20px rgba(0,0,0,.2);width:min(520px,100%);max-width:520px;text-align:left;position:relative;box-sizing:border-box;}
.popup-header1{margin-bottom:8px;}
.popup-title1{font-size:18px;font-weight:700;margin:0;color:#000;}
.popup-separator1{border-bottom:1px solid #d3d3d3;margin:10px 0;}
.popup-body1{margin:18px 0 28px;}
.popup-message1{font-size:15px;color:#333;margin:4px 0;}
.red-text1{color:#ff5c5c;font-weight:700;}
.popup-warning1{font-size:12px;color:#ff5c5c;margin:6px 0 0;}
.expel-button,.cancel-button{border:none;color:#fff;cursor:pointer;padding:8px 22px;border-radius:8px;font-size:15px;}
.expel-button{background:#ffb052;position:absolute;bottom:16px;right:16px;}
.cancel-button{background:#ccc;position:absolute;bottom:16px;right:112px;}
.expel-button:hover{background:#e6953e;}
.cancel-button:hover{background:#999;}

/* ===== 반응형 ===== */
@media (max-width: 992px){
  .member-item{grid-template-columns:auto 1.4fr 0.8fr 0.9fr 1fr;}
  .expulsion-list .member-item{grid-template-columns:1.4fr 0.8fr 0.9fr 1fr;}
}
@media (max-width: 768px){
  .expulsion-header{flex-direction:column;align-items:flex-start;gap:10px;}
  .member-item{
    grid-template-columns:auto 1fr 1fr;
    grid-template-areas:
      "check name phone"
      "check student major";
    row-gap:6px;
  }
  .member-item .custom-checkbox{grid-area:check;align-self:flex-start;margin-top:2px;}
  .member-item span:nth-of-type(1){grid-area:name;}
  .member-item span:nth-of-type(2){grid-area:student;}
  .member-item span:nth-of-type(3){grid-area:major;}
  .member-item span:nth-of-type(4){grid-area:phone;justify-self:end;text-align:right;}

  .expulsion-list .member-item{
    grid-template-columns:1fr 1fr;
    grid-template-areas:
      "name phone"
      "student major";
  }
  .expulsion-list .member-item span:nth-of-type(1){grid-area:name;}
  .expulsion-list .member-item span:nth-of-type(2){grid-area:student;}
  .expulsion-list .member-item span:nth-of-type(3){grid-area:major;}
  .expulsion-list .member-item span:nth-of-type(4){grid-area:phone;text-align:right;}
}
@media (max-width: 560px){
  .member-item{
    grid-template-columns:auto 1fr;
    grid-template-areas:
      "check name"
      "check phone"
      "check student"
      "check major";
  }
  .expulsion-list .member-item{
    grid-template-columns:1fr;
    grid-template-areas:
      "name"
      "phone"
      "student"
      "major";
  }
  .expulsion-button{width:100%;}
}
@media (max-width: 400px){
  .RemoveMemberDashboard{padding:8px;}
  .member-item{padding:8px 10px;}
  .member-item span{font-size:13px;}
  .popup-content1{width:100%;padding:16px;}
  .expel-button,.cancel-button{padding:8px 16px;font-size:14px;}
}

</style>
