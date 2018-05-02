import '../css/index.css'
import Vue from 'vue'

import iView from 'iview'
import 'iview/dist/styles/iview.css'

Vue.use(iView)
import { getBalance, getTransactionCount, sendRawTransaction, getTransactionRecords } from '@/api/walletapi'
import { errorCode } from '@/api/site'

import { Modal } from 'iview'
new Vue({
  el: "#app",
  data() {
    return {
      address: '',
      confirmation: false,
      amount: null,
      searchOpen: null,
      columns: [{
          title: '时间',
          key: 'timestamp'
        },
        {
          title: '类型',
          key: 'type'
        },

        {
          title: '数量',
          key: 'amount'
        },
      ],
      transfer: {},
      transferaddress: null,
      data: [],
      balance: 0,
      loading: false,
      transactionCount: 0
    }
  },
  created() {},
  methods: {
    handleClick() {
      this.$refs.input.click();
    },
    handleChange(e) {
      const files = e.target.files;
      if (!files) {
        return;
      }
      let postFiles = Array.prototype.slice.call(files);
      var reader = new FileReader();
      reader.addEventListener("loadend", (evt) => {
        var fileString = evt.target.result
        this.transferaddress = `0x${JSON.parse(fileString).address}`
        this.transfer['walletaddress'] = fileString
      })
      reader.readAsText(postFiles[0], "UTF-8")
    },
    confirmationfn(){
      if(!/^0[xX][a-fA-F0-9]{40}$/.test(this.transferaddress)){
          this.$Message.error('钱包地址不正确！')
          return
      }
      if(!this.transfer.password){
          this.$Message.error('钱包密码不能为空！')
          return
      }
      if(!/^0[xX][a-fA-F0-9]{40}$/.test(this.transfer.to_address)){
          this.$Message.error('收款账户不正确！')
          return
      }
      if(!this.transfer.value){
          this.$Message.error('转账链克不能为空！')
          return
      }
      this.amount = this.add(this.transfer.value, 0.01)
      this.confirmation = true
    },
    add(num1, num2) {
      const num1Digits = (num1.toString().split('.')[1] || '').length;
      const num2Digits = (num2.toString().split('.')[1] || '').length;
      const baseNum = Math.pow(10, Math.max(num1Digits, num2Digits));
      return (num1 * baseNum + num2 * baseNum) / baseNum;
    },
    sendRawTransaction() {
      let params = this.transfer
      this.loading = true
      sendRawTransaction(params).then(res => {
        this.loading = false
        if (this.validationRsults(res)) {
          this.$Message.success('交易成功')
        }
      })
    },

    validationRsults(obj) {
      if (!obj.error) {
        return true
      }
      let code = obj.error.code
      let info = errorCode[code]['CN']
      this.$Message.error(info)
    },

    getBalance() {
      let address = this.address
      if (!address) {
        this.$Message.error('钱包地址不能为空')
        return
      }
      getBalance(address).then(res => {
        if (this.validationRsults(res)) {
          this.balance = res.result
        }
      })
      getTransactionCount(address).then(res => {
        if (this.validationRsults(res)) {
          this.transactionCount = res.result
        }
      })
      getTransactionRecords(address).then(res => {
        if (this.validationRsults(res)) {
          this.data = res.result
        }
      })
    },
    opentab(name) {
      this.searchOpen = name
      console.log(name)
    }
  },

  computed: {

  },
  mounted: function () {
    this.$nextTick(function () {

    })
  },
  components: {
    Modal
  }

})