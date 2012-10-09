package { 'git':
  ensure => '1:1.7.9.5-1',
}

exec { "set_git_user":
    command => "/usr/bin/git config --global user.name 'Dustin Moore'",
    unless => "/usr/bin/git config --global user.name | grep -c 'Dustin Moore'",
}

exec { "set_git_email":
    command => "/usr/bin/git config --global user.email dustin@dandamoore.com",
    unless => "/usr/bin/git config --global user.email | grep -c dustin@dandamoore.com",
}
