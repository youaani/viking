var Container = require('../container');
var Volume = require('../volume');

module.exports = function(config, done){

	var name = config.network.hostname;
	var ip = config.network.private;
  var token = config.network.token;

	var options = {
    stack:'core',
    name:'etcd',
    image:'coreos/etcd',
    command:'-name ' + name + ' -bind-addr 0.0.0.0:4001 -addr ' + ip + ':4001 -peer-bind-addr 0.0.0.0:7001 -peer-addr ' + ip + ':7001 -data-dir /data/db -snapshot-count 100 -discovery ' + token,
    ports:[
      '4001:4001',
      '7001:7001'
    ],
    volumes:[
      Volume(config, 'core', '/data/db')
    ]
  }

  done(null, Container(options, config))
}