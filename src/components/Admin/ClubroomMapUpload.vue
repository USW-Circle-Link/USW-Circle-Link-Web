<template>
  <div class="title">카테고리 작성하기</div>

  <div class="floor-images-container">
    <!-- 지하 1층 -->
    <div class="floor-section">
      <h3>지하 1층</h3>
      <div class="image-container" @mouseover="showIcons(0, true)" @mouseleave="showIcons(0, false)">
        <div class="image-wrapper">
          <div class="image-box" :class="{ 'hovered': showingIcons[0] }">
            <img 
              v-if="floors[0].imageSrc" 
              :src="floors[0].imageSrc" 
              alt="Floor Image" 
              class="floor-image"
            />
            <div v-if="showingIcons[0]" class="icons-container">
              <img src="../../assets/zoom-in.png" class="icon zoom-icon" @click="enlargeImage(floors[0].imageSrc)" />
              <img src="../../assets/remove.png" class="icon remove-icon" @click="deleteImage(0)" />
            </div>
          </div>
          <div class="upload-placeholder">
            <button @click="triggerFileInput(0)" class="upload-button">
              <i class="upload-icon"></i>
              이미지 수정
            </button>
          </div>
          <input 
            type="file" 
            ref="fileInput0" 
            @change="onImageUpload(0, $event)" 
            style="display: none;"
          />
        </div>
      </div>
    </div>

    <!-- 1층과 2층 -->
    <div class="floor-section horizontal-layout">
      <div class="floor-container">
        <h3>1층</h3>
        <div class="image-container" @mouseover="showIcons(1, true)" @mouseleave="showIcons(1, false)">
          <div class="image-wrapper">
            <div class="image-box" :class="{ 'hovered': showingIcons[1] }">
              <img 
                v-if="floors[1].imageSrc" 
                :src="floors[1].imageSrc" 
                alt="Floor Image" 
                class="floor-image"
              />
              <div v-if="showingIcons[1]" class="icons-container">
                <img src="../../assets/zoom-in.png" class="icon zoom-icon" @click="enlargeImage(floors[1].imageSrc)" />
                <img src="../../assets/remove.png" class="icon remove-icon" @click="deleteImage(1)" />
              </div>
            </div>
            <div class="upload-placeholder">
              <button @click="triggerFileInput(1)" class="upload-button">
                <i class="upload-icon"></i>
                이미지 수정
              </button>
            </div>
            <input 
              type="file" 
              ref="fileInput1" 
              @change="onImageUpload(1, $event)" 
              style="display: none;"
            />
          </div>
        </div>
      </div>

      <div class="floor-container">
        <h3>2층</h3>
        <div class="image-container" @mouseover="showIcons(2, true)" @mouseleave="showIcons(2, false)">
          <div class="image-wrapper">
            <div class="image-box" :class="{ 'hovered': showingIcons[2] }">
              <img 
                v-if="floors[2].imageSrc" 
                :src="floors[2].imageSrc" 
                alt="Floor Image" 
                class="floor-image"
              />
              <div v-if="showingIcons[2]" class="icons-container">
                <img src="../../assets/zoom-in.png" class="icon zoom-icon" @click="enlargeImage(floors[2].imageSrc)" />
                <img src="../../assets/remove.png" class="icon remove-icon" @click="deleteImage(2)" />
              </div>
            </div>
            <div class="upload-placeholder">
              <button @click="triggerFileInput(2)" class="upload-button">
                <i class="upload-icon"></i>
                이미지 수정
              </button>
            </div>
            <input 
              type="file" 
              ref="fileInput2" 
              @change="onImageUpload(2, $event)" 
              style="display: none;"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <button @click="saveImages" class="save-button">저장하기</button>

    <!-- 확대된 이미지 모달 -->
    <div v-if="enlargedImage" class="image-modal">
      <div class="image-wrapper">
        <img 
          src="../../assets/remove.png" 
          class="remove-icon-modal" 
          @click="closeModal" 
          alt="Close Modal"
        />
        <img 
          :src="enlargedImage" 
          alt="Enlarged Image" 
          class="enlarged-image" 
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      floors: [
        { imageSrc: '', file: null }, // 지하 1층
        { imageSrc: '', file: null }, // 1층
        { imageSrc: '', file: null }  // 2층
      ],
      enlargedImage: null, // 확대된 이미지
      showingIcons: [false, false, false],
      presignedUrls: [], // 사전 서명된 URL (백엔드에서 제공)
    };
  },
  async created() {
    try {
      const response = await axios.get('http://15.164.246.244:8080/get-clubroom-images');
      
      if (response.data && response.data.images) {
        this.floors = await Promise.all(
          response.data.images.map(async (imageUrl, index) => {
            const file = await this.urlToFile(imageUrl, `floor${index + 1}.jpg`);
            return {
              imageSrc: imageUrl,
              file: file
            };
          })
        );
      }
    } catch (error) {
      console.error('이미지 불러오기 실패:', error);
      alert('서버에서 이미지를 불러오는 데 실패했습니다.');
    }
  },
  methods: {
    async urlToFile(url, filename, mimeType = 'image/jpeg') {
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], filename, { type: mimeType });
    },

    // 파일 입력창 열기
    triggerFileInput(index) {
      const fileInputRef = this.$refs[`fileInput${index}`];
      if (fileInputRef) fileInputRef.click();
    },

    // 파일 업로드 처리
    onImageUpload(index, event) {
      const file = event.target.files[0];
      if (!file) return;

      const validExtensions = ['png', 'jpg', 'jpeg'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const maxFileSize = 10 * 1024 * 1024;

      if (!validExtensions.includes(fileExtension) || file.size > maxFileSize) {
        alert('파일 형식이 잘못되었거나 크기가 초과되었습니다. (10MB 이하, png 또는 jpg만 허용)');
        event.target.value = ''; // 동일 파일 선택 가능하도록 초기화
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.floors[index].imageSrc = e.target.result; // 미리보기 이미지 설정
        this.floors[index].file = file; // 업로드 파일 저장
      };
      reader.readAsDataURL(file);

      // 동일 파일 선택 가능하도록 초기화
      event.target.value = '';
    },

    // 이미지 삭제
    deleteImage(index) {
      this.floors[index].imageSrc = null; // 미리보기 이미지 제거
      this.floors[index].file = null; // 파일 정보 제거

      // <input> 요소 초기화
      const fileInputRef = this.$refs[`fileInput${index}`];
      if (fileInputRef) {
        fileInputRef.value = ''; // 동일 파일 선택 가능
      }
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
    showIcons(index, status) {
      this.showingIcons = [
        ...this.showingIcons.slice(0, index),
        status,
        ...this.showingIcons.slice(index + 1)
      ];
    },

    // 이미지 저장
    async saveImages() {
      const formData = new FormData();

      this.floors.forEach((floor, index) => {
        if (floor.file) {
          formData.append(`floor${index + 1}Image`, floor.file);
        }
      });

      try {
        const response = await axios.post('http://15.164.246.244:8080/save-clubroom-images', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        // Presigned URL 제공되면 활용
        if (response.data && response.data.presignedUrls) {
          this.presignedUrls = response.data.presignedUrls;
          await this.uploadToPresignedUrls();
        }

        alert('이미지가 저장되었습니다!');
      } catch (error) {
        alert('이미지 저장에 실패했습니다. 다시 시도해주세요.');
      }
    },

    // Presigned URL로 이미지 업로드
    async uploadToPresignedUrls() {
      try {
        await Promise.all(
          this.presignedUrls.map(async (url, index) => {
            if (this.floors[index].file) {
              await axios.put(url, this.floors[index].file, {
                headers: { 'Content-Type': this.floors[index].file.type }
              });
            }
          })
        );
      } catch (error) {
        alert('Presigned URL 업로드 실패');
      }
    }
  }
};
</script>

<style scoped>
.title {
  color: black;
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 30px;
  position: relative; /* 상대 위치 설정 */
  display: inline-block;
  z-index: 1; /* 텍스트가 배경색 위에 오도록 설정 */
}

.floor-images-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.floor-section {
  margin: 10px 0;
  align-self: start;
  text-align: left;
}

.horizontal-layout {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.floor-container {
  flex: 1;
  margin: 0 10px;
}

.image-container {
  position: relative;
  display: inline-block;
}

.image-box {
  width: 280px; /* 고정 너비 */
  height: 160px; /* 고정 높이 */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* 이미지 넘치는 부분 숨김 */
  border: 1px solid #ddd;
  border-radius: 8px;

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
  filter: invert(99%) sepia(4%) saturate(985%) hue-rotate(214deg) brightness(113%) contrast(100%);
}

.upload-placeholder {
  margin-top: 10px;
}

.upload-button {
    width: 280px;
    height: 30px;
    display: flex;
    flex-shrink: 0;
    border-radius: 8px;
    background: #fff;
    justify-content: center;
    border: none;
    align-items: center;
    align-content: center;
    margin-right: 60px;
    cursor: pointer;

    color: #868686;
    line-height: 18px;
    font-weight: 500;
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
  margin-top: 30px;
  margin-left: 630px; /* 774 -> 630 */
  margin-bottom: 30px;
  cursor: pointer;
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
  filter: invert(99%) sepia(4%) saturate(985%) hue-rotate(214deg) brightness(113%) contrast(100%);
}
h2{
  align-self: start;
  margin-top: -15px;
  margin-bottom: -5px;
}
h3 {
  font-size: 18px;
}
.line {
  border: 1px solid;
  width: 735px;
  color: #d3d3d3;
  margin-top: 20px;
  align-self: flex-start;
}
.remove-icon {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 10px;
  right: 10px;
  pointer-events: all;
  filter: invert(99%) sepia(4%) saturate(985%) hue-rotate(214deg) brightness(113%) contrast(100%);
}
.upload-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
  padding: 7px;
  background: url('../../assets/hugeicons_image-upload.svg') no-repeat center center;
  filter: invert(54%) sepia(1%) saturate(0%) hue-rotate(179deg) brightness(97%) contrast(89%);
}
</style>
