#!/bin/bash

function setup_dirs() {
  LIST="log tmp tmp/pids tmp/sockets"
  for dir in $LIST
  do
    if [ ! -d "${dir}" ]; then 
      mkdir "${dir}"
    fi
  done
}

setup_dirs
# default to development when not set
: ${RACK_ENV:=development}
export RACK_ENV
echo "Booting unicorn with ${RACK_ENV} environment..."
unicorn -c unicorn.rb -E ${RACK_ENV} -D
