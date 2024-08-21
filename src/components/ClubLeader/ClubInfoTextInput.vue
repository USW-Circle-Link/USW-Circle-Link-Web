<template>
  <div>
    <h2>동아리 활동 사진</h2>
    <div class="image-upload-container">
      <div v-for="(image, index) in images" :key="image.src" class="image-preview">
        <img :src="image.src" alt="Uploaded Image" class="uploaded-image" />
        <div class="edit-icon" @click="triggerFileInput(index)">
          <img src="@/assets/penbrush.png" alt="Edit Icon" />
        </div>
        <div class="delete-icon" @click="deleteImage(index)">
          &times;
        </div>
        <input type="file" :ref="'fileInput' + index" @change="onFileChange(index, $event)" style="display: none;" />
      </div>
      <div v-if="images.length < 5" class="image-upload">
        <input type="file" @change="onImageUpload" />
        <span>+</span>
      </div>
    </div>

    <ClubUpdateHeader @sendData="isCheckedData" />
    <div class="ClubInfoTextInput">
      <textarea v-model="textareaContent" rows="4" cols="50"></textarea>
    </div>
    <GoogleFormLinkInput @sendLinkData="googleFormLinkData" />
    <button @click="saveInfo">작성 완료</button>
  </div>
</template>

<script>
import axios from 'axios';
import GoogleFormLinkInput from "@/components/ClubLeader/GoogleFormLinkInput.vue";
import ClubUpdateHeader from "@/components/ClubLeader/ClubUpdateHeader.vue";
import store from '@/store/store';

