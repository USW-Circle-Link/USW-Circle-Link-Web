
<template> 
  <div>
    <h2 class="title">공지사항 작성</h2>

    <div v-if="notice">
      <div class="title-container">
        <label for="title-input" class="label">제목</label>
        <input id="title-input" v-model="notice.noticeTitle" class="title-input" placeholder="제목을 입력해 주세요. (100자 이내)" />
      </div>
      <div class="content-container">
        <!-- <label for="content-input" class="label">내용</label> -->
        <div class="textarea-wrapper">
          <textarea 
          id="content-input" 
          v-model="notice.noticeContent" 
          class="content-input" 
          placeholder="내용을 입력해 주세요. 사진은 5장까지 첨부 가능합니다."
          @input="limitContentLength" 
        ></textarea>

          <div class="character-count">{{ notice.noticeContent.length }} / 3000</div> <!-- 글자 수 표시 -->
        </div>
      </div>
      <div class="image-upload-container">
        <div v-for="(image, index) in images" :key="index" class="image-preview">
          <img :src="image.src" alt="Uploaded Image" class="uploaded-image" />
          <div class="edit-icon" @click="editImage(index)">
            <img src="@/assets/penbrush.png" alt="Edit Icon" />
          </div>
          <div class="delete-icon" @click="deleteImage(index)">
            &times;
          </div>
          <input type="file" :ref="'fileInput' + index" @change="onImageChange(index, $event)" style="display: none;" />

        </div>
        <div v-if="images.length < 5" class="image-upload">
          <input type="file" @change="onImageUpload" />
          <span>+</span>
        </div>
      </div>
      <button class="submit-button" @click="submitNotice">작성 완료</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import store from '@/store/store';

export default {
  name: 'NoticeWrite',
  props: ['id'],
  data() {
    return {
      notice: { noticeTitle: '', noticeContent: '' },
      notices: [],
      images: [], // 이미지 파일과 미리보기를 저장할 배열
    };
  },
  methods: {
    limitContentLength() {
    const maxContentLength = 3000;
    if (this.notice.noticeContent.length > maxContentLength) {
      this.notice.noticeContent = this.notice.noticeContent.slice(0, maxContentLength);
    }
  },
  async fetchNotices() {
      try {
        const accessToken = store.state.accessToken;
        const response = await axios.get(
          `http://15.164.246.244:8080/notices?page=${this.currentPage - 1}&size=${this.itemsPerPage}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        this.notices = response.data.data.content || []; // 공지사항 목록 설정
        this.totalPages = response.data.data.totalPages || 1; // 전체 페이지 수 설정
      } catch (error) {
        console.error('공지사항 목록을 가져오는 중 오류:', error);
      }
    },
    fetchNotice(id) {
      const notice = this.notices.find(notice => notice.noticeId == id);
      if (notice) {
        this.notice = notice;
        this.images = notice.noticePhotos ? notice.noticePhotos.map(src => ({ src })) : [];
      } else {
        this.notice = { noticeTitle: '', noticeContent: '' };
        this.images = [];
      }
    },
    onImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const validExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (validExtensions.includes(fileExtension)) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.images.push({ src: e.target.result, file });
          };
          reader.readAsDataURL(file);
        } else {
          alert("파일 형식이 맞지 않습니다. \n10MB 이하 .png, .jpg, .jpeg, .gif, .bmp, .webp, .tiff 형식의 파일을 입력하세요.");
        }
      }
    },
    onImageChange(index) {
      const fileInput = this.$refs[`fileInput${index}`][0];
      if (fileInput && fileInput.files[0]) {
        const file = fileInput.files[0];
        const validExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const maxFileSize = 10 * 1024 * 1024; // 10MB
        if (validExtensions.includes(fileExtension) && file.size < maxFileSize) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.images.splice(index, 1, { src: e.target.result, file }); // Vue 3에서 splice로 대체
          };
          reader.readAsDataURL(file);
        } else {
          alert("파일 형식이 맞지 않거나 파일 크기가 10MB를 초과합니다. \n10MB 이하의 .png, .jpg, .jpeg, .gif, .bmp, .webp, .tiff 형식의 파일을 선택하세요.");
        }
      }
    },
    editImage(index) {
      this.$refs[`fileInput${index}`][0].click();
    },

    async submitNotice() {
      const maxTitleLength = 100;
      const maxContentLength = 3000;

      if (this.notice.noticeTitle.length > maxTitleLength) {
        alert(`공지사항 제목은 ${maxTitleLength}자 이내로 작성해야 합니다.`);
        return;
      }

      if (this.notice.noticeContent.length > maxContentLength) {
        alert(`공지사항 내용은 ${maxContentLength}자 이내로 작성해야 합니다.`);
        return;
      }

      try {
        const form = new FormData();

        const noticeData = {
          noticeTitle: this.notice.noticeTitle,
          noticeContent: this.notice.noticeContent
              .replace(/ /g, '&nbsp;')
              .replace(/\n/g, '<br>'),
          photoOrders: this.images.map((_, index) => index + 1)
        };
        form.append('request', new Blob([JSON.stringify(noticeData)], { type: 'application/json' }));

        this.images.forEach((image, index) => {
          form.append('photos', image.file);
        });

        const response = await axios.post('http://15.164.246.244:8080/notices', form, {
          headers: {
            'Authorization': `Bearer ${store.state.accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data && response.data.data && Array.isArray(response.data.data.noticePhotos)) {
          await Promise.all(response.data.data.noticePhotos.map(async (photoUrl, index) => {
            const photoResponse = await axios.put(photoUrl, this.images[index].file, {
              headers: {
                'Content-Type': this.images[index].file.type,
              }
            });
           // console.log(`Image ${index + 1} uploaded successfully:`, photoResponse);
          }));
        }

        alert('공지사항이 성공적으로 등록되었습니다!');
        this.$router.push({ name: 'Notice' });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          alert('인증되지 않은 사용자입니다. 다시 로그인해주세요.');
        } else if (error.response && error.response.data.code === 'FILE-308') {
          alert('업로드 가능한 사진 갯수를 초과했습니다.');
        } else if (error.response && error.response.data.code === 'NOT-203') {
          alert('제목과 내용을 모두 입력해주세요.');
        } else {
          alert('공지사항 제출에 실패했습니다.');
        }
      }
    },
  },
  created() {
    this.fetchNotices();
  }
};
</script>



