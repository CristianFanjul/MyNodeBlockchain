import Block from '../block';

describe('Block', () => {
  let timestamp;
  let previousBlock;
  let data;
  let hash;
  let nonce;

  beforeEach(() => {
    timestamp = new Date(2021, 0, 1);
    previousBlock = Block.genesis;
    data = 'test-data';
    hash = 'h4sh';
    nonce = 128;
  });

  it('create an instance with parameters', () => {
    const block = new Block(timestamp, previousBlock.hash, hash, data, nonce);

    expect(block.timestamp).toEqual(timestamp);
    expect(block.previousHash).toEqual(previousBlock.hash);
    expect(block.data).toEqual(data);
    expect(block.hash).toEqual(hash);
    expect(block.nonce).toEqual(nonce);
  });

  it('use static mine()', () => {
    const block = Block.mine(previousBlock, data);

    expect(block.hash.length).toEqual(64);
    expect(block.hash.substring(0, block.difficulty)).toEqual(
      '0'.repeat(block.difficulty)
    );
    expect(block.previousHash).toEqual(previousBlock.hash);
    expect(block.nonce).not.toEqual(0);
    expect(data).toEqual(data);
  });

  it('use static hash()', () => {
    hash = Block.hash(timestamp, previousBlock.hash, data, nonce);
    const hashOutput = '2ec5563a1a72c19a84ed6156e115abbb2da6c9cac77e3d1058599540483d0cca';

    expect(hash).toEqual(hashOutput);
  });

  it('use toString()', () => {
    const block = Block.mine(previousBlock, data);

    expect(typeof block.toString()).toEqual('string');
  });
});
