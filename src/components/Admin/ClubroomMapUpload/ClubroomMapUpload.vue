
<template>
  <div class="title">동아리 위치 정보 수정</div>

  <div class="floor-images-container">
    <!-- 지하 1층 -->
    <div class="floor-section">
      <div class="image-wrapper">
        <div
          class="image-container"
          @mouseover="showIcons('B1', true)"
          @mouseleave="showIcons('B1', false)"
        >
          <div class="image-box" :class="{ hovered: floorData.B1.showingIcon }">
            <img
              v-if="floorData.B1.imageSrc"
              :src="floorData.B1.imageSrc"
              alt="Floor Image"
              class="floor-image"
            />
            <div v-if="floorData.B1.showingIcon" class="icons-container">
              <img
                src="../../../assets/zoom.svg"
                class="icon zoom-icon"
                @click="enlargeImage(floorData.B1.imageSrc)"
              />
              <img
                src="../../../assets/remove.svg"
                class="icon remove-icon"
                @click="markImageForDeletion('B1')"
              />
            </div>
          </div>
          <h3>지하 1층</h3>
          <div class="upload-placeholder">
            <button @click="triggerFileInput('B1')" class="upload-button">
              <i class="upload-icon"></i>
              이미지 수정
            </button>
          </div>
          <input
            type="file"
            ref="fileInputB1"
            @change="onImageUpload('B1', $event)"
            style="display: none;"
          />
        </div>
      </div>
      <!-- 1층 -->
      <div class="floor-container">
        <div class="image-wrapper">
          <div
            class="image-container"
            @mouseover="showIcons('F1', true)"
            @mouseleave="showIcons('F1', false)"
          >
            <div class="image-box" :class="{ hovered: floorData.F1.showingIcon }">
              <img
                v-if="floorData.F1.imageSrc"
                :src="floorData.F1.imageSrc"
                alt="Floor Image"
                class="floor-image"
              />
              <div v-if="floorData.F1.showingIcon" class="icons-container">
                <img
                  src="../../../assets/zoom.svg"
                  class="icon zoom-icon"
                  @click="enlargeImage(floorData.F1.imageSrc)"
                />
                <img
                  src="../../../assets/remove.svg"
                  class="icon remove-icon"
                  @click="markImageForDeletion('F1')"
                />
              </div>
            </div>
            <h3>지상 1층</h3>
            <div class="upload-placeholder">
              <button @click="triggerFileInput('F1')" class="upload-button">
                <i class="upload-icon"></i>
                이미지 수정
              </button>
            </div>
            <input
              type="file"
              ref="fileInputF1"
              @change="onImageUpload('F1', $event)"
              style="display: none;"
            />
          </div>
        </div>
      </div>

      <!-- 2층 -->
      <div class="floor-container">
        <div class="image-wrapper">
          <div
            class="image-container"
            @mouseover="showIcons('F2', true)"
            @mouseleave="showIcons('F2', false)"
          >
            <div class="image-box" :class="{ hovered: floorData.F2.showingIcon }">
              <img
                v-if="floorData.F2.imageSrc"
                :src="floorData.F2.imageSrc"
                alt="Floor Image"
                class="floor-image"
              />
              <div v-if="floorData.F2.showingIcon" class="icons-container">
                <img
                  src="../../../assets/zoom.svg"
                  class="icon zoom-icon"
                  @click="enlargeImage(floorData.F2.imageSrc)"
                />
                <img
                  src="../../../assets/remove.svg"
                  class="icon remove-icon"
                  @click="markImageForDeletion('F2')"
                />
              </div>
            </div>
            <h3>지상 2층</h3>
            <div class="upload-placeholder">
              <button @click="triggerFileInput('F2')" class="upload-button">
                <i class="upload-icon"></i>
                이미지 수정
              </button>
            </div>
            <input
              type="file"
              ref="fileInputF2"
              @change="onImageUpload('F2', $event)"
              style="display: none;"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <button @click="saveImages" class="save-button">저장하기</button>

    <!-- 확대된 이미지 모달 -->
    <div v-if="enlargedImage" class="image-modal">
      <div class="image-wrapper">
        <img
          src="../../../assets/remove.svg"
          class="remove-icon-modal"
          @click="closeModal"
          alt="Close Modal"
        />
        <img :src="enlargedImage" alt="Enlarged Image" class="enlarged-image" />
      </div>
    </div>

  <ClubroomMapUploadPopup
      v-if="showPopup"
      :serverMessage="serverMessage"
      @close="closeResultPopup"
  />

  <Popup401 v-if="show401Popup" />
</template>

<script>
import axios from 'axios';
import store from '../../../store/store';
import Popup401 from "@/components/Admin/401Popup.vue";
import ClubroomMapUploadPopup from "@/components/Admin/ClubroomMapUpload/ClubroomMapUploadPopup.vue";

