CREATE TABLE IF NOT EXISTS idanDB.users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role varchar(255) not null
);

CREATE TABLE IF NOT EXISTS idanDB.products (
    makat VARCHAR(255) NOT NULL,
    product_line VARCHAR(1) NOT NULL,
    open_date DATE NOT NULL,
    item_description VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL,
    cat VARCHAR(255) NOT NULL,
    rep_act VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS idanDB.researches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    manager_username VARCHAR(255) NOT NULL,
    research_name varchar(255) not null,
    users VARCHAR(255) NOT NULL,
    open_date date NOT NULL,
    dest_date DATE NOT NULL,
    makat VARCHAR(255) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    conclusions varchar(2000)
);

CREATE TABLE IF NOT EXISTS idanDB.applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    makat varchar(255) not null,
    research_name varchar(255) not null,
    is_success TINYINT,
    price int,
    open_date date not null
);

CREATE TABLE IF NOT EXISTS idanDB.tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    research_name varchar(255) not null,
    task_name varchar(255) not null,
    dest_date date not null,
    conclusions varchar(2550),
    status varchar(255) not null -- in process / done / need_...
);

LOAD DATA INFILE '/var/lib/mysql-files/products.csv'
INTO TABLE idanDB.products
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(product_line, @open_date, item_description,
 makat, code, cat, rep_act) SET open_date = STR_TO_DATE(@open_date, '%d/%m/%Y');


LOAD DATA INFILE '/var/lib/mysql-files/users.csv'
INTO TABLE idanDB.users
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(username, email, password, first_name, last_name, role);