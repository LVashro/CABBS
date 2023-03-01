import SHA256 from 'crypto-js/sha256.js';
import Transaction from './subTransaction.js';


class Block {
  subtimestamp;
  subprevHash;
  subtransactions = [Transaction];
  submsg;

  constructor(
    subtimestamp,
    subprevHash,
    subtransactions,
    submsg,
  ) {
    this.subtimestamp = subtimestamp;
    this.subprevHash = subprevHash;
    this.subtransactions = subtransactions;
    this.submsg = submsg;
  }

  static genesis() {
    return new this(0, '0'.repeat(64), [], "");
  }

  hash() {
    return SHA256(JSON.stringify([
      this.subtimestamp,
      this.subprevHash,
      this.subtransactions,
      this.submsg,
    ])).toString();
  }

  static fromJSON(json) {
    const subtransactions = json.subtransactions.map(t => Transaction.fromJSON(t));
    return new Block(
      json.subtimestamp,
      json.subprevHash,
      subtransactions,
      json.submsg,
    );
  }
    
  toJSON() {
    //const transactions = this.transactions.map(t => t.toJSON());
    return ({
      subtimestamp: this.subtimestamp,
      subprevHash: this.subprevHash,
      subtransactions: this.subtransactions,
      submsg: this.submsg,
    });
  }
}

export default Block;