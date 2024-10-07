<template>
  <div>
    <h2>공지사항 수정</h2>

    <div v-if="notice">
      <div class="title-container">
        <label for="title-input" class="label">제목</label>
        <input id="title-input" v-model="notice.noticeTitle" placeholder="공지사항 제목" class="title-input"/>
      </div>
      <div class="content-container">
        <label for="content-input" class="label">내용</label>
        <textarea id="content-input" v-model="notice.noticeContent" placeholder="공지사항 내용" class="content-input"></textarea>
      </div>

      <!-- 이미지 업로드 컨테이너 -->
      <div class="image-upload-container">
        <draggable v-model="noticePhotos" @end="updateImageOrder" class="image-items">
          <template #item="{ element, index }">
            <div class="image-preview">
              <img :src="element.src" alt="Uploaded Image" class="uploaded-image" @error="onImageError" />

              <!-- 이미지 수정 아이콘 -->
              <div class="edit-icon" @click="editImage(index)">
                <img src="@/assets/penbrush.png" alt="Edit Icon" />
              </div>

              <!-- 삭제 버튼 추가 (X 아이콘) -->
              <div class="delete-icon" @click="deleteImage(index)">
                <span>X</span>
              </div>

              <input type="file" :ref="'fileInput' + index" @change="onImageChange(index)" style="display: none;" />
            </div>
          </template>
        </draggable>

        <!-- 이미지 추가 버튼을 이미지 옆에 배치 -->
        <div v-if="noticePhotos.length < 5" class="image-preview image-upload">
          <input type="file" @change="onImageUpload" ref="fileInput" />
          <span>+</span>
        </div>
      </div>

      <button class="submit-button" @click="submitNotice" :disabled="isLoading">작성 완료</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import store from '@/store/store';
import draggable from 'vuedraggable';

