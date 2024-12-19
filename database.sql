CREATE TABLE users(
    id INT PRIMARY KEY AUTO_INCREMENT,
    fullname VARCHAR(100) DEFAULT '',
    phone_number VARCHAR(10) NOT NULL,
    address VARCHAR(100) DEFAULT '',
    password VARCHAR(100) NOT NULL DEFAULT '',
    create_at DATETIME,
    update_at DATETIME,
    is_active TINYINT(1) DEFAULT 1,
    date_of_birth DATE,
    facebook_account_id INT DEFAULT 0,
    google_account_id INT DEFAULT 0
);
CREATE TABLE tokens(
    id int PRIMARY KEY AUTO_INCREMENT,
    token VARCHAR(255) UNIQUE NOT NULL,
    token_type VARCHAR(50) NOT NULL,
    expiration_date DATETIME,
    revoked TINYINT(1) NOT NULL,
    expired TINYINT(1) NOT NULL,
    user_id INT,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE TABLE social_accounts(
    
);
CREATE TABLE blogs(
	id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) DEFAULT '' NOT NULL,
    content LONGTEXT DEFAULT '' NOT NULL,
    create_at DATETIME,
    update_at DATETIME,
    user_id int,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE customers(
    id INT PRIMARY KEY AUTO_INCREMENT,
    fullname VARCHAR(100) DEFAULT '',
    phone_number VARCHAR(10) NOT NULL,
    email VARCHAR(100) DEFAULT '',
    address VARCHAR(100) DEFAULT '',
    create_at DATETIME,
    update_at DATETIME,
);

CREATE TABLE orders_in_counter(
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id int,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    address VARCHAR(200) NOT NULL,
    note VARCHAR(100) DEFAULT '',
    purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_money FLOAT CHECK(total_money >= 0)
);

CREATE TABLE orders_in_counter_details (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_counter_id INT,
    FOREIGN KEY (order_counter_id) REFERENCES orders_in_counter(id),
    product_id INT,
    FOREIGN KEY (product_id) REFERENCES products (id),
    price FLOAT CHECK(price >= 0),
    number_of_products INT CHECK(number_of_products > 0),
    total_money FLOAT CHECK(total_money >= 0)
);

CREATE TABLE likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    comment_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
);

ALTER TABLE comments ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
ALTER TABLE comments ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

"user_id": 11,
  	"content": "You look like a fuking bitch",
  	"likes": 0,
  	"parent_id": 0,
  	"product_id": 15008

CREATE TABLE raw_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    price FLOAT NOT NULL,
    note VARCHAR(500) DEFAULT '',
    provider_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES providers(id)
);

ALTER TABLE export_transaction_document_details
ADD COLUMN transaction_document_id INT;

ALTER TABLE export_transaction_document_details
ADD CONSTRAINT fk_transaction_document_id
FOREIGN KEY (transaction_document_id) REFERENCES transaction_documents(id)
ON DELETE CASCADE;

CREATE TABLE stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(10) NOT NULL,
    address VARCHAR(200) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transaction_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    user_id INT NOT NULL,
    total_products INT NOT NULL,
    type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE transaction_document_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    raw_product_name VARCHAR(200),
    quantity INT NOT NULL,
    price FLOAT NOT NULL,
    transaction_document_id INT;
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    provider_id INT NOT NULL,
    FOREIGN KEY (provider_id) REFERENCES providers(id),
    FOREIGN KEY (transaction_document_id) REFERENCES transaction_documents(id) ON DELETE CASCADE
);

CREATE TABLE export_transaction_document_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    raw_product_name VARCHAR(200),
    quantity INT NOT NULL,
    price FLOAT NOT NULL,
    transaction_document_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    store_id INT NOT NULL,
    FOREIGN KEY (store_id) REFERENCES stores(id),
    FOREIGN KEY (transaction_document_id) REFERENCES transaction_documents(id) ON DELETE CASCADE
);