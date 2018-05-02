

const osc = require('osc');
const fs = require('fs');

let udpPortPoints;
let updPortStart;

const localPortPoints = 10001;
const localPortStart = 10000;


const distantPortPoints = 10002;
const distantPortStart = 10003;


const fakeServer = {

  fileNumber: 6,
  start() {
    udpPortPoints = new osc.UDPPort({
      localAddress: '0.0.0.0',
      localPort: localPortPoints,
      metadata: true,
    });
    udpPortPoints.on('ready', fakeServer._onReadyPoints);
    udpPortPoints.open();

    updPortStart = new osc.UDPPort({
      localAddress: '0.0.0.0',
      localPort: localPortStart,
      metadata: true,
    });
    updPortStart.on('ready', fakeServer._onReadyStart);
    updPortStart.open();
  },

  _onReadyPoints() {
    fakeServer._sendPoints();
  },


  _onReadyStart() {
    setTimeout(() => fakeServer._sendMessage('start', '1', updPortStart, distantPortStart), 3000);
  },

  _onMessage(message) {
    console.log('server received', message);
  },

  _readPointsFromDisk(number) {
    return JSON.parse(fs.readFileSync(`sample/points/${number}.json`, 'utf8'));
  },

  _sendMessage(address, value, updPort, distantPort) {
    updPort.send({
      address: `/${address}`,
      args: [
        {
          type: 's',
          value,
        },
      ],
    }, '127.0.0.1', distantPort);
  },

  _sendPoints() {
    const points = fakeServer._readPointsFromDisk(fakeServer.fileNumber);
    Object.entries(points).forEach(([name, value]) => {
      fakeServer._sendMessage(`${name}u`, value.point.u, udpPortPoints, distantPortPoints);
      fakeServer._sendMessage(`${name}v`, value.point.v, udpPortPoints, distantPortPoints);
    });
  },


};

module.exports = fakeServer;
