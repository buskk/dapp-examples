const { Harmony } = require('@harmony-js/core')
const { isPrivateKey } = require('@harmony-js/utils')
const fs = require('fs')
const path = require('path')

// loading setting
const setting = JSON.parse(fs.readFileSync(path.resolve(__dirname, './setting.json')))

// loading setting from local json file
const harmony = new Harmony(setting.url, {
  chainType: setting.chainType,
  chainId: setting.chainId
})

// loading Mne phrases from file
const phrases = fs.readFileSync(path.resolve(__dirname, './phrase.txt'), { encoding: 'utf8' })
// we use default index = 0
const index = 0

let accountImported
if (isPrivateKey(phrases)) {
  let key = phrases.trim()
  accountImported = harmony.wallet.addByPrivateKey(key)
} else {
  accountImported = harmony.wallet.addByMnemonic(phrases, index)
}
// add the phrase and index to Wallet, we get the account,
// and we export it for further usage
const myAccount = accountImported

module.exports = {
  harmony,
  myAccount
}