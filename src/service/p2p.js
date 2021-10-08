import WebSocket from 'ws';

const { P2P_PORT = 5000, PEERS } = process.env;
const peers = PEERS ? PEERS.split(',') : [];
const MESSAGE = {
  BLOCKS: 'blocks',
  TX: 'transaction',
  WIPE: 'wipe_memoryPool',
};

class P2PService {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
  }

  listen() {
    const server = new WebSocket.Server({ port: P2P_PORT });
    server.on('connection', (socket) => this.onConnection(socket));

    peers.forEach((peer) => {
      const socket = new WebSocket(peer);
      socket.on('open', () => this.onConnection(socket));
    });

    console.log(`Service ws: ${P2P_PORT} listening...`);
  }

  onConnection(socket) {
    console.log(`[ws:socket] connected: ${socket.address}`);
    this.sockets.push(socket);
    socket.on('message', (message) => {
      const { type, value } = JSON.parse(message);

      try {
        if (type === MESSAGE.BLOCKS) {
          this.blockchain.replace(value);
        } else if (type === MESSAGE.TX) {
          this.blockchain.memoryPool.addOrUpdate(value);
        } else if (type === MESSAGE.WIPE) {
          this.blockchain.memoryPool.wipe();
        }
      } catch (error) {
        console.log(`[ws:message] error ${error}`);
        throw Error(error);
      }
    });

    socket.send(
      JSON.stringify({ type: MESSAGE.BLOCKS, value: this.blockchain.blocks })
    );
  }

  sync() {
    this.broadcast(MESSAGE.BLOCKS, this.blockchain.blocks);
  }

  broadcast(type, value) {
    console.log(`[ws:socket] ${type}...`);
    const message = JSON.stringify({ type, value });
    this.sockets.forEach((socket) => socket.send(message));
  }
}

export { MESSAGE };

export default P2PService;
