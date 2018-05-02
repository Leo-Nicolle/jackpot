const osc = require('osc');
const butcher = require('./butcher');
const write = require('./write');

const readFromStream = require('./readFromStream');
const transformPoints = require('./transform-points');


const data = {};

const oscComunication = {

  initialize() {
    // creates an udp osc that will listen on the 10000 port,
    // and will execute read point functionwhen a message arrives
    oscComunication._createUDP(10002, oscComunication._readPoint);
    oscComunication._createUDP(10003, oscComunication._startButcher);

    // oscComunication._createUDP(10001, oscComunication._example);
  },

  getData() {
    return data;
  },

  _createUDP(port, messageFunc, readyFunc) {
    const udpPort = new osc.UDPPort({
      localAddress: '0.0.0.0',
      localPort: port,
    });
    readyFunc = readyFunc || (() => console.log('OSC UDP port ready', port));
    udpPort.on('ready', readyFunc);
    udpPort.on('message', messageFunc);
    udpPort.open();
    return udpPort;
  },

  _readPoint(message) {
    let jointName = message.address.slice(0, message.address.length - 1);
    const coordinate = message.address.slice(message.address.length - 1);
    if (jointName.startsWith('/')) {
      jointName = jointName.slice(1);
    }
    if (!data[jointName]) {
      data[jointName] = { u: 0, v: 0 };
    }
    data[jointName][coordinate] = message.args[0];
  },

  _startButcher() {
    // don't care about the message, when this event is triggered, start the pipeline
    // finds the right file number(the las image taken)
    readFromStream.loadImage().then((image) => {
      console.log('start cut');
      const points = data;
      console.log(data);
      const parts = butcher.cutHeadBodyLegs(
        image,
        transformPoints(points, image.width, image.height),
      );
      write.parts(parts);
      return new Promise(() => console.log('--cut succes -- '), () => console.log('--cut error -- '));
    });
  },

  _example(message) {
    console.log('message: ', message);
  },
};

module.exports = oscComunication;
