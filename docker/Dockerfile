# Ambiente locale che replica Plesk: Apache + PHP 8.3 + Composer.
# Serve gli stessi file generati da Astro (cartella dist/) e li esegue con PHP.
FROM php:8.3-apache

# Abilita .htaccess e i moduli usati
RUN sed -ri -e 's!AllowOverride None!AllowOverride All!g' /etc/apache2/apache2.conf \
    && a2enmod rewrite headers expires deflate

# Strumenti necessari a Composer
RUN apt-get update \
    && apt-get install -y --no-install-recommends git unzip \
    && rm -rf /var/lib/apt/lists/*

# Composer (immagine ufficiale)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Config PHP orientata allo sviluppo
RUN printf "display_errors=On\nerror_reporting=E_ALL\n" > /usr/local/etc/php/conf.d/zz-dev.ini

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

WORKDIR /var/www/html

ENTRYPOINT ["entrypoint.sh"]
CMD ["apache2-foreground"]
