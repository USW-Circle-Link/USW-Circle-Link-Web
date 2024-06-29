<template>
  <div class="ClubInfoTextInput">
    <textarea v-model="textareaContent" rows="4" cols="50"></textarea>
  </div>
  <button @click="saveInfo">작성 완료</button>
</template>

<script>
export default {
  name: 'ClubInfoTextInput',
  data() {
    return {
      textareaContent: '' // 입력된 텍스트를 저장할 데이터
    };
  },
  methods: {
    saveInfo(){
      //textareaContent 값을 포스트 통신으로 서버에 전달
      alert("내용이 정상적으로 저장 되었습니다.")
    }
  }
};
</script>

<style scoped>
.ClubInfoTextInput{
  width: 886px;
  height: 382px;
  border-radius: 8px;
  background-color: #ffffff;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ClubInfoTextInput textarea{
  width: 820px;
  height: 330px;
  text-align: left;
  border: none;
  font-size: 16px;
  resize: none;
}

textarea:focus {
  outline: none; /* 포커스 상태일 때 테두리 제거 */
}

button{
  width: 112px;
  height: 48px;
  background: #FFC700;
  border: none;
  border-radius: 4px;
  color: #ffffff;
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: -0.025em;
  text-align: center;
  margin-top: 10px;
  margin-left: 774px;
}
</style>