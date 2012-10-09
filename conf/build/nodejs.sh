#!/bin/sh

cd /tmp

wget -O node.tar.gz http://nodejs.org/dist/v0.8.11/node-v0.8.11.tar.gz

tar -xzf node.tar.gz

cd node-v0.8.11

./configure

make

make install

cd /home/dustin/PicList

sudo -u dustin npm install
