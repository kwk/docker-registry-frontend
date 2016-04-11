#!/bin/bash

die() {
  echo "ERROR: $1"
  exit 2
}

if [ -e /etc/apache2/envvars.orig ]; then
  # On container restart we create a fresh copy of environment variables
  cp -f /etc/apache2/envvars.orig /etc/apache2/envvars
else
  # On a fresh start we save the original environment variables to the side
  cp -f /etc/apache2/envvars /etc/apache2/envvars.orig
fi

[[ -z "$ENV_DOCKER_REGISTRY_HOST" ]] && die "Missing environment variable: ENV_DOCKER_REGISTRY_HOST=url-to-your-registry" 
[[ -z "$ENV_DOCKER_REGISTRY_PORT" ]] && ENV_DOCKER_REGISTRY_PORT=80 
[[ -z "$ENV_REGISTRY_PROXY_FQDN" ]] && ENV_REGISTRY_PROXY_FQDN=$ENV_DOCKER_REGISTRY_HOST
[[ -z "$ENV_REGISTRY_PROXY_PORT" ]] && ENV_REGISTRY_PROXY_PORT=$ENV_DOCKER_REGISTRY_PORT

echo "export DOCKER_REGISTRY_HOST=$ENV_DOCKER_REGISTRY_HOST" >> /etc/apache2/envvars
echo "export DOCKER_REGISTRY_PORT=$ENV_DOCKER_REGISTRY_PORT" >> /etc/apache2/envvars
echo "export REGISTRY_PROXY_FQDN=$ENV_REGISTRY_PROXY_FQDN" >> /etc/apache2/envvars
echo "export REGISTRY_PROXY_PORT=$ENV_REGISTRY_PROXY_PORT" >> /etc/apache2/envvars

needModSsl=0
if [ -n "$ENV_DOCKER_REGISTRY_USE_SSL" ]; then
  echo "export DOCKER_REGISTRY_SCHEME=https" >> /etc/apache2/envvars
  needModSsl=1
else
  echo "export DOCKER_REGISTRY_SCHEME=http" >> /etc/apache2/envvars
fi

# docker-registry-frontend acts as a proxy so may well
# have a different hostname than the registry itself.
echo "{\"host\": \"$ENV_REGISTRY_PROXY_FQDN\", \"port\": $ENV_REGISTRY_PROXY_PORT}" > /var/www/html/registry-host.json

# information about browse mode.
[[ x$ENV_MODE_BROWSE_ONLY =~ ^x(true|false)$ ]] || ENV_MODE_BROWSE_ONLY=false
# Overwrite browse-only option for now since only browse-only is working right now
ENV_MODE_BROWSE_ONLY=true
[[ -z "$ENV_DEFAULT_REPOSITORIES_PER_PAGE" ]] && ENV_DEFAULT_REPOSITORIES_PER_PAGE=20
[[ -z "$ENV_DEFAULT_TAGS_PER_PAGE" ]] && ENV_DEFAULT_TAGS_PER_PAGE=10
echo "{\"browseOnly\":$ENV_MODE_BROWSE_ONLY, \"defaultRepositoriesPerPage\":$ENV_DEFAULT_REPOSITORIES_PER_PAGE , \"defaultTagsPerPage\":$ENV_DEFAULT_TAGS_PER_PAGE }"  > /var/www/html/app-mode.json
if [ "$ENV_MODE_BROWSE_ONLY" == "true" ]; then
  echo "export APACHE_ARGUMENTS='-D FRONTEND_BROWSE_ONLY_MODE'" >> /etc/apache2/envvars
fi

# Optionally enable Kerberos authentication and do some parameter checks
if [ -n "$ENV_AUTH_USE_KERBEROS" ]; then

  [[ -z "$ENV_AUTH_NAME" ]] && die "Missing environment variable for Kerberos: ENV_AUTH_NAME" 
  [[ -z "$ENV_AUTH_KRB5_KEYTAB" ]] && die "Missing environment variable for Kerberos: ENV_AUTH_KRB5_KEYTAB" 
  [[ -z "$ENV_AUTH_KRB_REALMS" ]] && die "Missing environment variable for Kerberos: ENV_AUTH_KRB_REALMS" 
  [[ -z "$ENV_AUTH_KRB_SERVICE_NAME" ]] && die "Missing environment variable for Kerberos: ENV_AUTH_KRB_SERVICE_NAME" 

  a2enmod auth_kerb 

  echo "export USE_KERBEROS_AUTH=$ENV_AUTH_USE_KERBEROS" >> /etc/apache2/envvars
  echo "export AUTH_NAME=\"$ENV_AUTH_NAME\"" >> /etc/apache2/envvars
  echo "export AUTH_KRB5_KEYTAB=$ENV_AUTH_KRB5_KEYTAB" >> /etc/apache2/envvars
  echo "export AUTH_KRB_REALMS=$ENV_AUTH_KRB_REALMS" >> /etc/apache2/envvars
  echo "export AUTH_KRB_SERVICE_NAME=$ENV_AUTH_KRB_SERVICE_NAME" >> /etc/apache2/envvars
else
  a2dismod auth_kerb
fi

# Optionally enable SSL
if [ -n "$ENV_USE_SSL" ]; then
  useSsl="-D USE_SSL"

  [[ ! -e /etc/apache2/server.crt ]] && die "/etc/apache2/server.crt is missing"
  [[ ! -e /etc/apache2/server.key ]] && die "/etc/apache2/server.key is missing"
  needModSsl=1
fi

if [ $needModSsl -ne 0 ]; then
  a2enmod ssl 
else
  a2dismod ssl
fi

# Enable mod_rewrite
a2enmod rewrite

# Stop apache first if is still running from the last time the container was run
service apache2 stop

/usr/sbin/apache2ctl -D FOREGROUND ${useSsl}
