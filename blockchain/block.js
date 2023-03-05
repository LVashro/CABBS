import SHA256 from 'crypto-js/sha256.js';
import Transaction from './transaction.js';


class Block {
  timestamp;
  prevHash;
  transactions = [Transaction];
  msg;
  subBlockchain = [SubBlockchain];

  constructor(
    timestamp,
    prevHash,
    transactions,
    msg,
    subBlockchain,
  ) {
    this.timestamp = timestamp;
    this.prevHash = prevHash;
    this.transactions = transactions;
    this.msg = msg;
    this.subBlockchain = subBlockchain;
  }

  static genesis() {
    return new this(0, '0'.repeat(64), [], "", "");
  }

  hash() {
    return SHA256(JSON.stringify([
      this.timestamp,
      this.prevHash,
      this.transactions,
      this.msg,
      this.subBlockchain,
    ])).toString();
  }

  static fromJSON(json) {
    const transactions = json.transactions.map(t => Transaction.fromJSON(t));
    return new Block(
      json.timestamp,
      json.prevHash,
      transactions,
      json.msg,
      json.subBlockchain,
    );
  }
    
  toJSON() {
    //const transactions = this.transactions.map(t => t.toJSON());
    return ({
      timestamp: this.timestamp,
      prevHash: this.prevHash,
      transactions: this.transactions,
      msg: this.msg,
      subBlockchain: this.subBlockchain,
    });
  }
}

export default Block;