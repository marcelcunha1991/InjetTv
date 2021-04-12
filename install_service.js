var Service = require('node-windows').Service;

var svc = new Service({
  name:'InjetTv Web',
  description: 'Dashboard do InjetTv-Web',
  script: 'C:\\mapprojetos\\pgit\\InjetTv\\bin\\www'
});

svc.on('install',function(){
  svc.start();
});

svc.install();