<template>
  <div class="Dashboardhead">
    <p>소속 동아리 회원 정보</p>
    <button v-if="isButtonVisible" @click="showPopup" class="spreadsheets">
      <p>구글 스프레드시트</p>
      <img src="@/assets/spreadsheets.png">
    </button>
  </div>
    <div id="Dashboard" class="Dashboard">

        <!-- 스프레트시트 URL 입력 -->
        <spreadsheetLinkInput @update:inputValue="sheetUrl = $event" v-if="isPopupVisible"  @close="closePopup" />
        <!-- 링크 제출 시 나타는 테이블 -->
        <div v-if="sheetData.length" class="memberlist">
            <table>
                <tbody>
                    <tr v-for="(row, rowIndex) in sheetData" :key="rowIndex">
                        <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
                        <td><button class="Expulsion" @click="deleteRow(rowIndex)">퇴출</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import spreadsheetLinkInput from "@/components/spreadsheetLinkInput.vue";

export default {
    name: 'Dashboard',
    components:{
      spreadsheetLinkInput,
    },
    data() {
        return {
          sheetUrl: '',
          sheetData: [],
          isPopupVisible: false,
          isButtonVisible: true,
          apiKey: 'AIzaSyCgARDETVZFsr3mu58W7gQyKdCX0HP0SLI'  // 여기서 API 키를 입력하세요.
        };
    },
    methods: {
        extractSheetId(url) {
            const regex = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
            const match = url.match(regex);
            return match ? match[1] : null;
        },
        showPopup() {
          this.isPopupVisible = true;
        },
        // 팝업 창을 닫음과 동시에 스프레드시트 데이터 불러오기
        async closePopup() {
          this.isPopupVisible = false;
          const sheetId = this.extractSheetId(this.sheetUrl);
          if (sheetId) {
            const range = 'Sheet1!A1:D999'; // 필요한 범위를 지정하세요.
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${this.apiKey}`;
            try {
              const response = await axios.get(url);
              console.log('데이터 블러오기 성공:', url);
              this.sheetData = response.data.values;
            } catch (error) {
              console.error('Error fetching sheet data:', error);
            }
          }
          // input 칸이 비어있으면 사라지지 않음
          if(sheetId){
            this.isButtonVisible = false;
          }
        },
        async deleteRow(rowIndex) {
          const sheetId = this.extractSheetId(this.sheetUrl);
          //console.log(sheetId, rowIndex, this.apiKey);
          if (sheetId) {
            try {
              const apiKey = 'AIzaSyCgARDETVZFsr3mu58W7gQyKdCX0HP0SLI';
              const range = `Sheet1!A${rowIndex + 1}:D${rowIndex + 1}`; // 삭제할 행의 범위 지정
              const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:clear?key=${apiKey}`;
              const response = await axios.post(url);
              console.log('행 삭제 성공:', response.data);
              this.items.splice(rowIndex, 1); // Vue.js 리스트에서 항목 삭제
            } catch (error) {
              console.error('행 삭제 실패:', error);
            }
          }
        }
    },
};
</script>

<style>
.Dashboard{
    width: 886px;
    background: #fff;
    border-radius: 8px;
    align-items: center;
    align-content: center;
    text-align: center;
}

.Dashboard p {
    font-family: Pretendard;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    padding: 20px;
}

.Dashboardhead{
  width: 886px;
  height: 76px;
  flex-shrink: 0;
  border-radius: 8px;
  background: #FFF;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.Dashboardhead p{
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: -0.05em;
  text-align: left;
  margin-left: 60px;
}

.spreadsheets{
  width: 170px;
  height: 60px;
  display: flex;
  flex-shrink: 0;
  border-radius: 8px;
  background: #7FB08C;
  justify-content: space-between;
  border: none;
  align-items: center;
  margin-right: 60px;
}

.spreadsheets p{
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.05em;
  text-align: left;
  color: #FFFFFF;
  margin-left: 7px;
  margin-bottom: 13px;
}

.spreadsheets img{
  margin-right: 7px;
}

.Dashboard h1{
    text-align: center;
}

.Dashboard div{
    align-items: center;
}

.Dashboard input{
    width: 880px;
    margin: 30px 0px 30px 0px;
    align-content: center;
}

table {
    width: 860px;
    border-spacing: 0px 8px;
    margin: 0 auto;
}

td {
    text-align: center;
    height: 46px;
    width: 215px;
}

td:first-child{
    border-radius: 8px 0px 0px 8px;
    background-color: #F0F2F5;
}

td:nth-last-child(4){
  background-color: #F0F2F5;
}

td:nth-last-child(3){
  background-color: #F0F2F5;
}

td:nth-last-child(2){
    border-radius: 0px 8px 8px 0px;
    padding-right: 20px;
    background-color: #F0F2F5;
}

td:last-child{
  background-color: #ffffff;
  width: 56px;
}

.Expulsion{
    background-color: #e57373;
    width: 56px;
    height: 46px;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    margin-left: 8px;
}

</style>