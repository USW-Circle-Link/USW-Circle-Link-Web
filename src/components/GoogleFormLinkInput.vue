<template>
  <h2>구글폼 링크</h2>
  <div class="GoogleFormLinkInput">
    <textarea placeholder="링크를 입력해 주세요" v-model="textareaContent" rows="4" cols="1"></textarea>
  </div>
</template>
<script>
export default {
  name: 'GoogleFormLinkInput',
  data() {
    return {
      textareaContent: '' // 입력된 텍스트를 저장할 데이터
    };
  },
};
</script>
<style scoped>
.GoogleFormLinkInput{
  width: 886px;
  height: 40px;
  border-radius: 8px;
  background-color: #ffffff;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.GoogleFormLinkInput textarea{
  width: 820px;
  height: 28px;
  margin-top: 10px;
  text-align: left;
  border: none;
  font-size: 16px;
  resize: none;
}

.GoogleFormLinkInput textarea::placeholder{
  text-align: center;
}

textarea:focus {
  outline: none; /* 포커스 상태일 때 테두리 제거 */
}
</style>