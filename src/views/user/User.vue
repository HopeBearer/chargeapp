<script setup></script>
<template>
  <div class="user">
    <div class="head">
      <img class="avatar" src="//s.yezgea02.com/1606836859539/onpeice.png" />
      <div class="info">
        <!-- <span class="name">{{ user.username || '' }}</span> -->
        <!-- <span class="slogen">个性签名：{{ user.signature || '' }}</span> -->
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .user {
    min-height: 100%;
    background-color: #f5f5f5;
    padding: 12px;
    .head {
      display: flex;
      background: linear-gradient(315deg, #7fcea4 0%, #39be77 100%);
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 12px;
      .avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 3px solid #fff;
        margin-right: 10px;
      }
      .info {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .name {
          font-size: 18px;
          color: #fff;
          font-weight: 500;
        }
        .slogen {
          color: #fff;
          background: rgba(0, 0, 0, 0.1);
          padding: 1px 5px;
          border-radius: 10px;
        }
      }
    }
  }
</style>
