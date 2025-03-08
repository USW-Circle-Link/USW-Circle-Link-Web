<template>
  <div class="notice-write-container">
    <h2>공지사항 수정</h2>

    <div v-if="notice">
      <div class="title-container">
        <label for="title-input" class="label">제목</label>
        <input id="title-input" v-model="notice.noticeTitle" placeholder="제목을 입력해주세요.(200자이내)" class="title-input"/>
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

              <div class="edit-icon" @click="editImage(index)">
                <img src="@/assets/penbrush.png" alt="Edit Icon" />
              </div>

              <input
                  type="file"
                  :ref="'fileInput' + index"
                  @change="onImageChange(index, $event)"
                  style="display: none;"
              />

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

  <Popup401 v-if="show401Popup" />
</template>

<script>
import axios from 'axios';
import store from '@/store/store';
import draggable from 'vuedraggable';
import Popup401 from "@/components/Admin/401Popup.vue";

export default {
  name: 'NoticeEdit',
  components: {
    Popup401,
    draggable,
  },
  props: ['noticeUUID'],
  data() {
    return {
      notice: { noticeTitle: '', noticeContent: '' }, // 제목, 내용 저장
      noticePhotos: [], // { id, src, file, order }
      deletedPhotoIds: [], // 삭제된 사진 ID 저장
      isLoading: false, // 로딩 상태
      show401Popup: false  // 401 팝업
    };
  },
  methods: {
    // 401 에러 처리를 위한 공통 함수
    handle401Error(error) {
      if (error.response && error.response.status === 401) {
        this.show401Popup = true;
        return true;
      }
      return false;
    },
    async fetchNotice(noticeUUID) {
      try {
        const accessToken = store.state.accessToken;
        const response = await axios.get(`${store.state.apiBaseUrl}/notices/${noticeUUID}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });


        // 에러 상태 코드 처리
        if (response.status === 404 || response.status === 413 || response.status === 422) {
          let message = '';

          if (response.status === 404) {
            message = '공지사항이 존재하지 않습니다.';
          } else if (response.status === 413) {
            message = '최대 5개의 사진이 업로드 가능합니다.';
          } else if (response.status === 422) {
            message = '제목과 내용을 모두 입력해주세요.';
          }

          alert(message);
          return;
        }


        if (response.data && response.data.data) {
          const data = response.data.data;

          // 제목과 내용 설정
          this.notice.noticeTitle = data.noticeTitle || '';
          this.notice.noticeContent = (data.noticeContent || '')
              .replace(/<br>/g, '\n') // 줄바꿈 처리
              .replace(/&nbsp;/g, ' '); // 공백 처리

          // 사진 설정
          const photoUrls = data.noticePhotos || [];
          this.noticePhotos = await Promise.all(
              photoUrls.map(async (url, index) => {
                const file = await this.urlToFile(url);
                return { id: index + 1, src: url, file, order: index + 1 };
              })
          );
        }
      } catch (error) {
        if (!this.handle401Error(error)) {
          console.error('Error updating member:', error);
        }
      }
    },

    // URL에서 File 객체 생성
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

    // 이미지 업로드
    onImageUpload(event) {
    if (this.noticePhotos.length >= 5) {
      alert('이미지는 최대 5개까지 업로드할 수 있습니다.');
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
        const order = this.noticePhotos.length + 1;
        this.noticePhotos.push({ id: null, src: e.target.result, file, order });

        // 🔹 파일 입력 필드 초기화 (같은 파일 다시 업로드 가능)
        event.target.value = "";
      };
      reader.readAsDataURL(file);
    } else {
      alert('업로드 가능한 최대 파일 크기를 초과했습니다. (개별 파일 10MB, 총 파일 크기 50MB)');
    }
  },

    editImage(index) {
      const fileInput = this.$refs[`fileInput${index}`];
      if (fileInput && fileInput.click) {
        fileInput.click(); // 파일 선택창 열기
      } else {
        console.error(`File input not found for index ${index}`);
      }
    }
    ,onImageChange(index, event) {
      if (!event || !event.target || !event.target.files) {
        console.error('Invalid event object:', event);
        return;
      }

      const file = event.target.files[0];
      if (!file) return;

      const validExtensions = ['png', 'jpg', 'jpeg'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const maxFileSize = 10 * 1024 * 1024;

      if (validExtensions.includes(fileExtension) && file.size <= maxFileSize) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.noticePhotos[index] = { ...this.noticePhotos[index], src: e.target.result, file };
        };
        reader.readAsDataURL(file);
      } else {
        alert('업로드 가능한 최대 파일 크기를 초과했습니다. (개별 파일 10MB, 총 파일 크기 50MB)');
      }
    },

    // 이미지 삭제
    deleteImage(index) {
    const photo = this.noticePhotos[index];
    if (photo.id) {
      this.deletedPhotoIds.push(photo.id); // 삭제된 이미지 ID 저장
    }
    this.noticePhotos.splice(index, 1);

    // 🔹 파일 입력 필드 초기화 (같은 파일을 다시 업로드 가능하게 함)
    if (this.$refs.fileInput) {
      this.$refs.fileInput.value = "";
    }
  },

    // 이미지 순서 업데이트
    updateImageOrder() {
      this.noticePhotos.forEach((photo, index) => {
        photo.order = index + 1;
      });
    },

    // 공지사항 수정 제출
    async submitNotice() {
      const maxTitleLength = 200;
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
        this.isLoading = true;
        const accessToken = store.state.accessToken;
        const form = new FormData();

        // 요청 데이터 구성
        const noticeData = {
          noticeTitle: this.notice.noticeTitle,
          noticeContent: this.notice.noticeContent
              .replace(/ /g, '&nbsp;')
              .replace(/\n/g, '<br>'),
          photoOrders: this.noticePhotos.map(photo => photo.order),
          deletedPhotos: this.deletedPhotoIds,
        };
        form.append('request', new Blob([JSON.stringify(noticeData)], { type: 'application/json' }));

        // 새로 추가된 파일만 첨부
        this.noticePhotos.forEach((photo) => {
          if (photo.file) {
            form.append('photos', photo.file);
          }
        });

        // API 호출
        const response = await axios.put(
            `${store.state.apiBaseUrl}/notices/${this.noticeUUID}`,
            form,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data',
              },
            }
        );

        // Presigned URLs 처리 (S3 업로드)
        const presignedUrls = response?.data?.data || [];
        if (presignedUrls.length) {
          await Promise.all(
              presignedUrls.map(async (url, index) => {
                const file = this.noticePhotos[index].file;
                if (file) {
                  await axios.put(url, file, {
                    headers: { 'Content-Type': file.type },
                  });
                }
              })
          );
        }

        alert('공지사항이 성공적으로 수정되었습니다!');
        this.$router.push({ name: 'Notice' });
      } catch (error) {
        if (!this.handle401Error(error)) {
          console.error('Error updating member:', error);
        }
      } finally {
        this.isLoading = false;
      }
    },
  },



  created() {
    this.fetchNotice(this.noticeUUID);
  },
};
</script>



<style scoped>
.notice-write-container {
  width: 100%;
  min-width: 900px;
  margin: 0 auto;
  padding: 10px;
}

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
  width: 100%;
  display: inline-block;
  position: relative;
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
  width: 100%;
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