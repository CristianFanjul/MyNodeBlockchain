import { blockchainWallet, Transaction } from '../wallet';
import { MESSAGE } from '../service/p2p';

class Miner {
  constructor(blockchain, p2pService, wallet) {
    this.blockchain = blockchain;
    this.p2pService = p2pService;
    this.wallet = wallet;
  }

  mine() {
    if (this.blockchain.memoryPool.transactions.length === 0) {
      throw Error('The are no unconfirmed transactions.');
    }

    /*
      1. Include reward to miner in transaction.
      2. Create a block consisting on valid transactions
      3. Sync new blockchain with the network.
      4. Wipe transaction from memory pool.
      5. Broadcast wipe message to every node.
      */

    const rewardTransaction = Transaction.reward(this.wallet, blockchainWallet);
    this.blockchain.memoryPool.transactions.push(rewardTransaction);
    const block = this.blockchain.addBlock(this.blockchain.memoryPool.transactions);
    this.p2pService.sync();
    this.blockchain.memoryPool.wipe();
    this.p2pService.broadcast(MESSAGE.WIPE);

    return block;
  }
}

export default Miner;
