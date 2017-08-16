DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    signature TEXT NOT NULL
);




INSERT INTO signatures (first_name, last_name, signature) VALUES ('Leonardo', 'DiCaprio', 'nonsense text');

INSERT INTO signatures (first_name, last_name, signature) VALUES ('Maggie', 'Wiseman', 'more nonsense text');

SELECT first_name, last_name FROM signatures;

SELECT signature FROM signatures WHERE id = 2;

SELECT COUNT(*) FROM signatures;
