<template>
  <div class="popup">
    <div class="popup-content">
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
  background-color: rgba(0, 0, 0, 0.5); /* 반투명 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content{
  display: flex;
  flex-direction: column;
}
</style>