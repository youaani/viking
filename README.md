viking
======

Docker PaaS Platform for node.js applications.

The main objective of viking is to help you move westward and colonize server-farms with viking apps.

STATUS - PRE-ALPHA - do not try to use at the moment

```
                                
 /-\  //\ (-)  ~  ~  (-)  ~~~~     ~~~~ 
 \\-\//-/ |-| |-|/-/ |-| |----\   /----|
  \\-V-/  |-| |- -<  |-| |-|||-| |-(_|-|
   \\-/   |-| |-|\-\ |-| |-|||-|  \----|
                                   __|-|
                                  |---/ 
```

## installation

```
$ wget -qO- https://raw.github.com/binocarlos/viking/master/bootstrap.sh | sudo bash
```
## example viking file

This is an example stack that has 3 node.js workers - 1 one them with a volume and 2 services.

```yaml
# the viking object configures the stack itself
viking:
  # the name of the stack is used for container names - teststack/website in this case
  name: teststack
  # viking hamster raaaaaaaar
  comment: Ragnar Hamster Lothbrok

# containers are built from your source code and pushed to a private docker registry
# you can use local containers in FROM statements by using:
# FROM viking:<stackname>/<nodename>
image:
  # the base container - the other nodes will extend from this
  base: |
    FROM quarry/monnode
    ADD . /srv/app
    RUN cd /srv/app && npm install
    WORKDIR /srv/app
  db: |
    FROM viking:teststack/base
    EXPOSE 5000
    VOLUME /var/db
    ENTRYPOINT mon node db/index.js
  logic: |
    FROM viking:teststack/base
    EXPOSE 5001
    ENTRYPOINT mon node logic/index.js
  website: |
    FROM viking:teststack/base
    EXPOSE 80
    ENTRYPOINT mon node website/index.js
  mongo: |
    FROM quarry/mongo
    VOLUME /data/db
    EXPOSE 27017
  redis: |
    FROM quarry/redis
    VOLUME /data/db
    EXPOSE 6379

# workers are processes that we are deploying
# each worker has an ideal 'scale' that is the minimum number of workers
container:
  db:
    image: db
    # this means deploy to the same server each time
    # volumes in images trigger this automatically
    fixed: true
  logic:
    image: logic
    scale: 2
    args: mode=1
  # multiple workers from the same image using arguments to the entrypoint
  logic2:
    image: logic
    scale: 1
    args: mode=2
  website:
    image: website
    scale: 3
    # each domain is automapped to the front end HTTP router
    # this applies to each of the exposed ports in the image
    domains:
      - "thetracktube.com"
      - "www.thetracktube.com"
      - "tracktube.local.digger.io"
      - "tracktube.lan.digger.io"
  mongo:
    image: mongo
    # static is the same as fixed but also never restart (good for database servers)
    static: true
  redis:
    image: redis
    static: true

# websites are static HTML and can be served by the generic web server
website:
  help:
    document_root: ./help/www
    domains:
      - "help.thetracktube.com"
      - "*.help.thetracktube.com"
```

## license

MIT