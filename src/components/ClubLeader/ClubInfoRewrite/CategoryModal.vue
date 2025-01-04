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
          <div class="category-grid">
            <button
                v-for="category in categories"
                :key="category"
                :class="['category-button', { active: selectedCategories.includes(category) }]"
                @click="toggleCategory(category)"
                :disabled="isMaxSelected && !selectedCategories.includes(category)"
            >
              {{ category }}
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
      categories: [
        '공부', '개발', '국어', '수학', '건축', '뭐시기', '예술',
        '힙합', '수많은', '잡초들', '사이핀', '내뷰', '티플라워', '빨주',
        '노초', '암어레', '전드', '타노스', '토르', '헐크', '아이언맨'
      ],
      selectedCategories: []
    }
  },
  computed: {
    isMaxSelected() {
      return this.selectedCategories.length >= 3;
    }
  },
  methods: {
    toggleCategory(category) {
      const index = this.selectedCategories.indexOf(category);
      if (index === -1 && !this.isMaxSelected) {
        this.selectedCategories.push(category);
      } else if (index !== -1) {
        this.selectedCategories.splice(index, 1);
      }
    },
    selectCategories() {
      this.$emit('select', this.selectedCategories);
      this.close();
    },
    close() {
      this.selectedCategories = [];
      this.$emit('close');
    }
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.selectedCategories = [...this.currentSelected];
      }
    }
  }
}
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
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: -0.4px;
  margin: 0;
  line-height: 1;
}

.sub-text {
  color: #FFB052;
  font-family: Pretendard;
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
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  padding: 4px;
}
.selected-info {
  margin-top: 16px;
  color: #5A5A5A;
  text-align: right;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.category-button {
  padding: 10px 8px;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  color: #5A5A5A;
  height: 35px;
  width: 68px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
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
</style>