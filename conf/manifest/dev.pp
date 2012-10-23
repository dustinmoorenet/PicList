Exec { path => [ "/bin/", "/sbin/" , "/usr/bin/", "/usr/sbin/", "/usr/local/bin" ] }

class git_setup {
  package { 'git':
    ensure => present,
  } ->
  exec { "set_git_user":
    command => "sudo -u dustin git config --global user.name 'Dustin Moore'",
    unless => "sudo -u dustin git config --global user.name | grep -c 'Dustin Moore'",
  } ->
  exec { "set_git_email":
    command => "sudo -u dustin git config --global user.email dustin@dandamoore.com",
    unless => "sudo -u dustin git config --global user.email | grep -c dustin@dandamoore.com",
  } ->
  exec { "get_git_repo":
    command => "sudo -u dustin git clone https://github.com/dustinmoorenet/PicList.git /home/dustin/PicList",
    unless => 'test -d /home/dustin/PicList'
  }
}

# NodeJS
class nodejs {
  package { [ 
      'build-essential',
      'python',
      'libssl-dev',
      'pkg-config' ] :
    ensure => present,
    before => Exec['compile_nodejs']
  }
  
  exec { 'compile_nodejs':
    command => 'sh /home/dustin/PicList/conf/build/nodejs.sh',
    unless => 'test -f /usr/local/bin/node',
    timeout => 0
  } ->

  file { '/etc/init/http_server.conf':
    ensure => present,
    source => '/home/dustin/PicList/conf/init/http_server.conf'
  } ->
  
  file { '/etc/init.d/http_server':
    ensure => link,
    target => '/lib/init/upstart-job'
  } ->

  service { 'http_server':
    ensure => 'running',
    provider => 'upstart',
  }
}


# CouchDB
class couchdb {
  package { [
      'g++',
      'erlang-base',
      'erlang-dev',
      'erlang-eunit',
      'erlang-nox',
      'libmozjs185-dev',
      'libicu-dev',
      'libcurl4-gnutls-dev',
      'libtool',
      'curl' ] :
    ensure => present,
    before => Exec['compile_couchdb']
  }

  exec { 'compile_couchdb':
    command => 'sh /home/dustin/PicList/conf/build/couchdb.sh',
    unless => 'test -f /usr/local/bin/couchdb',
    timeout => 0
  } ->

  file { '/etc/init/couchdb.conf':
    ensure => present,
    source => '/home/dustin/PicList/conf/init/couchdb.conf'
  } ->
  
  file { '/etc/init.d/couchdb':
    ensure => link,
    target => '/lib/init/upstart-job'
  } ->

  service { 'couchdb':
    ensure => 'running',
    provider => 'upstart',
  }
}

# Init
class init {
  exec { 'build_photo_db':
    command => 'node /home/dustin/PicList/init.js',
    unless => 'test $(curl -sX GET http://localhost:5984/photos) != \'{"error":"not_found","reason":"no_db_file"}\'',
  }  
}

# ImageMagick
package { 'imagemagick':
  ensure => present
}

class { 'git_setup': } ->
class { 'nodejs': } ->
class { 'couchdb': } ->
class { 'init': }
