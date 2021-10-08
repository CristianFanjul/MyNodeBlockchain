import Blockchain from '../blockchain';
import validate from '../modules/validate';

describe('validate', () => {
  let blockchain;

  beforeEach(() => {
    blockchain = new Blockchain();
  });

  it('validates a valid chain', () => {
    blockchain.addBlock('bl4ck-1');
    blockchain.addBlock('bl4ck-2');

    expect(validate(blockchain.blocks)).toBe(true);
  });

  it('validates a chain with a corrupt genesis block', () => {
    blockchain.blocks[0].data = 'b4d d4ta';

    expect(() => {
      validate(blockchain.blocks);
    }).toThrowError('Invalid genesis block.');
  });

  it('invalidates a chain with corrupt previousHash within a block', () => {
    blockchain.addBlock('bl4ck-1');
    blockchain.blocks[1].previousHash = 'h4ck';

    expect(() => {
      validate(blockchain.blocks);
    }).toThrowError('Invalid previous hash.');
  });

  it('invalidates a chain with corrupt hash within a block', () => {
    blockchain.addBlock('bl4ck-1');
    blockchain.blocks[1].hash = 'h4ck';

    expect(() => {
      validate(blockchain.blocks);
    }).toThrowError('Invalid hash.');
  });
});
