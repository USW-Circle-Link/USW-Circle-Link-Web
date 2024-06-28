<template>
  <div class="Dashboardhead">
    <p>소속 동아리 회원 정보</p>
    <button @click="fetchSheetData" class="spreadsheets">
      <p>구글 스프레드시트</p>
      <img src="@/assets/spreadsheets.png">
    </button>
  </div>
    <div id="Dashboard" class="Dashboard">

        <!-- 스프레트시트 URL 입력 -->
        <spreadsheetLinkInput v-if="this.openModal == true" />
        <!-- 링크 제출 시 나타는 테이블 -->
        <div v-if="sheetData.length" class="memberlist">
            <table>
                <tbody>
                    <tr v-for="(row, rowIndex) in sheetData" :key="rowIndex">
                        <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
                        <td class="Expulsion" onclick="Expulsion()">퇴출</td>
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
            openModal: true,
        };
    },
    methods: {
        async fetchSheetData() {
            const sheetId = this.extractSheetId(this.sheetUrl);
            if (sheetId) {
                const apiKey = 'AIzaSyCgARDETVZFsr3mu58W7gQyKdCX0HP0SLI';  // 여기서 API 키를 입력하세요.
                const range = 'Sheet1!A1:D999'; // 필요한 범위를 지정하세요.
                const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
                try {
                    const response = await axios.get(url);
                    this.sheetData = response.data.values;
                } catch (error) {
                    console.error('Error fetching sheet data:', error);
                }
            }
        },
        extractSheetId(url) {
            const regex = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
            const match = url.match(regex);
            return match ? match[1] : null;
        },
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
    width: 734px;
    border-spacing: 0px 30px;
}

tr{
    background-color: #F0F2F5;
    border-radius: 8px;
}

th,
td {
    padding: 8px;
    text-align: left;
    height: 46px;
}

td:first-child,
th:first-child{
    border-radius: 2px 0px 0px 2px;
    padding-left: 20px;
}

td:last-child,
th:last-child{
    border-radius: 0px 2px 2px 0px;
    padding-right: 20px;
}

.Expulsion{
    background: #BF6F6F;
}

</style>