#!/bin/bash
# run: sudo sh ./dev.sh

# upgrade all packages
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get -y upgrade
 
# install PuppetLabs repo
wget http://apt.puppetlabs.com/puppetlabs-release-precise.deb
dpkg -i puppetlabs-release-precise.deb
 
# Install puppet
apt-get -y install puppet

# Clean up
export DEBIAN_FRONTEND=dialog
