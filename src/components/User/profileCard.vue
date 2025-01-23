<template>
  <div class="profile-card">
    <div class="profile-image">
      <img src="@/assets/dongurami_logo.png" alt="Profile Image" />
      <span class="edit-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 16 16" fill="none">
            <path d="M1.78906 14.6237H4.06932C4.56974 14.6236 5.04965 14.4248 5.40361 14.0711L14.7122 4.76313L11.6496 1.70117L2.34229 11.0085C2.16687 11.1839 2.02773 11.3921 1.9328 11.6212C1.83788 11.8504 1.78903 12.096 1.78906 12.3441V14.6237ZM3.04783 13.3649V12.3441C3.04787 12.1771 3.1142 12.0171 3.23224 11.8991L4.59045 10.5409L5.87251 11.8223L4.5143 13.1805C4.39629 13.2985 4.23623 13.3649 4.06932 13.3649H3.04783ZM6.76245 10.9323L5.4804 9.65029L11.6496 3.4817L12.9317 4.76313L6.76245 10.9323Z" fill="white"/>
          </svg>
        </span>
    </div>
    <div class="profile-info">
      <h2>{{ userName }}</h2>
      <p>{{ department }}</p>
      <p>{{ studentNumber }}</p>
    </div>
    <div class="underline"></div>
  </div>
</template>

<script>
export default {
  name: "profileCard",
  data() {
    return {
      userName: '박성재',
      department: '정보통신학과',
      studentNumber: '20518035'
    }
  }
};
</script>

<style scoped>
.profile-card {
  width: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
}

.profile-image {
  position: relative;
  width: 140px;
  height: 140px;
  margin-bottom: 10px;
}

.profile-image img {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.edit-icon {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: #C4C4C4;
  border-radius: 50%;
  cursor: pointer;
  align-content: center;
}

.edit-icon svg{
  margin-top: 2px;
  margin-left: 3px;
}

.profile-info {
  margin-top: 40px;
  text-align: center;
}

.profile-info h2 {
  margin: 0;
  font-size: 18px;
  color: #4682b4;
}

.profile-info p {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}

.underline{
  width: 112px;
  height: 1px;
  background: #E3E3E3;
  margin-top: 40px;
}

</style>
<script setup>
</script>