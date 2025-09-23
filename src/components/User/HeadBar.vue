<template>
  <div class="header">
    <div class="left" @click="navigateTo('dashboard')">
      <img src="../../assets/dongurami_logo.png" alt="Dongurami Logo" class="logo" />
      <h1 class="title">동구라미</h1>
    </div>
    <div class="right">
      <NotificationButton />
    </div>
  </div>
</template>

<script>
import NotificationButton from "@/components/User/NotificationButton.vue";

export default {
  name: 'Headbar',
  components: { NotificationButton },
  methods: {
    navigateTo(routeName) {
      this.$router.push({ name: routeName }).catch(err => {
        if (err.name !== 'NavigationDuplicated') throw err;
      });
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');

/* 0) 공통 토큰 */
:root{
  --brand:#FFB052;
  --line:#E5E5E5;
  --radius:12px;
  --gap:12px;
}

/* 1) 페이지 래퍼: 휴대폰 폭에 맞춰 “해상도 틀” 잡기 */
.page {
  width: 100%;
  max-width: 420px;          /* 휴대폰 캔버스 폭 */
  margin: 0 auto;
  padding: 12px 10px 48px;
  box-sizing: border-box;
}

/* 2) 상단 카드(대표 이미지 + 요약) */
.club-card{
  background:#fff;
  border:1px solid var(--line);
  border-radius:var(--radius);
  box-shadow:0 1px 3px rgba(0,0,0,.06);
  overflow:hidden;
}
.club-card .thumb{
  width:100%;
  height: auto;              /* 이미지 비율 유지 */
  display:block;
}
.club-card .meta{
  padding:12px;
  display:grid;
  gap:8px;
}

/* 3) 섹션 카드 (정보, 버튼 모음 등) */
.section{
  background:#fff;
  border:1px solid var(--line);
  border-radius:var(--radius);
  padding:12px;
  margin-top:12px;
}

/* 4) 그리드: 모바일 1열 → 태블릿 2열 */
.grid{
  display:grid;
  grid-template-columns: 1fr;  /* 모바일: 1열 */
  gap: var(--gap);
}
@media (min-width: 768px){
  .page { max-width: 760px; padding: 16px 14px 64px; }
  .grid{ grid-template-columns: 1fr 1fr; } /* 태블릿↑ 2열 */
}
@media (min-width: 1024px){
  .page { max-width: 960px; }
  .grid{ grid-template-columns: repeat(3,1fr); } /* 데스크톱↑ 3열 */
}

/* 5) 탭/버튼/텍스트 크기 자동 조정 */
.h1 { font-size: clamp(1rem, 3.8vw, 1.35rem); font-weight:700; }
.btn{
  height: clamp(40px, 6.5vw, 48px);
  font-size: clamp(.9rem, 3.6vw, 1rem);
  border-radius:10px;
  border:1px solid var(--line);
  background: var(--brand);
  color:#fff;
  padding: 0 14px;
}
.badge{ font-size: clamp(.72rem, 3.2vw, .85rem); }

/* 6) “가나다순/비회원/회원” 탭 줄바꿈 대응 */
.tabs{
  display:flex; gap:6px; flex-wrap: wrap;
}
.tab{ padding:8px 10px; border:1px solid var(--line); border-radius:10px; }

/* 7) “회원 행(row)” : 모바일 세로 스택 → 태블릿 가로 한 줄 */
.member-row{
  display:flex;
  flex-direction: column;          /* 모바일: 세로 */
  gap:8px;
  padding:10px;
  border:1px solid var(--line);
  border-radius:10px;
  background:#fff;
}
.member-row .row{
  display:flex; gap:8px;
}
.member-row select,
.member-row input{
  flex:1 1 auto;
  min-height: 40px;
  font-size: clamp(.9rem, 3.6vw, 1rem);
  width:100%;
}
.member-row .actions{
  display:flex; gap:8px; justify-content:flex-end;
}
@media (min-width: 768px){
  .member-row{ flex-direction: row; align-items: center; }
  .member-row .row{ flex:1 1 auto; }
}

/* 8) 긴 문자열/링크로 레이아웃 깨짐 방지 */
*{ min-width: 0; }
.break{ word-break: break-all; overflow-wrap:anywhere; }

/* 9) 표를 카드로 바꾸기 어려우면, 가로 스크롤 허용 */
.table-wrap{ overflow-x:auto; }
table{ min-width:600px; }

/* 10) 아이콘/배지/이미지 */
img{ max-width:100%; height:auto; }

/* 11) 상단 헤더 고정(있으면) */
.header{ position: sticky; top: 0; z-index: 50; background:#fff; }

</style>
