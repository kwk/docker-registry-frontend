#!/bin/bash

die() {
  echo "ERROR: $1"
  exit 2
}

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

# Build the JSON file which is read by JS to retrieve
# information about how to contact the registry.
# docker-registry-frontend acts as a proxy so may well
# have a different hostname than the registry itself.
echo "{\"host\": \"$ENV_REGISTRY_PROXY_FQDN\", \"port\": $ENV_REGISTRY_PROXY_PORT}" > /var/www/html/registry-host.json

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

/usr/sbin/apache2ctl -D FOREGROUND ${useSsl}
