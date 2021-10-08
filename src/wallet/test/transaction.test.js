import Transaction, { REWARD } from '../transaction';
import Wallet from '../wallet';
import { blockchainWallet } from '../index';

describe('Transaction', () => {
  let wallet;
  let transaction;
  let amount;
  let recipientAddres;

  beforeEach(() => {
    wallet = new Wallet();
    recipientAddres = 'r3c1pient';
    amount = 5;
    transaction = Transaction.create(wallet, recipientAddres, amount);
  });

  it('outputs the amount subtracted from the wallet balance', () => {
    const output = transaction.outputs.find(
      ({ address }) => address === wallet.publicKey
    );
    expect(output.amount).toEqual(wallet.balance - amount);
  });

  it('outputs the amount added to the recipient', () => {
    const output = transaction.outputs.find(
      ({ address }) => address === recipientAddres
    );
    expect(output.amount).toEqual(amount);
  });

  describe('transacting with an amount that exceeds the balance', () => {
    beforeEach(() => {
      amount = 500;
      transaction = undefined;
    });

    it('it does not create the transaction', () => {
      expect(() => {
        transaction = Transaction.create(wallet, recipientAddres, amount);
      }).toThrowError(`Amount: ${amount} exceeds balance.`);
    });
  });

  it('inputs the balance of the wallet', () => {
    expect(transaction.input.amount).toEqual(wallet.balance);
  });

  it('inputs the sender address of the wallet', () => {
    expect(transaction.input.address).toEqual(wallet.publicKey);
  });

  it('inputs has a signature using the wallet', () => {
    expect(typeof transaction.input.signature).toEqual('object');
    expect(transaction.input.signature).toEqual(
      wallet.sign(transaction.outputs)
    );
  });

  it('validate a valid transaction with verify()', () => {
    expect(Transaction.verify(transaction)).toBe(true);
  });

  it('invalidate a a corrupt transaction with verify()', () => {
    transaction.outputs[0].amount = 500;
    expect(Transaction.verify(transaction)).toBe(false);
  });

  describe('Update transactions', () => {
    let nextAmount;
    let nextRecipient;

    beforeEach(() => {
      nextAmount = 3;
      nextRecipient = 'n3xt-4ddress';
      transaction = transaction.update(wallet, nextRecipient, nextAmount);
    });

    it('substracts the next amount from the senders wallet', () => {
      const output = transaction.outputs.find(
        ({ address }) => address === wallet.publicKey
      );
      expect(output.amount).toEqual(wallet.balance - amount - nextAmount);
    });

    it('outputs an amount for the next recipient', () => {
      const output = transaction.outputs.find(
        ({ address }) => address === nextRecipient
      );
      expect(output.amount).toEqual(nextAmount);
    });
  });

  describe('Creating a reward transaction', () => {
    beforeEach(() => {
      transaction = Transaction.reward(wallet, blockchainWallet);
    });

    it('reward the miner wallet', () => {
      expect(transaction.outputs.length).toEqual(2);

      let output = transaction.outputs.find(
        ({ address }) => address === wallet.publicKey
      );
      expect(output.amount).toEqual(REWARD);

      output = transaction.outputs.find(
        ({ address }) => address === blockchainWallet.publicKey
      );
      expect(output.amount).toEqual(blockchainWallet.balance - REWARD);
    });
  });
});
