// let nebulas = require('../thirdparty/nebulas')
let Account = nebulas.Account
let neb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest("http://localhost:8685"));

let account = new Account()
account.fromKey('{"address":"n1H4MYms9F55ehcvygwWE71J8tJC4CRr2so","crypto":{"cipher":"aes-128-ctr","ciphertext":"75f814c2393ba63445dbab278f7b53cedbadc338a77664ccfb1656c81eeba27d","cipherparams":{"iv":"4a2f57ddd9eaad908904364483c1c943"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":4096,"p":1,"r":8,"salt":"a14af20b1e59da3ab38e37f2b5607a7a2166e1418852dd1a49d65d9342540b27"},"mac":"a9a726f43a45f0c248dadbaa8ab83036e1f3994bc330cedb5454666702fe69e9","machash":"sha3256"},"id":"40b6ee5e-142e-411f-97c5-dcfcdc44378d","version":3}', 'passphrase', false)

const dappAddress = 'n1rVLTRxQEXscTgThmbTnn2NqdWFEKwpYUM'
export {neb, account, dappAddress}