export default {
  name: 'ClubInfoTextInput',
  components: {
    ClubUpdateHeader,
    GoogleFormLinkInput
  },
  data() {
    return {
      images: [],  // 이미지를 저장할 배열
      textareaContent: '',  // 소개글
      googleFormLink: '',  // 구글 폼 링크
      orders: [],  // 이미지 순서 배열
      file: [],  // 파일 배열
      deletedImages: [],  // 삭제된 이미지의 URL을 저장할 배열
      presignedUrls: [],  // 사전 서명된 URL 배열
      errorMessage: '',  // 에러 메시지
      validFile: false,  // 파일 유효성 여부
    };
  },
  mounted() {
    this.fetchClubInfo();  // 컴포넌트가 마운트되면 클럽 정보를 가져옵니다.
  },
  methods: {
    async fetchClubInfo() {
      const clubId = store.state.clubId;
      const accessToken = store.state.accessToken;

      try {
        const response = await axios.get(`http://15.164.246.244:8080/club-leader/${clubId}/intro`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        const clubData = response.data.data;
        this.textareaContent = clubData.clubIntro || '';
        this.googleFormLink = clubData.googleFormUrl || '';
        this.images = clubData.introPhotos.map(url => ({ src: url })) || [];
        this.orders = clubData.introPhotos.map((_, index) => index + 1);
      } catch (error) {
        console.error('클럽 정보를 가져오는 중 오류가 발생했습니다:', error);
        this.errorMessage = '클럽 정보를 가져오는 중 오류가 발생했습니다. 다시 시도해주세요.';
      }
    },
    googleFormLinkData(data) {
      this.googleFormLink = data;
    },
    triggerFileInput(index) {
      const fileInputRef = this.$refs[`fileInput${index}`];
      if (fileInputRef && fileInputRef[0] && fileInputRef[0].click) {
        fileInputRef[0].click();
      }
    },
    onFileChange(index, event) {
      const file = event.target.files[0];
      if (file) {
        const validExtensions = ['png', 'jpg', 'jpeg'];
        const fileExtension = file.name.split('.').pop().toLowerCase();

        if (validExtensions.includes(fileExtension)) {
          this.file.splice(index, 1, file);
          this.orders.push(index + 1);
          this.errorMessage = '';
          this.validFile = true;

          const reader = new FileReader();
          reader.onload = (e) => {
            this.images[index].src = e.target.result;
          };
          reader.readAsDataURL(file);
        } else {
          console.error("Invalid file format:", fileExtension);
          alert("파일 형식이 맞지 않습니다. .png, .jpg, .jpeg 형식의 파일을 입력하세요.");
          this.errorMessage = '파일 형식이 맞지 않습니다. .png, .jpg, .jpeg 형식의 파일을 입력하세요.';
          this.file.splice(index, 1);
          this.validFile = false;
        }
      }
    },
    onImageUpload(event) {
      if (this.images.length >= 5) {
        alert('이미지는 최대 5개까지 업로드할 수 있습니다.');
        return;
      }

      const file = event.target.files[0];
      if (file) {
        const validExtensions = ['png', 'jpg', 'jpeg'];
        const fileExtension = file.name.split('.').pop().toLowerCase();

        if (validExtensions.includes(fileExtension)) {
          this.file.push(file);
          this.orders.push(this.file.length);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.images.push({ src: e.target.result });
          };
          reader.readAsDataURL(file);
        } else {
          console.error("Invalid file format:", fileExtension);
          alert("파일 형식이 맞지 않습니다. .png, .jpg, .jpeg 형식의 파일을 입력하세요.");
        }
      }
    },
    deleteImage(index) {
      try {
        console.log("Deleting image at index:", index);
        console.log("Image URL:", this.images[index].src);

        // 삭제된 이미지의 URL을 저장하여 서버로 전송하지 않도록 함
        const deletedImageUrl = this.images[index].src;
        this.deletedImages.push(deletedImageUrl);

        // 이미지를 images 배열에서 제거
        this.images.splice(index, 1);
        console.log("Image successfully deleted.");

        // 파일 배열에서 해당 파일을 제거
        this.file.splice(index, 1);
        console.log("File array after deletion:", this.file);

        // 삭제된 이미지의 순서를 orders 배열에서 제거
        this.orders.splice(index, 1);
        console.log("Orders array after deletion:", this.orders);

        // 참조된 파일 input을 null로 설정
        this.$refs[`fileInput${index}`] = null;

        // 파일 input 참조를 재정렬
        this.$forceUpdate();

      } catch (error) {
        console.error("Error while deleting image:", error);
      }
    },
    async saveInfo() {
        const clubId = store.state.clubId;
        const accessToken = store.state.accessToken;

        const form = new FormData();
        const jsonData = JSON.stringify({
          clubIntro: this.textareaContent,
          googleFormUrl: this.googleFormLink,
          orders: this.orders,
          deletedImages: this.deletedImages // 삭제된 이미지를 서버로 전송
        });

        form.append('clubIntroRequest', new Blob([jsonData], { type: 'application/json' }));

        // 삭제되지 않은 파일만 서버에 전송
        this.file.forEach((file, index) => {
          if (!this.deletedImages.includes(this.images[index].src)) {
            form.append('introPhotos', file);
          }
        });

        try {
          const response = await axios.patch(
            `http://15.164.246.244:8080/club-leader/${clubId}/intro`,
            form,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data'
              }
            }
          );

          if (response.data && response.data.data && response.data.data.presignedUrls) {
            this.presignedUrls = response.data.data.presignedUrls;

            // 각 파일을 S3에 업로드
            await this.uploadFiles();
          }

          alert("저장되었습니다!");

          // 저장 후 데이터를 다시 불러오기 위해 이벤트 발생
          this.$emit('data-saved');

        } catch (error) {
          console.error("오류가 발생했습니다:", error.response ? error.response.data : error);
          alert("오류가 발생했습니다. 다시 시도해주세요.");
        }
    },
    async uploadFiles() {
      try {
        await Promise.all(this.file.map((file, index) => {
          if (!this.deletedImages.includes(this.images[index].src)) {
            return axios.put(this.presignedUrls[index], file, {
              headers: {
                'Content-Type': file.type
              }
            });
          }
        }));
        await this.saveFileUrlsToDatabase();
      } catch (error) {
        console.error("파일 업로드 실패:", error);
        alert("파일 업로드 실패!");
      }
    },
    async saveFileUrlsToDatabase() {
      const clubId = store.state.clubId;
      const accessToken = store.state.accessToken;

      try {
        const fileUrls = this.presignedUrls.map(url => url.split('?')[0]);

        // 삭제된 이미지의 URL을 제외하고 전송
        const filteredFileUrls = fileUrls.filter(url => !this.deletedImages.includes(url));

        await axios.put(
          `http://15.164.246.244:8080/club-leader/${clubId}/intro`,
          { fileUrls: filteredFileUrls },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );

      } catch (error) {
        console.error("파일 URL 저장 실패:", error);
        alert("파일 URL 저장 실패!");
      }
    }
  }
};
</script>









<style scoped>
.image-upload-container {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 866px;
  height: 153.96px;
  background-color: white;
  padding: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  justify-content: space-around;
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

.delete-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 24px;
  color: red;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 30px;
}

.edit-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
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

.ClubInfoTextInput{
  width: 886px;
  height: 382px;
  border-radius: 8px;
  background-color: #ffffff;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.ClubInfoTextInput textarea{
  width: 820px;
  height: 330px;
  text-align: left;
  border: none;
  font-size: 16px;
  resize: none;
}

textarea:focus {
  outline: none; /* 포커스 상태일 때 테두리 제거 */
}

button {
  width: 112px;
  height: 48px;
  background: #FFC700;
  border: none;
  border-radius: 4px;
  color: #ffffff;
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: -0.025em;
  text-align: center;
  margin-top: 30px;
  margin-left: 774px;
  margin-bottom: 30px;
}
</style>


