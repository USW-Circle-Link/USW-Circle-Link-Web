<template>
  <div class="container">
    <div class="contents">
      <h2 class="title">개인정보 처리방침</h2>
      <div class="notices">
        <table>
          <tbody>
          <h2 class="centered-title">동구라미 서비스 개인정보 처리방침</h2>
          <hr class="divider" />




          <!-- 서문 -->
          <div class="section">
            <h2>서문</h2>
            <p class="indent">
              동구라미는 정보주체의 자유와 권리 보호를 위해 「개인정보 보호법」 및 관계 법령이 정한 바를 준수하여, 적법하게 개인정보를 처리하고 안전하게 관리하고 있습니다. 이에 「개인정보 보호법」 제30조에 따라 정보주체에게 개인정보의 처리와 보호에 관한 절차 및 기준을 안내하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립‧공개합니다.
            </p>
            <p class="indent">본 개인정보처리방침은 동구라미가 제공하는 서비스에 적용됩니다.</p>
          </div>

          <!-- 목차 -->
          <div class="section">
            <h2>목차</h2>
            <ol class="toc">
              <li><a href="#section1" @click.prevent="scrollToSection('section1')">개인정보의 처리목적</a></li>
              <li><a href="#section2" @click.prevent="scrollToSection('section2')">처리하는 개인정보 항목</a></li>
              <li><a href="#section3" @click.prevent="scrollToSection('section3')">개인정보의 처리 및 보유 기간</a></li>
              <li><a href="#section4" @click.prevent="scrollToSection('section4')">개인정보의 파기 절차 및 방법</a></li>
              <li><a href="#section5" @click.prevent="scrollToSection('section5')">개인정보의 안전성 확보조치에 관한 사항</a></li>
              <li><a href="#section6" @click.prevent="scrollToSection('section6')">개인정보 자동 수집 장치의 설치‧운영 및 거부에 관한 사항</a></li>
              <li><a href="#section7" @click.prevent="scrollToSection('section7')">정보주체와 법정대리인의 권리‧의무 및 행사방법에 관한 사항</a></li>
              <li><a href="#section8" @click.prevent="scrollToSection('section8')">개인정보 보호책임자의 성명 또는 개인정보 업무 담당부서 및 고충사항을 처리하는 부서에 관한 사항</a></li>
              <li><a href="#section9" @click.prevent="scrollToSection('section9')">정보주체의 권익침해에 대한 구제방법</a></li>
              <li><a href="#section10" @click.prevent="scrollToSection('section10')">개인정보 처리방침의 변경</a></li>
            </ol>
          </div>

          <!-- 각 섹션 -->
          <div id="section1" class="section">
            <h2>1. 개인정보의 처리목적</h2>
            <p class="indent bold">
              동구라미는 아래의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도 동의를 받는 등 필요한 조치를 이행하고 있습니다.
            </p>
            <ul class="bullet-list">
              <li>- 회원 가입 의사 확인을 위해 개인정보를 처리합니다.</li>
              <li>- 이용자를 식별하고, 본인임을 확인하는 회원 관리를 위해 개인정보를 처리합니다.</li>
              <li>- 회원자격 유지‧관리를 위해 개인정보를 처리합니다.</li>
              <li>- 부정가입 및 이용 방지를 위해 개인정보를 처리합니다.</li>
              <li>- 서비스 제공을 목적으로 개인정보를 처리합니다.</li>
            </ul>
          </div>


          <div id="section2" class="section">
            <h2>2. 처리하는 개인정보 항목</h2>
            <p class="indent bold">
              동구라미는 서비스 제공을 위해 필요 최소한의 범위에서 개인정보를 수립‧이용하며, 수집하는 개인정보의 항목을 정보주체에게 상세히 안내하고 있습니다.
            </p>
            <p class="indent">
              동구라미는 아래의 개인정보 항목을 이용자의 동의를 받아 처리하고 있습니다.
            </p>

            <!-- 들여쓰기 및 박스 구분선 적용 -->
            <div class="indented-section">
              <div class="bordered-box">
                <h3>회원가입 시</h3>
                <ul class="info-list">
                  <li><span class="info-label">- 수집 항목:</span> [필수] ID, 비밀번호, 본인확인정보(이름, 전화번호, 학번, 학과, 이메일)</li>
                  <li><span class="info-label">- 수집 목적:</span> 서비스 이용 및 제공</li>
                  <li><span class="info-label">- 보유 및 이용기간:</span> 회원 탈퇴 시까지</li>
                </ul>
              </div>

              <div class="bordered-box">
                <h3>동아리 생성 시</h3>
                <ul class="info-list">
                  <li><span class="info-label">- 수집 항목:</span> [필수] 이름, 전화번호</li>
                  <li><span class="info-label">- 수집 목적:</span> 서비스 이용 및 제공</li>
                  <li><span class="info-label">- 보유 및 이용기간:</span> 동아리 삭제 시까지</li>
                </ul>
              </div>
            </div>

            <p class="indent">
              동구라미는 아래의 개인정보 항목을 정보주체의 동의없이 처리하고 있습니다.
            </p>

            <div class="indented-section">
              <div class="bordered-box">
                <h3>서비스 운영</h3>
                <ul class="info-list">
                  <li><span class="info-label">- 법적 근거:</span> 개인정보 보호법 제15조 제1항 제1호('정보주체의 동의')</li>
                  <li><span class="info-label">- 수집‧이용 항목:</span> ID, 이름, 전화번호, 학번, 학과, 이메일</li>
                </ul>
              </div>
            </div>

            <p class="indent warning-text">
              만 14세 미만 아동은 동구라미 서비스 회원가입이 불가합니다.
            </p>
          </div>

          <div id="section3" class="section">
            <h2>3. 개인정보의 처리 및 보유 기간</h2>
            <p class="indent bold">
              동구라미는 법령에 따른 개인정보 보유‧이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의 받은 개인정보 보유‧이용기간 내에서 개인정보를 처리‧보유합니다.
            </p>
            <p class="indent">각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.</p>

            <div class="indented-section">
              <p>1. 서비스 회원 가입 및 관리 : 회원 탈퇴 시까지</p>
            </div>
          </div>

          <div id="section4" class="section">
            <h2>4. 개인정보의 파기 절차 및 방법</h2>
            <p class="indent bold">
              동구라미는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
            </p>
            <p class="indent">개인정보 파기의 절차 및 방법은 다음과 같습니다.</p>

            <div class="indented-section">
              <p>1. 파기절차: 동구라미는 파기 사유가 발생한 개인정보는 즉시 개인정보를 파기합니다.</p>
              <p>2. 파기방법: 동구라미는 전자적 파일 형태로 기록‧저장된 개인정보를 기록을 재생할 수 없도록 파기 하며, 종이 문서 기록‧저장된 개인정보는 분쇄기로 분쇄하거나 파기합니다.</p>
            </div>
          </div>

          <div id="section5" class="section">
            <h2>5. 개인정보의 안전성 확보조치에 관한 사항</h2>
            <p class="indent bold">
              동구라미는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
            </p>
            <ul class="bullet-list">
              <li>- 클라우드 보안조치, 시큐어 코딩을 시행하고 있습니다.</li>
              <li>- 개인정보를 암호화하고 있습니다. 비밀번호는 암호화하여 저장하며 이렇게 암호화된 개
                인정보는 암호화 통신을 이용하여 안전하게 전송하고 있습니다.
              </li>
            </ul>
          </div>

          <div id="section6" class="section">
            <h2 class="section-title">6. 개인정보 자동 수집 장치의 설치‧운영 및 거부에 관한 사항</h2>

            <div class="subsection">
              <h3 class="subsection-title">&lt;설치‧운영하는 개인정보 자동 수집 장치&gt;</h3>
              <p class="content">
                동구라미는 사용자에게 개별적인 서비스와 편의를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.
                쿠키는 웹사이트 운영에 이용되는 서버(http)가 정보주체의 브라우저에 보내는 소량의 정보이며 정보주체의 PC 또는 모바일에 저장됩니다.
                정보주체는 웹 브라우저 옵션 설정을 통해 쿠키 허용, 차단 등의 설정을 할 수 있습니다.
                다만, 쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.
              </p>
            </div>

            <div class="subsection">
              <h3 class="subsection-title">&lt;쿠키 허용/차단 방법&gt;</h3>
              <ol class="numbered-list">
                <li>
                  <p class="list-title">웹브라우저에서 쿠키 허용/차단</p>
                  <ul class="bullet-list">
                    <li>크롬(Chrome) : 웹 브라우저 설정 > 개인정보 보호 및 보안 > 인터넷 사용 기록 삭제</li>
                    <li>엣지(Edge) : 웹 브라우저 설정 > 쿠키 및 사이트 권한 > 쿠키 및 사이트 데이터 관리 및 삭제</li>
                  </ul>
                </li>
                <li>
                  <p class="list-title">모바일 브라우저에서 쿠키 허용/차단</p>
                  <ul class="bullet-list">
                    <li>크롬(Chrome) : 모바일 브라우저 설정 > 개인정보 보호 및 보안 > 인터넷 사용 기록 삭제</li>
                    <li>사파리(Safari) : 모바일 기기 설정 > 사파리(Safari) > 고급 > 모든 쿠키 차단</li>
                    <li>삼성 인터넷 : 모바일 브라우저 설정 > 인터넷 사용 기록 > 인터넷 사용 기록 삭제</li>
                  </ul>
                </li>
              </ol>
            </div>

            <div class="subsection">
              <h3 class="subsection-title">&lt;행태정보의 수집‧이용‧제공 및 거부 등에 관한 사항&gt;</h3>
              <p class="content">
                <span class="bold">동구라미는 서비스 이용과정에서 사용자에게 서비스를 제공하기 위하여 쿠키를 활용하여 개인을 식별 가능한 형태로 행태정보를 수집‧이용하고 있습니다.</span>
              </p>
              <p class="content">
                동구라미는 자사가 운영하는 웹사이트에서 다음과 같이 행태정보를 수집하고 있습니다.
              </p>

              <table class="info-table">
                <tr>
                  <th>법적 근거</th>
                  <th>수집하는 행태정보 항목</th>
                  <th>행태정보 수집 방법</th>
                  <th>행태정보 수집 목적</th>
                  <th>보유‧이용기간</th>
                </tr>
                <tr>
                  <td>개인정보보호법 제15조 제1항 제1호</td>
                  <td>로그인 내역</td>
                  <td>정보주체가 서비스 로그인 시 자동 수집</td>
                  <td>정보주체 서비스<br> 자동 로그인</td>
                  <td>수집일로부터</td>
                </tr>
              </table>

              <p class="content">
                정보주체는 아래의 연락처로 행태정보와 관련하여 궁금한 사항과 거부권 행사, 피해 신고 접수 등을 문의할 수 있습니다.
              </p>

              <div class="bordered-box">
                <p class="list-title">개인정보 보호 담당팀</p>
                <p>담당자: 이동수, 이메일: dlehdtn0118@naver.com</p>
              </div>
            </div>
          </div>

          <div id="section7" class="section">
            <h2>7. 정보주체와 법정대리인의 권리‧의무 및 행사방법에 관한 사항</h2>
            <p class="indent bold">
              정보주체는 동구라미에 대해 언제든지 개인정보 열람‧정정‧ 삭제‧처리정지 및 철회 요구, 자 동화된 결정에 대한 거부 또는 설명 요구 등의 권리를 행사(이하 “권리 행사”라 함)할 수 있습니다.<br>
              권리 행사는 동구라미에 대해 「개인정보 보호법」 시행령 제41조 제1항에 따라 서면, 전자우편을 통하여 하실 수 있으며, 동구라미는 이에 대해 지체없이 조치하겠습니다.
            </p>
            <ul class="bullet-list">
              <li>- 정보주체는 언제든지 모바일 ‘내 정보 > 내 정보 수정’에서 개인정보를 직접 조회‧수정 하거나 개인정보 담당자 문의를 통해 열람을 요청할 수 있습니다.</li>
              <li>- 정보주체는 언제든지 ‘회원탈퇴’를 통해 개인정보의 수집 및 이용 동의 철회가 가능합니다.</li>
              <li>- 정보주체는 언제든지 모바일 ‘피드백’을 통해 자동화된 결정의 거부 및 설명 요구가 가능합니다.</li>
              <li>- 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수도 있습니다. 이 경우 “개인정보 처리 방법에 관한 고시” 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.</li>
              <li>- 정보주체가 개인정보 열람 및 처리 정지를 요구할 권리는 「개인정보 보호법」 제35조 제 4항 및 제37조 제2항에 의하여 제한될 수 있습니다.</li>
              <li>- 다른 법령에서 그 개인정보가 수집 대상으로 명시되어 있는 경우에는 해당 개인정보의 삭제를 요구할 수 없습니다.</li>
              <li>- 자동화된 결정이 이루어진다는 사실에 대해 정보주체의 동의를 받았거나, 계약 등을 통 해 미리 알린 경우, 법률에 명확히 규정이 있는 경우에는 자동화된 결정에 대한 거부는 인정되지 않으며 설명 및 검토 요구만 가능합니다.</li>
              <li>- 또한 자동화된 결정에 대한 거부‧설명 요구는 다른 사람의 생명‧신체‧재산과 그 밖의 이익을 부당하게 침해할 우려가 있는 등 정당한 사유가 있는 경우에는 그 요구가 거절될 수 있습니다.</li>
              <li>- 동구라미는 권리 행사를 한 자가 본인이거나 정당한 대리인인지를 확인합니다.</li>
            </ul>

            <p class="content">
              동구라미는 권리 행사를 아래 부서에 할 수 있습니다. 동구라미는 정보주체의 권리 행사가 신속 하게 처리되도록 노력하겠습니다.
            </p>

            <div class="bordered-box">
              <p class="list-title">개인정보 보호 담당팀</p>
              <p>담당자: 이동수, 이메일: dlehdtn0118@naver.com</p>
            </div>
          </div>

          <div id="section8" class="section">
            <h2>8. 개인정보 보호책임자의 성명 또는 개인정보 업무 담당부서 및 고충사항을 처리하는 부서에 관한 사항</h2>
            <p class="indent bold">
              동구라미는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div class="bordered-box">
              <p class="list-title">개인정보 보호책임자</p>
              <p>담당자: 이동수, 이메일: dlehdtn0118@naver.com</p>
            </div>
            <div class="bordered-box">
              <p class="list-title">개인정보 보호 담당팀</p>
              <p>담당자: 이동수, 이메일: dlehdtn0118@naver.com</p>
            </div>
            <p class="content">정보주체는 동구라미의 서비스를 이용하시면서 발생한 모든 개인정보보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의할 수 있습니다. 동구라미는 정보주체의 문의에 대해 지체없이 답변 및 처리해드릴 것입니다.</p>
          </div>


          <div id="section9" class="section">
            <h2>9. 정보주체의 권익침해에 대한 구제방법</h2>
            <p class="indent bold">
              정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다. 이 밖에 기타 개인정보 침해의 신고, 상담에 대하여는 아래의 기관에 문의하시기 바랍니다.
            </p>
            <div class="indented-section">
              <p>1. 개인정보 분쟁조정위원회 : (국번없이) 1833-6972 (www.kopico.go.kr)</p>
              <p>2. 개인정보침해신고센터 : (국번없이) 118 (privacy.kisa.or.kr)</p>
              <p>3. 대검찰청 : (국번없이) 1301 (www.spo.go.kr)</p>
              <p>4. 경찰청 : (국번없이) 182 (ecrm.cyber.go.kr)</p>
            </div>
            <p class="indent">동구라미는 정보주체의 개인정보자기결정권을 보장하고, 개인정보침해로 인한 상담 및 피해 구제를 위해 노력하고 있으며, 신고나 상담이 필요한 경우 아래의 담당부서로 연락해 주시기 바랍니다.</p>
            <div class="bordered-box">
              <p class="list-title">개인정보 보호 담당팀</p>
              <p>담당자: 이동수, 이메일: dlehdtn0118@naver.com</p>
            </div>
          </div>

          <div id="section10" class="section">
            <h2>10. 개인정보 처리방침의 변경</h2>
            <p class="indent bold">
              이 개인정보 처리방침은 2024.12.24부터 적용됩니다.</p>
            <p class="indent">이전의 개인정보 처리방침은 아래에서 확인하실 수 있습니다.</p>
            <div class="indented-section">
              <p>- 이전 개인정보 처리방침 없음.</p>
            </div>
          </div>

          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrivacyPolicy',
  methods: {
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 100; // Adjust this value as needed
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.container {
  display: flex;
}

.contents {
  flex: 1;
  padding-bottom: 40px;
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
  background-color: #fff;
  padding: 10px 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  font-size: 20px;
  color: #393939;
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




.section {
  margin-bottom: 2.5rem;
  scroll-margin-top: 2rem;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 1rem 0;
}

.indent {
  text-indent: 1rem;
  margin-bottom: 1rem;
  font-weight: 400;
}

.bold {
  font-weight: 700;
}


.toc {
  padding-left: 2rem;
}

.toc li {
  margin-bottom: 0.5rem;
  font-weight: 400;
}

.toc a {
  text-decoration: none;
  color: #333;
  transition: color 0.2s;
}

.toc a:hover {
  color: #007bff;
  text-decoration: underline;
}

.bullet-list {
  list-style-type: none;
  padding-left: 1.5rem;
}

.bullet-list li {
  margin-bottom: 0.5rem;
  font-weight: 400;
}

.bullet-list li::before {
  content: "-";
  position: absolute;
  left: -1rem;
}

.info-list {
  list-style-type: none;
  padding-left: 1rem;
}

.info-list li {
  margin-bottom: 0.5rem;
  font-weight: 400;
}

.sub-section {
  margin: 1.5rem 0;
  padding-left: 1rem;
}

.indented-section {
  margin-left: 3rem;
  margin-bottom: 1.5rem;
}

.bordered-box {
  border: 1px solid #ddd;
  padding: 1.5rem;
  margin-bottom: 1rem;
  background-color: #fff;
  border-radius: 4px;
}

.info-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.info-list li {
  margin-bottom: 0.8rem;
  line-height: 1.6;
}

.info-label {
  font-weight: 500;
  margin-left: 20px;
  margin-right: 0.5rem;
}

h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
}

.warning-text {
  color: #333;
  font-weight: 500;
}

/* 기존 .section 스타일 수정 */
.section {
  margin-bottom: 3rem;
  padding: 0 1rem;
}

/* 기존 .indent 스타일 수정 */
.indent {
  text-indent: 1rem;
  margin-bottom: 1.2rem;
  line-height: 1.6;
}

/* 제목 스타일 수정 */
h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #333;
}

