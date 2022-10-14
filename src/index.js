const Web3 = require('web3');
const { WebClient, LogLevel } = require("@slack/web-api");
const client = new WebClient("xoxb-4208929916324-4206536588322-sDfAq6ILynxYQoUqtHHageMZ", {
  logLevel: LogLevel.DEBUG
});
const channelId = "C0467PK7ZT8";

class TransactionChecker {
 web3;
 account;

  constructor(projectId, account) {
   this.web3 = new Web3(new Web3.providers.HttpProvider('https://Goerli.infura.io/v3/4adb25ba68ee4df7a3129096d5cff115'));
   this.account = account.toLowerCase();
  }

  async checkBlock() {
   let block = await this.web3.eth.getBlock('latest');
   let number = block.number;
   console.log('Searching block ' + number);

    if (block != null && block.transactions != null) {
      for (let txHash of block.transactions) {
       let tx = await this.web3.eth.getTransaction(txHash);

       const outputMSG ='Transaction found on block: ' + number + '\nfrom wallet: ' + tx.from + '\nto wallet: ' + tx.to+ '\nvalue: '+ this.web3.utils.fromWei(tx.value, 'ether')+ '\ntime:'+ new Date() +'\nhttps://goerli.etherscan.io/tx/'+txHash

       function output(){
         console.log(outputMSG)
         try {
           const result =  client.chat.postEphemeral({
             channel: channelId,
             user: userId,
             text: outputMSG
            });
            console.log(result);
          }
          catch (error) {
            console.error(error);
          }
        }
       let x = tx.to?.toLowerCase()|| ''
       if (this.account == x) {
          output()
        }
       if (this.account == tx.from.toLowerCase()) {
          output()
        }
      }
    }
  }
}

let txChecker = new TransactionChecker(process.env.INFURA_ID, '0x8cb72A8D2fb86bEB75ECED30C957F7aA8F839AA4');
const userId = "U0462BKP8QK";   //I think it must replace with a mapping
setInterval(() => {
  txChecker.checkBlock();
}, 15 * 1000);
