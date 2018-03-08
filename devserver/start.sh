#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
NGINX_CONF="$DIR/server.conf"

# Generate an nginx config based on the repo location
m4 -DPROJECT_DIR=`git rev-parse --show-toplevel` $DIR/server.conf.m4 > $NGINX_CONF

# Kill a running server (if applicable)
nginx -c $NGINX_CONF -s stop > /dev/null 2>&1

# Start a new server
nginx -c $NGINX_CONF

