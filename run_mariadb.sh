docker run --name mariadb -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root_password -e MYSQL_DATABASE=law_office -e MYSQL_USER=lawOffice_server -e MYSQL_PASSWORD=testpassword -d mariadb:latest --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci 
docker run --name mariadb -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=mariadb mariadb
docker exec -it mariadb /bin/bash

lawOffice_server:testpassword

CREATE DATABASE lawoffice_testdb DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
CREATE USER 'lawoffice_test'@'%' IDENTIFIED BY '1q2w3e4r!@';
GRANT ALL PRIVILEGES ON lawoffice_testdb.* TO 'lawoffice_test'@'%';