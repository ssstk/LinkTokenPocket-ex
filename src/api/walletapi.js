/*
 * @Author: MrWang
 * @Date:   2018-04-28 12:11:31
 * @Last Modified by:   mr.wang
 * @Last Modified time: 2018-04-28 12:11:31
 */

'use strict'
import axios from 'axios'
import EthereumTx from 'ethereumjs-tx'
import Wallet from 'ethereumjs-wallet'
import Qs from 'qs'
import moment from 'moment'
import Web3 from 'web3'

const web3 = new Web3()
const url = 'https://walletapi.onethingpcs.com'
const type = { '0': '减少', '1': '增加' }

export function getBalance(address) {
  return axios({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    data: {
      "jsonrpc": "2.0",
      "method": "eth_getBalance",
      "params": [address, "latest"],
      "id": 1
    },
    url: url + '/getBalance'
  }).then(res => {
    res.data.result = web3.utils.fromWei(res.data.result, 'ether')
    return Promise.resolve(res.data)
  })
}

export function getTransactionCount(address) {
  return axios({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    data: {
      "jsonrpc": "2.0",
      "method": "eth_getTransactionCount",
      "params": [address, "pending"],
      "id": 1
    },
    url: url + '/getTransactionCount'
  }).then(res => {
    res.data.result = parseInt(res.data.result, 16)
    return Promise.resolve(res.data)
  })
}

export function getTransactionRecords(address) {
  let data = [address, "0", "0", "1", "20"]
  const dateFormat = 'YYYY-MM-DD HH:mm:ss'
  return axios({
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    data: data,
    url: url + '/getTransactionRecords'
  }).then(res => {
    let data = []
    res.data.result.map(item => {
      let typename = type[item.type]
      let amount = web3.utils.fromWei(item.amount, 'ether')
      let timestamp = moment(item.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')
      item = Object.assign({}, item, {
        amount: amount,
        timestamp: timestamp,
        type: typename
      })
      data.push(item)
    })
    res.data.result = data
    return Promise.resolve(res.data)
  })
}

export function sendRawTransaction(params) {
  const keystore = params.walletaddress
  const password = params.password
  try {
    const wallet_new = Wallet.fromV3(keystore, password)
    const address = `0x${wallet_new.getAddress().toString('hex')}`;
    const txParams = {
      from: address,
      to: address,
      value: web3.utils.toHex(web3.utils.toWei(params.value)),
      gasLimit: '0x186a0',
      gasPrice: '0x174876e800',
      nonce: '0x0',
    };
    const tx = new EthereumTx(txParams)
    tx.sign(wallet_new.getPrivateKey())
    const serializedTx = tx.serialize();

    const raw = `0x${serializedTx.toString('hex')}`;

    return axios({
      method: 'POST',
      headers: { 'content-type': 'application/json', "Nc": "IN" },
      data: JSON.stringify({
        "jsonrpc": "2.0",
        "method": "eth_sendRawTransaction",
        "params": [raw],
        "id": 1
      }),
      url: url + '/sendRawTransaction'
    }).then(res => {
      return Promise.resolve(res.data)
    })
  } catch (err) {
    let result = {
      error: {
        code : -3003
      }
    }
    return Promise.resolve(result)
  }
  
}