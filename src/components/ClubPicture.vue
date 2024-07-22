<template>
  <h2>동아리 활동 사진</h2>
  <div class="ClubPicture">
    <div class="Picture1">
      <img :src="clubImage1" alt="동아리 이미지" />
      <div class="edit-icon1" @click="triggerFileInput1">
        <img src="@/assets/penbrush.png" alt="Edit Icon" />
      </div>
      <input type="file" ref="fileInput1" @change="onFileChange1" style="display: none;" />
    </div>
    <div class="Picture2">
      <img :src="clubImage2" alt="동아리 이미지" />
      <div class="edit-icon2" @click="triggerFileInput2">
        <img src="@/assets/penbrush.png" alt="Edit Icon" />
      </div>
      <input type="file" ref="fileInput2" @change="onFileChange2" style="display: none;" />
    </div>
    <div class="Picture3">
      <img :src="clubImage3" alt="동아리 이미지" />
      <div class="edit-icon3" @click="triggerFileInput3">
        <img src="@/assets/penbrush.png" alt="Edit Icon" />
      </div>
      <input type="file" ref="fileInput3" @change="onFileChange3" style="display: none;" />
    </div>
    <div class="Picture4">
      <img :src="clubImage4" alt="동아리 이미지" />
      <div class="edit-icon4" @click="triggerFileInput4">
        <img src="@/assets/penbrush.png" alt="Edit Icon" />
      </div>
      <input type="file" ref="fileInput4" @change="onFileChange4" style="display: none;" />
    </div>
    <div class="Picture5">
      <img :src="clubImage5" alt="동아리 이미지" />
      <div class="edit-icon5" @click="triggerFileInput5">
        <img src="@/assets/penbrush.png" alt="Edit Icon" />
      </div>
      <input type="file" ref="fileInput5" @change="onFileChange5" style="display: none;" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClubPicture',
  data() {
    return {
      clubImage1: require('@/assets/logo.png'), // 초기 이미지
      clubImage2: require('@/assets/logo.png'), // 초기 이미지
      clubImage3: require('@/assets/logo.png'), // 초기 이미지
      clubImage4: require('@/assets/logo.png'), // 초기 이미지
      clubImage5: require('@/assets/logo.png'), // 초기 이미지
    };
  },
  methods: {
    triggerFileInput1() {
      this.$refs.fileInput1.click();
    },
    triggerFileInput2() {
      this.$refs.fileInput2.click();
    },
    triggerFileInput3() {
      this.$refs.fileInput3.click();
    },
    triggerFileInput4() {
      this.$refs.fileInput4.click();
    },
    triggerFileInput5() {
      this.$refs.fileInput5.click();
    },
    onFileChange1(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.clubImage1 = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    onFileChange2(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.clubImage2 = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    onFileChange3(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.clubImage3 = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    onFileChange4(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.clubImage4 = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    onFileChange5(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.clubImage5 = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
  }
};
</script>

<style scoped>
.ClubPicture{
  width: 886px;
  height: 150px;
  background-color: #ffffff;
  box-shadow: 0px 0px 3.69px 0px #00000040;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
}

.Picture1{
  margin-left: 10px;
}

.Picture5{
  margin-right: 10px;
}

.Picture1 img{
  position: absolute;
  width: 142px;
  height: 96px;
  border-radius: 8px;
}

.Picture2 img{
  position: absolute;
  width: 142px;
  height: 96px;
  border-radius: 8px;
}

.Picture3 img{
  position: absolute;
  width: 142px;
  height: 96px;
  border-radius: 8px;
}

.Picture4 img{
  position: absolute;
  width: 142px;
  height: 96px;
  border-radius: 8px;
}

.Picture5 img{
  position: absolute;
  width: 142px;
  height: 96px;
  border-radius: 8px;
}
.edit-icon1 img{
  width: 30px;
  height: 30px;
  margin: 0 0 0 55px;
  bottom: 30px;
  visibility: hidden;
}

.edit-icon2 img{
  width: 30px;
  height: 30px;
  margin: 0 0 0 55px;
  bottom: 30px;
  visibility: hidden;
}

.edit-icon3 img{
  width: 30px;
  height: 30px;
  margin: 0 0 0 55px;
  bottom: 30px;
  visibility: hidden;
}

.edit-icon4 img{
  width: 30px;
  height: 30px;
  margin: 0 0 0 55px;
  bottom: 30px;
  visibility: hidden;
}

.edit-icon5 img{
  width: 30px;
  height: 30px;
  margin: 0 0 0 55px;
  bottom: 30px;
  visibility: hidden;
}

.edit-icon1, .edit-icon2, .edit-icon3, .edit-icon4, .edit-icon5{
  width: 142px;
  height: 96px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  align-items: center;
  align-content: center;
}

.Picture1:hover .edit-icon1 img{
  visibility: visible;
}

.Picture2:hover .edit-icon2 img{
  visibility: visible;
}

.Picture3:hover .edit-icon3 img{
  visibility: visible;
}

.Picture4:hover .edit-icon4 img{
  visibility: visible;
}

.Picture5:hover .edit-icon5 img{
  visibility: visible;
}

</style>