<!-- ClubRoomModal.vue -->
<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h3>동아리방 선택하기</h3>
        <button class="close-button" @click="close">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <g clip-path="url(#clip0_4722_18717)">
              <path d="M17.3588 0.643066L0.644531 17.3574M0.644531 0.643066L17.3588 17.3574" stroke="#969696" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
              <clipPath id="clip0_4722_18717">
                <rect width="18" height="18" fill="white"/>
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>


      <div class="modal-body">
        <div class="floor-selector-container">
          <div class="floor-selector">
            <button
                v-for="floor in floors"
                :key="floor"
                :class="['floor-button', { active: selectedFloor === floor }]"
                @click="selectedFloor = floor"
            >
              {{ floor }}
            </button>
          </div>
        </div>
        <div class="room-container">
          <div class="rooms-wrapper">
          <div class="room-grid">
            <button
                v-for="room in roomsByFloor"
                :key="room"
                :class="['room-button', { active: selectedRoom === room }]"
                @click="selectedRoom = room"
            >
              {{ room }}호
            </button>
          </div>
        </div>
      </div>
      </div>
      <div class="modal-footer">
        <button class="select-button" @click="selectRoom">선택하기</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClubRoomModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      floors: ['지하', '1층', '2층'],
      selectedFloor: '1층',
      selectedRoom: null,
      roomMap: {
        '지하': ['B101', 'B102', 'B103', 'B104', 'B105', 'B106', 'B107', 'B108', 'B109', 'B110', 'B111', 'B112', 'B113','B114', 'B115', 'B116', 'B117', 'B118', 'B119', 'B120', 'B121', 'B122', 'B123'],
        '1층': ['102', '103', '104', '105', '106', '107', '108', '109', '110', '112'],
        '2층': ['109', '110', '112']
      }
    }
  },
  computed: {
    roomsByFloor() {
      return this.roomMap[this.selectedFloor] || []
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    selectRoom() {
      if (this.selectedRoom) {
        this.$emit('select', `${this.selectedRoom}호`)
        this.close()
      }
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  display: flex;
  flex-direction: column;
  background: #F3F3F3;
  border-radius: 32px;
  width: 645px;
  height: 399px;
  max-width: 90vw;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  margin-bottom: -25px;
}

.modal-header h3 {
  color: #575757;
  font-family: Pretendard;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 12px; /* 75% */
  letter-spacing: -0.4px;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.close-button:hover {
  stroke: #000; /* Change the stroke color to a darker shade */
}


.modal-body {
  flex: 1;
  padding: 10px 40px;
  overflow: hidden;
}

.floor-selector-container {
  margin-bottom: 10px;
}

.floor-selector {
  background: #E8E8E8;
  border-radius: 10px;
  padding: 4px;
  display: flex;
  position: relative;
  width: fit-content;
}

.floor-button {
  padding: 8px 32px;
  border: none;
  border-radius: 11px;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  position: relative;
  z-index: 2;
  transition: color 0.3s ease;
}

.floor-button.active {
  background: white;
  color: #000;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
}

.room-container {
  min-height: 160px;
  margin-bottom: 24px;
}

.rooms-wrapper {
  border-radius: 8px;
  border: 1px solid #C3C3C3;
  background: #FFF;
  padding: 16px;
}

.room-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.room-button {
  padding: 10px 8px;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  color: #5A5A5A;
  font-family: Pretendard;
  font-style: normal;
  font-weight: 400;
  line-height: 12px; /* 85.714% */
  transition: all 0.2s ease;
  width: 68px;
}

.room-button.active {
  border-color: #FFA000;
  color: #000;
}

.modal-footer {
  padding: 10px 40px;
  text-align: right;
  margin-bottom: 20px;
}

.select-button {
  width: 124px; /* Set the width to 124px */
  height: 40px;
  padding: 8px 10px;
  justify-content: center;
  align-items: center;
  background: #FFB74D;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.select-button:hover {
  background: #FFA726;
}
</style>