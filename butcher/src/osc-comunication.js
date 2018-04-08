const osc = require('osc');

const data = {};

const oscCommunication = {

  initialize() {
    // creates an udp osc that will listen on the 10000 port,
    // and will execute read point functionwhen a message arrives
    oscCommunication.createUDP(10000, oscCommunication._readPoint);

    oscCommunication.createUDP(10001, oscCommunication._example);
  },

  _createUDP(port, messageFunc) {
    const udpPort = new osc.UDPPort({
      localAddress: '0.0.0.0',
      localPort: port,
    });
    udpPort.on('ready', () => console.log('OSC UDP port ready', port));
    udpPort.on('meassge', messageFunc);
    udpPort.open();
  },

  _readPoint(message) {
    const jointName = message.address.slice(0, message.address.length - 1);
    const coordinate = message.address.slice(message.address.length - 1);

    if (!data[jointName]) {
      data[jointName] = { u: 0, v: 0 };
    }
    data[jointName][coordinate] = message.args[0];
  },

  _example(message) {
    console.log('message: ', message);
  },
};

module.exports = oscCommunication;
