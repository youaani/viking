var spawn = require('child_process').spawn;
var utils = require('component-consoler');
var fs = require('fs');
var spawnargs = require('spawn-args');

var socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
var stats  = fs.statSync(socket);

if (!stats.isSocket()) {
	utils.fatal('docker must be running');
}

module.exports = function(opts, done){
	opts = opts || {};

	if(!opts.image){
		utils.fatal('image option required');
	}

	var arr = [
		'run',
		'-d',
		'-t'
	]

	if(opts.name){
		arr.push('--name')
		arr.push(opts.name)
	}

	if(opts.ports){
		opts.ports.forEach(function(p){
			arr.push('-p');
			arr.push(p);
		})
	}

	if(opts.volumes){
		opts.volumes.forEach(function(v){
			arr.push('-v');
			arr.push(v);
		})
	}

	if(opts.env){
		Object.keys(opts.env).forEach(function(k){
			arr.push('-e');
			arr.push(k + '=' + opts.env[k]);
		})
	}

	if(opts.rm){
		arr.push('-rm')
	}

	arr.push(opts.image);

	if(opts.command){
		arr = arr.concat(spawnargs(opts.command));
	}

	console.log('docker ' + arr.join(' '));

	var process = spawn('docker', arr, { stdio: 'inherit' });

	process.on('error', done);
	process.on('close', done);

	return process;
}