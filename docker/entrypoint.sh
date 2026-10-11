#!/bin/sh
set -e

# Installa le dipendenze PHP (PHPMailer) al primo avvio, se mancanti.
if [ -f /var/www/html/api/composer.json ] && [ ! -d /var/www/html/api/vendor ]; then
  echo "→ Installazione dipendenze PHP (PHPMailer) con composer…"
  composer install --no-interaction --no-dev --working-dir=/var/www/html/api
fi

exec "$@"
