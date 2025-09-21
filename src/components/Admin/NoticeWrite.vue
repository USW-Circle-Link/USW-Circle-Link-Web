<template>
  <div class="notice-write-container">
    <h2 class="title">공지사항 작성</h2>
<p></p>
    <!-- 401 에러 팝업 -->
    <Popup401 v-if="show401Popup" />

    <div v-if="notice">
      <!-- 제목 입력 영역 -->
<!-- 제목 입력 영역 -->
<div class="title-container" style="position: relative;">

  <label for="title-input" class="label">제목</label>

  <input
    id="title-input"
    v-model="notice.noticeTitle"
    @input="limitTitleLength"
    :class="{ 'input-error': notice.noticeTitle.length >= titleMaxLength }"
    class="title-input"
    placeholder="제목을 입력해 주세요. (200자 이내)"
  />

  <div class="title-character-count" :class="{ 'error-text': notice.noticeTitle.length >= titleMaxLength }">
  {{ notice.noticeTitle.length }} / {{ titleMaxLength }}
</div>

<span class="error-text" v-show="titleError">{{ titleError }}</span>

</div>



<div v-if="showSuccessPopup" class="popup-overlay">
  <div class="popup">
    <h2>동구라미</h2>
    <hr />
    <p class="confirm-message">공지사항이 정상적으로 저장되었어요.</p>
    <div class="popup-buttons">
      <button @click="closeSuccessPopup">확인</button>
    </div>
  </div>
</div>



<div v-if="showUnexpectedErrorPopup" class="popup-overlay">
      <div class="unexpectedPopup">
        <h2>동구라미</h2>
        <hr />
        <p class="confirm-message">
          <span class="error-highlight">예기치 못한 오류</span>가 발생했습니다.<br>문제가 계속될 시, 관리자에게 문의해주세요.</p>
        <div class="unexpectedPopup-buttons">
          <button @click="hideUnexpectedErrorPopup">확인</button>
        </div>
      </div>
    </div>


      <!-- 내용 입력 영역 -->
      <div class="content-container">
  <div class="textarea-wrapper">
    
    <textarea
  id="content-input"
  v-model="notice.noticeContent"
  @input="limitContentLength"
  :class="{ 'input-error': notice.noticeContent.length >= contentMaxLength }"
  class="content-input"
  placeholder="내용을 입력해 주세요. 사진은 5장까지 첨부 가능합니다."
></textarea>
<div class="character-count" :class="{ 'error-text': notice.noticeContent.length >= contentMaxLength }">
  {{ notice.noticeContent.length }} / {{ contentMaxLength }}
</div>

    <span v-if="contentError" class="error-text">{{ contentError }}</span>
  </div>
</div>

      <!-- 이미지 업로드 영역 -->
      <div class="image-upload-container">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="image-preview"
        >
          <img :src="image.src" alt="Uploaded Image" class="uploaded-image" />
          <div class="edit-icon" @click="editImage(index)">
            <img src="@/assets/penbrush.png" alt="Edit Icon" />
          </div>
          <div class="delete-icon" @click="deleteImage(index)">
            &times;
          </div>
          <input
            type="file"
            :ref="'fileInput' + index"
            @change="onImageChange(index, $event)"
            style="display: none;"
          />
        </div>

        <!-- 최대 5장 제한 -->
        <div v-if="images.length < 5" class="image-upload">
          <input type="file" @change="onImageUpload" />
          <div class="plus" @click="$event.target.previousElementSibling.click()">
            +
          </div>
        </div>
      </div>

      <!-- 완료 버튼 -->
      <button class="submit-button" @click="submitNotice" :disabled="isLoading">
        완료
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import store from '@/store/store';
import Popup401 from "@/components/Admin/401Popup.vue";

