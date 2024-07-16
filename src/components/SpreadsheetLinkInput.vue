<template>
  <div class="popup">
    <div class="popup-content">
      <h1>구글 스프레드시트 링크를 입력하세요.</h1>
      <input v-model="value"  placeholder="Enter Google Sheets URL" />
      <button @click="sendInputToParent" >입력</button>
    </div>
  </div>

</template>
<script>
  export default {
    name: 'PopUpView',
    data() {
      return {
        value: ''  // 로컬 상태로 입력 값을 관리합니다.
      };
    },
    methods: {
      sendInputToParent() {
        // 버튼 클릭 시 이 메서드를 호출하고, 입력 값을 상위 컴포넌트로 전달합니다.
        this.$emit('update:inputValue', this.value);
        this.$emit('close');
      },
      closePopup() {
        this.$emit('close');
      }
    },
  }
</script>
<style scoped>

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3); /* 반투명 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content{
  width: 900px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 8px;
}

.popup-content input{
  width: 800px;
  height: 40px;
  margin: 30px 0px 30px 0px;
  align-content: center;
  font-size: 14px;
  border: 0;
  border-radius: 15px;
  outline: none;
  padding-left: 10px;
  background-color: rgb(233, 233, 233);
}
</style>