<template>
  <div>
    <h2>공지사항 수정</h2>

    <div v-if="notice">
      <div class="title-container">
        <label for="title-input" class="label">제목</label>
        <input id="title-input" v-model="notice.noticeTitle" placeholder="제목을 입력해주세요.(100자이내)" class="title-input"/>
      </div>
      <div class="content-container">
  <label for="content-input" class="label">내용</label>

  <!-- textarea -->
  <div class="textarea-wrapper">
    <textarea 
      id="content-input" 
      v-model="notice.noticeContent" 
      @input="limitContentLength"
      placeholder="내용을 입력해 주세요. 사진은 5장까지 첨부 가능합니다." 
      class="content-input">
    </textarea>
    <!-- 글자수 표시 -->
    <div class="character-count">{{ notice.noticeContent.length }} / 3000</div>
  </div>
</div>


      <div class="image-upload-container">
        <draggable v-model="noticePhotos" @end="updateImageOrder" class="image-items">
          <template #item="{ element, index }">
            <div class="image-preview">
              <img :src="element.src" alt="Uploaded Image" class="uploaded-image" @error="onImageError" />

              <div class="edit-icon" @click="editImage(index)">
                <img src="@/assets/penbrush.png" alt="Edit Icon" />
              </div>

              <div class="delete-icon" @click="deleteImage(index)">
            &times;
          </div>
              <input type="file" :ref="'fileInput' + index" @change="onImageChange(index)" style="display: none;" />
            </div>
          </template>
        </draggable>

        <div v-if="noticePhotos.length < 5" class="image-preview image-upload">
          <input type="file" @change="onImageUpload" ref="fileInput" />
          <span>+</span>
        </div>
      </div>

      <button class="submit-button" @click="submitNotice" :disabled="isLoading">수정 완료</button>
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
      noticePhotos: [],
      isLoading: false,
    };
  },
  methods: {
    limitContentLength() {
    const maxContentLength = 3000;
    if (this.notice.noticeContent.length > maxContentLength) {
      this.notice.noticeContent = this.notice.noticeContent.slice(0, maxContentLength);
    }
  },
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
            noticeContent: (response.data.data.noticeContent || '')
              .replace(/\n?<br>\n?/gi, '\n') // 줄바꿈 처리
              .replace(/&nbsp;/g, ' ')       // 공백 처리
          };
          const photoUrls = response.data.data.noticePhotos || [];
          for (let i = 0; i < photoUrls.length; i++) {
            const file = await this.urlToFile(photoUrls[i]);
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
    async urlToFile(url) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const mimeType = blob.type;
        const extension = mimeType.split("/")[1];
        const filename = `image_${new Date().getTime()}.${extension}`;
        return new File([blob], filename, { type: mimeType });
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
    onImageUpload(event) {
      if (this.noticePhotos.length >= 5) {
        alert('이미지는 최대 5개까지 업로드할 수 있습니다.');
        return;
      }
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      const validExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (validExtensions.includes(fileExtension)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImageOrder = this.noticePhotos.length + 1;
          this.noticePhotos.push({ id: null, src: e.target.result, file, order: newImageOrder });
        };
        reader.readAsDataURL(file);
      } else {
        alert("파일 형식이 맞지 않습니다. .png, .jpg, .jpeg, .gif, .bmp, .webp, .tiff 형식의 파일을 입력하세요.");
      }
    },
    onImageChange(index) {
      const fileInput = this.$refs[`fileInput${index}`];
      if (fileInput && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const validExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (validExtensions.includes(fileExtension)) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.noticePhotos[index] = { ...this.noticePhotos[index], src: e.target.result, file };
          };
          reader.readAsDataURL(file);
        } else {
          alert("파일 형식이 맞지 않습니다. .png, .jpg, .jpeg, .gif, .bmp, .webp, .tiff 형식의 파일을 입력하세요.");
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
    async submitNotice() {
      const maxTitleLength = 300;
      const maxContentLength = 3000;
      if (this.notice.noticeTitle.length > maxTitleLength) {
        alert(`공지사항 제목은 ${maxTitleLength}자 이내로 작성해야 합니다.`);
        return;
      }
      if (this.notice.noticeContent.length > maxContentLength) {
        alert(`공지사항 내용은 ${maxContentLength}자 이내로 작성해야 합니다.`);
        return;
      }
      if (!this.validateInput()) {
        return;
      }
      try {
        this.isLoading = true;
        const accessToken = store.state.accessToken;
        const form = new FormData();
        const noticeData = {
          noticeTitle: this.sanitizeInput(this.notice.noticeTitle),
          noticeContent: this.sanitizeInput(this.notice.noticeContent)
            .replace(/ /g, '&nbsp;') // 공백을 `&nbsp;`로 변환
            .replace(/\n/g, '<br>'),  // 줄바꿈을 `<br>`로 변환
          photoIds: this.noticePhotos.filter(photo => photo.id && !photo.file).map(photo => photo.id),
          photoOrders: this.noticePhotos.map(photo => photo.order),
        };
        form.append('request', new Blob([JSON.stringify(noticeData)], { type: 'application/json' }));
        this.noticePhotos.forEach((image) => {
          if (image.file) {
            form.append('photos', image.file);
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
                await axios.put(photoUrl, this.noticePhotos[index].file, {
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
          } else if (status === 401) {
            alert('인증되지 않은 사용자입니다. 다시 로그인해주세요.');
            this.$router.push({ name: 'Login' }); 
            return;
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
.textarea-wrapper {
  position: relative;
  display: inline-block;
}

.character-count {
  position: absolute;
  bottom: 10px; /* 아래 여백 */
  right: 10px; /* 오른쪽 여백 */
  font-size: 12px;
  color: #888; /* 글자 색상 */
  background: rgba(255, 255, 255, 0.8); /* 배경색 추가 */
  padding: 2px 5px;
  border-radius: 3px;
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

/* .submit-button:hover {
  background-color: #e0a800;
} */
</style>
