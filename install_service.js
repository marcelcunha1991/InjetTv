require('dotenv').config();

const Service = require('node-windows').Service,
    svc = new Service({
        name:'SmartTV Injet',
        description: 'Dashboard que exibe os indicadores',
        script: process.env.BIN_PATH
    });
svc
.on('install',() => svc.start())
.install();