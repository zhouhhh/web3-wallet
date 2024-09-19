<template>
  <h1>账户信息</h1>
  <p>地址：{{ address }}</p>
  <p>私钥：{{ priviteKey }}</p>
  <p>数量：{{ balance }}</p>
  <van-button type="primary" @click="send">开始转账</van-button>
</template>

<script setup>
import { ref, reactive } from 'vue';
import Web3 from 'web3'
import Tx from 'ethereumjs-tx'

const web3 = new Web3(Web3.givenProvider || "wss://sepolia.infura.io/ws/v3/44c9b438af104f158bd4958888917597")

//每次执行创建一个新账号
// const account = web3.eth.accounts.create('1111')
// console.log(account);
const address = ref('0xEeD08E5908803112c09168e2D6cB64B588818f46')
const priviteKey = ref('0x309442518df28bf1663e0429ddca744ae2efb404a1d2941238b6d891ea81f07d')
const balance = ref(0)
web3.eth.getBalance(address.value).then((res) => {
  balance.value = web3.utils.fromWei(res, 'ether')
  // web3.utils.fromWei('300000000', 'ether')
})


const send = async () => {
  //1.构建转账参数
  //获取账号交易次数
  const nonce = await web3.eth.getTransactionCount(address.value)
  //console.log('转账', nonce);
  //2.获取预计转账gas费
  const gasPrice = await web3.eth.getGasPrice()
  //转账金额 以 wei 为单位
  const value = web3.utils.toWei("0.009370192566556", "ether")
  //console.log(value);
  const rawTx = {
    from: address.value,
    to: '0xF07c86ed54bA393A93277Ef8915b0C8df859868c',
    nonce,
    gasPrice,
    value,
    data: '0x0000'
  }
  //3.生成 serializedTx
  //转化私钥
  const bufferPriviteKey = Buffer(priviteKey.value.slice(2), 'hex')
  // console.log(bufferPriviteKey);
  //gas估算
  const gas = await web3.eth.estimateGas(rawTx)
  rawTx.gas = gas
  //ethereumjs-tx私钥加密
  const tx = new Tx(rawTx)
  tx.sign(bufferPriviteKey)
  //生成 serializedTx
  const serializedTx = tx.serialize().toString('hex')
  console.log(serializedTx);
}

</script>

<style lang="less"></style>
