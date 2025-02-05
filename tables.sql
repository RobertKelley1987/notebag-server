/* CODE USED TO CREATE DB IN MYSQL. FOR REFERENCE ONLY. */
/* ADDITIONAL REFERENCE FOR TAG ARCHITECTURE: 
http://howto.philippkeller.com/2005/04/24/Tags-Database-schemas/ */

CREATE TABLE users (
    user_id varchar(36) PRIMARY KEY,
    email varchar(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    refresh_token varchar(255)
);

CREATE TABLE notes (
    note_id varchar(36) PRIMARY KEY,
    title varchar(255),
    content TEXT,
    position INT UNSIGNED default 0,
    user_id varchar(36) NOT NULL,
    updated_at timestamp DEFAULT current_timestamp ON UPDATE CURRENT_TIMESTAMP,
    created_at timestamp DEFAULT current_timestamp,
    pinned BOOLEAN DEFAULT FALSE,
    pinned_at timestamp DEFAULT NULL,
    foreign key(user_id) references users(user_id) ON DELETE CASCADE
);

CREATE TABLE tags (
    tag_id varchar(36) PRIMARY KEY,
    name varchar(255) NOT NULL
);

CREATE TABLE user_tags (
    user_tag_id varchar(36) PRIMARY KEY,
    user_id varchar(36) NOT NULL,
    tag_id varchar(36) NOT NULL,
    FOREIGN KEY(user_id) references users(user_id) ON DELETE CASCADE,
    FOREIGN KEY(tag_id) references tags(tag_id) ON DELETE CASCADE
);

CREATE TABLE note_tags (
    note_tag_id varchar(36) PRIMARY KEY,
    note_id varchar(36) NOT NULL,
    tag_id varchar(36) NOT NULL,
    FOREIGN KEY(note_id) references notes(note_id) ON DELETE CASCADE,
    FOREIGN KEY(tag_id) references tags(tag_id) ON DELETE CASCADE
);