export default {
  name: 'NoticeEdit',
  components: {
    draggable,
  },
  props: ['id'],
  data() {
    return {
      notice: { noticeTitle: '', noticeContent: '' },
      noticePhotos: [], // 기존 이미지와 새 이미지를 모두 포함하는 배열
      isLoading: false,
    };
  },
  methods: {
    // 이미지 순서 변경 시 호출
    updateImageOrder() {
      this.noticePhotos.forEach((photo, index) => {
        photo.order = index + 1;
      });
    },
    async fetchNotice(id) {
      try {
        const accessToken = store.state.accessToken;
        const response = await axios.get(`http://15.164.246.244:8080/notices/${id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.data && response.data.data) {
          this.notice = {
            noticeTitle: response.data.data.noticeTitle,
            noticeContent: response.data.data.noticeContent,
          };

          const photoUrls = response.data.data.noticePhotos || [];
          // 모든 이미지 (JPG, PNG)를 동일하게 처리
          for (let i = 0; i < photoUrls.length; i++) {
            const file = await this.urlToFile(photoUrls[i], `image_${i + 1}.jpg`); // 파일로 변환 (형식은 자동 처리)
            if (file) {
              this.noticePhotos.push({ id: i + 1, src: photoUrls[i], file, order: i + 1 });
            }
          }
        } else {
          console.warn('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching notice:', error);
        this.notice = { noticeTitle: '', noticeContent: '' };
        this.noticePhotos = [];
      }
    },
    // URL을 파일로 변환
    async urlToFile(url, filename) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], filename, { type: blob.type });
      } catch (error) {
        console.error('Error converting URL to file:', error);
        return null;
      }
    },
    sanitizeInput(input) {
      const element = document.createElement('div');
      element.innerText = input;
      return element.innerHTML;
    },
    validateInput() {
      if (!this.notice.noticeTitle || !this.notice.noticeContent) {
        alert('제목과 내용을 모두 입력해주세요.');
        return false;
      }
      return true;
    },
    // 이미지 업로드 핸들러
    onImageUpload(event) {
      if (this.noticePhotos.length >= 5) {
        alert('이미지는 최대 5개까지 업로드할 수 있습니다.');
        return;
      }

      const file = event.target.files[0];
      if (!file) {
        return;
      }

      if (!this.validateFile(file)) {
        return;
      }
      // .jpg, .jpeg (JPEG 이미지), .png (PNG 이미지), .gif (GIF 이미지), .bmp (비트맵 이미지), .webp (WebP 이미지), .tiff (TIFF 이미지)
      // 파일 업로드 이미지 사이즈는 10mb 이하
      const validExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      //const maxFileSize = 10 * 1024 * 1024; // 10MB를 바이트로 변환
      console.log(file.size);
      if (validExtensions.includes(fileExtension)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImageOrder = this.noticePhotos.length + 1;
        this.noticePhotos.push({ id: null, src: e.target.result, file, order: newImageOrder });
      };
      reader.readAsDataURL(file);
      } else {
        console.error("Invalid file format:", fileExtension);
        alert("파일 형식이 맞지 않습니다. \n10MB 이하 .png, .jpg, .jpeg, .gif, .bmp, .webp, .tiff 형식의 파일을 입력하세요.");
      }
    },
    // 파일 검증
    validateFile(file) {
      const validTypes = ['image/png', 'image/jpeg'];
      const maxSize = 10 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        alert('지원하지 않는 파일 확장자입니다. PNG 또는 JPG 형식의 이미지만 업로드할 수 있습니다.');
        return false;
      }

      if (file.size > maxSize) {
        alert('파일 크기가 5MB를 초과합니다.');
        return false;
      }

      return true;
    },
    // 이미지 변경 핸들러
    onImageChange(index) {
      const fileInput = this.$refs[`fileInput${index}`];
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];

        if (!this.validateFile(file)) {
          return;
        }
        // .jpg, .jpeg (JPEG 이미지), .png (PNG 이미지), .gif (GIF 이미지), .bmp (비트맵 이미지), .webp (WebP 이미지), .tiff (TIFF 이미지)
        // 파일 업로드 이미지 사이즈는 10mb 이하
        const validExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff'];
        const fileExtension = fileInput.name.split('.').pop().toLowerCase();
        const maxFileSize = 10 * 1024 * 1024; // 10MB를 바이트로 변환
        if (validExtensions.includes(fileExtension) && file.size < maxFileSize) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.noticePhotos[index] = {...this.noticePhotos[index], src: e.target.result, file};
          };
          reader.readAsDataURL(file);
        } else {
          alert("파일 형식이 맞지 않습니다. \n10MB 이하 .png, .jpg, .jpeg, .gif, .bmp, .webp, .tiff 형식의 파일을 입력하세요.");
          this.errorMessage = '파일 형식이 맞지 않습니다. .png, .jpg, .jpeg, .gif, .bmp, .webp, .tiff 형식의 파일을 입력하세요.';
        }
      } else {
        console.error('fileInput is not found or files are empty.');
      }
    },
    editImage(index) {
      const fileInput = this.$refs['fileInput' + index];
      if (fileInput && fileInput.click) {
        fileInput.click();
      } else {
        console.error('fileInput is undefined or does not have a click method.');
      }
    },
    deleteImage(index) {
      this.noticePhotos.splice(index, 1);
    },
    // 공지사항 제출 핸들러
    async submitNotice() {
      if (!this.validateInput()) {
        return;
      }

      try {
        this.isLoading = true;
        const accessToken = store.state.accessToken;
        const form = new FormData();

        const noticeData = {
          noticeTitle: this.sanitizeInput(this.notice.noticeTitle),
          noticeContent: this.sanitizeInput(this.notice.noticeContent),
          photoIds: this.noticePhotos.filter(photo => photo.id && !photo.file).map(photo => photo.id),
          photoOrders: this.noticePhotos.map(photo => photo.order),
        };

        form.append('request', new Blob([JSON.stringify(noticeData)], { type: 'application/json' }));

        this.noticePhotos.forEach((image, index) => {
          if (image.file) {
            form.append('photos', image.file); // 파일이 있는 경우에만 업로드
          }
        });

        const response = await axios.put(
            `http://15.164.246.244:8080/notices/${this.id}`,
            form,
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
              }
            }
        );

        if (response.data && response.data.data && Array.isArray(response.data.data.noticePhotos)) {
          await Promise.all(response.data.data.noticePhotos.map(async (photoUrl, index) => {
            if (this.noticePhotos[index] && this.noticePhotos[index].file) {
              try {
                const photoResponse = await axios.put(photoUrl, this.noticePhotos[index].file, {
                  headers: {
                    'Content-Type': this.noticePhotos[index].file.type,
                  }
                });
              } catch (uploadError) {
                console.error(`Image ${index + 1} failed to upload:`, uploadError);
              }
            }
          }));
        }

        alert('공지사항이 성공적으로 수정되었습니다!');
        this.$router.push({ name: 'Notice' });
      } catch (error) {
        if (error.response) {
          const status = error.response.status;
          if (status === 400) {
            alert('지원하지 않는 파일 확장자입니다. PNG 또는 JPG 형식의 이미지만 업로드할 수 있습니다.');
          } else if (status === 404) {
            alert('공지사항이 존재하지 않습니다.');
          } else if (status === 413) {
            alert('최대 5개의 사진이 업로드 가능합니다.');
          } else if (status === 422) {
            alert('제목과 내용을 모두 입력해주세요.');
          } else {
            alert('공지사항 수정에 실패했습니다.');
          }
        } else {
          console.error('Error submitting notice:', error);
          alert('공지사항 수정에 실패했습니다.');
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
  created() {
    this.fetchNotice(this.id);
  }
};
</script>





<style scoped>
@import url('https://webfontworld.github.io/goodchoice/Jalnan.css');

* {
  box-sizing: border-box;
}

.page-title {
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
  font-size: 24px;
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
  width: 100%;  /* 전체 너비 */
  background-color: white;
  padding: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow-x: auto; /* 이미지가 가로로 넘칠 때 스크롤 가능하도록 설정 */
  flex-wrap: nowrap; /* 한 줄로 배치 */
}

.image-items {
  display: flex;
  gap: 10px;
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

.delete-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
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
