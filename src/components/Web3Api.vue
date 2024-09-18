<template>
  <h1>账户信息</h1>
  <p>地址：{{ address }}</p>
  <p>私钥：0x309442518df28bf1663e0429ddca744ae2efb404a1d2941238b6d891ea81f07d</p>
  <p>数量：{{ balance }}</p>
  <van-button type="primary" @click="send">开始转账</van-button>
</template>

<script setup>
import { ref, reactive } from 'vue';
import Web3 from 'web3'

const web3 = new Web3(Web3.givenProvider || "wss://holesky.infura.io/ws/v3/44c9b438af104f158bd4958888917597")
//每次执行创建一个新账号
// const account = web3.eth.accounts.create('1111')
// console.log(account);
const address = ref('0xEeD08E5908803112c09168e2D6cB64B588818f46')
const balance = ref(0)
web3.eth.getBalance(address.value).then((res) => {
  balance.value = res
})


const send = async () => {
  //1.构建转账参数
  //获取账号交易次数
  const nonce = await web3.eth.getTransactionCount(address.value)
  //console.log('转账', nonce);
  //2.获取预计转账gas费
  const gasPrice = await web3.eth.getGasPrice()
  //转账金额 以 wei 为单位
  const value = web3.utils.toWei("0.01", "ether")
  //console.log(value);
  const rawTx = {
    from: address.value,
    to: '',
    nonce,
    gasPrice
  }
}

</script>

<style lang="less"></style>
