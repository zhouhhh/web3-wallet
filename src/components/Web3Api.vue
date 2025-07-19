<template>
  <div class="wallet-container">
    <div class="wallet-card">
      <img :src="logoUrl" class="wallet-logo" alt="logo" />
      <h2>账户信息</h2>
      <div class="wallet-info">
        <div class="wallet-row">
          <span class="wallet-label">地址：</span>
          <span class="wallet-value address">{{ address }}</span>
        </div>
        <div class="wallet-row">
          <span class="wallet-label">私钥：</span>
          <span class="wallet-value private">{{ privateKeyDisplay }}</span>
        </div>
        <div class="wallet-row">
          <span class="wallet-label">余额：</span>
          <span class="wallet-value balance">{{ balance }} <span class="eth">ETH</span></span>
        </div>
      </div>
      <van-button type="primary" :loading="loading" block @click="send">
        {{ loading ? '转账中...' : '开始转账' }}
      </van-button>
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue';
import Web3 from 'web3'
import logo from '@/assets/logo.png'
const logoUrl = logo

const web3 = new Web3(Web3.givenProvider || "wss://sepolia.infura.io/ws/v3/44c9b438af104f158bd4958888917597")

//每次执行创建一个新账号
// const account = web3.eth.accounts.create('1111')
// console.log(account);

const address = ref('0xEeD08E5908803112c09168e2D6cB64B588818f46')
const privateKey = ref('0x309442518df28bf1663e0429ddca744ae2efb404a1d2941238b6d891ea81f07d')
const balance = ref('0')
const loading = ref(false)

// 私钥只显示前后几位，避免泄露
const privateKeyDisplay = computed(() => {
  const key = privateKey.value
  return key ? key.slice(0, 6) + '...' + key.slice(-4) : ''
})

const fetchBalance = async () => {
  try {
    const res = await web3.eth.getBalance(address.value)
    balance.value = web3.utils.fromWei(res, 'ether')
  } catch (e) {
    balance.value = '获取失败'
  }
}

fetchBalance()


const send = async () => {
  loading.value = true
  try {
    // 1. 构建转账参数
    const nonce = await web3.eth.getTransactionCount(address.value)
    const gasPrice = await web3.eth.getGasPrice()
    const value = web3.utils.toWei("0.009370192566556", "ether")
    const rawTx = {
      from: address.value,
      to: '0xF07c86ed54bA393A93277Ef8915b0C8df859868c',
      nonce,
      gasPrice,
      value,
      data: '0x',
    }
    // gas估算
    rawTx.gas = await web3.eth.estimateGas(rawTx)
    // 签名交易
    const signedTx = await web3.eth.accounts.signTransaction(rawTx, privateKey.value)
    // 发送签名后的交易
    web3.eth.sendSignedTransaction(signedTx.rawTransaction)
      .on('transactionHash', (hash) => {
        window.alert('转账已提交，交易哈希：' + hash)
        fetchBalance()
      })
      .on('receipt', (receipt) => {
        window.alert('转账成功！区块哈希：' + receipt.blockHash)
        fetchBalance()
      })
      .on('error', (error) => {
        window.alert('转账失败：' + error.message)
      })
      .finally(() => {
        loading.value = false
      })
  } catch (e) {
    window.alert('转账异常：' + (e.message || e))
    loading.value = false
  }
}

</script>

<style lang="less">
.wallet-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%);
}

.wallet-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(60, 120, 240, 0.08);
  padding: 36px 32px 28px 32px;
  min-width: 340px;
  max-width: 90vw;
  text-align: center;
  position: relative;
}

.wallet-logo {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px #e0e7ff;
}

.wallet-info {
  margin: 24px 0 32px 0;
}

.wallet-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.wallet-label {
  color: #888;
  font-size: 15px;
}

.wallet-value {
  font-family: 'Fira Mono', 'Menlo', monospace;
  font-size: 15px;
  color: #222;
  word-break: break-all;
}

.wallet-value.address {
  color: #2d8cf0;
}

.wallet-value.private {
  color: #f56c6c;
}

.wallet-value.balance {
  font-weight: bold;
  color: #19be6b;
}

.eth {
  font-size: 13px;
  color: #888;
  margin-left: 2px;
}

.van-button {
  margin-top: 10px;
  font-size: 16px;
  height: 44px;
  border-radius: 8px;
}
</style>
