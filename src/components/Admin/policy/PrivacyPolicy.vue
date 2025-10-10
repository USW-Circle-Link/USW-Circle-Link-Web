<template>
  <div class="container">
    <div class="contents">
      <h2 class="title">개인정보 처리방침</h2>

      <div class="notices">
        <h2 class="centered-title">동구라미 서비스 개인정보 처리방침</h2>
        <hr class="divider" />

        <!-- 서문 -->
        <section class="section">
          <h2>서문</h2>
          <p class="indent">
            동구라미는 정보주체의 자유와 권리 보호를 위해 「개인정보 보호법」 및 관계 법령이 정한 바를 준수하여, 적법하게 개인정보를 처리하고 안전하게 관리하고 있습니다. 이에 「개인정보 보호법」 제30조에 따라 정보주체에게 개인정보의 처리와 보호에 관한 절차 및 기준을 안내하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립‧공개합니다.
          </p>
          <p class="indent">본 개인정보처리방침은 동구라미가 제공하는 서비스에 적용됩니다.</p>
        </section>

        <!-- 목차 -->
        <section class="section">
          <h2>목차</h2>
          <ol class="toc">
            <li><a href="#section1" @click.prevent="scrollToSection('section1')">개인정보의 처리목적</a></li>
            <li><a href="#section2" @click.prevent="scrollToSection('section2')">처리하는 개인정보 항목</a></li>
            <li><a href="#section3" @click.prevent="scrollToSection('section3')">개인정보의 처리 및 보유 기간</a></li>
            <li><a href="#section4" @click.prevent="scrollToSection('section4')">개인정보의 파기 절차 및 방법</a></li>
            <li><a href="#section5" @click.prevent="scrollToSection('section5')">개인정보의 안전성 확보조치에 관한 사항</a></li>
            <li><a href="#section6" @click.prevent="scrollToSection('section6')">개인정보 자동 수집 장치의 설치‧운영 및 거부에 관한 사항</a></li>
            <li><a href="#section7" @click.prevent="scrollToSection('section7')">정보주체와 법정대리인의 권리‧의무 및 행사방법</a></li>
            <li><a href="#section8" @click.prevent="scrollToSection('section8')">개인정보 보호책임자 등</a></li>
            <li><a href="#section9" @click.prevent="scrollToSection('section9')">권익침해 구제방법</a></li>
            <li><a href="#section10" @click.prevent="scrollToSection('section10')">개인정보 처리방침의 변경</a></li>
          </ol>
        </section>

        <!-- 1 -->
        <section id="section1" class="section">
          <h2>1. 개인정보의 처리목적</h2>
          <p class="indent bold">
            동구라미는 아래의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도 동의를 받는 등 필요한 조치를 이행하고 있습니다.
          </p>
          <ul class="bullet-list">
            <li>회원 가입 의사 확인</li>
            <li>본인 확인을 통한 회원 관리</li>
            <li>회원자격 유지‧관리</li>
            <li>부정가입 및 이용 방지</li>
            <li>서비스 제공</li>
          </ul>
        </section>

        <!-- 2 -->
        <section id="section2" class="section">
          <h2>2. 처리하는 개인정보 항목</h2>
          <p class="indent bold">
            서비스 제공을 위해 필요 최소한의 범위에서 개인정보를 수집‧이용합니다.
          </p>

          <div class="indented-section">
            <div class="bordered-box">n
              <h3>회원가입 시</h3>
              <ul class="info-list">
                <li><span class="info-label">수집 항목</span> [필수] ID, 비밀번호, 이름, 전화번호, 학번, 학과, 이메일</li>
                <li><span class="info-label">수집 목적</span> 서비스 이용 및 제공</li>
                <li><span class="info-label">보유기간</span> 회원 탈퇴 시까지</li>
              </ul>
            </div>

            <div class="bordered-box">
              <h3>동아리 생성 시</h3>
              <ul class="info-list">
                <li><span class="info-label">수집 항목</span> [필수] 이름, 전화번호</li>
                <li><span class="info-label">수집 목적</span> 서비스 이용 및 제공</li>
                <li><span class="info-label">보유기간</span> 동아리 삭제 시까지</li>
              </ul>
            </div>
          </div>

          <div class="indented-section">
            <div class="bordered-box">
              <h3>서비스 운영</h3>
              <ul class="info-list">
                <li><span class="info-label">법적 근거</span> 개인정보 보호법 제15조 제1항 제1호</li>
                <li><span class="info-label">항목</span> ID, 이름, 전화번호, 학번, 학과, 이메일</li>
              </ul>
            </div>
          </div>

          <p class="indent warning-text">만 14세 미만 아동은 회원가입이 불가합니다.</p>
        </section>

        <!-- 3 -->
        <section id="section3" class="section">
          <h2>3. 개인정보의 처리 및 보유 기간</h2>
          <p class="indent bold">법령 또는 동의한 기간 내에서 처리‧보유합니다.</p>
          <div class="indented-section">
            <p>1. 서비스 회원 가입 및 관리 : 회원 탈퇴 시까지</p>
          </div>
        </section>

        <!-- 4 -->
        <section id="section4" class="section">
          <h2>4. 개인정보의 파기 절차 및 방법</h2>
          <p class="indent bold">보유기간 경과, 처리목적 달성 시 지체없이 파기합니다.</p>
          <div class="indented-section">
            <p>1. 파기절차: 사유 발생 시 즉시 파기</p>
            <p>2. 파기방법: 전자파일은 복구 불가 방식으로, 종이는 분쇄 등으로 파기</p>
          </div>
        </section>

        <!-- 5 -->
        <section id="section5" class="section">
          <h2>5. 개인정보의 안전성 확보조치에 관한 사항</h2>
          <p class="indent bold">동구라미는 다음과 같은 조치를 취하고 있습니다.</p>
          <ul class="bullet-list">
            <li>클라우드 보안조치 및 시큐어 코딩</li>
            <li>개인정보 암호화 및 암호화 통신 적용</li>
          </ul>
        </section>

        <!-- 6 -->
        <section id="section6" class="section">
          <h2 class="section-title">6. 개인정보 자동 수집 장치의 설치‧운영 및 거부</h2>

          <div class="subsection">
            <h3 class="subsection-title">&lt;설치‧운영하는 개인정보 자동 수집 장치&gt;</h3>
            <p class="content">
              쿠키(cookie)를 사용합니다. 브라우저 설정에서 허용/차단을 선택할 수 있으며, 차단 시 맞춤형 서비스 이용에 제한이 있을 수 있습니다.
            </p>
          </div>

          <div class="subsection">
            <h3 class="subsection-title">&lt;쿠키 허용/차단 방법&gt;</h3>
            <ol class="numbered-list">
              <li>
                <p class="list-title">웹브라우저</p>
                <ul class="bullet-list">
                  <li>크롬: 설정 &gt; 개인정보 보호 및 보안 &gt; 인터넷 사용 기록 삭제</li>
                  <li>엣지: 설정 &gt; 쿠키 및 사이트 권한 &gt; 쿠키 및 사이트 데이터 관리 및 삭제</li>
                </ul>
              </li>
              <li>
                <p class="list-title">모바일 브라우저</p>
                <ul class="bullet-list">
                  <li>크롬: 설정 &gt; 개인정보 보호 및 보안 &gt; 인터넷 사용 기록 삭제</li>
                  <li>사파리: 기기 설정 &gt; 사파리 &gt; 고급 &gt; 모든 쿠키 차단</li>
                  <li>삼성 인터넷: 설정 &gt; 인터넷 사용 기록 &gt; 인터넷 사용 기록 삭제</li>
                </ul>
              </li>
            </ol>
          </div>

          <div class="subsection">
            <h3 class="subsection-title">&lt;행태정보의 수집‧이용‧제공 및 거부 등에 관한 사항&gt;</h3>
            <p class="content"><span class="bold">동구라미는 쿠키를 활용하여 개인을 식별 가능한 형태로 행태정보를 수집‧이용하고 있습니다.</span></p>
            <p class="content">자사 웹사이트에서 아래와 같이 행태정보를 수집합니다.</p>

            <div class="table-responsive">
              <table class="info-table">
                <thead>
                  <tr>
                    <th>법적 근거</th>
                    <th>수집 항목</th>
                    <th>수집 방법</th>
                    <th>수집 목적</th>
                    <th>보유‧이용기간</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>개인정보보호법 제15조 제1항 제1호</td>
                    <td>로그인 내역</td>
                    <td>로그인 시 자동 수집</td>
                    <td>자동 로그인</td>
                    <td>수집일로부터</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p class="content">행태정보 관련 문의/거부권 행사는 아래로 연락해 주세요.</p>
            <div class="bordered-box">
              <p class="list-title">개인정보 보호 담당팀</p>
              <p>담당자: 이동수, 이메일: dlehdtn0118@naver.com</p>
            </div>
          </div>
        </section>

        <!-- 7 -->
        <section id="section7" class="section">
          <h2>7. 정보주체와 법정대리인의 권리‧의무 및 행사방법</h2>
          <p class="indent bold">
            정보주체는 열람‧정정‧삭제‧처리정지 및 철회 요구, 자동화된 결정에 대한 거부 또는 설명 요구를 할 수 있습니다.
          </p>
          <ul class="bullet-list">
            <li>모바일 '내 정보 &gt; 내 정보 수정'에서 직접 조회/수정 또는 담당자에게 열람 요청</li>
            <li>'회원탈퇴'를 통해 수집 및 이용 동의 철회</li>
            <li>모바일 '피드백'을 통해 자동화된 결정의 거부 및 설명 요구</li>
            <li>대리인 행사 시 위임장 제출(별지 제11호 서식)</li>
            <li>법령에 따른 제한 및 예외 사항 존재</li>
          </ul>
          <div class="bordered-box">
            <p class="list-title">개인정보 보호 담당팀</p>
            <p>담당자: 이동수, 이메일: dlehdtn0118@naver.com</p>
          </div>
        </section>

        <!-- 8 -->
        <section id="section8" class="section">
          <h2>8. 개인정보 보호책임자 등</h2>
          <p class="indent bold">아래와 같이 지정합니다.</p>
          <div class="bordered-box">
            <p class="list-title">개인정보 보호책임자</p>
            <p>담당자: 이동수, 이메일: dlehdtn0118@naver.com</p>
          </div>
          <div class="bordered-box">
            <p class="list-title">개인정보 보호 담당팀</p>
            <p>담당자: 이동수, 이메일: dlehdtn0118@naver.com</p>
          </div>
        </section>

        <!-- 9 -->
        <section id="section9" class="section">
          <h2>9. 권익침해 구제방법</h2>
          <div class="indented-section">
            <p>1. 개인정보 분쟁조정위원회 : 1833-6972 (kopico.go.kr)</p>
            <p>2. 개인정보침해신고센터 : 118 (privacy.kisa.or.kr)</p>
            <p>3. 대검찰청 : 1301 (spo.go.kr)</p>
            <p>4. 경찰청 : 182 (ecrm.cyber.go.kr)</p>
          </div>
          <div class="bordered-box">
            <p class="list-title">개인정보 보호 담당팀</p>
            <p>담당자: 이동수, 이메일: dlehdtn0118@naver.com</p>
          </div>
        </section>

        <!-- 10 -->
        <section id="section10" class="section">
          <h2>10. 개인정보 처리방침의 변경</h2>
          <p class="indent bold">이 개인정보 처리방침은 2024.12.24부터 적용됩니다.</p>
          <p class="indent">이전의 개인정보 처리방침은 아래에서 확인하실 수 있습니다.</p>
          <div class="indented-section">
            <p>- 이전 개인정보 처리방침 없음</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrivacyPolicy',
  methods: {
    scrollToSection (id) {
      const el = document.getElementById(id);
      if (!el) return;
      const off = 100;
      const y = el.getBoundingClientRect().top + window.pageYOffset - off;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
}
</script>

<style scoped>
* { box-sizing: border-box; }

/* 1) 레이아웃: 고정 min-width 제거 */
.container { display: flex; width: 100%; }            /* 가로 숨김 제거 */
.contents  { flex: 1; min-width: 0; padding: 0 12px 40px; } /* 축소 허용 + 좌우 여백 */
.title     { font-size: clamp(16px,3vw,20px); font-weight: 600; margin-bottom: 20px; color:#333; }

/* 2) 카드 */
.notices {
  inline-size: min(100%, 820px);   /* width:100% + max-width 대체(안전) */
  margin: 0 auto;
  background: #fff;
  border-radius: 10px;
  padding: 10px 16px;              /* 모바일에서 여유 */
  box-shadow: 0 2px 4px rgba(0,0,0,.1);
  overflow-wrap: anywhere;
}
.notices * { min-width: 0; max-width: 100%; }

/* 4) 제목/구분선 */
.centered-title { text-align:center; font-size: clamp(16px,3vw,20px); font-weight:700; color:#393939; margin:20px 0; }
.divider { width:100%; border:0; border-top:1px solid #C6C6C6; margin:0 0 16px; }

/* 5) 본문 */
.section { margin-bottom: 2.5rem; padding: 0 1rem; scroll-margin-top: 2rem; }
.section h2, h2 { font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; color:#333; }
.section h3, h3 { font-size: 1.1rem; font-weight: 600; margin: .5rem 0 1rem; color:#333; }
.indent { text-indent: 1rem; margin-bottom: 1rem; line-height: 1.6; }
.bold { font-weight: 700; }

/* 6) 리스트 */
.toc { padding-left: 1.25rem; }
.toc li { margin-bottom: .5rem; }
.toc a { color:#333; text-decoration:none; }
.toc a:hover { color:#007bff; text-decoration: underline; }

.bullet-list { list-style: none; padding-left: 1.25rem; margin: .5rem 0; }
.bullet-list li { position: relative; padding-left: 1rem; margin-bottom: .5rem; }
.bullet-list li::before { content: "•"; position: absolute; left: 0; top: 0; }

/* 7) 정보 블록 */
.indented-section { margin-left: 1.25rem; margin-bottom: 1.25rem; }
.bordered-box { border:1px solid #ddd; padding:1rem; margin-bottom:1rem; border-radius:4px; background:#fff; }
.info-list { list-style:none; padding:0; margin:0; }
.info-list li { margin-bottom:.6rem; line-height:1.6; }
.info-label { display:inline-block; font-weight:600; margin-right:.5rem; }
.warning-text { color: #d32f2f; font-weight: 500; }

/* 8) 서브섹션 */
.subsection { margin-bottom: 1.5rem; padding-left: 1rem; }
.subsection-title { font-size: 1rem; font-weight: 600; margin: 1rem 0; }
.content { margin: 0.75rem 0; line-height: 1.6; }
.list-title { font-weight: 600; margin: 0.5rem 0; }
.numbered-list { list-style-type: decimal; padding-left: 1.5rem; }

/* 9) 표: 래퍼에만 가로 스크롤 허용 */
.table-responsive {
  display: block;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 1rem 0;
}
.info-table { border-collapse: collapse; table-layout: fixed; min-width: 520px; width: 100%; }
.info-table th, .info-table td { border:1px solid #ddd; padding:8px; text-align:center; font-size:.83rem; word-break: break-word; }
.info-table th { background:#f5f5f5; font-weight:700; }

/* 10) 좁은 화면 보정 */
@media (max-width: 630px) {
  .notices { padding: 12px; }
  .section { padding: 0 .75rem; }
  .indented-section { margin-left: .75rem; }
}
@media (max-width: 390px) {
  .notices { padding: 10px; }
  .indented-section { margin-left: .5rem; }
}
</style>