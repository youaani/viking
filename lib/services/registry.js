var path = require('path');
var Denver = require('denver')
var Container = require('../container');
var Volume = require('../volume');

module.exports = function(config, etcd, done){

  var denver = Denver({}, etcd)

  denver.env('vikingcore', function(err, env){

    // the volume so we are sharing the config
    var volumes = [
      path.normalize(__dirname + '/../../files/registry') + ':/registryconf'
    ]

    // the development volume for images
    if(config.env=='development'){
      volumes.push(Volume(config, 'core', '/data/registry'))
    }
    
    // the env has been augmented from denver -> vikingcore
    var env = {
      DOCKER_REGISTRY_CONFIG:'/registryconf/config.yml',
      SETTINGS_FLAVOR:config.env,
      SECRET_KEY:env.REGISTRY_SECRET_KEY,
      AWS_KEY:env.AWS_KEY,
      AWS_SECRET:env.AWS_SECRET,
      AWS_BUCKET:env.REGISTRY_AWS_BUCKET
    }

    var options = {
      stack:'core',
      name:'registry',
      image:'registry',
      system:true,
      filter:{
        leader:true
      },
      ports:[
        '5000:5000'
      ],
      env:env,
      volumes:volumes
    }

    done(null, options)
  })

}