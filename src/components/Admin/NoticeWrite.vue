<template>
  <div>
    <h2 class="title">공지사항 작성</h2>

    <div v-if="notice">
      <div class="title-container">
        <label for="title-input" class="label">제목</label>
        <input id="title-input" v-model="notice.noticeTitle" class="title-input" />
      </div>
      <div class="content-container">
        <label for="content-input" class="label">내용</label>
        <textarea id="content-input" v-model="notice.noticeContent" class="content-input"></textarea>
      </div>
      <div class="image-upload-container">
        <div v-for="(image, index) in images" :key="index" class="image-preview">
          <img :src="image.src" alt="Uploaded Image" class="uploaded-image" />
          <div class="edit-icon" @click="editImage(index)">
            <img src="@/assets/penbrush.png" alt="Edit Icon" />
          </div>
          <input type="file" :ref="'fileInput' + index" @change="onImageChange(index)" style="display: none;" />
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
import store from '@/store/store'; // Vuex store 가져오기

export default {
  name: 'NoticeEdit',
  props: ['id'],
  data() {
    return {
      notice: { noticeTitle: '', noticeContent: '' },
      notices: [],
      images: [], // 이미지 파일과 미리보기를 저장할 배열
    };
  },
  methods: {
    async fetchNotices() {
      try {
        const response = await axios.get('http://15.164.246.244:8080/notices/paged', {
          headers: {
            'Authorization': `Bearer ${store.state.accessToken}`, // 토큰 추가
          },
        });
        if (response.data && response.data._embedded && Array.isArray(response.data._embedded.noticeListResponseList)) {
          this.notices = response.data._embedded.noticeListResponseList;
        } else {
          this.notices = [];
          console.warn('Unexpected response format:', response.data);
        }
        this.fetchNotice(this.id);
      } catch (error) {
        console.error('Error fetching notices:', error);
        this.notices = [];
        alert('공지사항 목록을 가져오는 중 오류가 발생했습니다.');
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
        const maxFileSize = 10 * 1024 * 1024; // 10MB를 바이트로 변환
        if (validExtensions.includes(fileExtension) && file.size < maxFileSize) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.$set(this.images, index, { src: e.target.result, file });
          };
          reader.readAsDataURL(file);
        } else {
          alert("파일 형식이 맞지 않습니다. \n10MB 이하 .png, .jpg, .jpeg, .gif, .bmp, .webp, .tiff 형식의 파일을 입력하세요.");
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
          noticeContent: this.notice.noticeContent,
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
            console.log(`Image ${index + 1} uploaded successfully:`, photoResponse);
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
  width: 102.5%;
  height: 19px; /* 형광펜 두께 */
  background-color: #FFB052;
; /* 노란색 배경 */
  z-index: -1; /* 텍스트 뒤에 위치하도록 설정 */
  transform: skew(-12deg); /* 기울기 효과 추가 */
}


* {
  box-sizing: border-box;
}

.title-container, .content-container, .image-upload-container {
  margin-bottom: 20px;
}

.label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.title-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.content-input {
  width: 817px;
  height: 382px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: none;
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
  width: 153.96px;
  height: 153.96px;
  flex: 0 0 auto;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  width: 153.96px;
  height: 153.96px;
  border: 2px dashed #ddd;
  border-radius: 5px;
  cursor: pointer;
  position: relative;
  flex: 0 0 auto;
}

.image-upload input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.image-upload span {
  font-size: 24px;
  color: #ddd;
}

.submit-button {
  display: block;
  width: 112.5px;
  padding: 10px;
  margin: 20px auto;
  background-color: #ffc107;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  text-align: center;
}

.submit-button:hover {
  background-color: #e0a800;
}
</style>