export default {
  components: {ClubroomMapUploadPopup, Popup401},
  data() {
    return {
      floorData: {
        B1: { imageSrc: '', originalImageSrc: '', file: null, showingIcon: false },
        F1: { imageSrc: '', originalImageSrc: '', file: null, showingIcon: false },
        F2: { imageSrc: '', originalImageSrc: '', file: null, showingIcon: false },
      },

      showPopup: false,
      serverMessage: '',

      enlargedImage: null, // 확대된 이미지
      show401Popup: false  // 401 팝업
    };
  },
  async created() {
    await this.fetchImages();
  },
  methods: {
    // 401 에러 처리를 위한 공통 메서드
    handle401Error(error) {
      if (error.response && error.response.status === 401) {
        this.show401Popup = true;
        return true;
      }
      return false;
    },
    // 모든 층 이미지 가져오기
    async fetchImages() {
      const accessToken = store.state.accessToken;

      try {
        const floorIds = Object.keys(this.floorData);
        const requests = floorIds.map((floorId) =>
            axios
                .get(`${store.state.apiBaseUrl}/admin/floor/photo/${floorId}`, {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                })
                .catch((error) => {
                  if (error.response && error.response.status === 404) {
                    console.warn(`층 ${floorId}에 대한 이미지를 찾을 수 없습니다.`);
                    return null;
                  }
                  if (this.handle401Error(error)) {
                    return null;
                  }
                  throw error;
                })
        );

        const responses = await Promise.all(requests);

        responses.forEach((response, index) => {
          if (response && response.data && response.data.data) {
            const floorId = Object.keys(this.floorData)[index];
            this.floorData[floorId].imageSrc = response.data.data.presignedUrl;
            this.floorData[floorId].originalImageSrc = response.data.data.presignedUrl;
          }
        });
      } catch (error) {
        if (!this.handle401Error(error)) {
          console.error('이미지 불러오기 실패:', error.response?.data || error);
          alert('이미지를 불러오는 데 실패했습니다.');
        }
      }
    },


    // 파일 입력창 열기
    triggerFileInput(floorId) {
      const fileInputRef = this.$refs[`fileInput${floorId}`];
      if (fileInputRef) fileInputRef.click();
    },

    // 파일 업로드 (클라이언트에서만 변경)
    onImageUpload(floorId, event) {
      const file = event.target.files[0];
      if (!file) return;

      const validExtensions = ['png', 'jpg', 'jpeg'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const maxFileSize = 10 * 1024 * 1024;

      if (!validExtensions.includes(fileExtension) || file.size > maxFileSize) {
        alert('파일 형식이 잘못되었거나 크기가 초과되었습니다. (10MB 이하, png 또는 jpg만 허용)');
        event.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.floorData[floorId].imageSrc = e.target.result;
        this.floorData[floorId].file = file;
      };
      reader.readAsDataURL(file);

      event.target.value = '';
    },

    // 저장하기 버튼 클릭 시 서버에 저장
    async saveImages() {
      const accessToken = store.state.accessToken;

      try {
        const floorIds = Object.keys(this.floorData);

        for (const floorId of floorIds) {
          const { imageSrc, file, originalImageSrc } = this.floorData[floorId];

          if (!imageSrc && !file && originalImageSrc) {
            try {
              await axios.delete(`${store.state.apiBaseUrl}/admin/floor/photo/${floorId}`, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              });
              console.log(`층 ${floorId} 이미지 삭제 성공`);
            } catch (error) {
              if (this.handle401Error(error)) {
                return;
              }
              throw error;
            }
          }
        }

        for (const floorId of floorIds) {
          const { file } = this.floorData[floorId];

          if (file) {
            const formData = new FormData();
            formData.append('photo', file);

            try {
              const response = await axios.put(
                  `${store.state.apiBaseUrl}/admin/floor/photo/${floorId}`,
                  formData,
                  {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                      'Content-Type': 'multipart/form-data',
                    },
                  }
              );

              if (response.data && response.data.data.presignedUrl) {
                const presignedUrl = response.data.data.presignedUrl;

                await axios.put(presignedUrl, file, {
                  headers: {
                    'Content-Type': file.type,
                  },
                });

                this.floorData[floorId].imageSrc = presignedUrl;
                this.floorData[floorId].originalImageSrc = presignedUrl;
                console.log(`층 ${floorId} 이미지 저장 성공`);
              }
            } catch (error) {
              if (this.handle401Error(error)) {
                return;
              }
              throw error;
            }
          }
        }

        this.serverMessage = "동아리 위치 정보가 정상적으로 저장되었습니다.";
        this.showPopup = true;

        await this.fetchImages();
      } catch (error) {
        if (!this.handle401Error(error)) {
          console.error('이미지 저장 실패:', error.response?.data || error);
          alert('이미지 저장에 실패했습니다.');
        }
      }
    },

    // 이미지 삭제 (클라이언트에서만 변경)
    markImageForDeletion(floorId) {
      this.floorData[floorId].imageSrc = null;
      this.floorData[floorId].file = null;
    },

    // 이미지 확대
    enlargeImage(imageSrc) {
      this.enlargedImage = imageSrc;
    },

    // 확대된 이미지 닫기
    closeModal() {
      this.enlargedImage = null;
    },

    // 아이콘 표시 토글
    showIcons(floorId, status) {
      this.floorData[floorId].showingIcon = status;
    },

    closeResultPopup() {
      this.showPopup = false
    }
  },
};
</script>

