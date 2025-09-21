<template>
  <div class="container">
    <div class="contents">
      <h2 class="title">이용약관</h2>
      <div class="notices">
        <table>
          <tbody>
          <h1 class="centered-title">동구라미 서비스 이용약관</h1>
          <section>
            <h2>제 1 조 (목적)</h2>
            <p>
              본 약관은 [동구라미] (이하 "동구라미"라 함)의 이용에 관한 조건 및 절차,
              이용자와 서비스 제공자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2>제 2 조 (회원가입 및 개인정보 동의)</h2>
            <h3>회원가입</h3>
            <p>
              서비스 이용을 원하는 이용자는 회원가입 절차를 거쳐야 하며,
              회원가입 시 제공한 정보는 정확하고 최신의 정보여야 합니다.
              이용자는 회원가입 시 본 약관에 동의하는 것으로 간주됩니다.
            </p>
            <h3>개인정보 동의</h3>
            <p>
              이용자는 서비스 이용을 위해 개인정보 수집 및 이용에 대한 동의를 해야 합니다.
              수집되는 개인정보의 항목은 이름, 학과, 학번, 전화번호 등이며,
              이는 서비스 제공 및 운영을 위해 사용됩니다.
              이용자는 언제든지 자신의 개인정보를 열람, 수정, 삭제할 수 있으며,
              이를 위해 서비스 내의 관련 기능을 이용해야 합니다.
            </p>
          </section>

          <section>
            <h2>제 3 조 (서비스 이용 약관)</h2>
            <h3>서비스 이용</h3>
            <p>
              이용자는 본 약관에 동의함으로써 서비스를 자유롭게 이용할 수 있습니다.
              서비스는 이용자에게 다음과 같은 기능을 제공합니다.
            </p>
            <ul>
              <li>수원대학교 중앙 동아리 소속 동아리 조회</li>
              <li>수원대학교 중앙 동아리 모집 조회</li>
              <li>동아리 지원 현황 확인</li>
              <li>수원대학교 동아리 연합회 공지사항 조회</li>
              <li>수원대학교 동구라미 개발팀 공지사항 조회</li>
              <li>수원대학교 동아리 소개 페이지 조회</li>
              <li>동아리 합/불 조회 및 알림 서비스</li>
              <li>사용자 회원 가입, 로그인, 정보수정</li>
            </ul>
            <h3>이용자의 의무</h3>
            <p>
              이용자는 서비스 이용 시 아래의 행위를 하여서는 안 됩니다.
            </p>
            <ul>
              <li>타인의 개인정보를 도용하거나 허위 정보를 입력하는 행위</li>
              <li>서비스의 정상적인 운영을 방해하는 행위</li>
              <li>타인을 비방하거나 명예를 훼손하는 행위</li>
              <li>불법적인 목적으로 서비스를 이용하는 행위</li>
            </ul>
            <h3>서비스 제공자의 의무</h3>
            <p>
              서비스 제공자는 이용자가 안정적으로 서비스를 이용할 수 있도록 최선을 다합니다.
              서비스 제공자는 이용자의 개인정보를 보호하며, 관련 법률 및 규정을 준수합니다.
            </p>
            <h3>서비스의 변경 및 중단</h3>
            <p>
              서비스 제공자는 필요한 경우 사전 통지 없이 서비스를 변경하거나 중단할 수 있습니다.
              서비스 중단으로 인한 손해에 대해 서비스 제공자는 책임을 지지 않습니다.
            </p>
            <h3>약관의 변경</h3>
            <p>
              서비스 제공자는 본 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지 또는 약관 페이지에 명시 합니다.
              이용자는 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단할 수 있습니다.
            </p>
          </section>

          <section>
            <h2>제 4 조 (면책조항)</h2>
            <p>
              서비스 제공자는 이용자의 귀책 사유로 인한 서비스 이용의 중단 및 손해에 대해 책임을 지지 않습니다.
              또한, 천재지변, 전쟁 등의 불가항력적 사유로 인한 서비스 제공의 중단에 대해서도 책임을 지지 않습니다.
            </p>
          </section>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {

    };
  },

};
</script>

<style scoped>

/* 모든 요소에 박스 사이징 설정 */
* {
  box-sizing: border-box;
}

/* 전체 컨테이너 설정 */
.container {
  display: flex;
  min-width: 390px;
}

/* 콘텐츠 영역 설정 */
.contents {
  flex: 1;
  padding-bottom: 40px;
}

/* 타이틀 스타일 */
.title {
  color: black;
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 10px;
  position: relative; /* 상대 위치 설정 */
  display: inline-block;
  z-index: 1; /* 텍스트가 배경색 위에 오도록 설정 */
}

.title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 2px; /* 텍스트 아래쪽 위치 조정 */
  width: 10.5%;
  height: 19px; /* 형광펜 두께 */
  background-color: #FFB052;
; /* 노란색 배경 */
  z-index: -1; /* 텍스트 뒤에 위치하도록 설정 */
  transform: skew(-12deg); /* 기울기 효과 추가 */
}

/* 공지사항 박스 설정 */
.notices {
  width: 820px;
  height: auto;
  border-radius: 10px;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 테이블 스타일 */
table {
  width: 100%;
  border-collapse: collapse;
}
.centered-title {
  text-align: center;
}

</style>
