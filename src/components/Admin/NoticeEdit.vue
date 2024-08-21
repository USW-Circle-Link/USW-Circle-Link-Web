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
        <div v-for="(image, index) in noticePhotos" :key="index" class="image-preview">
          <img :src="image.src" alt="Uploaded Image" class="uploaded-image"/>
          <div class="edit-icon" @click="editImage(index)">
            <img src="@/assets/penbrush.png" alt="Edit Icon" />
          </div>
          <input type="file" :ref="'fileInput' + index" @change="onImageChange(index)" style="display: none;" />
        </div>
        <div v-if="noticePhotos.length < 5" class="image-upload">
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
import store from '@/store/store'; // Vuex store 가져오기

export default {
  name: 'NoticeEdit',
  props: ['id'],
  data() {
    return {
      notice: { noticeTitle: '', noticeContent: '' },
      noticePhotos: [], // 기존 이미지와 새 이미지를 모두 포함하는 배열
      isLoading: false,
    };
  },
  methods: {
    async fetchNotice(id) {
      try {
        const accessToken = store.state.accessToken;
        const response = await axios.get(`http://15.164.246.244:8080/notices/${id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`, // 토큰 추가
            'Content-Type': 'application/json',
          },
        });

        if (response.data && response.data.data) {
          this.notice = {
            noticeTitle: response.data.data.noticeTitle,
            noticeContent: response.data.data.noticeContent,
          };

          const photoUrls = response.data.data.noticePhotos || [];
          // 기존 이미지 URL을 가져와서 File 객체로 변환하여 noticePhotos 배열에 추가
          for (let i = 0; i < photoUrls.length; i++) {
            const file = await this.urlToFile(photoUrls[i], `image_${i + 1}.png`);
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
    onImageUpload(event) {
      if (this.noticePhotos.length >= 5) {
        alert('이미지는 최대 5개까지 업로드할 수 있습니다.');
        return;
      }

      const file = event.target.files[0];
      if (!file) {
        return;  // 파일이 선택되지 않았을 경우 아무런 액션도 취하지 않음
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newImageOrder = this.noticePhotos.length + 1;
        this.noticePhotos.push({ id: null, src: e.target.result, file, order: newImageOrder });
      };
      reader.readAsDataURL(file);
    },
    onImageChange(index) {
      const fileInput = this.$refs[`fileInput${index}`][0];
      if (!fileInput || !fileInput.files[0]) {
        return;  // 파일이 선택되지 않았을 경우 아무런 액션도 취하지 않음
      }

      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.noticePhotos[index] = { ...this.noticePhotos[index], src: e.target.result, file };
      };
      reader.readAsDataURL(file);
    },
    editImage(index) {
      this.$refs[`fileInput${index}`][0].click();
    },
    async submitNotice() {
      try {
        this.isLoading = true;
        const accessToken = store.state.accessToken;
        const form = new FormData();

        // 공지사항 데이터를 JSON으로 변환하여 FormData에 추가
        const noticeData = {
          noticeTitle: this.notice.noticeTitle,
          noticeContent: this.notice.noticeContent,
          photoIds: this.noticePhotos
            .filter(photo => photo.id) // 기존 이미지의 ID만 추출
            .map(photo => photo.id),
          photoOrders: this.noticePhotos.map(photo => photo.order), // 이미지 순서를 추출
        };

        form.append('request', new Blob([JSON.stringify(noticeData)], { type: 'application/json' }));

        // 새 이미지 파일들을 FormData에 추가
        this.noticePhotos.forEach((image) => {
          if (image.file) {
            form.append('photos', image.file);
          }
        });

        // 공지사항 수정 요청
        const response = await axios.patch(
          `http://15.164.246.244:8080/notices/${this.id}`,
          form,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data',
            }
          }
        );

        // 공지사항 등록 후 noticePhotos로 이미지 재업로드
        if (response.data && response.data.data && Array.isArray(response.data.data.noticePhotos)) {
          await Promise.all(response.data.data.noticePhotos.map(async (photoUrl, index) => {
            // 이미지가 존재하고 파일이 존재하는지 확인
            if (this.noticePhotos[index] && this.noticePhotos[index].file) {
              try {
                const photoResponse = await axios.put(photoUrl, this.noticePhotos[index].file, {
                  headers: {
                    'Content-Type': this.noticePhotos[index].file.type,
                  }
                });
                console.log(`Image ${index + 1} uploaded successfully:`, photoResponse);
              } catch (uploadError) {
                console.error(`Image ${index + 1} failed to upload:`, uploadError);
              }
            }
          }));
        }
        
        // **Success Alert Notification**
        alert('공지사항이 성공적으로 수정되었습니다!');
        this.$router.push({ name: 'Notice' });
      } catch (error) {
        console.error('Error submitting notice:', error.response ? error.response.data : error);
        alert('공지사항 수정에 실패했습니다.');
      } finally {
        this.isLoading = false;
      }
    },
  },
  created() {
    this.fetchNotice(this.id); // 컴포넌트 생성 시 기존 데이터를 불러옵니다.
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