<style scoped>
.title {
  color: black;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 30px;
  position: relative; /* 상대 위치 설정 */
  display: inline-block;
}

.floor-images-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  min-width: 390px;
  overflow-x: hidden;
  gap: 20px;
}

.floor-section {
  margin: 10px 0;
  text-align: left;
  display: flex;
  flex-wrap: wrap; /* 줄바꿈 허용 */
  justify-content: flex-start;
  flex: 1 1 auto; /* 유연한 크기 조정 */
  min-width: 200px; /* 최소 너비 줄임 */
  max-width: 100%; /* 최대 너비 제한 */
}

.floor-section h3 {
  flex: 0 0 100%; /* 한 줄 전체 차지 */
}

.horizontal-layout {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.floor-container {
  flex: 1;
  margin: 0 10px;
  background-color: white;
  border-radius: 8px;
  width : 281.33px;
  height: 280.33px;
}

.image-container {
  position: relative;
  display: inline-block;
}

.image-box {
  width: 100%;
  max-width: 280px; /* 최대 너비 제한 */
  min-width: 200px; /* 최소 너비 보장 */
  height: 182px; /* 고정 높이 */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* 이미지 넘치는 부분 숨김 */
  border: 1px solid #ddd;
  border-radius: 8 0px;

  position: relative;
  transition: background-color 0.2s ease;
}

.image-container:hover .image-box {
  background-color: rgba(24, 24, 24, 0.5);
}

.floor-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: opacity 0.2s ease;
  transition: filter 0.2s ease;
}

.image-box:hover .floor-image {
  filter: brightness(50%);
  opacity: 0.7;
}

.icons-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  cursor: pointer;
}

.zoom-icon {
  position: absolute;
  width: 40px;
  height: 40px;
  top: 50%;
  left: 50%;
  transform: translate(-40%, -30%);
  pointer-events: all;
  cursor: pointer;
}

.upload-placeholder {
  margin-top: 10px;
}

.upload-button {
  width: 260px;
  height: 35px;
  display: flex;
  flex-shrink: 0;
  border-radius: 8px;
  background: #fff;
  justify-content: center;
  border-width: 1px;
  border-color: #868686;
  align-items: center;
  align-content: center;
  margin-right: 60px;
  cursor: pointer;
  margin: 10px;

  color: #868686;
  line-height: 18px;
  font-weight: 500;
}

.upload-button :hover {
  background-color: #e6953e;
}

.save-button {
  width: 112px;
  height: 48px;
  background: #FFb052;
  border: none;
  border-radius: 4px;
  color: #ffffff;
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: -0.025em;
  text-align: center;
  margin: 30px auto;
  display: block;
  cursor: pointer;
}

.save-button:hover {
  background-color: #e6953e;
}

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  /*cursor: pointer;*/
}

.image-wrapper {
  position: relative;
  justify-content: center;
  align-items: center;
}
.enlarged-image {
  /*
  max-width: 55%;
  max-height: 55%;*/
  max-width: 700px;
  max-height: 400px;
  margin-top: 55px;
  object-fit: contain;
}

.remove-icon-modal {
  position: absolute;
  width: 30px; 
  height: 30px;
  top: 10px;
  right: 0px;
  cursor: pointer;
}
h2{
  align-self: start;
  margin-top: 20px;
  margin-bottom: -5px;
}
h3 {
  margin: 10px 0px 15px 10px;
  font-size: 12px;
  height: 25px;
}

.remove-icon {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 10px;
  right: 10px;
  pointer-events: all;

}
.upload-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
  padding: 7px;
  background: url('../../../assets/hugeicons_image-upload.svg') no-repeat center center;
  filter: invert(54%) sepia(1%) saturate(0%) hue-rotate(179deg) brightness(97%) contrast(89%);
}

/* 반응형 미디어 쿼리 */
@media (max-width: 768px) {
  .floor-images-container {
    flex-direction: column;
    align-items: center;
  }
  
  .floor-section {
    width: 100%;
    max-width: 400px;
    justify-content: center;
  }
  
  .image-box {
    max-width: 100%;
    min-width: 250px;
  }
}

@media (max-width: 480px) {
  .floor-section {
    min-width: 150px;
  }
  
  .image-box {
    min-width: 200px;
  }
}
</style>
