const path = require('path');
const osu = require('node-os-utils');
const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;

let cpuOverload = 80;
let alertFrequency = 1;

// Run every 2 seconds
setInterval(() => {
    // cpu usage
    cpu.usage().then(info => {
        document.getElementById('cpu-usage').innerText = info + '%';
        document.getElementById("cpu-progress").style.width = info + '%';

        if(info >= cpuOverload){
            document.getElementById("cpu-progress").style.background = 'red';
        }
        else{
            document.getElementById("cpu-progress").style.background = '#30c88b';
        }

        //check overload
        if(info >= cpuOverload && runNotify(alertFrequency)){
            notifyUser({
                title: 'CPU OVERLOAD !!',
                body: `CPU is over ${cpuOverload}%`,
                icon: path.join(__dirname, 'img', 'icon.png')
            });

            localStorage.setItem('lastNotify', +new Date());
        }
    });

    // cpu free
    cpu.free().then(info => {
        document.getElementById('cpu-free').innerText = info + '%'
    });

    // uptime
    document.getElementById('sys-uptime').innerText = secondsToDhms(os.uptime());
},2000)

// set model
document.getElementById('cpu-model').innerText = cpu.model();

// computer name
document.getElementById('comp-name').innerText = os.hostname();

// os
document.getElementById('os').innerText = `${os.type()} ${os.arch()}`

// total memory
mem.info().then(info => {
    document.getElementById('mem-total').innerText = info.totalMemMb
});

//show days, hours, mins, secs
function secondsToDhms(seconds){
    seconds = +seconds;
    const day = Math.floor(seconds / (3600 * 24));
    const hour = Math.floor((seconds % (3600 * 24)) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const sec = Math.floor(seconds % 60);

    return `${day}d, ${hour}h, ${mins}m, ${sec}s`;
}


// send notification
function notifyUser(options){
    new Notification(options.title, options);
}

// check how much time has passed since notification 
function runNotify(frequency){
    if(localStorage.getItem('lastNotify') === null){
        // store timestamp
        localStorage.setItem('lastNotify', +new Date());
        return true;
    }
    const notifyTime = new Date(parseInt(localStorage.getItem('lastNotify')));
    const now = new Date();
    const diffTime = Math.abs(now - notifyTime);
    const minutesPassed = Math.ceil(diffTime / (1000 * 60));

    if(minutesPassed > frequency){
        return true;
    }
    else{
        return false;
    }
}