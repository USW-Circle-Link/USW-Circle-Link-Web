<template>
  <div>
    <h2>동아리 활동 사진</h2>
    <div class="image-upload-container">
      <div v-for="(image, index) in images" :key="index" class="image-preview">
        <div v-if="image.src" class="image-preview">
          <img :src="image.src" alt="Uploaded Image" class="uploaded-image" oncontextmenu="return false;"/>
          <div class="edit-icon" @click="triggerFileInput(index)">
            <img src="../../assets/penbrush.png" alt="Edit Icon" />
          </div>
          <div class="delete-icon" @click="deleteImage(index)">
            &times;
          </div>
          <input type="file" :ref="'fileInput' + index" @change="onFileChange(index, $event)" style="display: none;" />
        </div>
        <div v-else class="image-upload">
          <input type="file" @change="onImageUpload(index, $event)" />
          <span>+</span>
        </div>
      </div>
    </div>
    <div class="ClubUpdateHeader">
      <h2>동아리 소개 수정</h2>
      <div class="head">
        <p>소개 & 모집글 작성</p>
        <div class="empty"></div>
        <p>모집 중</p>
        <input type="checkbox" v-model="isChecked" id="chk1"/><label for="switch" @click="toggleCheckbox"></label>
      </div>
    </div>
    <div class="ClubInfoTextInput">
      <textarea v-model="textareaContent" rows="4" cols="50"></textarea>
    </div>
    <h2>구글폼 링크</h2>
    <div class="GoogleFormLinkInput">
      <textarea placeholder="링크를 입력해 주세요" v-model="googleFormLink" rows="4" cols="1"></textarea>
    </div>
    <button @click="saveInfo">작성 완료</button>
  </div>
</template>

<script>
import axios from 'axios';
import store from '../../store/store';

export default {
  name: 'ClubInfoTextInput',
  data() {
    return {
      images: [],
      textareaContent: '',
      isChecked: null,
      googleFormLink: '',
      orders: [],
      deletedOrders: [],
      clubData: {}
    };
  },
  mounted() {
    this.fetchClubInfo();
  },
  methods: {
    convertNewlinesToBr(text) {
      return text ? text.replace(/\n/g, '<br>') : text;
    },
    convertBrToNewlines(text) {
      return text ? text.replace(/<br\s*\/?>/g, '\n') : text;
    },
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

        this.clubData = response.data.data;
        this.isChecked = (this.clubData.recruitmentStatus === 'OPEN');
        this.textareaContent = this.convertBrToNewlines(this.clubData.clubIntro || '');
        this.googleFormLink = this.clubData.googleFormUrl || '';
        this.images = this.clubData.introPhotos.map(url => ({ src: url })) || [];

      } catch (error) {
        console.error('클럽 정보를 가져오는 중 오류가 발생했습니다:', error);
      }
    },
    async saveInfo() {
      const clubId = store.state.clubId;
      const accessToken = store.state.accessToken;

      if (this.textareaContent === '') {
        alert("소개 모집글 작성 실패. 동아리 소개 입력칸이 비어있습니다.");
        return;
      }
      if (this.googleFormLink === '') {
        alert("소개 모집글 작성 실패. 구글 폼 링크 입력칸이 비어있습니다.");
        return;
      }
      if (!this.googleFormLink.includes("https://forms.gle/") && !this.googleFormLink.includes("https://docs.google.com/forms/")) {
        alert("https://forms.gle/ 또는 https://docs.google.com/forms/ 로 시작하는 링크만 입력 할 수 있습니다.");
        return;
      }

      const form = new FormData();
      const jsonData = {
        clubIntro: this.convertNewlinesToBr(this.textareaContent),
        googleFormUrl: this.googleFormLink,
        orders: this.orders || this.clubData.orders,
        deletedOrders: this.deletedOrders.length ? this.deletedOrders : []
      };

      form.append('clubIntroRequest', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }));

      try {
        const response = await axios.put(
          `http://15.164.246.244:8080/club-leader/${clubId}/intro`,
          form,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        alert("저장되었습니다!");
        location.reload();
      } catch (error) {
        console.error("오류가 발생했습니다:", error.response ? error.response.data : error);
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
  width: 150px;
  height: 150px;
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

.ClubInfoTextInput {
  width: 886px;
  height: 382px;
  border-radius: 8px;
  background-color: #ffffff;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  white-space: pre-line; /* 줄바꿈을 자연스럽게 처리 */
}

textarea {
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

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.head p {
  font-size: 18px;
  font-weight: 500;
  margin-top: 21px;
}

.empty {
  width: 630px;
}

label {
  display: block;
  position: relative;
  width: 50px;
  height: 22px;
  background: #d3d3d3;
  border-radius: 60px;
  transition: background 0.4s;
}

label::after {
  content: "";
  position: absolute;
  left: 4px;
  top: 50%;
  width: 14px;
  height: 14px;
  border-radius: 100%;
  background-color: #fff;
  transform: translateY(-50%);
  box-shadow: 1px 3px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.4s;
}

#chk1:checked + label {
  background-color: #FFC700;
}

#chk1:checked + label::after {
  left: calc(100% - 18px);
}

.GoogleFormLinkInput {
  width: 886px;
  height: 40px;
  border-radius: 8px;
  background-color: #ffffff;
  margin: 0 auto;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.GoogleFormLinkInput textarea {
  width: 820px;
  height: 28px;
  margin-top: 7px;
  text-align: left;
  border: none;
  font-size: 16px;
  resize: none;
}

.GoogleFormLinkInput textarea::placeholder {
  text-align: center;
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
