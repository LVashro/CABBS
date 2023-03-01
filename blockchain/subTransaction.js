import uuidv1 from 'uuidv1';
import SHA256 from 'crypto-js/sha256.js';
import pkg from 'elliptic';
//import Router from '../router/index.js';

const { ec:EC } = pkg;
const ec = new EC('secp256k1');

class Transaction {
  subid;
  suboutputs = [];
  subinput;

  constructor() {
    this.subprivateKey = ec.genKeyPair({ entropy: uuidv1() });
    this.subpublicKey = this.subprivateKey.getPublic().encode('hex');
  }

  signTransaction(subprivateKey, msg) {
    const subhash = SHA256(JSON.stringify(this.suboutputs)).toString();
    this.id = uuidv1();
    this.outputs = {
        msg,
        subpublicKey: this.subpublicKey,
    };
    this.input = {
        subtimestamp: Date.now(),
        msg,
        subpublicKey: this.subprivateKey.getPublic().encode('hex'),
        subsignature: this.subprivateKey.sign(subhash),
    };
  }

  verifyTransaction() {
    const subhash = SHA256(JSON.stringify(this.suboutputs)).toString();
    return ec.keyFromPublic(this.subinput.subaddress, 'hex')
      .verify(subhash, this.subinput.subsignature);
  }

  static createTransaction(
    subprivateKey,
    submsg,
  ) {
    const tx = new Transaction();
    tx.subid = uuidv1();
    tx.createOutputs(subprivateKey, this.subpublicKey, submsg);
    tx.signTransaction(subprivateKey, submsg);
    return tx;
  }

  static fromJSON(json) {
    const tx = new Transaction();
    tx.subid = json.subid;
    tx.suboutputs = json.suboutputs;
    tx.subinput = json.subinput;
    return tx;
  }

  toJSON() {
    return ({
        subid: this.subid,
        suboutputs: this.suboutputs,
        subinput: this.subinput,
    });
  }
}

export default Transaction;