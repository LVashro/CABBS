import uuidv1 from 'uuidv1';
import SHA256 from 'crypto-js/sha256.js';
import pkg from 'elliptic';
//import Router from '../router/index.js';

const { ec:EC } = pkg;
const ec = new EC('secp256k1');

class Transaction {
  id;
  outputs = [];
  input;

  constructor() {
    this.privateKey = ec.genKeyPair({ entropy: uuidv1() });
    this.publicKey = this.privateKey.getPublic().encode('hex');
  }

  signTransaction(privateKey, msg) {
    const hash = SHA256(JSON.stringify(this.outputs)).toString();
    this.id = uuidv1();
    this.outputs = {
      msg,
      publicKey: this.publicKey,
    };
    this.input = {
      timestamp: Date.now(),
      msg,
      publicKey: this.privateKey.getPublic().encode('hex'),
      signature: this.privateKey.sign(hash),
    };
  }

  verifyTransaction() {
    const hash = SHA256(JSON.stringify(this.outputs)).toString();
    return ec.keyFromPublic(this.input.address, 'hex')
      .verify(hash, this.input.signature);
  }

  static createTransaction(
    privateKey,
    msg,
  ) {
    const tx = new Transaction();
    tx.id = uuidv1();
    tx.createOutputs(privateKey, this.publicKey, msg);
    tx.signTransaction(privateKey, msg);
    return tx;
  }

  static fromJSON(json) {
    const tx = new Transaction();
    tx.id = json.id;
    tx.outputs = json.outputs;
    tx.input = json.input;
    return tx;
  }

  toJSON() {
    return ({
      id: this.id,
      outputs: this.outputs,
      input: this.input,
    });
  }
}

export default Transaction;