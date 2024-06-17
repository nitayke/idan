FROM container-registry.oracle.com/mysql/community-server:latest

ENV MYSQL_PORT=3306
ENV MYSQL_DATABASE=idanDB
ENV MYSQL_ROOT_HOST="%"
ENV MYSQL_ROOT_PASSWORD=pass

COPY tasks.csv /var/lib/mysql-files/
COPY users.csv /var/lib/mysql-files/
COPY init.sql /docker-entrypoint-initdb.d/

EXPOSE $MYSQL_PORT