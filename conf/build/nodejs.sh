#!/bin/sh

cd /tmp

wget -O node.tar.gz http://nodejs.org/dist/v0.10.12/node-v0.10.12.tar.gz

tar -xzf node.tar.gz

cd node-v0.10.12

./configure

make

make install

cd /home/dustin/PicList

sudo -u dustin npm install
