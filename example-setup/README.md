# Example Setup

A lot of issues where opened that deal with setting up a registry and a
front-end.

This document describes how you can setup a basic registry v2 and a front-end
with almost no effort. We will start with a basic working configuration and
later you can plug your configuration (like certificates) in to adapt everything
to your needs.

I highly recommend you try out this setup before you open an issue regarding
setup of any kind.

## Directory layout

This is the directory layout of this example setup:

```
.
├── docker-compose.yml
├── frontend
│   └── certs
│       ├── frontend.crt
│       └── frontend.key
├── REAME.md
└── registry
    ├── certs
    │   ├── registry.crt
    │   └── registry.key
    ├── config
    │   └── config.yml
    └── storage
```

## Starting the registry and front-end

Notice that there's a `docker-compose.yml` file. With a simple
`docker-compose up` command, the registry and front-end containers will be up and
running.

## Usage

Make sure your docker daemon allows access to your insecure registry by adding
`--insecure-registry=0.0.0.0:5000` to your `DOCKER_OPTS` in
`/etc/default/docker` (at least this is where you find it in Ubuntu 14.04).

Then restart your docker daemon: `sudo service docker restart`

Run these commands to pull a `busybox` image and upload it to your registry:

```bash
docker pull busybox
docker tag busybox 0.0.0.0:5000/busybox/busybox
docker push 0.0.0.0:5000/busybox/busybox
```

Then enter this URL in your browser to access the front-end:
https://0.0.0.0:8443. You should see the `busybox` image that we just pushed.

## SSL

By default the front-end as well as the registry are protected by SSL using
dedicated self-signed certificates. Feel free to replace them with your own.

## Registry config

You might want to adjust the `registry/config/config.yml` before going into
production with this setup.

Have fun!
