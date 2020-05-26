const path = require('path');
const osu = require('node-os-utils');
const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;

// set model
document.getElementById('cpu-model').innerText = cpu.model();

// computer name
document.getElementById('comp-name').innerText = os.hostname();

// os
document.getElementById('os').innerText = `${os.type()} ${os.arch()}`

// total memory
mem.info().then(info => {
    document.getElementById('mem-total').innerText = info.totalMemMb
})