/* 추가 반응형 스타일 */
@media (max-width: 768px) {
  .indented-section {
    margin-left: 1.5rem;
  }

  .bordered-box {
    padding: 1rem;
  }
}


.privacy-section {
  padding: 20px;
  line-height: 1.6;
}

.section-title {
  font-weight: bold;
  margin-bottom: 20px;
}

.subsection {
  margin-bottom: 30px;
  padding-left: 20px;
}

.subsection-title {
  font-size: 1rem;
  font-weight: bold;
  margin: 15px 0;
}

.content {
  margin: 10px 0;
  text-align: justify;
  padding-left: 20px;
}

.bold {
  font-weight: bold;
}

.numbered-list {
  list-style-type: decimal;
  padding-left: 20px;
}

.list-title {
  font-weight: bold;
  margin: 10px 0 5px 0;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  margin: 15px 0;
}

.info-table th,
.info-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.info-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.info-table th:nth-child(1),
.info-table td:nth-child(1) {
  width: 20%; /* Reduce width of '법적 근거' column */
}

.info-table th:nth-child(2),
.info-table td:nth-child(2) {
  width: 20%; /* Increase width of '수집하는 행태정보 항목' column */
}

.info-table th:nth-child(3),
.info-table td:nth-child(3) {
  width: 24%; /* Increase width of '수집하는 행태정보 항목' column */
}

/* Adjust the font size */
.info-table th,
.info-table td {
  font-size: 0.83rem; /* Make the font size smaller */
}


.contact-info {
  margin-top: 15px;
  padding-left: 20px;
}
</style>