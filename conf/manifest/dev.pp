Exec { path => [ "/bin/", "/sbin/" , "/usr/bin/", "/usr/sbin/" ] }

package { 'git':
  ensure => '1:1.7.9.5-1',
}

exec { "set_git_user":
  command => "sudo -u dustin git config --global user.name 'Dustin Moore'",
  unless => "sudo -u dustin git config --global user.name | grep -c 'Dustin Moore'",
}

exec { "set_git_email":
  command => "sudo -u dustin git config --global user.email dustin@dandamoore.com",
  unless => "sudo -u dustin git config --global user.email | grep -c dustin@dandamoore.com",
}

exec { "get_git_repo":
  command => "sudo -u dustin git clone https://github.com/dustinmoorenet/PicList.git /home/dustin/PicList",
  unless => 'test -d /home/dustin/PicList'
}

# NodeJS
package { [ 'build-essential',
            'python',
            'libssl-dev',
            'pkg-config' ] :
  ensure => present
}

exec { 'compile_nodejs':
  command => 'sh /home/dustin/PicList/conf/build/nodejs.sh',
  unless => 'test -f /usr/local/bin/node'
}

# CouchDB
package { [ 'g++',
          'erlang-base',
          'erlang-dev',
          'erlang-eunit',
          'erlang-nox',
          'libmozjs185-dev',
          'libicu-dev',
          'libcurl4-gnutls-dev',
          'libtool',
          'curl' ] :
  ensure => present
}

exec { 'compile_couchdb':
  command => 'sh /home/dustin/PicList/conf/build/couchdb.sh',
  unless => 'test -f /usr/local/bin/couchdb'
}
