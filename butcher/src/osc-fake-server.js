

const osc = require('osc');
const fs = require('fs');

let udpPort;

const fakeServer = {

  fileNumber: 6,
  start() {
    udpPort = new osc.UDPPort({
      localAddress: '0.0.0.0',
      localPort: 10003,
      metadata: true,
    });
    udpPort.on('ready', fakeServer._onReady);
    udpPort.open();
  },

  _onReady() {
    fakeServer._sendPoints();
  },

  _onMessage(message) {
    console.log('server received', message);
  },

  _readPointsFromDisk(number) {
    return JSON.parse(fs.readFileSync(`sample/points/${number}.json`, 'utf8'));
  },

  _sendMessage(address, value) {
    udpPort.send({
      address: `/${address}`,
      args: [
        {
          type: 's',
          value,
        },
      ],
    }, '127.0.0.1', 10004);
  },

  _sendPoints() {
    const points = fakeServer._readPointsFromDisk(fakeServer.fileNumber);
    Object.entries(points).forEach(([name, value]) => {
      fakeServer._sendMessage(`${name}u`, value.point.u);
      fakeServer._sendMessage(`${name}v`, value.point.v);
    });
  },
};

module.exports = fakeServer;
