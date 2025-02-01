<template>
  <div class="title">카테고리 작성하기</div>
  <div class="container">
    <!-- 카테고리 리스트 -->
    <h2>카테고리 리스트</h2>
    <div class="category-list">
      <span v-for="(category, index) in categories" :key="index" class="category-item">
        {{ category }}
        <button class="remove-btn" @click="removeCategory(category,index)">×</button>
      </span>
    </div>
    <div class="line"></div>
    <!-- 카테고리 추가 -->
    <h2>카테고리 추가</h2>
    <div class="category-add">
      <input
          ref="inputField"
          v-model="clubCategory"
          type="text"
          placeholder="추가할 카테고리를 작성해주세요."
          class="input-field"
      />
      <button class="save-btn" @click="addCategory">저장하기</button>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import store from "@/store/store";

export default {
  data() {
    return {
      categories: [], // 초기 카테고리 데이터
      clubCategory: "", // 새로 추가할 카테고리
      categoryMap: new Map(),
    };
  },
  mounted() {
    this.fetchCategory();
  },
  methods: {
    async fetchCategory(){
      try {
        const response = await axios.get("http://15.164.246.244:8080/admin/category", {
          headers: {
            Authorization: `Bearer ${store.state.accessToken}`,
          },
        });
        const jsonData = response.data;
        if (jsonData && Array.isArray(jsonData.data)) {
          this.categories = jsonData.data.map(item => item.clubCategory);
          console.log(this.categories); // ["운동", "학술", "봉사", "개발", "공부"]
          jsonData.data.forEach(item => {
            this.categoryMap.set(item.clubCategory, item.clubCategoryId);
          });
        }
        console.log('카테고리 불러오기 성공',this.categoryMap);
      } catch (error) {
        console.error("Error fetching clubs:", error);
        alert("카테고리를 불러오는데 실패했습니다.");
      }
    },
    async addCategory() {
      const trimmedCategory = this.clubCategory.trim(); // 입력값의 앞뒤 공백 제거
      if (trimmedCategory !== "" && !this.categories.includes(trimmedCategory)) {
        try {
          const response = await axios.post(
              `http://15.164.246.244:8080/admin/category`,
              this.clubCategory,
              {
                headers: {
                  'Authorization': `Bearer ${store.state.accessToken}`,
                  'Content-Type': 'application/json'
                }
              });
          //console.log(response);
        } catch (error) {
          console.error("오류가 발생했습니다:", error.response ? error.response.data : error);
        }
        // 중복 확인 및 값 추가
        this.categories.push(trimmedCategory);
        this.clubCategory = ""; // 입력 필드 초기화
      } else if (this.categories.includes(trimmedCategory)) {
        alert("이미 존재하는 카테고리입니다.");
      }
    },
    async removeCategory(category,index) {
      console.log(category);
      const categoryId = this.categoryMap.get(category);
      try {
        await axios.delete(`http://15.164.246.244:8080/admin/category/${categoryId}`, {
          headers: {
            Authorization: `Bearer ${store.state.accessToken}`,
          },
        });
        this.categories.splice(index, 1); // 카테고리 삭제
        alert("카테고리가 성공적으로 삭제되었습니다.");
      } catch (error) {
        console.error("Error:", error);
      }
    },
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
</style>