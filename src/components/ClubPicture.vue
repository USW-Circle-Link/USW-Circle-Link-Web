<template>
  <h2>동아리 활동 사진</h2>
  <div class="ClubPicture">
    <div class="edit-icon" @click="triggerFileInput">
      <img src="@/assets/penbrush.png" alt="Edit Icon" />
    </div>
    <input type="file" ref="fileInput" @change="onFileChange" style="display: none;" />
  </div>
</template>

<script>
export default {
  name: 'ClubPicture',
  data() {
    return {

    };
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.clubImage = e.target.result;
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
}

.ClubPicture

.ClubPicture img {
  width: 22px;
  height: 22px;
  border-radius: 8px;
}

.edit-icon {
  position: absolute;
  cursor: pointer;
}
</style>