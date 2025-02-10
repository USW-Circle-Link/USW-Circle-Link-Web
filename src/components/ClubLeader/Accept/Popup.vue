<!-- src/components/Popup.vue -->
<template>
  <div v-if="visible" class="popup-overlay">
    <div class="popup">
      <h3 class="popup-title">{{ title }}</h3>
      <div class="popup-divider"></div>
      <p class="popup-message" v-html="message"></p>
      <p v-if="subMessage" class="popup-sub-message" v-html="subMessage"></p>
      <p v-if="message2" class="popup-message2" v-html="message2"></p>
      <div class="popup-buttons">
        <button v-if="!hideCancelButton" @click="onCancel" class="cancel-button1">취소</button>
        <button @click="onConfirm" class="confirm-button1">확인</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    subMessage: {
      type: String,
      default: ''
    },
    message2: {
      type: String,
      required: true
    },
    hideCancelButton: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onCancel() {
      this.$emit('cancel');
    },
    onConfirm() {
      this.$emit('confirm');
    }
  }
};
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup {
  position: relative;
  width: 451px;
  height: 152px;
  background: #fff;
  border-radius: 8px;
  padding: 10px 20px 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.popup-title {
  color: #2F2F2F;
  font-size: 16px;
  font-weight: 500;
}

.popup-divider {
  border-top: 1px solid #ddd;
  margin: 10px 0;
}

.popup-message {
  color: #2F2F2F;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.popup-message2 {
  color: #2F2F2F;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.popup-sub-message {
  color: #FF3535;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  margin-bottom: 30px;
}


.popup-buttons {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-button1,
.confirm-button1 {
  display: flex;
  width: 80px;
  height: 32px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  border-radius: 8px;
  border: none; /* Remove border */
}

.cancel-button1 {
  background: #B9B9B9;
  color: white;
}

.confirm-button1 {
  background-color: #FFB052;
  color: white;
}

.confirm-button1:hover {
  background-color: #e09b4d;
}

.cancel-button1:hover {
  background: #a0a0a0;
}

.popup-sub-message,
.popup-message2 {
  display: inline;
}
</style>