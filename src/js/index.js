import '../css/index.css'
import Vue from 'vue'

import iView from 'iview'
import 'iview/dist/styles/iview.css'

Vue.use(iView)
import { getBalance, getTransactionCount, sendRawTransaction, getTransactionRecords } from '@/api/walletapi'
import { errorCode } from '@/api/site'

import { Upload } from 'iview'
new Vue({
  el: "#app",
  data() {
    return {
      address: '',
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
    Upload
  }

})