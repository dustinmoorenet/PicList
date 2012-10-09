#!/bin/sh

cd /tmp

wget -O couchdb.tar.gz 'http://apache.stu.edu.tw/couchdb/releases/1.2.0/apache-couchdb-1.2.0.tar.gz'

tar -xzf couchdb.tar.gz

cd apache-couchdb-1.2.0

./configure && make && make install
