import Elliptic from 'elliptic';
import genHash from './hash';

const ec = new Elliptic.ec('secp256k1'); // eslint-disable-line

export default {
  createKeyPair: () => ec.genKeyPair(),

  verifySignature: (publicKey, signature, data) => ec.keyFromPublic(publicKey, 'hex').verify(genHash(data), signature),
};
