# Use the official PHP 8.2 FPM image as the base image
FROM php:8.2-apache

# Install Node.js and npm
RUN apt-get update && apt-get install -y nodejs npm