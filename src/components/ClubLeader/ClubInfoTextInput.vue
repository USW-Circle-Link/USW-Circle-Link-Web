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
        <input type="checkbox" v-model="isChecked" id="chk1"/><label for="switch" @click="toggleCheckbox" ></label>
      </div>
    </div>
    <div class="ClubInfoTextInput">
      <textarea v-model="textareaContent" rows="4" cols="50"></textarea>
    </div>
    <h2>구글폼 링크</h2>
    <div class="GoogleFormLinkInput">
      <textarea placeholder="링크를 입력해 주세요" v-model="googleFormLink" rows="4" cols="1" ></textarea>
    </div>
    <button @click="saveInfo">작성 완료</button>
  </div>
</template>

<script>
import axios from 'axios';
import store from '../../store/store';

export default {
  name: 'ClubInfoTextInput',
  components: {
  },
  data() {
    return {
      images: [],  // 이미지를 저장할 배열
      imagesData: [],
      textareaContent: '',  // 소개글
      isChecked: null,    //[모집 중 X] 기본 상태
      googleFormLink: '',  // 구글 폼 링크
      orders: [],  // 이미지 순서 배열
      deletedOrders: [], // 이미지 삭제 순서 배열
      file: [],  // 파일 배열
      presignedUrls: [],  // 사전 서명된 URL 배열
      sendpresignedUrls: [],  // 사전 서명된 URL과 사진을 변경하여
      errorMessage: '',  // 에러 메시지
      validFile: false,  // 파일 유효성 여부
      clubData: {}       // 클럽 소개 정보를 저장할 객체
    };
  },
  computed: {

  },
  mounted() {
    this.fetchClubInfo();  // 컴포넌트가 마운트되면 클럽 정보를 가져옵니다.
  },
  methods: {
    // 컴포넌트가 마운트되면 클럽 정보를 가져옵니다.
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
        this.textareaContent = this.clubData.clubIntro || '';
        this.googleFormLink = this.clubData.googleFormUrl || '';
        this.images = this.clubData.introPhotos.map(url => ({ src: url })) || [];
        // this.orders = this.clubData.introPhotos
        //     .map((photo, index) => (photo ? index + 1 : null)) // 빈 값이 아닌 경우에만 index + 1
        //     .filter(index => index !== null); // null을 필터링
        //this.orders = this.clubData.introPhotos.map((_, index) => index + 1);

        // console.log(this.isChecked);
        // console.log("클럽 정보 불러오기 성공!", this.clubData);
        // console.log(this.images);
        // console.log(this.googleFormLink);

      } catch (error) {
        console.error('클럽 정보를 가져오는 중 오류가 발생했습니다:', error);
        this.errorMessage = '클럽 정보를 가져오는 중 오류가 발생했습니다. 다시 시도해주세요.';
      }
    },
    // X 버튼을 누르면 이미지를 삭제합니다.
    deleteImage(index) {
      this.pastImages = this.images;
      try {
        // console.log(index + 1, "번째 사진 삭제");
        //console.log("Image URL:", this.images[index].src);

        // 삭제된 이미지 배열에 빈 문자열 넣기
        this.images.splice(index, 1, { src: '' });
        // console.log(this.images);

        this.orders.splice(this.orders.indexOf(index + 1) , 1);
        //this.orders.push('');
        //this.orders = this.orders.filter(item => item !== '');

        // console.log("새로 저장 할 사진 순서가 저장된 배열 값",this.orders);

        // 삭제할 이미지 배열 index 값 deletedOrders에 넣기
        this.deletedOrders.splice(index, 0, index + 1);
        this.deletedOrders.sort();
        // console.log("삭제할 사진 순서가 저장된 배열 값",this.deletedOrders);

        // 파일 input 참조를 재정렬
        this.$forceUpdate();

      } catch (error) {
        console.error("Error while deleting image:", error);
      }
    },
    // 모집중 토글 함수, 모집 상태를 서버에 반영합니다.
    async toggleCheckbox() {
      const accessToken = store.state.accessToken; // 저장된 accessToken 가져오기채
      const clubId = store.state.clubId; // 저장된 clubId 가져오기
      this.isChecked = !this.isChecked;  // 현재 isChecked 상태를 반전시킴
      this.$emit('sendData', this.isChecked);

      axios.patch(`http://15.164.246.244:8080/club-leader/${clubId}/toggle-recruitment`,
          {
            key: this.isChecked
          },
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`, // 헤더에 accessToken 추가해야 함
            }
          })
          .then(response => {
            console.log('Updated data:', response.data);
            if(this.isChecked === true){
              setTimeout(function() {
                alert('동아리 모집 상태 변경 완료 [모집중 ON]');
              }, 800);
            } else {
              setTimeout(function() {
                alert('동아리 모집 상태 변경 완료 [모집중 OFF]');
              }, 800);
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
    },
    // 파일을 선택합니다.
    triggerFileInput(index) {
      const fileInputRef = this.$refs[`fileInput${index}`];
      if (fileInputRef && fileInputRef[0] && fileInputRef[0].click) {
        fileInputRef[0].click();
      }
    },
    // 선택된 이미지를 다른 이미지로 교체합니다.
    onFileChange(index, event) {
      this.images.splice(index, 1, {src : ''});
      if (this.images.filter(image => image.src !== '').length >= 5) {
        alert('이미지는 최대 5개까지 업로드할 수 있습니다.');
        return;
      }
      const file = event.target.files[0];

      if (file) {
        // .jpg, .jpeg (JPEG 이미지), .png (PNG 이미지), .gif (GIF 이미지), .bmp (비트맵 이미지), .webp (WebP 이미지), .tiff (TIFF 이미지)
        // 파일 업로드 이미지 사이즈는 10mb 이하
        const validExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const maxFileSize = 10 * 1024 * 1024; // 10MB를 바이트로 변환
        console.log(file.size);

        if (validExtensions.includes(fileExtension) && file.size < maxFileSize) {
          this.file.splice(index, 1, file);
          this.errorMessage = '';
          this.validFile = true;

          const reader = new FileReader();
          reader.onload = (e) => {
            this.images[index].src = e.target.result;
            this.imagesData.push({ src: e.target.result, file });
            console.log(this.imagesData);
          };
          reader.readAsDataURL(file);

          console.log(index + 1, "번째 사진 변경", );
          this.orders.splice(index, 0, index + 1);
          this.orders.sort();
          // console.log("새로 저장 할 사진 순서가 저장된 배열 값",this.orders);
          // console.log("삭제할 사진 순서가 저장된 배열 값",this.deletedOrders);
        } else {
          console.error("Invalid file format:", fileExtension);
          alert("파일 형식이 맞지 않습니다. \n10MB 이하 .png, .jpg, .jpeg, .gif, .bmp, .webp, .tiff 형식의 파일을 입력하세요.");
          this.errorMessage = '파일 형식이 맞지 않습니다. .png, .jpg, .jpeg, .gif, .bmp, .webp, .tiff 형식의 파일을 입력하세요.';
          this.file.splice(index, 1, file);
          this.validFile = false;
        }
      }
    },
    // 새로운 이미지를 업로드합니다.
    onImageUpload(index, event) {
      const file = event.target.files[0];
      if (file) {
        // .jpg, .jpeg (JPEG 이미지), .png (PNG 이미지), .gif (GIF 이미지), .bmp (비트맵 이미지), .webp (WebP 이미지), .tiff (TIFF 이미지)
        // 파일 업로드 이미지 사이즈는 10mb 이하
        const validExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const maxFileSize = 10 * 1024 * 1024; // 10MB를 바이트로 변환
        console.log(file.size);

        if (validExtensions.includes(fileExtension) && file.size < maxFileSize) {
          this.file.push(file);
          console.log(index + 1, "번째 사진 추가", );
          this.deletedOrders.splice(this.deletedOrders.indexOf(index + 1), 1);
          this.orders.splice(index, 0, index + 1);
          this.orders.sort();
          // console.log("삭제할 사진 순서가 저장된 배열 값",this.deletedOrders);
          // console.log("새로 저장 할 사진 순서가 저장된 배열 값", this.orders);
          const reader = new FileReader();
          reader.onload = (e) => {
            this.images.splice(index,1,{ src: e.target.result });
            this.imagesData.push({ src: e.target.result, file });
            // console.log(this.images);
          };
          reader.readAsDataURL(file);
        } else {
          console.error("Invalid file format:", fileExtension);
          alert("파일 형식이 맞지 않습니다. \n10MB 이하 .png, .jpg, .jpeg, .gif, .bmp, .webp, .tiff 형식의 파일을 입력하세요.");
        }
      }
    },
    // 소개/모집글 정보를 저장합니다.
    async saveInfo() {
      const clubId = store.state.clubId;
      const accessToken = store.state.accessToken;

      if(this.textareaContent === ''){
        alert("소개 모집글 작성 실패. 동아리 소개 입력칸이 비어있습니다.");
        return;
      }
      if(this.googleFormLink === ''){
        alert("소개 모집글 작성 실패. 구글 폼 링크 입력칸이 비어있습니다.");
        return;
      }
      if(this.googleFormLink.includes("https://forms.gle/") && this.googleFormLink.includes("https://docs.google.com/forms/")){
        alert("https://forms.gle/ 또는 https://docs.google.com/forms/ 로 시작하는 링크만 입력 할 수 있습니다.");
        return;
      }

      const form = new FormData();
      const jsonData = {
        clubIntro: this.textareaContent || this.clubData.clubIntro,
        googleFormUrl: this.googleFormLink || this.clubData.googleFormUrl,
        orders: this.orders || this.clubData.orders,
        deletedOrders : this.deletedOrders
      };
      form.append('clubIntroRequest', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }));
      //console.log(jsonData);
      //삭제되지 않은 파일만 서버에 전송
      // console.log('A', this.images);
      // this.imagesData = this.images.filter(image => image.src !== '');
      // console.log('B', this.imagesData);
      this.imagesData.forEach((image, index) => {
        // console.log(`${index}`,image.file);
        form.append('introPhotos', image.file);
      });
      try {
        const response = await axios.put(
            `http://15.164.246.244:8080/club-leader/${clubId}/intro`,
            form,
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data'
              }
            }
        );
        // for (let [key, value] of form.entries()) {
        //   console.log(`${key}: ${value}`);
        // }
        // console.log(response);
        if (response.data && response.data.data && response.data.data.presignedUrls) {
          this.presignedUrls = response.data.data.presignedUrls;
          // console.log(this.presignedUrls);
          // 각 파일을 S3에 업로드
          await this.uploadFiles();
        }

        alert("저장되었습니다!");
        console.log("소개/모집글 작성 완료!");
        location.reload();
        // console.log('서명된 사진 링크 ', this.presignedUrls);

        // 저장 후 데이터를 다시 불러오기 위해 이벤트 발생
        this.$emit('data-saved');

      } catch (error) {
        console.error("오류가 발생했습니다:", error.response ? error.response.data : error);
      }
    },
    // 이미지 데이터가 저장된 서명된 이미지 링크를 불러와 저장합니다.
    async uploadFiles() {
      try {
        await Promise.all(this.presignedUrls.map(async (photoUrl, index) => {
          const photoResponse = await axios.put(photoUrl, this.imagesData[index].file, {
            headers: {
              'Content-Type': this.imagesData[index].file.type,
            }
          });
        }));
        //await this.saveFileUrlsToDatabase();
      } catch (error) {
        console.error("파일 업로드 실패:", error);
        alert("파일 업로드 실패!");
      }
    },
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

.head{
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.head p{
  font-size: 18px;
  font-weight: 500;
  margin-top: 21px;
}

.empty{
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
  box-shadow: 1px 3px 4px rgba(0,0,0,0.1);
  transition: all 0.4s;
}

#chk1:checked + label {
  background-color: #FFC700;
}

#chk1:checked + label::after {
  left: calc(100% - 18px);
}

.head input{
  visibility: hidden;
  width: 1px;
}

.GoogleFormLinkInput{
  width: 886px;
  height: 40px;
  border-radius: 8px;
  background-color: #ffffff;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.GoogleFormLinkInput textarea{
  width: 820px;
  height: 28px;
  margin-top: 10px;
  text-align: left;
  border: none;
  font-size: 16px;
  resize: none;
}

.GoogleFormLinkInput textarea::placeholder{
  text-align: center;
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
