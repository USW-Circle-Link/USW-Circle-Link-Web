<template>
  <div class="ClubUpdateHeader">
    <h2>동아리 소개 수정</h2>
    <div class="head">
      <p>소개 & 모집글 작성</p>
      <div class="empty"></div>
      <p>모집 중</p>
      <input type="checkbox" v-model="isChecked" id="chk1"/><label for="switch" @click="toggleCheckbox" ></label>
    </div>
  </div>
</template>

<script>
import store from "@/store/store";
import axios from "axios";
export default {
  name: 'ClubUpdateHeader',
  data() {
    return {
      isChecked: false    //[모집 중 X] 기본 상태
    }
  },
  methods: {
    async toggleCheckbox() {
      const accessToken = store.state.accessToken; // 저장된 accessToken 가져오기채
      const clubId = store.state.clubId; // 저장된 clubId 가져오기
      this.isChecked = !this.isChecked;  // 현재 isChecked 상태를 반전시킴
      this.$emit('sendData', this.isChecked);

      axios.patch(`http://43.200.140.186:8080/club-leader/${clubId}/toggle-recruitment`,
          {
            key: this.isChecked
          },
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`, // 헤더에 accessToken 추가해야 함
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            console.log('Updated data:', response.data);
            if(this.isChecked === true){
              setTimeout(function() {
                alert('동아리 모집 상태 변경 완료 [모집중 ON]');
              }, 800);
            } else {
              setTimeout(function() {
                alert('동아리 모집 상태 변경 완료 [모집중 OFF]');
              }, 800);
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
    },
  }
};
</script>

<style scoped>

.head{
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.head p{
  font-size: 18px;
  font-weight: 500;
  margin-top: 21px;
}

.empty{
  width: 630px;
}

label {
  display: block;
  position: relative;
  width: 50px;
  height: 22px;
  background: #d3d3d3;
  border-radius: 60px;
  transition: background 0.4s;
}

label::after {
  content: "";
  position: absolute;
  left: 4px;
  top: 50%;
  width: 14px;
  height: 14px;
  border-radius: 100%;
  background-color: #fff;
  transform: translateY(-50%);
  box-shadow: 1px 3px 4px rgba(0,0,0,0.1);
  transition: all 0.4s;
}

#chk1:checked + label {
  background-color: #FFC700;
}

#chk1:checked + label::after {
  left: calc(100% - 18px);
}

input{
  visibility: hidden;
  width: 1px;
}

</style>
