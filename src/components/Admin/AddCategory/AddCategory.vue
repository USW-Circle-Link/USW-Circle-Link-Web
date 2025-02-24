<template>
  <div class="container">
    <div class="title">카테고리 작성하기</div>
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
          v-model="categoryName"
          type="text"
          placeholder="추가할 카테고리를 작성해주세요."
          class="input-field"
      />
      <button class="save-btn" @click="addCategory">저장하기</button>
    </div>
  </div>
  <!--카테고리 추가 성공, 중복, 삭제 팝업창-->
  <AddCategoryPopup
      v-if="showPopup"
      :serverMessage="serverMessage"
      @close="closeResultPopup"
  />

  <Popup401 v-if="show401Popup" />
</template>



<script>
import axios from "axios";
import store from "@/store/store";
import Popup401 from "@/components/Admin/401Popup.vue";
import AddCategoryPopup from "@/components/Admin/AddCategory/AddCategoryPopup.vue";

export default {
  components: {AddCategoryPopup, Popup401},
  data() {
    return {
      categories: [], // 초기 카테고리 데이터
      categoryName: "", // 새로 추가할 카테고리
      categoryMap: new Map(),

      showPopup: false,
      serverMessage: '',

      show401Popup: false  // 401 팝업
    };
  },
  mounted() {
    this.fetchCategory();
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
    async fetchCategory(){
      try {
        const response = await axios.get("https://api.donggurami.net/admin/clubs/category", {
          headers: {
            Authorization: `Bearer ${store.state.accessToken}`,
          },
        });
        const jsonData = response.data;
        if (jsonData && Array.isArray(jsonData.data)) {
          this.categories = jsonData.data.map(item => item.clubCategoryName);
          console.log(this.categories); // ["운동", "학술", "봉사", "개발", "공부"]
          this.categoryMap.clear();
          jsonData.data.forEach(item => {
            this.categoryMap.set(item.clubCategoryName, item.clubCategoryUUID);
          });
        }
        console.log('카테고리 불러오기 성공',this.categoryMap);
      } catch (error) {
        if (!this.handle401Error(error)) {
          console.error('Error updating member:', error);
        }
      }
    },
    async addCategory() {
      const trimmedCategory = this.categoryName.trim();
      if (trimmedCategory !== "" && !this.categories.includes(trimmedCategory)) {
        try {
          const response = await axios.post(
              "https://api.donggurami.net/admin/clubs/category",
              this.categoryName,
              {
                headers: {
                  'Authorization': `Bearer ${store.state.accessToken}`,
                  'Content-Type': 'application/json'
                }
              }
          );

          // 서버로부터 받은 새 카테고리의 UUID를 저장
          if (response.data && response.data.data) {
            const newCategoryUUID = response.data.data.clubCategoryUUID;
            this.categoryMap.set(trimmedCategory, newCategoryUUID);
            this.categories.push(trimmedCategory);
          }

          this.serverMessage = '카테고리가 정상적으로 저장되었습니다.'
          this.showPopup = true;
          this.categoryName = "";

        } catch (error) {
          if (!this.handle401Error(error)) {
            console.error('Error adding category:', error);
          }
        }
      } else if (this.categories.includes(trimmedCategory)) {
        this.serverMessage = '이미 존재하는 카테고리입니다.'
        this.showPopup = true;
      }
    },
    async removeCategory(category, index) {
      const categoryId = this.categoryMap.get(category);
      if (!categoryId) {
        console.error('Category UUID not found');
        return;
      }

      try {
        await axios.delete(`https://api.donggurami.net/admin/clubs/category/${categoryId}`, {
          headers: {
            Authorization: `Bearer ${store.state.accessToken}`,
          },
        });
        this.categories.splice(index, 1);
        this.categoryMap.delete(category); // Map에서도 카테고리 제거
        this.serverMessage = '카테고리가 정상적으로 삭제되었습니다.'
        this.showPopup = true;
      } catch (error) {
        if (!this.handle401Error(error)) {
          console.error('Error removing category:', error);
        }
      }
    },
    closeResultPopup() {
      this.showPopup = false
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
  display: block;
  z-index: 1; /* 텍스트가 배경색 위에 오도록 설정 */
}

.container {
  width: 890px;
  margin: 0 auto;
  padding: 10px;
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
  background: #FFb052;
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