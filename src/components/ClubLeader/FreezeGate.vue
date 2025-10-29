<template>
  <div v-if="active" class="freeze-overlay" @click.stop @wheel.stop @touchmove.prevent @contextmenu.prevent>
    <div class="freeze-dialog" role="dialog" aria-modal="true" @keydown.stop>
      <h2 class="title">엑셀 업로드 기능이 삭제되었습니다.</h2>
      <p class="desc">{{ message }}</p>
      <button class="confirm" @click="goBack">확인</button>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'FreezeGate',
  props: {
    active: { type: Boolean, default: false },
    message: {
      type: String,
      default: '현재 페이지는 일시적으로 이용이 제한됩니다.'
    }
  },
  setup() {
    const router = useRouter()
    const goBack = () => router.push('/main/passer-management')
    return { goBack }
  },
  watch: {
    active(v) { document.body.style.overflow = v ? 'hidden' : '' }
  },
  unmounted() { document.body.style.overflow = '' }
}
</script>

<style scoped>
.freeze-overlay{
  position: fixed; inset: 0; display: grid; place-items: center;
  background: rgba(0,0,0,.45); z-index: 9999;
  pointer-events: all;
}
.freeze-dialog{
  min-width: 320px; max-width: 90vw; padding: 24px 20px;
  background: #fff; border-radius: 14px; box-shadow: 0 10px 30px rgba(0,0,0,.25);
}
.title{ margin: 0 0 8px; font-size: 20px; font-weight: 700; }
.desc{ margin: 0 0 16px; line-height: 1.5; color: #444; white-space: pre-line; }
.confirm{
  display: inline-block; padding: 10px 16px; border: 0; border-radius: 10px;
  background: #111; color:#fff; cursor: pointer;
}
</style>
