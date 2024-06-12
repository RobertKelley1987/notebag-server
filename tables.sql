CREATE TABLE users (
    user_id varchar(36) PRIMARY KEY,
    email varchar(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL
);


CREATE TABLE notes (
    note_id varchar(36) NOT NULL UNIQUE PRIMARY KEY,
    title varchar(255),
    content TEXT,
    position INT UNSIGNED default 0,
    user_id varchar(36) NOT NULL,
    updated_at DATETIME DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
    created_at timestamp DEFAULT current_timestamp,
    foreign key(user_id) references users(user_id)
)