import Block from './subBlock.js';

class Blockchain {
    subchain;

  constructor() {
    this.subchain = [Block.genesis()];
  }

  addBlock(subblock){
    if (!this.canAddBlock(subblock)) {
      console.log("block追加ミスってるで");
      return false;
    }

    this.subchain.push(subblock);
    return true;
  }

  canAddBlock(subblock){
    const lastBlock = this.subchain[this.subchain.length - 1];
    console.log(subblock.subprevHash);
    console.log(lastBlock.hash());
    console.log(subblock.subtimestamp);
    console.log(lastBlock.subtimestamp);
    return subblock.subprevHash === lastBlock.hash() && subblock.subtimestamp > lastBlock.subtimestamp
  }

  lastHash(){
    return this.subchain[this.subchain.length - 1].hash();
  }

  static isValidChain(subchain) {
    if (JSON.stringify(subchain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    let subprevBlock = null;
    return subchain.every((subblock) => {
      if (!subprevBlock) {
        subprevBlock = subblock;
        return true;
      }
      if (subprevBlock.hash() !== subblock.subprevHash) {
        return false;
      }
      subprevBlock = subblock;
      return true;
    });
  }
}

export default Blockchain;