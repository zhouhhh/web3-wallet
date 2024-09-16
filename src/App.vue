<template>
  <h1>{{ title }}</h1>
  <van-button type="primary">按钮</van-button>
</template>

<script setup>
import { ref } from 'vue';
import Web3 from 'web3'
const title = ref('title');

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545")
console.log(web3);

</script>

<style lang="less"></style>
