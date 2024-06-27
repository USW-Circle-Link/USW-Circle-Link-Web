<template>
    <div class="notification-button">
        <span>새로운 알림</span>
        <div class="icon-wrapper">
            <i class="icon alram"></i>
            <span class="red-dot"></span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NotificationButton'
};
</script>

<style scoped>
.notification-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #60C66A;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.08);
    color: #fff;
    padding: 10px 20px;
    border-radius: 20px;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    width: 200px;
    height: 45px;
    cursor: pointer;
  margin-bottom: 15px;
    /* Adjust the width as necessary */
}

.icon-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    margin: 0px 0px 0px 10px;
}

.alram {
    width: 24px;
    height: 24px;
    background: url('@/assets/alram.svg') no-repeat center center;
    background-size: contain;
}

.red-dot {
    width: 6px;
    height: 6px;
    background-color: #FF0000;
    border-radius: 50%;
    position: absolute;
    top: 0;
    right: -3px;
}
</style>