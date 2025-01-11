<template>
  <div class="title">카테고리 작성하기</div>

  <div class="container">
    <!-- 카테고리 리스트 -->
    <h2>카테고리 리스트</h2>
    <div class="category-list">
      <span v-for="(category, index) in categories" :key="index" class="category-item">
        {{ category }}
        <button class="remove-btn" @click="removeCategory(index)">×</button>
      </span>
    </div>

    <div class="line"></div>

    <!-- 카테고리 추가 -->
    <h2>카테고리 추가</h2>
    <div class="category-add">
      <input
          v-model="newCategory"
          type="text"
          placeholder="추가할 카테고리를 작성해주세요."
          @keydown.enter="addCategory"
          class="input-field"
      />
      <button class="save-btn" @click="saveCategory">저장하기</button>
    </div>
  </div>

  <div v-if="addCategoryPopupVisible" class="popup-overlay">
    <div class="popup">
      <p class="confirm-message">카테고리가 정상적으로 저장되었습니다.</p>
      <button class="confirm-button" @click="ConfirmeCategory">확인</button>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      categories: ["공부", "공부", "공부", "공부"], // 초기 카테고리 데이터
      newCategory: "", // 새로 추가할 카테고리

      addCategoryPopupVisible: false
    };
  },
  methods: {
    addCategory() {
      if (this.newCategory.trim() !== "") {
        this.categories.push(this.newCategory.trim());
        this.newCategory = ""; // 입력 필드 초기화
      }
    },
    removeCategory(index) {
      this.categories.splice(index, 1); // 카테고리 삭제
    },
    saveCategory(){
      this.addCategoryPopupVisible = true;
    },
    ConfirmeCategory(){
      this.addCategoryPopupVisible = false;
    }
  },
};
</script>


<style scoped>
.title {
  color: black;
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 30px;
  position: relative; /* 상대 위치 설정 */
  display: inline-block;
  z-index: 1; /* 텍스트가 배경색 위에 오도록 설정 */
}

.container {
  width: 890px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  font-size: 18px;
  margin-bottom: 20px;
  color: #333;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px; /* 항목 간 간격 */
  margin-bottom: 150px;

}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 78px;
  height: 35px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  color: #868686;
}

.remove-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: #969696;
  cursor: pointer;
  font-weight: 100;
}

.line{
  border-bottom: 1px solid #d3d3d3;
  margin: 60px 0;
}

.category-add {
  display: flex;
  align-items: center;
  gap: 10px; /* 버튼과 입력 필드 간 간격 */
  flex-direction: column;
}

.input-field {
  width: 860px;
  margin-top: 10px;
  flex: 1;
  padding: 20px 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
}

.input-field:focus {
  border-color: #FFC700; /* Border color when focused */
  outline: none; /* Remove default outline */
}

.input-field::placeholder{
  font-size: 16px;
  color: #868686;
}

.save-btn {
  width: 112px;
  height: 48px;
  background: #FFC700;
  border: none;
  border-radius: 4px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: -0.025em;
  text-align: center;
  margin-top: 30px;
  margin-left: 774px;
  margin-bottom: 30px;
  cursor: pointer;
}

.save-btn:hover {
  background-color: #e0891a;
}

.popup-overlay {
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
  flex-direction: column;
}

.popup {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  width: 452px;
  height: 184px;
  text-align: left;
  position: relative;
}

.confirm-message{
  text-align: center;
  margin-top: 80px;
  font-size: 20px;
  font-weight: 500;
  line-height: 12px;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
}

.confirm-button{
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
</style>
