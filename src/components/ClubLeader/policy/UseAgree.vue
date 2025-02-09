<template>
  <div class="container">
    <div class="contents">
      <div class="notices">
        <table>
          <tbody>
          <h2 class="centered-title">동구라미 개인정보 수집 및 이용 동의</h2>
          <hr class="divider" />

          <section class="terms-section">
            <h3>수집하는 개인정보의 항목</h3>
            <p>
              동구라미는 서비스 제공을 위해, 회원가입 시점에 다음에 해당하는 개인정보를 수집합니다.<br>
              1.	아이디, 비밀번호, 이름, 전화번호, 학번, 학과, 이메일<br>
              ※ 각 항목 또는 추가적으로 수집이 필요한 개인정보 및 개인정보를 포함한 자료는 이용자 응대 과정과 서비스 내부 알림 수단 등을 통해 별도의 동의 절차를 거쳐 요청 및 수집될 수 있습니다.<br>
            </p>
          </section>

          <section class="terms-section">
            <h3>수집된 개인정보의 처리 목적</h3>
            <p>
              회원가입 시점에 수집된 개인정보는 다음의 목적에 한해 이용됩니다.
            </p>
            <p class="double-indent">
              1. 가입 및 탈퇴 의사 확인, 회원 식별 및 관리<br>
              2.	개인정보 및 관심에 기반한 이용자친화적 서비스 제공 및 기존・신규 시스템 개발・유지・개선<br>
              3.	불법・약관 위반 행위와 같은 부정행위 방지를 위한 운영 시스템 개발・유지・개선<br>
              4.	문의 응대 및 처리<br>
              5.	회원관리, 서비스 운영 및 유지보수를 위한 통계 자료 도출
            </p>
          </section>

          <section class="terms-section">
            <h3>개인정보의 보유 및 이용 기간</h3>
            <p class="indent">
              동구라미는 서비스를 제공하는 동안 개인정보 처리방침 및 관련법에 의거하여 회원의 개인정보를지속적으로 관리 및 보관합니다. 탈퇴 및 동의 철회 등 개인정보 수집 및 이용이 달성될 경우 수집된 개인정보는 즉시 파기하고 있습니다.<br>
              1.	회원 탈퇴 시 개인정보는 즉시 파기합니다.<br>
              2.	동아리 삭제 시 연관 개인정보는 즉시 파기합니다.<br>
              3.	동아리원 개인 정보 또한 동아리 탈퇴 시 즉시 파기합니다.<br>
              ※ 동구라미는 위와 같이 파기 사유가 발생한 개인정보는 지체없이 재생이 불가능한 방법으로 파기됩니다. 전자적 파일 형태로 기록・저장된 개인정보는 기록을 재생할 수 없도록 파기하며, 종이 문서에 기록・저장된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.<br>
              ※ 위 항에도 불구하고 법령에 의해 개인정보를 보존해야 하는 경우, 해당 개인정보는 물리적・논리적으로 분리하여 해당 법령에서 정한 기간에 따라 저장합니다.
            </p>
          </section>

          <section class="terms-section">
            <h3>기타</h3>
            <p class="indent">
              개인정보 수집 및 이용에 동의하지 않을 권리가 있으며, 거부할 경우 회원가입이 불가합니다.
              자세한 내용은 웹사이트 및 모바일 하단에 게시된 개인정보처리방침을 참고하시길 바랍니다.
              <br>            </p>
          </section>


          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 기존 스타일 유지 */
* {
  box-sizing: border-box;
}

.container {
  display: flex;
}

.contents {
  flex: 1;
}

.title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.notices {
  width: 820px;
  height: auto;
  border-radius: 10px;
  padding: 0px 10px;
  margin-top: -10px;

}

/* 새로 추가된 스타일 */
.terms-section {
  margin: 20px 0;
}

.terms-section h3 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.terms-section p {
  margin: 10px 0;
  line-height: 1.6;
}

.indent {
  padding-left: 20px;
}

.double-indent {
  padding-left: 40px;
}

.centered-title {
  text-align: center;
  color: #393939;
  font-size: 20px;
  font-weight: 700;
  margin: 20px 0;
}

.divider {
  width: 100%;
  margin: 10px auto;
  border: none;
  border-top: 1px solid #C6C6C6;
  margin-top: 0px;
}

table {
  width: 100%;
  border-collapse: collapse;
}
</style>
<script setup lang="ts">
</script>