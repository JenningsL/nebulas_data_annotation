// let nebulas = require('../thirdparty/nebulas')
let Account = nebulas.Account
let neb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"));

let account = Account.NewAccount()
const contractTx = '106c73823a1579be4049951a0f39316206d0de53718c1fa72d734cd0cd19c92b'
const dappAddress = 'n1vRm1cUKyZNxLaGoqQbevNK9tTxY48eHc2'
export {neb, account, dappAddress}
