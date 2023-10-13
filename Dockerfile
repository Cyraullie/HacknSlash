# Use the official PHP 8.2 FPM image as the base image
FROM php:8.2-apache

RUN apt-get update && apt-get install -y libpng-dev libjpeg-dev libfreetype6-dev zip unzip libzip-dev
RUN docker-php-ext-configure gd --with-freetype --with-jpeg
RUN docker-php-ext-install gd pdo pdo_mysql sockets zip fileinfo

RUN docker-php-ext-install mysqli pdo pdo_mysql sockets zip fileinfo

# Install Node.js and npm
RUN apt-get update && apt-get install -y nodejs npm