#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
NGINX_CONF="$DIR/server.conf"

nginx -c $NGINX_CONF -s stop

if [[ $? -eq 0 ]]; then
  echo Stopped nginx.
else 
  echo Failed to stop nginx.
fi;
