<template>
  <div class="agree-overlay">
    <div class="agree-popup">
      <h2>동구라미 이용 약관 동의</h2>

      <div class="agree-items">
        <div class="agree-item">
          <div class="checkbox-wrapper">
            <input
                type="checkbox"
                id="age-check"
                v-model="agreements.isAdult"
            >
            <label for="age-check">만 14세 이상입니다. <span class="required">* 필수</span></label>
          </div>
          <div class="terms-container1">
            <p class="description">동구라미는 수원대학교 학생을 위한 서비스이며, 만 14세 이상만 가입할 수 있습니다.</p>
          </div>
        </div>

        <div class="agree-item">
          <div class="checkbox-wrapper">
            <input
                type="checkbox"
                id="usage-check"
                v-model="agreements.usage"
            >
            <label for="usage-check">이용 약관을 확인하였습니다. <span class="required">* 필수</span></label>
          </div>
          <div class="terms-container">
            <FATOU />
          </div>
        </div>

        <div class="agree-item">
          <div class="checkbox-wrapper">
            <input
                type="checkbox"
                id="privacy-check"
                v-model="agreements.privacy"
            >
            <label for="privacy-check">개인정보 수집에 동의합니다. <span class="required">* 필수</span></label>
          </div>
          <div class="terms-container">
            <UseAgree />
          </div>
        </div>
      </div>

      <button
          class="confirm-button"
          :disabled="!allAgreed"
          @click="confirmAgreements"
      >
        확인
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import UseAgree from "@/components/ClubLeader/policy/UseAgree.vue";
import FATOU from "@/components/ClubLeader/policy/FA-TOU.vue";
import store from "@/store/store";

export default {
  name: 'FirstAgree',
  components: {
    FATOU,
    UseAgree,
  },
  data() {
    return {
      showPopup: true,
      agreements: {
        isAdult: false,
        usage: false,
        privacy: false
      }
    }
  },
  computed: {
    allAgreed() {
      return this.agreements.isAdult &&
          this.agreements.usage &&
          this.agreements.privacy;
    }
  },
  methods: {
    async confirmAgreements() {
      try {
        const accessToken = this.$store.state.accessToken;

        await axios.patch(`${store.state.apiBaseUrl}/club-leader/terms/agreement`,
            { },
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            }
        );

        // Vuex store 업데이트
        this.$store.commit('setIsAgreedTerms', true);

        // 팝업 닫기
        this.showPopup = false;


        this.$emit('agreement-confirmed');

      } catch (error) {
        console.error('동의 중 오류:', error);
        alert('약관 동의 처리 중 오류가 발생했습니다.');
      }
    }
  }
}
</script>

<style scoped>
.agree-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.agree-popup {
  background: white;
  width: 600px;
  padding: 30px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 20px;
  margin-bottom: 20px;
  text-align: left;
}

.agree-items {
  margin-bottom: 20px;
}

.agree-item {
  margin-bottom: 35px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

input[type="checkbox"] {
  margin: 0;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

label {
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0;
}

.required {
  color: #FF0000;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
}

.description {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
  padding-left: 24px;
}

.terms-container {
  height: 120px;
  overflow-y: auto;
  overflow-x: hidden;
  border: 1px solid #B0B0B0;
  padding: 10px;
  border-radius: 4px;
}

.terms-container1 {
  height: 25px;
  border: 1px solid #B0B0B0;
  border-radius: 4px;
}

.terms-container * {
  max-width: 100%;
}

.terms-text {
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
  font-size: 14px;
  margin-top: 4px;
}

.confirm-button {
  width: 124px;
  height: 40px;
  padding: 0; /* 패딩 제거 */
  background-color: #FFB052;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-left: auto;
  display: flex; /* block에서 flex로 변경 */
  justify-content: center; /* 수평 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
}

.confirm-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.confirm-button:hover:not(:disabled) {
  background-color: #f49421;
}
</style>