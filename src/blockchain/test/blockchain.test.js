import Blockchain from '../blockchain';
import Block from '../block';

describe('Blockchain', () => {
  let blockchain;
  let blockchainB;

  beforeEach(() => {
    blockchain = new Blockchain();
    blockchainB = new Blockchain();
  });

  it('every blockchain has genesis block', () => {
    const [genesisBlock] = blockchain.blocks;

    expect(genesisBlock).toEqual(Block.genesis);
    expect(blockchain.blocks.length).toEqual(1);
  });

  it('use addBlock() with one block', () => {
    const data = 'd4ta';
    blockchain.addBlock(data);

    const [, lastBlock] = blockchain.blocks;
    expect(lastBlock.data).toEqual(data);
    expect(blockchain.blocks.length).toEqual(2);
  });

  it('use addBlock() with two blocks', () => {
    const data1 = 'd4ta1';
    const data2 = 'd4ta2';
    blockchain.addBlock(data1);
    blockchain.addBlock(data2);

    const [, beforeLastBlock, lastBlock] = blockchain.blocks;
    expect(beforeLastBlock.data).toEqual(data1);
    expect(lastBlock.data).toEqual(data2);
    expect(blockchain.blocks.length).toEqual(3);
  });

  it('replaces the chain with a valid chain', () => {
    blockchainB.addBlock('d4ta-1');
    blockchain.replace(blockchainB.blocks);

    expect(blockchain.blocks).toEqual(blockchainB.blocks);
  });

  it('does not replace the chain with one with less blocks', () => {
    blockchain.addBlock('block-1');

    expect(() => {
      blockchain.replace(blockchainB.blocks);
    }).toThrowError('Received chain is not longer than current chain.');
  });

  it('does not replace the chain with one is not valid', () => {
    blockchainB.addBlock('block-1');
    blockchainB.blocks[1] = 'block-hacked';

    expect(() => {
      blockchain.replace(blockchainB.blocks);
    }).toThrowError('Received chain is invalid.');
  });
});
