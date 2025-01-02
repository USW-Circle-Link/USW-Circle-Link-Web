<template>
  <div>
    <h2>동아리 활동 사진</h2>
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
          <span>+</span>
        </div>
      </div>
    </div>

    <div class="ClubUpdateHeader">
      <div class="head">
        <h2>동아리 소개 글 수정</h2>
        </div>
    </div>
    <div class="ClubTextInput">
      <textarea 
      v-model="textareaContent" 
      rows="4" 
      cols="50"
      class="preserve-whitespace"
      @input="updateTextSize">
    </textarea>
    </div>

    <p class="textSize">{{ textSize }} / 3000</p>

    <div class="ClubRecruitHeader">
      <div class="head">
        <h2>동아리 모집 글 수정</h2>
        <div class="empty"></div>
        <p>모집 중</p>
        <input type="checkbox" v-model="isChecked" id="chk1" /><label for="switch" @click="toggleCheckbox"></label>
      </div>
    </div>
    <div class="ClubTextInput" id="RecruitInputSpace"
      :disabled="!isChecked" 
      :class="{ 'RecruitToggleOff': !isChecked }" >
      
      <textarea 
      v-model="textareaRecruitContent" 
      :disabled="!isChecked" 
      :class="{ 'RecruitToggleOff': !isChecked }" 
      rows="4" 
      cols="50"
      class="preserve-whitespace"
      @input="updateRecruitTextSize">
      </textarea>
    </div>

    <p class="textSize">{{ RecruittextSize }} / 3000</p>

    <h2>지원서 링크</h2>
    <div class="GoogleFormLinkInput"
      :disabled="!isChecked"
      :class="{ 'RecruitToggleOff': !isChecked }">
      <textarea placeholder="링크를 입력해 주세요" 
      v-model="googleFormLink" rows="4" cols="1"
      :disabled="!isChecked"
      :class="{ 'RecruitToggleOff': !isChecked }"></textarea>
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
      images: [], //업로드 된 이미지 정보
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
    };
  },
  mounted() {
    this.fetchClubInfo();  // 클럽 정보를 가져옵니다.
  },
  methods: {
    // 클럽 정보 가져오기
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
        
        //가져온 클럽 데이터를 저장
        this.clubData = response.data.data;
        this.isChecked = (this.clubData.recruitmentStatus === 'OPEN');
        // 줄바꿈 처리 수정
        this.textareaContent = (this.clubData.clubIntro || '')
            .replace(/\n?<br>\n?/gi, '\n')
            .replace(/&nbsp;/g, ' ');
        // 줄바꿈 처리 수정
        /*
        this.textareaRecruitContent = (this.clubData.clubRecruit || '') // this.clubData.clubRucruit부분 백엔드에 맞추어 추후 수정 필요 @
            .replace(/\n?<br>\n?/gi, '\n')
            .replace(/&nbsp;/g, ' ');*/
        this.googleFormLink = this.clubData.googleFormUrl || '';
        this.images = this.clubData.introPhotos.map(url => ({ src: url })) || [];

      } catch (error) {
        //console.error('클럽 정보를 가져오는 중 오류가 발생했습니다:', error);
        this.errorMessage = '클럽 정보를 가져오는 중 오류가 발생했습니다. 다시 시도해주세요.';
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
      this.pastImages = this.images;//현재 이미지를 임시 저장
      try {
        this.images.splice(index, 1, { src: '' });//해당 인덱스의 이미지를 제거
        this.orders.splice(this.orders.indexOf(index + 1), 1);//순서 정보 업데이트
        this.deletedOrders.splice(index, 0, index + 1);//삭제 된 순서 저장
        this.deletedOrders.sort();//순서 정렬
        this.$forceUpdate();//변경사항 적용 강제
      } catch (error) {
        console.error("Error while deleting image:", error);
      }
    },
    // 모집중 토글(on/off)
    async toggleCheckbox() {
      const accessToken = store.state.accessToken;
      const clubId = store.state.clubId;
      this.isChecked = !this.isChecked;
      this.$emit('sendData', this.isChecked);

      axios.patch(`http://15.164.246.244:8080/club-leader/${clubId}/toggle-recruitment`, {
        key: this.isChecked
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
          .then(response => {
            //모집 상태 변경 완료 후 알림
            if (this.isChecked === true) {
              setTimeout(() => alert('동아리 모집 상태 변경 완료 [모집중 ON]'), 800);
            } else {
              setTimeout(() => alert('동아리 모집 상태 변경 완료 [모집중 OFF]'), 800);
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
        const validExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const maxFileSize = 10 * 1024 * 1024;

        if (validExtensions.includes(fileExtension) && file.size < maxFileSize) {
          this.file.splice(index, 1, file);//파일 추가
          this.errorMessage = '';
          this.validFile = true;

          const reader = new FileReader();
          reader.onload = (e) => {
            this.images[index].src = e.target.result;//미리보기 이미지 설정
            this.imagesData.push({ src: e.target.result, file });//이미지 데이터 추가
          };
          reader.readAsDataURL(file);

          this.orders.splice(index, 0, index + 1);//순서 추가 및 정렬
          this.orders.sort();
        } else {
          alert("파일 형식이 맞지 않습니다. \n10MB 이하 .png, .jpg, .jpeg, .gif, .bmp, .webp, .tiff 형식의 파일을 입력하세요.");
          this.errorMessage = '파일 형식이 맞지 않습니다.';
          this.validFile = false;
        }
      }
    },
    // 이미지 업로드
    onImageUpload(index, event) {
      const file = event.target.files[0];
      //파일 유효성 검사
      if (file) {
        const validExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const maxFileSize = 10 * 1024 * 1024;

        if (validExtensions.includes(fileExtension) && file.size < maxFileSize) {
          this.file.push(file);
          this.deletedOrders.splice(this.deletedOrders.indexOf(index + 1), 1);//삭제 된 순서 제거
          this.orders.splice(index, 0, index + 1);//순서 추가 및 정렬
          this.orders.sort();
          const reader = new FileReader();
          reader.onload = (e) => {
            this.images.splice(index, 1, { src: e.target.result });
            this.imagesData.push({ src: e.target.result, file });
          };
          reader.readAsDataURL(file);
        } else {
          alert("파일 형식이 맞지 않습니다.");
        }
      }
    },
    // 정보 저장
    async saveInfo() {
      const clubId = store.state.clubId;
      const accessToken = store.state.accessToken;

      // if (this.textareaContent === '') {
      //   alert("소개 모집글 작성 실패. 동아리 소개 입력칸이 비어있습니다.");
      //   return;
      // }
      // if (this.googleFormLink === '') {
      //   alert("소개 모집글 작성 실패. 구글 폼 링크 입력칸이 비어있습니다.");
      //   return;
      // }
      // if (!this.googleFormLink.includes("https://forms.gle/") && !this.googleFormLink.includes("https://docs.google.com/forms/")) {
      //   alert("https://forms.gle/ 또는 https://docs.google.com/forms/ 로 시작하는 링크만 입력 할 수 있습니다.");
      //   return;
      // }

      const form = new FormData();
      const jsonData = {
        // 줄바꿈을 <br>로 변환
        clubIntro: this.textareaContent
            .replace(/ /g, '&nbsp;')
            .replace(/\n/g, '<br>'),
        //clubIntro: this.textareaContent,

        // 줄바꿈을 <br>로 변환
        /*
        clubRecruit: this.textareaRecruitContent // 백엔드에 맞추어 추후 수정 필요 @
            .replace(/ /g, '&nbsp;')
            .replace(/\n/g, '<br>'),*/

        googleFormUrl: this.googleFormLink || this.clubData.googleFormUrl,
        orders: this.orders || this.clubData.orders,
        deletedOrders: this.deletedOrders
      };
      form.append('clubIntroRequest', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }));
      //이미지 데이터 폼에 추가
      this.imagesData.forEach((image, index) => {
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
        if (response.data && response.data.data && response.data.data.presignedUrls) {
          this.presignedUrls = response.data.data.presignedUrls;
          await this.uploadFiles();//파일 업로드
        }

        alert("저장되었습니다!");
        this.navigateTo('dashboard');//완료 되면 홈 화면으로 이동
        this.$emit('data-saved');//데이터 저장 완료 이벤트 발생

      } catch (error) {
        console.error("오류가 발생했습니다:", error.response ? error.response.data : error);
      }
    },
    // 이미지 업로드
    async uploadFiles() {
      try {
        await Promise.all(this.presignedUrls.map(async (photoUrl, index) => {
          await axios.put(photoUrl, this.imagesData[index].file, {
            headers: {
              'Content-Type': this.imagesData[index].file.type,
            }
          });
        }));
      } catch (error) {
        console.error("파일 업로드 실패:", error);
        alert("파일 업로드 실패!");
      }
    },
    updateTextSize() {
      // 문자 수가 3000자를 초과하는지 확인
      if (this.textareaContent.length > 3000) {
        alert("문자 수가 3000자를 초과했습니다.");
        this.textareaContent = this.textareaContent.slice(0, 3000); // 3000자로 잘라서 저장
      }

      // 문자 수 업데이트
      this.textSize = this.textareaContent.length;
    },
    updateRecruitTextSize(){
      // 문자 수가 3000자를 초과하는지 확인
      if (this.textareaRecruitContent.length > 3000) {
        alert("문자 수가 3000자를 초과했습니다.");
        this.textareaRecruitContent = this.textareaRecruitContent.slice(0, 3000); // 3000자로 잘라서 저장
      }

      // 문자 수 업데이트
      this.RecruittextSize = this.textareaRecruitContent.length;
    }
  }
};
</script>


<style scoped>
.preserve-whitespace {
  white-space: pre-wrap;
}

.image-upload-container {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 866px;
  height: 153.96px;
  background-color: white;
  padding: 10px;
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

.ClubTextInput{
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

.ClubTextInput textarea{
  width: 820px;
  height: 330px;
  text-align: left;
  border: none;
  font-size: 16px;
  resize: none;
  white-space: pre-wrap;
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
  height: 25px;
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
  cursor: pointer;
}

.textSize{
  text-align: right;
  margin-right: 10px;
  font-size: 14px;
}

</style>
