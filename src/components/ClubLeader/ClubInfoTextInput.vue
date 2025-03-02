<template>
  <div class="whole-container">
    <div class="head">
      <h2>동아리 활동 사진</h2>
      <div class="empty"></div>
      <div class="warning-text">동아리와 관련 없는 사진 업로드 시, 권한이 제한될 수 있습니다.</div>
    </div>
    <div class="image-upload-container">
      <div v-for="(image, index) in images" :key="index" class="image-preview">
        <div v-if="image.src" class="image-preview">
          <img :src="image.src" alt="Uploaded Image" class="uploaded-image" oncontextmenu="return false;" />
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
          <div class="plus" @click="$event.currentTarget.previousElementSibling.click()">
            <img src="../../assets/plus.svg" alt="이미지 추가" />
          </div>
        </div>
      </div>
    </div>

    <div class="ClubUpdateHeader">
      <div class="head">
        <h2>동아리 소개 글 수정</h2>
      </div>
    </div>
    <div class="ClubTextInput">
      <div class="textarea-container">
        <textarea
            placeholder="동아리에 대해 자유롭게 설명해주세요."
            v-model="textareaContent"
            rows="4"
            cols="50"
            class="preserve-whitespace"
            @input="updateTextSize"
        ></textarea>
        <p class="textSize">{{ textSize }} / 3000</p>
      </div>
    </div>

    <div class="ClubRecruitHeader">
      <div class="head">
        <h2>동아리 모집 글 수정</h2>
        <div class="empty"></div>
        <p>모집 중</p>
        <input type="checkbox" v-model="isChecked" id="chk1" /><label for="switch" @click="toggleCheckbox"></label>
      </div>
    </div>
    <div class="ClubTextInput" id="RecruitInputSpace" :readonly="!isChecked" :class="{ 'RecruitToggleOff': !isChecked }">
      <div class="textarea-container">
        <textarea
            placeholder="동아리 모집에 대해 자유롭게 설명해주세요."
            v-model="textareaRecruitContent"
            :readonly="!isChecked"
            :class="{ 'RecruitToggleOff': !isChecked }"
            rows="4"
            cols="50"
            class="preserve-whitespace"
            @input="updateRecruitTextSize"
        ></textarea>
        <p class="textSize">{{ RecruittextSize }} / 3000</p>
      </div>
    </div>

    <div class="head">
      <h2>지원서 링크</h2>
    </div>
    <div class="GoogleFormLinkInput"
         :readonly="!isChecked"
         :class="{ 'RecruitToggleOff': !isChecked }">
      <textarea placeholder="링크를 입력해 주세요"
                v-model="googleFormLink" rows="4" cols="1"
                :readonly="!isChecked"
                :class="{ 'RecruitToggleOff': !isChecked }"></textarea>
    </div>
    <button @click="saveInfo" >작성 완료</button>

    <div v-if="showConfirmPopup" class="popup-overlay">
      <div class="popup">
        <h2>동아리 소개/모집</h2>
        <hr>
        <p class="confirm-message">동아리 소개/모집 글 작성이 완료되었습니다.</p>
        <div class="popup-buttons">
          <button @click="hidePopup">확인</button>
        </div>
      </div>
    </div>

    <Popup401 v-if="show401Popup" />
  </div>
</template>

<script>
import axios from 'axios';
import store from '../../store/store';
import Popup401 from './401Popup.vue';

