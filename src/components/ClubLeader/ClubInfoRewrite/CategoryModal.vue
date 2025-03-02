<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <div class="modal-header-wrapper">
          <div class="header-content">
            <div class="title-wrapper">
              <h3>카테고리 설정하기</h3>
              <span class="sub-text">최대 3개까지 선택해주세요.</span>
            </div>
          </div>
          <button class="close-button" @click="close">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <g clip-path="url(#clip0_4722_18717)">
                <path d="M17.3588 0.643066L0.644531 17.3574M0.644531 0.643066L17.3588 17.3574" stroke="#969696" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
              <defs>
                <clipPath id="clip0_4722_18717">
                  <rect width="18" height="18" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
      </div>

      <div class="divider"></div>

      <div class="modal-body">
        <div class="category-container">
          <div v-if="loading" class="loading-message">
            카테고리를 불러오는 중입니다...
          </div>
          <div v-else-if="error" class="error-message">
            카테고리를 불러오는데 실패했습니다. 다시 시도해주세요.
          </div>
          <div v-else class="category-grid">
            <button
                v-for="category in categories"
                :key="category.clubCategoryId"
                :class="['category-button', {
        active: isSelectedCategory(category)
      }]"
                @click="toggleCategory(category)"
                :disabled="isMaxSelected && !isSelectedCategory(category)"
            >
              {{ category.clubCategoryName }}
            </button>
          </div>
          <div class="selected-info">
            선택된 카테고리: {{ selectedCategories.length }}/3
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="select-button" @click="selectCategories">추가하기</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import store from '@/store/store';

export default {
  name: 'CategoryModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    currentSelected: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      categories: [],
      selectedCategories: [],
      loading: false,
      error: null
    };
  },
  computed: {
    isMaxSelected() {
      return this.selectedCategories.length >= 3;
    }
  },
  methods: {
    async fetchCategories() {
      this.loading = true;
      this.error = null;
      try {
        const accessToken = store.state.accessToken;
        const response = await axios.get('https://api.donggurami.net/club-leader/category', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }
        });
        this.categories = response.data.data;
      } catch (error) {
        console.error('카테고리 조회 실패:', error);
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    // 현재 카테고리가 선택된 상태인지 확인하는 메서드 추가
    isSelectedCategory(category) {
      return this.currentSelected.some(
          selected => selected.clubCategoryName === category.clubCategoryName
      );
    },

    toggleCategory(category) {
      const index = this.currentSelected.findIndex(
          selected => selected.clubCategoryName === category.clubCategoryName
      );

      const updatedCategories = [...this.currentSelected];

      if (index === -1 && updatedCategories.length < 3) {
        // 선택되지 않은 상태이고 3개 미만일 때 추가
        updatedCategories.push({
          clubCategoryName: category.clubCategoryName,
          clubCategoryId: category.clubCategoryId
        });
      } else if (index !== -1) {
        // 이미 선택된 상태면 제거
        updatedCategories.splice(index, 1);
      }

      // 변경된 선택 상태를 부모 컴포넌트로 전달
      this.$emit('select', updatedCategories);
    },

    selectCategories() {
      this.$emit('select', this.selectedCategories);
      this.close();
    },
    close() {
      this.$emit('close');
    }
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.fetchCategories();
        // 기존 선택값 유지
        this.selectedCategories = [...this.currentSelected];
      }
    },
    currentSelected: {
      immediate: true,
      handler(newVal) {
        this.selectedCategories = [...newVal];
      }
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.category-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.modal-content {
  display: flex;
  flex-direction: column;
  background: #FFF;
  border-radius: 32px;
  width: 607px;
  height: 325px;
  max-width: 90vw;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 20px 40px 20px 40px;
}

.modal-header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  height: 24px;
}

.title-wrapper {
  margin-right: auto;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 100%;
}


.header-content {
  display: flex;
  align-items: flex-start;  /* flex-end에서 flex-start로 변경 */
  gap: 8px;
}

.header-content h3 {
  color: #575757;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: -0.4px;
  margin: 0;
  line-height: 1;
}

.sub-text {
  color: #FFB052;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: -0.325px;
  line-height: 1;
  margin-bottom: -1px;
}

.divider {
  height: 1px;
  background-color: #B7B7B7;
  width: 87%;
  margin: 0 auto;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.modal-body {
  flex: 1;
  padding: 20px 40px;
  overflow-y: auto;
}

.category-grid {
  display: flex;
  flex-wrap: wrap; /* 넘칠 경우 자동 줄바꿈 */
  gap: 8px;
  justify-content: flex-start; /* 왼쪽 정렬 */
  align-items: center;
  max-width: 100%; /* 부모 요소 안에서만 배치 */
}

.selected-info {
  margin-top: 16px;
  color: #5A5A5A;
  text-align: right;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.category-button {
  padding: 8px 10px;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  color: #5A5A5A;
  min-height: 35px;
  min-width: 68px;
  max-width: 160px; /* 최대 너비 설정 */
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center; /* 텍스트 중앙 정렬 */
  word-wrap: break-word; /* 단어가 길 경우 줄바꿈 */
  white-space: normal; /* 여러 줄 허용 */
  overflow-wrap: break-word; /* 긴 단어 줄바꿈 */
}


.category-button.active {
  border-color: #FFA000;
  color: #000;
  background-color: #FFF3E0;
}

.category-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.modal-footer {
  padding: 20px 40px;
  text-align: right;
}

.select-button {
  width: 124px;
  height: 40px;
  padding: 8px 10px;
  justify-content: center;
  align-items: center;
  background: #FFB74D;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.select-button:hover {
  background: #FFA726;
}

.loading-message, .error-message {
  text-align: center;
  padding: 20px;
  color: #5A5A5A;
}

.error-message {
  color: #FF5252;
}
</style>