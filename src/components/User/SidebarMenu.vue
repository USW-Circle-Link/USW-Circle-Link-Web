<template>
  <div class="sidebar">
    <ProfileCard v-if="id === 1"/>
    <LoginCard v-if="id === 0"/>
    <div class="menu">
      <ul>
        <li>
          <div class="list1">
            <p>내 정보</p>
          </div>
          <div class="yellowLine"></div>
        </li>
        <li>
          <div class="list2">
            <p>소속된 동아리</p>
          </div>
          <div class="yellowLine"></div>
        </li>
        <li>
          <div class="list3">
            <p>지원한 동아리</p>
          </div>
          <div class="yellowLine"></div>

        </li>
        <li>
          <div class="list4">
            <p>공지사항</p>
          </div>
          <div class="yellowLine"></div>
        </li>
        <li>
          <div class="list5">
            <p>이용약관</p>
          </div>
          <div class="yellowLine"></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import ProfileCard from "@/components/User/profileCard.vue";
import Login from "@/components/Login/Login.vue";
import LoginCard from "@/components/User/LoginCard.vue";

export default {
  name: "Sidebar",
  components: {LoginCard, Login, ProfileCard},
  data() {
    return {
      userName: '박성재',
      department: '정보통신학과',
      studentNumber: '20518035',
      id: 1
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  padding: 40px;
  height: 550px;
}

.menu ul {
  margin-top: 100px;
  color: #3E3E3E;
  font-family: 'Pretendard-Regular', Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  padding: 0;
}

.menu li {
  width: 220px;
  height: 55px;
  display: flex;
  flex-direction: row;
  transition-property: height;
  transition-duration: 0.2s;
  text-align: left;
  flex-shrink: 0;
  justify-content: space-between;
}

.menu p{
  margin-left: 30px;
}

.menu list1 {

}

.menu li:hover {
  background-color: #fff;
}

.menu li:hover .yellowLine {
  background-color: #FFC700;
}

.menu li .yellowLine {
  width: 7px;
  height: 55px;
}
</style>
