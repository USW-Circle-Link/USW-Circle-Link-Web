<template>
  <div class="club_container">
    <div class="clubList">
      <h3>학술</h3>
      <div class="department_clubList">
        <!-- 학술 클럽 배열에 동아리가 들어오면 요소 나타내기 -->
        <div class="card" v-for="(club, columnIndex) in ACADEMIC_clubList" :key="columnIndex">
          <div class="card-image">
            <img src="@/assets/flag_logo.jpeg" alt="Flag Logo" />
          </div>
          <div class="card-text">
            <p>{{ club }}</p>
          </div>
        </div>
      </div>
      <h3>공연</h3>
      <div class="department_clubList">
        <!-- 학술 클럽 배열에 동아리가 들어오면 요소 나타내기 -->
        <div class="card" v-for="(club, columnIndex) in SHOW_clubList" :key="columnIndex">
          <div class="card-image">
            <img src="@/assets/flag_logo.jpeg" alt="Flag Logo" />
          </div>
          <div class="card-text">
            <p>{{ club }}</p>
          </div>
        </div>
      </div>
      <h3>예술</h3>
      <div class="department_clubList">
        <!-- 학술 클럽 배열에 동아리가 들어오면 요소 나타내기 -->
        <div class="card" v-for="(club, columnIndex) in ART_clubList" :key="columnIndex">
          <div class="card-image">
            <img src="@/assets/flag_logo.jpeg" alt="Flag Logo" />
          </div>
          <div class="card-text">
            <p>{{ club }}</p>
          </div>
        </div>
      </div>
      <h3>체육</h3>
      <div class="department_clubList">
        <!-- 학술 클럽 배열에 동아리가 들어오면 요소 나타내기 -->
        <div class="card" v-for="(club, columnIndex) in SPORT_clubList" :key="columnIndex">
          <div class="card-image">
            <img src="@/assets/flag_logo.jpeg" alt="Flag Logo" />
          </div>
          <div class="card-text">
            <p>{{ club }}</p>
          </div>
        </div>
      </div>
      <h3>봉사</h3>
      <div class="department_clubList">
        <!-- 학술 클럽 배열에 동아리가 들어오면 요소 나타내기 -->
        <div class="card" v-for="(club, columnIndex) in VOLUNTEER_clubList" :key="columnIndex">
          <div class="card-image">
            <img src="@/assets/flag_logo.jpeg" alt="Flag Logo" />
          </div>
          <div class="card-text">
            <p>{{ club }}</p>
          </div>
        </div>
      </div>
      <h3>종교</h3>
      <div class="department_clubList">
        <!-- 학술 클럽 배열에 동아리가 들어오면 요소 나타내기 -->
        <div class="card" v-for="(club, columnIndex) in RELIGION_clubList" :key="columnIndex">
          <div class="card-image">
            <img src="@/assets/flag_logo.jpeg" alt="Flag Logo" />
          </div>
          <div class="card-text">
            <p>{{ club }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      department: ['ACADEMIC', 'RELIGION', 'ART', 'SPORT', 'SHOW', 'VOLUNTEER'],
      ACADEMIC_clubList: ['FLAG', 'cap', '라이더스', 'SSG', '수북수북', '유니피스', '어스파이어'],
      RELIGION_clubList: ['CCC', '기독교 학생회'],
      ART_clubList: ['소담','SCO','천마극회','와우시날'],
      SPORT_clubList: ['굴리세','ACE','기백', '두공갈'],
      SHOW_clubList: ['올어바웃','플레이버','나래','도레샘','이클립스', '울림소리'],
      VOLUNTEER_clubList: ['능동','로타렉트','봉토리'],
      slideIndex: 0, // 현재 슬라이드 인덱스
      itemsToShow: 5, // 화면에 보일 카드 수
    };
  },
  methods: {

  }
}
</script>

<style scoped>
.club_container{
  width: 1000px;
  overflow: hidden; /* 요소가 넘치면 숨김 */
}

.club_container h3{
  color: #5A96CA;
  font-family: Pretendard;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.department_clubList{
  display: flex;
  flex-direction: row;
  transition: scroll-left 0.5s ease; /* 스크롤 애니메이션 효과 */
}

.card {
  width: 160px;
  height: 150px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  margin: 0px 40px 0px 0px
}

.card-image {
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.card-image img {
  width: 160px; /* 이미지 크기를 적절히 설정하세요 */
  height: 100px;
  border-radius: 8px;
  object-fit:cover;
}

.card-text {
  width: 160px;
  text-align: left;
}

.card-text p {
  color: #000;
  font-family: Pretendard;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  margin-left: 20px;
}
</style>