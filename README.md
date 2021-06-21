# PM2

sudo npm install pm2 -g
sudo pm2 install typescript
pm2 start law_office_server.json

## monitoring
pm2 monit
## list
pm2 list
## delete
pm2 delete {appName}
## delete all
pm2 delete all

## mariadb docker running
```
  docker run --name mariadb -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root_pssword -e MYSQL_DATABASE=law_office -e MYSQL_USER=lawOffice_server -e MYSQL_PASSWORD=testpassword -d mariadb:latest --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci 
  docker exec -it mariadb /bin/bash
```

## test database create sql
```
  CREATE DATABASE lawoffice_testdb DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
  CREATE USER 'lawoffice_test'@'%' IDENTIFIED BY '1q2w3e4r!@';
  GRANT ALL PRIVILEGES ON lawoffice_testdb.* TO 'lawoffice_test'@'%';
```