<style scoped>
.title {
  color: #000000;

  font-size: 30px;
  font-weight: bold;
  margin-bottom: 30px;
  margin-top: 10px;
  position: relative; /* 상대 위치 설정 */
  display: inline-block;
  z-index: 1; /* 텍스트가 배경색 위에 오도록 설정 */
}
.label {
  font-size: 18px; /* 글씨 크기를 20px로 변경 */
  /*  필요 시 굵게 표시 */
  color: #000000; /* 필요 시 색상 변경 */
}



.title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 2px; /* 텍스트 아래쪽 위치 조정 */
  width: 102.5%;
  
; /* 노란색 배경 */
  z-index: -1; /* 텍스트 뒤에 위치하도록 설정 */
  transform: skew(-12deg); /* 기울기 효과 추가 */
}

.character-count {
    text-align: right; /* 글자 수 우측 정렬 */
    font-size: 14px; /* 글자 크기 */
    color: #666; /* 글자 색상 */
    margin-top: 5px; /* 위쪽 여백 */
}

* {
  box-sizing: border-box;
}

.title-container{
  margin-top:30px ;
}

.content-container 
{
  margin-top: 35px; /* 내용 입력 필드 위 여백 추가 */
}

.image-upload-container {
  
  margin-top: 30px; 
}

.label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.title-input {
  margin-top: 10px; /* 위 요소와 간격 */
  width: 100%; /* 입력창 크기 */
  padding: 10px; /* 내부 여백 */
  font-size: 16px; /* 입력창 글씨 크기 */
  border: 1px solid #ddd; /* 테두리 */
  border-radius: 5px; /* 모서리 둥글기 */
}


/* 텍스트 영역 wrapper 스타일 */
.textarea-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}

/* 글자 수 카운터 스타일 */
.character-count {
  position: absolute;
  bottom: 10px; /* textarea 내부에서 아래쪽 여백 */
  right: 15px; /* textarea 내부에서 오른쪽 여백 */
  font-size: 12px;
  color: #999;
  pointer-events: none; /* 클릭 불가 설정 */
}

.content-input {
  width: 817px;
  height: 382px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: none;
  position: relative; /* 카운터 위치 조정을 위해 relative 설정 */
}

.image-upload-container {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 815px;
  height: 153.96px;
  background-color: white;
  padding: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

.image-preview {
  position: relative;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
  width: 142px; /* 이미지 업로드 후에도 너비를 142px로 고정 */
  height: 95.88px; /* 이미지 업로드 후에도 높이를 95.88px로 고정 */
  flex: 0 0 auto;
  background-color: #ECECEC
;
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
  cursor: pointer;
}

.edit-icon img {
  width: 100%;
  height: 100%;
}

.image-upload {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 142px;
  height: 95.88px;
  border: 2px  #ddd;
  border-radius: 5px;
  cursor: pointer;
  position: relative;
  flex: 0 0 auto;
  background: #ECECEC;

}

.image-upload input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.image-upload span {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px; /* 플러스 기호 크기 */
  color: #515151; /* 플러스 기호 색상 */
  font-weight: bold;
  width: 22px; /* 동그라미 크기 */
  height: 22px;
  background-color: white; /* 흰색 배경 */
  border-radius: 50%; /* 원형 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
}



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

.title-input::placeholder, 
.content-input::placeholder, 
.image-upload input::placeholder {
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 400;
  line-height: 14px;
  letter-spacing: -0.025em;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
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

</style>
