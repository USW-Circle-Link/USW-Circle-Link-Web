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
export default {
  name: 'ClubUpdateHeader',
  data() {
    return {
      isChecked: false    //[모집 중 X] 기본 상태
    }
  },
  methods: {
    toggleCheckbox() {
      this.isChecked = !this.isChecked;  // 현재 isChecked 상태를 반전시킴
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