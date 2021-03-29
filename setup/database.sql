
-- Reset previous loading of this script.
-- ----------------------------------------------------------------------------
DROP DATABASE IF EXISTS `skeletonapp`;
DROP USER IF EXISTS 'skeletonapp'@'127.0.0.1';


-- Create a new database called 'skeletonapp'.
-- ----------------------------------------------------------------------------
CREATE DATABASE skeletonapp;
USE skeletonapp;


-- Create a new database user called 'skeletonapp'.
-- ----------------------------------------------------------------------------
CREATE USER 'skeletonapp'@'127.0.0.1' IDENTIFIED BY 'REPLACE_THIS_PASS';
GRANT ALL PRIVILEGES ON `skeletonapp`.* TO 'skeletonapp'@'127.0.0.1';


-- User data table.
-- Note that BINARY(40) is the size of a bcrypt hash and may need to be 
--    changed for other hasing algorithms.
-- ----------------------------------------------------------------------------
CREATE TABLE `user` (
    id          SERIAL PRIMARY KEY, 
    username    VARCHAR(255) NOT NULL UNIQUE,
    passhash    VARCHAR(60) NOT NULL,
    joined_on   TIMESTAMP DEFAULT NOW() NOT NULL,

    is_admin    BOOLEAN DEFAULT FALSE NOT NULL
);


-- Session history table.
-- ----------------------------------------------------------------------------
-- CREATE TABLE `sessions`  (
--     user_id     BIGINT UNSIGNED NOT NULL,
--     started_on  TIMESTAMP NOT NULL,
--     ip_address  TINYTEXT NOT NULL,
--     user_agent  TINYTEXT NOT NULL,

--     FOREIGN KEY (user_id) REFERENCES user(id)
-- );


-- Stored functions and procedures
-- ----------------------------------------------------------------------------

-- -- get_user_by_name(username): userdata row
-- DELIMITER //
-- CREATE PROCEDURE get_user_by_name(username TEXT)
-- BEGIN SELECT * FROM `user` AS u WHERE u.username = username LIMIT 1; END // 
-- DELIMITER ;

-- -- get_user_by_id(id): userdata row
-- DELIMITER //
-- CREATE PROCEDURE get_user_by_id(id BIGINT UNSIGNED)
-- BEGIN SELECT * FROM `user` AS u WHERE u.id = id LIMIT 1; END // 
-- DELIMITER ;

-- -- add_user(username, passhash): id of new user
-- DELIMITER //
-- CREATE PROCEDURE add_user(name TEXT, hash BINARY(40))
-- BEGIN INSERT INTO user(username, passhash) VALUES(LCASE(name), hash); SELECT LAST_INSERT_ID() AS 'id '; END // 
-- DELIMITER ;

-- -- make_admin(userid): void
-- DELIMITER //
-- CREATE PROCEDURE make_admin(userid BIGINT UNSIGNED)
-- BEGIN UPDATE `user` SET is_admin=TRUE WHERE user.id = userid LIMIT 1; END // 
-- DELIMITER ;

-- -- remove_admin(userid): void
-- DELIMITER //
-- CREATE PROCEDURE remove_admin(userid BIGINT UNSIGNED)
-- BEGIN UPDATE `user` SET is_admin=FALSE WHERE user.id = userid LIMIT 1; END // 
-- DELIMITER ;

-- -- update_username(userid, newname)
-- DELIMITER //
-- CREATE PROCEDURE update_username(userid BIGINT UNSIGNED, newname TEXT)
-- BEGIN UPDATE `user` SET username=LCASE(newname) WHERE user.id = userid LIMIT 1; END // 
-- DELIMITER ;

-- -- update_password(userid, newpasshash)
-- DELIMITER //
-- CREATE PROCEDURE update_username(userid BIGINT UNSIGNED, newname TEXT)
-- BEGIN UPDATE `user` SET passhash=newpasshash WHERE user.id = userid LIMIT 1; END // 
-- DELIMITER ;

-- -- add_session()


-- -- delete_all_sessions()
-- DELIMITER //
-- CREATE PROCEDURE update_username(userid BIGINT UNSIGNED, newname TEXT)
-- BEGIN UPDATE `user` SET passhash=newpasshash WHERE user.id = userid LIMIT 1; END // 
-- DELIMITER ;

-- INSERT INTO user(username, passhash, is_admin) VALUES('matthijs', '8888', TRUE);
-- CALL add_user("pelle", 888);
