#!/bin/bash

die() {
  echo "ERROR: $1"
  exit 2
}

mod_activate_deactivate() {
  mod_name=$1;
  en_en=$2;
  httpd_path="/etc/httpd"
  conf_path="${httpd_path}/conf.d"
  conf_modules_path="${httpd_path}/conf.modules.d"

  case ${mod_name} in
    SSL)
      mod_file1="${conf_path}/ssl.conf";
      mod_file1_back="${mod_file1}.back"
      mod_file2="${conf_modules_path}/00-ssl.conf"
      mod_file2_back="${mod_file2}.back"
      if [ ${en_en} -eq 0 ]; then
        mv ${mod_file1} ${mod_file1_back};
        mv ${mod_file2} ${mod_file2_back};
      else
        mv ${mod_file1_back} ${mod_file1};
        mv ${mod_file2_back} ${mod_file2};
      fi
    ;;
    KERB)
      mod_file1="${conf_modules_path}/10-auth_kerb.conf";
      mod_file1_back="${mod_file1}.back"

      if [ ${en_en} -eq 0 ]; then
        mv ${mod_file1} ${mod_file1_back};
      else
        mv ${mod_file1_back} ${mod_file1};
      fi
    ;;
  esac
}

for item in SSL KERB; do
  mod_activate_deactivate ${item} 0;
done

[[ -z "$ENV_DOCKER_REGISTRY_HOST" ]] && die "Missing environment variable: ENV_DOCKER_REGISTRY_HOST=url-to-your-registry"
[[ -z "$ENV_DOCKER_REGISTRY_PORT" ]] && ENV_DOCKER_REGISTRY_PORT=80
[[ -z "$ENV_REGISTRY_PROXY_FQDN" ]] && ENV_REGISTRY_PROXY_FQDN=$ENV_DOCKER_REGISTRY_HOST
[[ -z "$ENV_REGISTRY_PROXY_PORT" ]] && ENV_REGISTRY_PROXY_PORT=$ENV_DOCKER_REGISTRY_PORT

export DOCKER_REGISTRY_HOST=$ENV_DOCKER_REGISTRY_HOST
export DOCKER_REGISTRY_PORT=$ENV_DOCKER_REGISTRY_PORT
export REGISTRY_PROXY_FQDN=$ENV_REGISTRY_PROXY_FQDN
export REGISTRY_PROXY_PORT=$ENV_REGISTRY_PROXY_PORT

needModSsl=0
if [ -n "$ENV_DOCKER_REGISTRY_USE_SSL" ]; then
  export DOCKER_REGISTRY_SCHEME=https
  needModSsl=1
else
  export DOCKER_REGISTRY_SCHEME=http
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
  export APACHE_ARGUMENTS='-D FRONTEND_BROWSE_ONLY_MODE'
fi

# Optionally enable Kerberos authentication and do some parameter checks
if [ -n "$ENV_AUTH_USE_KERBEROS" ]; then

  [[ -z "$ENV_AUTH_NAME" ]] && die "Missing environment variable for Kerberos: ENV_AUTH_NAME"
  [[ -z "$ENV_AUTH_KRB5_KEYTAB" ]] && die "Missing environment variable for Kerberos: ENV_AUTH_KRB5_KEYTAB"
  [[ -z "$ENV_AUTH_KRB_REALMS" ]] && die "Missing environment variable for Kerberos: ENV_AUTH_KRB_REALMS"
  [[ -z "$ENV_AUTH_KRB_SERVICE_NAME" ]] && die "Missing environment variable for Kerberos: ENV_AUTH_KRB_SERVICE_NAME"

  mod_activate_deactivate KERB 1;
  export USE_KERBEROS_AUTH=$ENV_AUTH_USE_KERBEROS
  export AUTH_NAME=\"$ENV_AUTH_NAME\"
  export AUTH_KRB5_KEYTAB=$ENV_AUTH_KRB5_KEYTAB
  export AUTH_KRB_REALMS=$ENV_AUTH_KRB_REALMS
  export AUTH_KRB_SERVICE_NAME=$ENV_AUTH_KRB_SERVICE_NAME
fi

# Optionally enable SSL
if [ -n "$ENV_USE_SSL" ]; then
  useSsl="-D USE_SSL"

  [[ ! -e /etc/apache2/server.crt ]] && die "/etc/apache2/server.crt is missing"
  [[ ! -e /etc/apache2/server.key ]] && die "/etc/apache2/server.key is missing"
  needModSsl=1
fi

if [ $needModSsl -ne 0 ]; then
  mod_activate_deactivate SSL 1;
fi

exec /usr/sbin/httpd -D FOREGROUND ${useSsl}
