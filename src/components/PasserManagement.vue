<template>
  <div class="MainBox">
    <div class="header">
      <p class="common">지원자 합격 처리</p>
      <div class="status-boxes">
        <div class="status-box approve-box">합격</div>
        <div class="status-box reject-box">불합격</div>
      </div>
    </div>
    <div class="content">
      <div class="applicant-list">
        <div class="applicant-item" v-for="applicant in paginatedApplicants" :key="applicant.id">
          <p>{{ applicant.name }}</p>
          <p>{{ applicant.id }}</p>
          <p>{{ applicant.department }}</p>
          <p>{{ applicant.phone }}</p>
          <div class="buttons-group">
            <label :class="{ checked: applicant.decision === 'approved' }">
              <input type="radio" :name="'decision' + applicant.id" v-model="applicant.decision" value="approved" />
              <span>체크</span>
            </label>
            <label :class="{ checked: applicant.decision === 'rejected' }">
              <input type="radio" :name="'decision' + applicant.id" v-model="applicant.decision" value="rejected" />
              <span>체크</span>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">‹</button>
      <span v-for="page in totalPages" :key="page" @click="changePage(page)" :class="{ active: page === currentPage }">{{ page }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">›</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ApplicantManagement',
  data() {
    return {
      applicants: [
        { id: 1, name: '김길김', department: '무슨학과', phone: '010-1234-5678', decision: null },
        { id: 2, name: '이길이', department: '어떤학과', phone: '010-9876-5432', decision: null },
        { id: 3, name: '박길박', department: '또다른학과', phone: '010-1234-5678', decision: null },
        // 나머지 지원자 데이터 추가
      ],
      currentPage: 1,
      itemsPerPage: 10,
      statusBoxMargin: 0, // 상태 박스 왼쪽 간격 데이터 속성
      checkboxGap: 13, // 체크 박스 간격 데이터 속성
    };
  },
  computed: {
    paginatedApplicants() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.applicants.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.applicants.length / this.itemsPerPage);
    },
  },
  methods: {
    approveApplicants() {
      this.paginatedApplicants.forEach(applicant => {
        if (applicant.decision === 'approved') {
          console.log(`${applicant.name} 합격`);
        } else if (applicant.decision === 'rejected') {
          console.log(`${applicant.name} 불합격`);
        } else {
          console.log(`${applicant.name} 미결정`);
        }
      });
      this.sendNotifications();
    },
    rejectApplicants() {
      this.paginatedApplicants.forEach(applicant => {
        if (applicant.decision === 'rejected') {
          console.log(`${applicant.name} 불합격`);
        }
      });
      this.sendNotifications();
    },
    sendNotifications() {
      console.log('푸쉬 알람 전송 완료');
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    changePage(page) {
      this.currentPage = page;
    },
  },
};
</script>

<style scoped>
.MainBox {
  width: 886px;
  display: flex;
  flex-direction: column;
  background: #fff;
  margin-bottom: 30px;
  border-radius: 8px;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.common {
  color: #000;
  font-family: Pretendard;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: -0.6px;
}

.status-boxes {
  display: flex;
  align-items: center;
}

.status-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;  /* 너비 조정 */
  height: 43px;  /* 높이 조정 */
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-right: 8px; /* 상태 박스 간의 간격 */
  background-color: #f7f7f7;
}

.approve-box {
  background-color: #4CAF50;
  color: white;
}

.reject-box {
  background-color: #f44336;
  color: white;
}

.content {
  display: flex;
  flex-direction: column;
}

.applicant-list {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  overflow-y: auto;
  max-height: 200px;
  flex: 1;
}

.applicant-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f7f7f7;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.applicant-item p {
  margin: 0;
  text-align: center;
  flex: 1;
}

.buttons-group {
  display: flex;
  align-items: center;
  gap: 9px; /* 체크박스 간의 기본 간격 */
  margin-left: 5px; /* 상태 박스와 체크박스 간의 간격 */
}

.buttons-group label {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;  /* 너비 조정 */
  height: 43px;  /* 높이 조정 */
  border-radius: 8px;
  cursor: pointer;
  background-color: #eee;
}

.buttons-group label.checked {
  background-color: #4CAF50;
  color: white;
}

.buttons-group label.checked:nth-child(2) {
  background-color: #f44336;
}

.buttons-group input[type="radio"] {
  display: none;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  align-items: center;
  gap: 5px;
}

.pagination button, .pagination span {
  cursor: pointer;
  font-size: 18px;
}

.pagination span.active {
  color: #FFA000; /* 현재 페이지 번호 색상 */
}
</style>