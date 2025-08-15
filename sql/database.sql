CREATE DATABASE task_helper;

-- 해당 계정에 권한 부여
GRANT ALL PRIVILEGES ON task_helper.* TO 'jsl22'@'%';

-- 권한 적용
FLUSH PRIVILEGES;

-- 권한 확인
SHOW GRANTS FOR 'jsl22'@'%';