export default {
  name: 'NoticeWrite',
  components: {
    Popup401,
  },
  props: ['noticeUUID'],
  data() {
    return {
      notice: {
        noticeTitle: '',
        noticeContent: ''
      },
      images: [],             // 이미지 파일 및 미리보기 저장
      show401Popup: false,    // 401 에러 팝업
      showSuccessPopup: false, // 공지사항 작성 성공 팝업
      isLoading: false,       // 로딩 상태 (필요 시 사용)
      titleError: '', // 제목 오류 메시지
      contentError: '', // 내용 오류 메시지
      titleMaxLength: 200, // 제목 최대 글자 수
      contentMaxLength: 3000, // 내용 최대 글자 수
      showUnexpectedErrorPopup: false
    };
  },
  methods: {
    // 글자수 제한
    limitTitleLength() {
    if (this.notice.noticeTitle.length > this.titleMaxLength) {
      this.notice.noticeTitle = this.notice.noticeTitle.slice(0, this.titleMaxLength);
    }
  },
  limitContentLength() {
    if (this.notice.noticeContent.length > this.contentMaxLength) {
      this.notice.noticeContent = this.notice.noticeContent.slice(0, this.contentMaxLength);
    }
  },

    // 성공 팝업 닫기
    closeSuccessPopup() {
      this.showSuccessPopup = false;
      // 팝업 닫은 후 공지사항 목록 페이지로 이동
      this.$router.push({ name: 'Notice' });
    },

    // 이미지 삭제
    deleteImage(index) {
      this.images.splice(index, 1);
      this.$refs[`fileInput${index}`] = null; // 파일 입력 필드 초기화
    },

    // 예기치 못한 오류 팝업 숨기기
    hideUnexpectedErrorPopup() {
      this.showUnexpectedErrorPopup = false;
    },

    // 401 에러 공통 처리
    handle401Error(error) {
      if (error.response && error.response.status === 401) {
        this.show401Popup = true;
        return true;
      }
      return false;
    },

    // 이미지 업로드
    onImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const validExtensions = ['png', 'jpg', 'jpeg'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const maxFileSize = 10 * 1024 * 1024;

        if (validExtensions.includes(fileExtension) && file.size <= maxFileSize) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.images.push({ src: e.target.result, file });
            // 파일 입력 필드 초기화 (같은 파일 다시 업로드 가능)
            event.target.value = "";
          };
          reader.readAsDataURL(file);
        } else {
          alert('파일 형식이 맞지 않거나 크기가 초과되었습니다. (10MB 이하, png/jpg만 허용)');
        }
      }
    },

    // 이미지 수정 아이콘 클릭
    editImage(index) {
      this.$refs[`fileInput${index}`][0].click();
    },

    // 이미지 수정 실제 처리
    onImageChange(index, event) {
      if (!event || !event.target || !event.target.files) {
        console.error('Invalid event object:', event);
        return;
      }
      const file = event.target.files[0];
      if (!file) return;

      const validExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const maxFileSize = 10 * 1024 * 1024;

      if (validExtensions.includes(fileExtension) && file.size <= maxFileSize) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.images[index] = {
            ...this.images[index],
            src: e.target.result,
            file
          };
        };
        reader.readAsDataURL(file);
      } else {
        alert('파일 형식이 맞지 않거나 크기가 초과되었습니다. (10MB 이하, png/jpg만 허용)');
      }
    },

    // 공지사항 제출
    async submitNotice() {
      const maxTitleLength = 200;
      const maxContentLength = 3000;

      // 🔹 제목과 내용 입력 여부 확인 후 오류 메시지 설정
   if (this.notice.noticeTitle.trim() === "") {
        this.titleError = "* 제목을 입력해주세요.";
      } else {
        this.titleError = "";
      }

      if (this.notice.noticeContent.trim() === "") {
        this.contentError = "* 내용을 입력해주세요.";
      } else {
        this.contentError = "";
      }


      try {
        this.isLoading = true;

        // 전송할 데이터 구성
        const form = new FormData();
        const noticeData = {
          noticeTitle: this.notice.noticeTitle,
          // 공백과 줄바꿈 처리
          noticeContent: this.notice.noticeContent
            .replace(/ /g, '&nbsp;')
            .replace(/\n/g, '<br>'),
          photoOrders: this.images.length > 0
            ? this.images.map((_, index) => index + 1)
            : [],
        };

        // request JSON 부분
        form.append(
          'request',
          new Blob([JSON.stringify(noticeData)], { type: 'application/json' })
        );

        // 사진(파일)들 추가
        if (this.images.length > 0) {
          this.images.forEach((image) => {
            form.append('photos', image.file);
          });
        }

        // API 요청
        const response = await axios.post(
          `${store.state.apiBaseUrl}/notices`,
          form,
          {
            headers: {
              Authorization: `Bearer ${store.state.accessToken}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        // 정상 등록 시
        if (response.status === 200) {
          
          // 팝업 표시
          this.showSuccessPopup = true;
        }

        if (!response || !response.data) {
          console.error('응답 데이터 없음');
        //  alert('공지사항 제출에 실패했습니다. 다시 시도해주세요.');
          return;
        }

        // 서버 응답 상태 코드 확인
        if ([401].includes(response.status)) {
          let message = '';

          if (response.status === 401) {
            message = '인증되지 않은 사용자입니다. 다시 로그인해주세요.';
            this.$router.push({ name: 'Login' });
          }
          alert(message);
          return;
        }

        // presignedUrls 존재 시, 실제 S3 업로드
        const presignedUrls = response?.data?.data || [];
        if (Array.isArray(presignedUrls) && presignedUrls.length > 0) {
          await Promise.all(
            presignedUrls.map(async (url, index) => {
              const file = this.images[index].file;
              await axios.put(url, file, {
                headers: { 'Content-Type': file.type },
              });
            })
          );
        }

        // (여기서 팝업 띄우는 로직이 이미 위에서 처리됨)
        // 또는, 바로 이동시키고 싶다면 아래처럼 작성:
        // this.showSuccessPopup = true; // -> 팝업 표시
        // this.$router.push({ name: 'Notice' }); // -> 곧바로 이동

      } catch (error) {
        // 401 에러 처리
        if (error.response && error.response.status === 401) {
          this.show401Popup = true;
          return;
        }

        // 400 에러(유효성 실패 등)
        // if (error.response && error.response.status === 400) {
        //   const additionalData = error.response.data.additionalData;
        //   if (additionalData.noticeTitle) {
        //    // alert(additionalData.noticeTitle);
        //   }
        //   if (additionalData.noticeContent) {
        //     //alert(additionalData.noticeContent);
        //   }
        //   return;
        // }

        const errorCode = error?.response?.data?.code;

        if (errorCode === 'MAX_UPLOAD_SIZE_EXCEEDED') {
          alert(error.response.data.message);
          return;
        }

        if (errorCode === 'INVALID_TITLE_OR_CONTENT') {
          const additionalData = error.response.data.additionalData || {};
          if (additionalData.noticeTitle) {
            this.titleError = additionalData.noticeTitle;
          }
          if (additionalData.noticeContent) {
            this.contentError = additionalData.noticeContent;
          }
          return;
        }


        // 기타 에러
        console.error('공지사항 제출 실패:', error.response || error.message);
      //  alert('공지사항 제출에 실패했습니다. 다시 시도해주세요.');
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
/* 전체 컨테이너 */
.notice-write-container {
  width: 100%;
  min-width: 390px;
  margin: 0 auto;
  padding: 10px;
}

/* 초과 시 테두리 빨갛게 */
.input-error {
  border: 1px solid red !important;
}

/* 초과 시 글자 수 빨갛게 */
.error-text {
  color: red !important;
  font-size: 14px;
  
  margin-top: 5px;
}



/* 페이지 제목 */
.title {
  color: #000000;
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 0px;
  margin-top: -20px;
  position: relative;
  display: inline-block;
  z-index: 1;
}
.title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 2px;
  width: 102.5%;
  z-index: -1;
  transform: skew(-12deg);
}

/* 라벨 스타일 */
.label {
  font-size: 18px;
  color: #000000;
  display: block;
  margin-bottom: 5px;
  /* font-weight: bold; */
}

/* 제목 입력창 */
.title-input {
  margin-top: 10px;
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

/* 내용 입력창 영역 */
.content-container {
  margin-top: 25px;
}

.textarea-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}

.content-input {
  width: 100%;
  height: 382px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: none;
  position: relative;
}

.title-container {
  position: relative;
  min-height: 85px; /* error-text 높이 고려한 값 */
}

.character-count {
  position: absolute;
  bottom: 10px; 
  right: -10px;
  font-size: 12px;
  color: black;
  background: rgba(255, 255, 255, 0.8);
  padding: 2px 5px;
  border-radius: 3px;
}

.title-character-count {
  position: absolute;
  top: 52px;
  right: -5px;
  font-size: 12px;
  color: black;
  pointer-events: none;
}


/* 포커스 시 검정 테두리 제거 */
input:focus,
textarea:focus {
  outline: none;
  border: 1px solid #ddd; /* 기존 그대로 유지 */
  box-shadow: none;
  transform: none;
}

input,
textarea {
  transition: none !important;
  transform: none !important;
}


/* 이미지 업로드 영역 */
.image-upload-container {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 153.96px;
  background-color: white;
  padding: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  margin-top: 25px;
}
.image-preview {
  position: relative;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
  width: 142px;
  height: 95.88px;
  flex: 0 0 auto;
  background-color: #ECECEC;
  margin-left: 7px;
}
.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #ECECEC;
}
.edit-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  filter: invert(100%);
  cursor: pointer;
}
.edit-icon img {
  width: 100%;
  height: 100%;
}
.delete-icon {
  position: absolute;
  top: 0px;
  right: 0px;
  font-size: 24px;
  color: #fff;
  cursor: pointer;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 30px;
}

/* + 버튼 */
.image-upload {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 138px;
  height: 92px;
  border: 2px solid #ddd;
  background: #ececec;
  border-radius: 5px;
  cursor: pointer;
  position: relative;
  flex: 0 0 auto;
  margin-left: 7px;
}
.image-upload input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
.plus {
  position: absolute;
  display: flex;
  background: hsla(0,0%,100%,.7);
  border-radius: 50%;
  width: 25px;
  height: 25px;
  justify-content: center;
  font-size: 20px;
  font-weight: 900;
  color: #696969;
  border: 2px solid #ddd;
  box-shadow: 0 0 1px rgba(0,0,0,.1);
  align-items: center;
}

/* 완료 버튼 */
.submit-button {
  display: block;
  width: 102.5px;
  height: 45px;
  padding: 10px;
  margin: 20px 0 20px auto;
  background-color: #FFB052;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  text-align: center;
}

.popup {
  position: fixed; /* 고정 위치 */
  top: 50%;         /* 수직 중앙 */
  left: 50%;        /* 수평 중앙 */
  transform: translate(-50%, -50%); /* 정확한 중앙 배치 */
  
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 500px;
  height: 180px;
  z-index: 1001; /* overlay보다 높게 */
}

.popup h2 {
  margin-top: 0;
  text-align: left;
  font-size: 16px; /* 👈 여기서 줄이세요 (기존 24px → 18px 추천) */
  font-weight: 500; /* 굵기도 조절 가능 */
}

hr {
  border: none;
  border-top: 1px solid #ccc;
  margin: 10px 0;
}
.confirm-message {
  text-align: left;
}
.popup-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 40px;
}
.popup-buttons button {
  width: 80px;
  height: 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-left: 10px;
  background: #ffb052;
  color: white;
}


/* 팝업 전체 화면 덮는 반투명 배경 */
.popup-overlay {
  position: fixed;
  top: 0; 
  left: 0;
  width: 100%; 
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

/* 팝업 박스: 452x182 고정 크기, 중앙 정렬 */
.write-popup {
  position: absolute;
  width: 452px;
  height: 182px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  box-sizing: border-box;
  padding: 20px; /* 내부 여백 */
  
  display: flex;
  flex-direction: column; /* 위->아래로 배치 */
}

/* 제목: 왼쪽 정렬, 폰트 크기/두께 조정 */
.popup-title {
  margin: 0;
  font-size: 16px; /* 필요 시 조정 */
  font-weight: 700;
  text-align: left;
  color: #333;
}

/* 구분선 */
.popup-divider {
  width: 100%;
  height: 1px;
  background-color: #ECECEC; /* 연한 회색 */
  margin: 8px 0;
}

/* 메시지: 왼쪽 정렬 */
.popup-message {
  margin: 0;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: left;
  color: #666;
  line-height: 1.4;
  /* flex: 1;  // 필요한 경우 버튼을 하단으로 밀고 싶으면 사용 */
}

/* 버튼 컨테이너: 오른쪽 정렬 */
.popup-buttons {
  display: flex;
  justify-content: flex-end;
}

/* [확인] 버튼 */
.confirm-button {
  background-color: #FFB052;
  color: #fff;
  border: none;
  border-radius: 4px;
  width: 60px;
  height: 32px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
}
.popup-message {
  margin: 20px 0 20px; /* 상단 마진 추가: margin-top: 20px */
  font-size: 14px;
  text-align: left;
  color: black;
  line-height: 1.4;
}

</style>
