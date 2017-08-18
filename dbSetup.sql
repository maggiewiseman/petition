DROP TABLE IF EXISTS signatures;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE signatures (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    signature TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



--INSERT INTO users (first_name, last_name, email, password) VALUES ('Leo', 'Dicap', 'leo@gmail', 'rose');

--INSERT INTO users (first_name, last_name, email, password) VALUES ('Maggie', 'Wiseman', 'mw@gmail', '$2a$10$uC5KEwHDIUBkEqoBy8BLqO2X0i7hcFdbBGRI4r545Kg21FDAvnwhO');


--INSERT INTO signatures (user_id, first_name, last_name, signature) VALUES ('1', 'Leonardo', 'DiCaprio', 'nonsense text');

--INSERT INTO signatures (user_id, first_name, last_name, signature) VALUES ('2', 'Maggie', 'Wiseman', 'more nonsense text');

--SELECT signature FROM signatures WHERE user_id = 1;
--SELECT password FROM users WHERE email = 'leo@gmail';

--SELECT id, first_name, last_name, password FROM users WHERE email = 'leo@gmail';

--SELECT id FROM signatures WHERE user_id = 25;


--SELECT first_name, last_name FROM signatures;

--

--SELECT COUNT(*) FROM signatures;
