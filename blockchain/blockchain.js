import Block from './block.js';

class Blockchain {
  chain;

  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock(block){
    if (!this.canAddBlock(block)) {
      console.log("block追加ミスってるで");
      return false;
    }
    this.chain.push(block);
    return true;
  }

  canAddBlock(block){
    const lastBlock = this.chain[this.chain.length - 1];
    console.log(block.prevHash);
    console.log(lastBlock.hash());
    console.log(block.timestamp);
    console.log(lastBlock.timestamp);
    return block.prevHash === lastBlock.hash() && block.timestamp > lastBlock.timestamp
  }

  lastHash(){
    return this.chain[this.chain.length - 1].hash();
  }

  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    let prevBlock = null;
    return chain.every((block) => {
      if (!prevBlock) {
        prevBlock = block;
        return true;
      }
      if (prevBlock.hash() !== b.prevHash) {
        return false;
      }
      prevBlock = block;
      return true;
    });
  }
}

export default Blockchain;