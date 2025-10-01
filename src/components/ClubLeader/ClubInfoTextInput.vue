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
            rows="10"
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
            rows="10"
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

    <div v-if="showUnexpectedErrorPopup" class="popup-overlay">
      <div class="unexpectedPopup">
        <h2>동구라미</h2>
        <hr />
        <p class="confirm-message">
          <span class="error-highlight">예기치 못한 오류</span>가 발생했습니다.<br>문제가 계속될 시, 관리자에게 문의해주세요.</p>
        <div class="unexpectedPopup-buttons">
          <button @click="hideUnexpectedErrorPopup">확인</button>
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
      show401Popup: false,
      showUnexpectedErrorPopup: false, // 예기치 못한 오류 팝업
    };
  },
  mounted() {
    this.fetchClubInfo();  // 클럽 정보를 가져옵니다.
  },
  methods: {
    // 401 에러 처리를 위한 공통 함수
    handle401Error(error) {
      // 에러 응답 O, 상태코드 401인 경우
      if (error.response && error.response.status === 401) {
        this.show401Popup = true; //팝업
        return true;
      }
      return false;
    },
    // 클럽 정보 가져오기
    async fetchClubInfo() {
      const clubUUID = store.state.clubUUID;
      const accessToken = store.state.accessToken;

      try {
        // GET요청으로 서버로부터 클럽 정보 받아오기
        const response = await axios.get(`${store.state.apiBaseUrl}/club-leader/${clubUUID}/intro`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        //가져온 클럽 데이터를 저장
        this.clubData = response.data.data;
        this.isChecked = (this.clubData.recruitmentStatus === 'OPEN');
        // 소개글 줄바꿈 처리
        this.textareaContent = (this.clubData.clubIntro || '')
            .replace(/\n?<br>\n?/gi, '\n')
            .replace(/&nbsp;/g, ' ');
        // 모집글 줄바꿈 처리
        this.textareaRecruitContent = (this.clubData.clubRecruitment || '' || this.textareaRecruitContent)
            .replace(/\n?<br>\n?/gi, '\n')
            .replace(/&nbsp;/g, ' ');
        this.googleFormLink = this.clubData.googleFormUrl || '';

        // 기존 이미지 배열 초기화 (항상 5개 슬롯 유지)
        this.images = Array(5).fill({ src: '' }); 

        // 서버에서 가져온 introPhotos를 기존 this.images 배열(UI상 이미지)의 적절한 위치에 삽입
        (this.clubData.introPhotos || []).forEach((url, index) => {
          if (url) {
            this.images[index] = { src: url };
          }
        });

      } catch (error) {
        // 401에러가 아니면 실패 alert창 
        if (!this.handle401Error(error)) {
          alert('동아리 정보를 불러오는데 실패했습니다.');
        }
      }
      // 텍스트 길이 업데이트 
      this.updateTextSize();
      this.updateRecruitTextSize();
    },
    navigateTo(routeName) {
      this.$router.push({name: routeName}).catch(err => {
        // 동일 경로 이동 시 에러 무시 
        if (err.name !== 'NavigationDuplicated') {
          throw err;
        }
      });
    },
    // 이미지 삭제
    deleteImage(index) {
      this.pastImages = this.images;//현재 이미지를 임시 저장
      try {
        this.images.splice(index, 1, {src: ''}); //해당 인덱스의 이미지를 제거 (빈 값)
        this.orders.splice(this.orders.indexOf(index + 1), 1); //순서 정보 업데이트 (삭제된 이미지의 순서를 orders에서 제거)
        this.deletedOrders.splice(index, 0, index + 1); // 삭제된 순서 저장 (삭제된 이미지 순서를 deletedOrders에 추가)
        this.deletedOrders.sort();// 삭제된 순서 배열 정렬
        this.$forceUpdate();//변경사항 적용 강제
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

      // 서버에 PATCH 요청으로 모집 상태 업데이트 
      axios.patch(`${store.state.apiBaseUrl}/club-leader/${clubUUID}/recruitment`, {
        key: this.isChecked // 모집 상태 
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
      // ref가 정상적으로 존재하고 클릭 가능할 경우 클릭 실행
      if (fileInputRef && fileInputRef[0] && fileInputRef[0].click) {
        fileInputRef[0].click();//파일 선택 창 열기
      }
    },
    // 파일 변경 처리
    onFileChange(index, event) {
      this.images.splice(index, 1, {src: ''});//이미지 초기화
      if (this.images.filter(image => image.src !== '').length >= 5) {
        alert('이미지는 최대 5개까지 업로드할 수 있습니다.');
        return;
      }
      const file = event.target.files[0]; // 파일 객체 가져오기 
      //파일 확장자 및 크기 검사
      if (file) {
        const validExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const maxFileSize = 10 * 1024 * 1024; // 10MB

        if (validExtensions.includes(fileExtension) && file.size < maxFileSize) {
          this.file.splice(index, 1, file); // 해당 인덱스에 파일 삽입
          this.errorMessage = '';
          this.validFile = true;

          const reader = new FileReader();
          reader.onload = (e) => {
            this.images[index].src = e.target.result;//미리보기 이미지 설정
            this.imagesData.push({src: e.target.result, file});//이미지 데이터 배열에 추가
          };
          reader.readAsDataURL(file);

          this.orders.splice(index, 0, index + 1); //순서 추가 및 정렬
          this.orders.sort();
        } else {
          // 잘못된 파일 형식, 크기 초과 시 
          alert("파일 형식이 맞지 않습니다. \n10MB 이하 .png, .jpg, .jpeg, .gif, .bmp, .webp, .tiff 형식의 파일을 입력하세요.");
          this.errorMessage = '파일 형식이 맞지 않습니다.';
          this.validFile = false;
        }
      }
    },
    // 이미지 업로드
    onImageUpload(index, event) {
      const file = event.target.files[0]; //선택된 파일 
      //파일 유효성 검사
      if (file) {
        const validExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const maxFileSize = 10 * 1024 * 1024;

        if (validExtensions.includes(fileExtension) && file.size < maxFileSize) {
          this.file.push(file); // 파일 리스트에 추가 
          this.deletedOrders.splice(this.deletedOrders.indexOf(index + 1), 1); //삭제 된 순서에서 제거
          this.orders.splice(index, 0, index + 1); //순서 추가 및 정렬
          this.orders.sort();

          const reader = new FileReader();
          reader.onload = (e) => {
            this.images.splice(index, 1, {src: e.target.result});
            this.imagesData.push({src: e.target.result, file});
          };
          reader.readAsDataURL(file);
        } else {
          alert("파일 형식이 맞지 않습니다.");
        }
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
    // 예기치 못한 오류 팝업 숨기기
    hideUnexpectedErrorPopup() {
      this.showUnexpectedErrorPopup = false;
    },
    // 정보 저장
    async saveInfo() {
      const clubUUID = store.state.clubUUID;
      const accessToken = store.state.accessToken;

      const form = new FormData();
      // JSON 데이터를 문자열로 변환하여 Blob으로 추가
      const jsonData = {
        // 줄바꿈을 <br>로 변환
        clubIntro: this.textareaContent
            .replace(/ /g, '&nbsp;')
            .replace(/\n/g, '<br>'),
        //clubIntro: this.textareaContent,
        recruitmentStatus: this.isChecked ? 'OPEN' : 'CLOSE',
        // 줄바꿈을 <br>로 변환
        clubRecruitment: this.textareaRecruitContent
            .replace(/ /g, '&nbsp;')
            .replace(/\n/g, '<br>'),

        googleFormUrl: this.googleFormLink,
        orders: this.orders || this.clubData.orders,
        deletedOrders: this.deletedOrders
      };
      form.append('clubIntroRequest', new Blob([JSON.stringify(jsonData)], {type: 'application/json'}));
      
      // 이미지 파일을 데이터 폼에 추가
      this.imagesData.forEach((image, index) => {
        form.append('introPhotos', image.file);
      });

      try {
        // PUT 요청으로 서버에 데이터 전송
        const response = await axios.put(
            `${store.state.apiBaseUrl}/club-leader/${clubUUID}/intro`,
            form,
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'multipart/form-data'
              }
            }
        );
        // 서버가 presigned URL을 응답했다면 이미지 업로드 실행
        if (response.data && response.data.data && response.data.data.presignedUrls) {
          this.presignedUrls = response.data.data.presignedUrls;
          await this.uploadFiles();//파일 업로드
        }

        // 저장 완료 후 팝업 표시
        this.showPopup();
        this.$emit('data-saved');//데이터 저장 완료 이벤트 발생

      } catch (error) {
        const errorData = error.response?.data;

        if (errorData?.code === 'CLP-201') {
          alert('범위를 벗어난 사진 순서 값입니다.');
          return;
        }
        if (errorData?.code === 'MAX_UPLOAD_SIZE_EXCEEDED') {
          alert('업로드 가능한 최대 파일 크기를 초과했습니다. (개별 파일 10MB, 총 파일 크기 50MB)');
          return;
        }
        if (errorData?.code === 'INVALID_ARGUMENT') {
          this.showUnexpectedErrorPopup = true;
          return;
        }
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
        alert("파일 업로드 실패!");
      }
    },
    // 소개글 텍스트 길이 검사 및 제한
    updateTextSize() {
      // 문자 수가 3000자를 초과하는지 확인
      if (this.textareaContent.length > 3000) {
        alert("문자 수가 3000자를 초과했습니다.");
        this.textareaContent = this.textareaContent.slice(0, 3000); // 3000자로 잘라서 저장
      }
      this.textSize = this.textareaContent.length; // 문자 수 업데이트
    },
    // 모집글 텍스트 길이 검사 및 제한 
    updateRecruitTextSize() {
      // 문자 수가 3000자를 초과하는지 확인
      if (this.textareaRecruitContent.length > 3000) {
        alert("문자 수가 3000자를 초과했습니다.");
        this.textareaRecruitContent = this.textareaRecruitContent.slice(0, 3000); // 3000자로 잘라서 저장
      }
      this.RecruittextSize = this.textareaRecruitContent.length; // 문자 수 업데이트
    }
  }
};
</script>


<style scoped>
/* ===== 기본 타이포 ===== */
.warning-text{ font-size: clamp(12px, 1.5vw, 14px); font-weight: 400; color:#656565; }
h2{ font-size: clamp(18px, 2.2vw, 24px); }

/* ===== 컨테이너 ===== */
.whole-container{
  display: grid;
  grid-template-rows: auto auto 1fr auto auto auto auto auto; /* 섹션 순서 유지 */
  gap: 10px;
  /* width: clamp(340px, 92vw, 1120px); */
  margin: 0 auto;
  padding: 0 clamp(12px, 2vw, 20px);
}
.whole-container h2{
  font-weight: 600; line-height: 1.3; letter-spacing: -0.025em; margin: 0;
}

/* ===== 섹션 헤더 공통 ===== */
.head{
  display: grid;
  grid-template-columns: 1fr auto; /* 좌: 제목 / 우: 보조텍스트 또는 컨트롤 */
  align-items: center;
  gap: 12px;
  width: 100%;
}
.head .warning-text{ justify-self: end; text-align: right; }
.head h2{ margin-top: 16px; }
.empty{ display: none; } /* 고정폭 밀어내기 요소 제거로 가려짐 방지 */
.head p{ font-size: clamp(14px, 1.8vw, 18px); font-weight: 500; margin: 0; }

/* 모집 섹션 헤더(제목 + "모집 중" + 토글) */
.ClubRecruitHeader .head{
  grid-template-columns: 1fr auto auto auto; /* h2 | (empty) | p | 토글 */
  column-gap: 12px;
}

/* ===== 이미지 업로드 영역 ===== */
.image-upload-container{
  width: 100%;
  background:#fff;
  padding: 8px;
  margin: 0;
  box-shadow: 0 0 5px rgba(0,0,0,.08);
  border-radius: 8px;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  align-items: start;
}
.image-preview,
.image-upload{
  position: relative;
  width: 100%;
  aspect-ratio: 16/10;          /* 고정 높이 제거, 비율 유지 */
  border-radius: 6px;
  overflow: hidden;
  background:#ececec;
}
.uploaded-image{ width:100%; height:100%; object-fit:cover; }
.image-upload{
  display: flex; align-items:center; justify-content:center;
  border: 2px solid #ddd; cursor:pointer;
}
.image-upload input{
  position:absolute; inset:0; opacity:0; cursor:pointer;
}
.plus{
  position:absolute; display:flex; justify-content:center; align-items:center;
  width:26px; height:26px; background:hsla(0,0%,100%,.7);
  border-radius:50%; border:2px solid #ddd; box-shadow:0 0 1px rgba(0,0,0,.1);
  color:#696969;
}
.plus img{ width:15px; height:15px; object-fit:contain; }
.delete-icon{
  position:absolute; top:4px; right:4px; font-size:22px; color:#fff; cursor:pointer;
  width:28px; height:28px; display:flex; justify-content:center; align-items:center;
  line-height:28px; border-radius:50%; background:rgba(0,0,0,.35);
}
.edit-icon{
  position:absolute; left:50%; top:50%; transform:translate(-50%,-50%);
  width:30px; height:30px; filter:invert(100%); cursor:pointer;
}
.edit-icon img{ width:100%; height:100%; }

/* ===== 텍스트 입력 공통 ===== */
.ClubTextInput,
.GoogleFormLinkInput{
  width: 100%;
  background:#fff;
  border-radius: 8px;
  margin: 0;
  display: grid;
  align-items: center;
  justify-items: stretch;
  padding: 12px;
}
.ClubTextInput{ min-height: 220px; }
.GoogleFormLinkInput{ min-height: 48px; }

.ClubTextInput textarea,
.GoogleFormLinkInput textarea{
  width: 100%;
  min-height: 20px;
  /* padding: 10px 16px; */
  border: none;
  font-size: 14px; line-height: 1.5; color:#333;
  resize: none; white-space: pre-wrap;
  font-family: 'Malgun Gothic', sans-serif;
  background: transparent;
}
textarea:focus{ outline: none; }

.preserve-whitespace{ white-space: pre-wrap; }

/* 모집 OFF 상태 */
.RecruitToggleOff{
  background:#e5e5e5 !important; color:#a9a9a9; cursor:not-allowed;
  border:1px solid #999;
}
.ClubTextInput textarea.RecruitToggleOff{ color:#333; }

/* 글자수 표시 */
.textarea-container{ position: relative; width: 100%; height: 100%; }
.textSize{
  position:absolute; bottom:-20px; right: 16px;
  font-size: 13px; color:#656565;
}
textarea::placeholder{ font-size: 14px; color:#9e9e9e; }

/* ===== 토글 스위치 ===== */
label{
  display:block; position:relative; width:50px; height:22px;
  background:#d3d3d3; border-radius:60px; transition: background .3s; cursor:pointer;
}
label::after{
  content:""; position:absolute; left:4px; top:50%; width:14px; height:14px; border-radius:50%;
  background:#fff; transform:translateY(-50%); box-shadow:1px 3px 4px rgba(0,0,0,.1);
  transition: all .3s;
}
#chk1:checked + label{ background:#FFB052; }
#chk1:checked + label::after{ left: calc(100% - 18px); }
.head input{ visibility:hidden; width:1px; }

/* ===== 저장 버튼 ===== */
button{
  justify-self: end;              /* 오른쪽 정렬 (고정 마진 제거) */
  width: auto;
  min-width: 112px;
  height: 48px;
  background:#FFB052; border:none; border-radius:6px;
  color:#fff; font-weight:700; font-size:16px; line-height:16px;
  letter-spacing:-0.025em; text-align:center; cursor:pointer;
  margin: 8px 0 30px 0;           /* 상하 여백만 */
}
button:hover{ background:#e69a3e; }

/* ===== 팝업 ===== */
.popup-overlay{
  position:fixed; inset:0; background:rgba(0,0,0,.5);
  display:grid; place-items:center; z-index:1000;
}
.popup{
  width: min(92vw, 520px);
  background:#fff; padding: clamp(16px, 2vw, 24px);
  border-radius:8px; box-shadow:0 10px 30px rgba(0,0,0,.15);
  position:relative;
}
.popup h2{ margin:0 0 10px 0; text-align:left; }
hr{ border:0; border-top:1px solid #ccc; margin:10px 0; }
.confirm-message{ text-align:left; }
.notice-message{ text-align:left; font-size:12px; color:gray; }
.popup-buttons{ display:flex; justify-content:flex-end; gap:10px; margin-top: 24px; }
.popup-buttons button{
  width: auto; min-width: 90px; height: 36px; border:none; border-radius:8px; cursor:pointer; margin:0;
  font-weight: 600; font-size: 14px;
}
.popup-buttons button:first-child{ background:#ffb052; color:#fff; }

/* ===== 반응형 브레이크포인트 ===== */
/* 태블릿: 헤더를 1열로 쌓고 경고문은 다음 줄로 */
@media (max-width: 1500px){
  .head{ grid-template-columns: 1fr; }
  .head .warning-text{ justify-self: start; text-align: left; }
}

/* 768px 이하: 레이아웃 간격/패딩 축소, 버튼은 풀폭 가능 */
@media (max-width: 768px){
  .image-upload-container{ grid-template-columns: repeat(3, 1fr); }
  .ClubTextInput{ min-height: 200px; }
  button{ width: 100%; justify-self: stretch; }  /* 저장 버튼 가려짐 방지 */
}

/* 600px 이하: 이미지 그리드 2열, 입력 영역 더 컴팩트 */
@media (max-width: 600px){
  .image-upload-container{ grid-template-columns: repeat(2, 1fr); }
  .textSize{ right: 8px; font-size: 12px; }
}

/* 400px 이하: 이미지 1열, 요소 간 여백 최소화 */
@media (max-width: 400px){
  .image-upload-container{ grid-template-columns: 1fr; }
}
</style>