export default {
  name: 'ClubInfoTextInput',
  components: {
    Popup401
  },
  data() {
    return {
      images: [
        { src: '' }, // 업로드되지 않은 상태의 기본 이미지 슬롯
        { src: '' },
        { src: '' },
        { src: '' },
        { src: '' },], //업로드 된 이미지 정보
      textareaContent: '',  // 소개글
      textareaRecruitContent: '',  // 모집글
      isChecked: null,
      googleFormLink: '',
      orders: [], //이미지 순서 정보
      deletedOrders: [],
      file: [],
      presignedUrls: [],
      imagesData: [],  // 이미지 정보
      errorMessage: '',
      validFile: false,
      clubData: {}, //클럽 정보
      textSize: 0,
      RecruittextSize: 0,
      showConfirmPopup: false,
      show401Popup: false
    };
  },
  mounted() {
    this.fetchClubInfo();  // 클럽 정보를 가져옵니다.
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

    // 클럽 정보 가져오기
    async fetchClubInfo() {
      const clubUUID = store.state.clubUUID;
      const accessToken = store.state.accessToken;

      try {
        const response = await axios.get(`https://api.donggurami.net/club-leader/${clubUUID}/intro`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        console.log("서버에서 받은 GET 응답 데이터:", response.data);

        //가져온 클럽 데이터를 저장
        this.clubData = response.data.data;
        this.isChecked = (this.clubData.recruitmentStatus === 'OPEN');
        // 줄바꿈 처리 수정
        this.textareaContent = (this.clubData.clubIntro || '')
            .replace(/\n?<br>\n?/gi, '\n')
            .replace(/&nbsp;/g, ' ');
        // 줄바꿈 처리 수정
        this.textareaRecruitContent = (this.clubData.clubRecruitment || '' || this.textareaRecruitContent)
            .replace(/\n?<br>\n?/gi, '\n')
            .replace(/&nbsp;/g, ' ');
        this.googleFormLink = this.clubData.googleFormUrl || '';
        
        //  새로운 이미지가 반영되는지 확인
        console.log("[fetchClubInfo] introPhotos:", this.clubData.introPhotos);
        
        //  UI가 변경되지 않도록 빈 값 포함하여 처리
        this.images = Array(5).fill({ src: '' }); // 항상 5개의 슬롯 유지

        // introPhotos를 기존 `this.images` 배열의 적절한 위치에 삽입
        (this.clubData.introPhotos || []).forEach((url, index) => {
          if (url) {
            this.images[index] = { src: url };
          }
        });

        console.log(" [fetchClubInfo] UI에 적용할 images:", this.images);

      } catch (error) {
        if (!this.handle401Error(error)) {
          console.error('동아리 정보를 불러오는데 실패했습니다.', error);
          alert('동아리 정보를 불러오는데 실패했습니다.');
        }
      }
      this.updateTextSize();
      this.updateRecruitTextSize();
    },
    navigateTo(routeName) {
      this.$router.push({ name: routeName }).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          throw err;
        }
      });
    },
    // 이미지 삭제
    deleteImage(index) {
      try {
        //  UI에서 해당 이미지를 삭제
        this.images.splice(index, 1, { src: '' });

        //  imagesData에서도 해당 데이터 삭제
        this.imagesData = this.imagesData.filter((_, i) => i !== index);

        console.log("이미지 삭제됨, images 상태:", this.images);

        this.$forceUpdate(); // UI 강제 업데이트
      } catch (error) {
        console.error("Error while deleting image:", error);
      }
    },


    // 모집중 토글(on/off)
    async toggleCheckbox() {
      const accessToken = store.state.accessToken;
      const clubUUID = store.state.clubUUID;
      this.isChecked = !this.isChecked;
      this.$emit('sendData', this.isChecked);

      axios.patch(`https://api.donggurami.net/club-leader/${clubUUID}/recruitment`, {
        key: this.isChecked
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

          .then(response => {
            //모집 상태 변경 완료 후 알림
            if (this.isChecked === true) {
              //setTimeout(() => alert('동아리 모집 상태 변경 완료 [모집중 ON]'), 800);
            } else {
              //setTimeout(() => alert('동아리 모집 상태 변경 완료 [모집중 OFF]'), 800);
            }
          })
          .catch(error => console.error('Error:', error));
    },
    // 파일 선택 트리거
    triggerFileInput(index) {
      const fileInputRef = this.$refs[`fileInput${index}`];
      if (fileInputRef && fileInputRef[0] && fileInputRef[0].click) {
        fileInputRef[0].click();//파일 선택 창 열기
      }
    },
    // 파일 변경 처리
    onFileChange(index, event) {
      this.images.splice(index, 1, { src: '' });//이미지 초기화
      if (this.images.filter(image => image.src !== '').length >= 5) {
        alert('이미지는 최대 5개까지 업로드할 수 있습니다.');
        return;
      }
      const file = event.target.files[0];
      //파일 확장자 및 크기 검사
      if (file) {
        const validExtensions = ['png', 'jpg', 'jpeg'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const maxFileSize = 10 * 1024 * 1024; // 10MB 제한

        // 사진 크기 체크를 명확하게 하고 별도 메시지 표시
        if (file.size > maxFileSize) {
          alert("사진 크기가 10MB를 초과합니다. 10MB 이하의 사진만 업로드 가능합니다.");
          this.errorMessage = '사진 크기가 10MB를 초과합니다.';
          this.validFile = false;
          return;
        }

        if (!validExtensions.includes(fileExtension)) {
          alert("지원하지 않는 사진 형식입니다. .png, .jpg, .jpeg 형식의 사진만 업로드 가능합니다.");
          this.errorMessage = '지원하지 않는 사진 형식입니다.';
          this.validFile = false;
          return;
        }

        // 유효한 파일인 경우 처리
        this.file.splice(index, 1, file);//파일 추가
        this.errorMessage = '';
        this.validFile = true;

        const reader = new FileReader();
        reader.onload = (e) => {
          // 기존의 `index` 위치를 강제적으로 유지하지 않고, 배열을 정리
          this.images[index].src = e.target.result;

          // 빈 공간이 생기지 않도록 배열을 정리하여 추가
          this.imagesData = this.images
            .map((image, i) => image.src ? { src: image.src, file: i === index ? file : this.imagesData[i]?.file } : null)
            .filter(image => image !== null);
        };
        reader.readAsDataURL(file);
      }
    },
    // 이미지 업로드
    onImageUpload(index, event) {
      const file = event.target.files[0];

      if (file) {
        const validExtensions = ['png', 'jpg', 'jpeg'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const maxFileSize = 10 * 1024 * 1024; // 10MB 제한

        // 파일 유효성 검사
        if (file.size > maxFileSize) {
          alert("사진 크기가 10MB를 초과합니다. 10MB 이하의 사진만 업로드 가능합니다.");
          return;
        }

        if (!validExtensions.includes(fileExtension)) {
          alert("지원하지 않는 사진 형식입니다. .png, .jpg, .jpeg 형식의 사진만 업로드 가능합니다.");
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          //  UI에서만 이미지 추가
          this.images.splice(index, 1, { src: e.target.result });

          // imagesData 배열에도 추가 (서버로 전송할 실제 파일 정보 포함)
          this.imagesData[index] = { src: e.target.result, file };

          console.log(" 이미지 업로드됨, images 상태:", this.images);
        };

        reader.readAsDataURL(file);
      }
    },

    //전송 확인 팝업 표시
    showPopup() {
      this.showConfirmPopup = true;
    },
    //전송 확인 팝업 숨김
    hidePopup() {
      this.showConfirmPopup = false;
    },
    // 정보 저장
    async saveInfo() {
      const clubUUID = store.state.clubUUID;
      const accessToken = store.state.accessToken;

      // 업로드 전에 실제 업로드할 파일들을 압축해서 새 배열로 만듭니다.
      const uploadedFiles = this.imagesData.filter(item => item && item.file);
      this.imagesData = uploadedFiles; // 이제 imagesData는 orders와 동일한 순서로 정렬됨.


      // 현재 업로드된 이미지가 있는 칸만 추출
      let tempOrders = this.images
        .map((image, index) => (image.src ? index : null))
        .filter(index => index !== null);
        
      //  빈 칸을 허용하지 않고 항상 1부터 연속된 숫자로 orders 변환
      this.orders = tempOrders.map((_, i) => i + 1);

      // 서버에서 가져온 기존 이미지 목록과 비교하여 삭제된 것만 `deletedOrders`에 포함
      const previousOrders = this.clubData.introPhotos.map((_, index) => index + 1); // 기존 서버 이미지 인덱스
      this.deletedOrders = previousOrders.filter(index => !this.orders.includes(index)); // 기존에는 있었는데 없어진 것만

      console.log(" 최종 orders:", this.orders);
      console.log(" 최종 deletedOrders:", this.deletedOrders);

      const form = new FormData();
      const jsonData = {
        clubIntro: this.textareaContent
          .replace(/ /g, '&nbsp;')
          .replace(/\n/g, '<br>'),

        clubRecruitment: this.textareaRecruitContent
          .replace(/ /g, '&nbsp;')
          .replace(/\n/g, '<br>'),

        recruitmentStatus: this.isChecked ? 'OPEN' : 'CLOSE',
        googleFormUrl: this.googleFormLink || this.clubData.googleFormUrl,
        orders: this.orders,
        deletedOrders: this.deletedOrders
      };
      form.append('clubIntroRequest', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }));

      // 이미지 데이터 폼에 추가
      this.imagesData.forEach((image) => {
        if (image.file) {
          form.append('introPhotos', image.file);
        }
      });

      try {
        const response = await axios.put(
          `https://api.donggurami.net/club-leader/${clubUUID}/intro`,
          form,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (response.data && response.data.data && response.data.data.presignedUrls) {
          this.presignedUrls = response.data.data.presignedUrls;
          await this.uploadFiles(); // 파일 업로드
          console.log(" [saveInfo] 서버 응답 데이터:", response.data);
        }
        

        this.showPopup();
        await this.fetchClubInfo(); // 저장 후 클럽 정보 다시 가져오기
        this.$emit('data-saved'); // 데이터 저장 완료 이벤트 발생

      } catch (error) {
        if (!this.handle401Error(error)) {
          console.error('동아리 정보 저장에 실패했습니다.', error);
          alert('동아리 정보 저장에 실패했습니다.');
        }
      }
    },

    // 이미지 업로드
    async uploadFiles() {
      try {
        await Promise.all(this.presignedUrls.map(async (photoUrl, index) => {
          if (this.imagesData[index] && this.imagesData[index].file) {
            await axios.put(photoUrl, this.imagesData[index].file, {
              headers: {
                'Content-Type': this.imagesData[index].file.type,
              }
            });
          }
        }));
      } catch (error) {
        console.error("파일 업로드 실패:", error);
        alert("파일 업로드 실패!");
      }
    },
    updateTextSize() {
      // 문자 수가 3000자를 초과하는지 확인
      if (this.textareaContent.length > 3000) {
        alert("소개글 문자 수가 3000자를 초과했습니다.");
        this.textareaContent = this.textareaContent.slice(0, 3000); // 3000자로 잘라서 저장
      }

      // 문자 수 업데이트
      this.textSize = this.textareaContent.length;
    },
    updateRecruitTextSize(){
      // 문자 수가 3000자를 초과하는지 확인
      if (this.textareaRecruitContent.length > 3000) {
        alert("모집글 문자 수가 3000자를 초과했습니다.");
        this.textareaRecruitContent = this.textareaRecruitContent.slice(0, 3000); // 3000자로 잘라서 저장
      }

      // 문자 수 업데이트
      this.RecruittextSize = this.textareaRecruitContent.length;
    }
  }
};
</script>


<style scoped>
.warning-text {
  font-size: 14px;
  font-weight: 400;
  color: #656565;
}

.whole-container {
  display: flex;
  flex-direction: column;
  align-items: center; /* center로 변경 */
  width: 886px; /* 컨테이너 너비 지정 */
  margin: 0 auto; /* 중앙 정렬을 위해 추가 */
}

.whole-container h2{
  font-size: 18px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: -0.025em;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;

}

.preserve-whitespace {
  white-space: pre-wrap;
}

.image-upload-container {
  display: flex;
  align-items: center;
  width: 866px;
  height: 153.96px;
  background-color: white;
  padding: 5px;
  margin: auto;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  justify-content: space-around;
}

h2{
  font-size: 24px;
}

.image-preview {
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  width: 141px;
  height: 95px;
  flex: 0 0 auto;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.edit-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  filter: invert(100%);
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
  width: 138px;
  height: 92px;
  border: 2px solid #ddd;
  background: #ececec;
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

.ClubTextInput{
  width: 886px;
  height: 262px;
  border-radius: 8px;
  background-color: #ffffff;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ClubTextInput textarea{
  width: 846px;
  height: 222px;
  padding: 0 20px;
  text-align: left;
  border: none;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  resize: none;
  white-space: pre-wrap;
  font-family: 'Malgun Gothic', sans-serif;
}

/* 모집중 X일 때 */
.RecruitToggleOff{
  background-color: #e5e5e5 !important; /* 회색 배경*/
  color: #a9a9a9; /* 회색 텍스트 */
  cursor: not-allowed; /* 마우스 입력 불가 */
  border-style: solid;
  border-width: 1px;
  border-color: #999999
}

.ClubTextInput textarea.RecruitToggleOff {
  font-size: 14px;
  line-height: 1.5;
  color: #333;

}

textarea:focus {
  outline: none; /* 포커스 상태일 때 테두리 제거 */
}

.head{
  display: flex;
  width: 886px;
  align-items: baseline;
  justify-content: space-between;
  white-space: nowrap; /* 줄바꿈 방지 */
}

.head h2{
  margin-top: 30px;
}

.head p{
  font-size: 18px;
  font-weight: 500;
  margin-top: 21px;

  white-space: nowrap; /* 줄바꿈 방지 */
}

.empty{
  width: 641px;
}

label {
  display: block;
  position: relative;
  width: 50px;
  height: 22px;
  background: #d3d3d3;
  border-radius: 60px;
  transition: background 0.4s;
  cursor: pointer;
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
  background-color: #FFB052;
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
}

.GoogleFormLinkInput textarea{
  width: 846px;
  height: 20px;
  padding: 0 20px;
  text-align: left;
  border: none;
  resize: none;
  font-size: 14px;
  color: #333;
  font-family: 'Malgun Gothic', sans-serif;
}

/*
.GoogleFormLinkInput textarea::placeholder{
  text-align: center;
}*/

textarea:focus {
  outline: none; /* 포커스 상태일 때 테두리 제거 */
}

button {
  width: 112px;
  height: 48px;
  background: #FFB052;
  border: none;
  border-radius: 4px;
  color: #ffffff;
  line-height: 16px;
  letter-spacing: -0.025em;
  text-align: center;
  margin-top: 35px;
  margin-left: 774px;
  margin-bottom: 30px;
  cursor: pointer;
  font-weight: 700;
  font-size: 16px;
}

.textSize{
  position:absolute;
  bottom: -20px;
  right: 20px;

  /*text-align: right;
  margin-right: 10px;*/
  font-size: 14px;
}

.textarea-container {
  position: relative;
  width: 100%;
  height: auto;
}

textarea::placeholder{
  font-size: 14px;
}

.plus {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  background: hsla(0,0%,100%,.7);
  border-radius: 50%;
  border: 2px solid #ddd;
  box-shadow: 0 0 1px rgba(0,0,0,.1);
  color: #696969;
}

.plus img {
  width: 15px; /* 이미지 크기 조정 */
  height: 15px;
  object-fit: contain;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 500px;
  height: 180px;
  position: relative;
}
.popup h2 {
  margin-top: 0;
  text-align: left;
}
hr {
  border: none;
  border-top: 1px solid #ccc;
  margin: 10px 0;
}
.confirm-message {
  text-align: left;
}
.notice-message {
  text-align: left;
  font-size: 12px;
  color: gray;
}
.popup-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 40px;
}
.popup-buttons button {
  width: 80px;
  height: 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-left: 10px;
}
.popup-buttons button:first-child {
  background: #ffb052;
  color: white;
}
</style>