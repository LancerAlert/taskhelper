CREATE TABLE role (
	role_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(20) NOT NULL UNIQUE
);

INSERT INTO role (role_name) VALUES
('REQUESTER'), ('HELPER'), ('ADMIN');

CREATE TABLE image (
	image_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    image_name VARCHAR(50) NOT NULL,
    image_hash VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 나중에 default hash update
INSERT INTO image (image_name, image_hash) VALUES ('default.png', 'default');

CREATE TABLE user (
	user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_id BIGINT NOT NULL DEFAULT 1,
    image_id BIGINT NOT NULL DEFAULT 1,
    login_type VARCHAR(20) NOT NULL DEFAULT 'LOCAL',
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    description TEXT,
    address VARCHAR(100),
	gender CHAR(1) NOT NULL CHECK(gender IN ('M','F')),
    birth_date DATE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES role(role_id),
    CONSTRAINT fk_user_image FOREIGN KEY (image_id) REFERENCES image(image_id)
);

CREATE INDEX idx_user_active ON user(is_active);

CREATE TABLE category (
	category_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(20) NOT NULL
);

INSERT INTO category(category_name) VALUES
('SHOPPING'), ('CLEANING'), ('DELIVERY'), ('PETCARE'), ('REPAIR'), ('OTHERS');

CREATE TABLE task (
	task_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    requester_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    address VARCHAR(100),
    price INT NOT NULL,
    task_date DATE NOT NULL,
    task_time VARCHAR(20) NOT NULL CHECK(task_time IN('MORNING', 'AFTERNOON', 'EVENING', 'ANYTIME')),
    status VARCHAR(20) NOT NULL CHECK(status IN('RECRUITING', 'INPROGRESS', 'COMPLETED', 'CANCELLED')),
    view_count INT DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at DATETIME,
    
    CONSTRAINT fk_task_requester FOREIGN KEY (requester_id) REFERENCES user(user_id),
    CONSTRAINT fk_task_category FOREIGN KEY (category_id) REFERENCES category(category_id)
);

CREATE INDEX idx_task_status ON task(status);
CREATE INDEX idx_task_category_status ON task(category_id, status);
CREATE INDEX idx_task_date ON task(task_date);

CREATE TABLE review (
	review_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    task_id BIGINT NOT NULL,
    reviewer_id BIGINT NOT NULL,
    reviewee_id BIGINT NOT NULL,
    score INT NOT NULL CHECK (score BETWEEN 1 AND 5),
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_review_task FOREIGN KEY (task_id) REFERENCES task(task_id),
    CONSTRAINT fk_review_reviewer FOREIGN KEY (reviewer_id) REFERENCES user(user_id),
    CONSTRAINT fk_review_reviewee FOREIGN KEY (reviewee_id) REFERENCES user(user_id),
    CONSTRAINT uk_review UNIQUE (task_id, reviewer_id, reviewee_id),
    CONSTRAINT ck_no_self_review CHECK (reviewer_id != reviewee_id)
);

CREATE INDEX idx_review_reviewee ON review(reviewee_id);
CREATE INDEX idx_review_task ON review(task_id);

CREATE TABLE task_image (
	task_image_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    task_id BIGINT NOT NULL,
    image_id BIGINT NOT NULL,
    original_name VARCHAR(50) NOT NULL,
    orders INT NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_ti_task FOREIGN KEY (task_id) REFERENCES task(task_id),
    CONSTRAINT fk_ti_image FOREIGN KEY (image_id) REFERENCES image(image_id),
    CONSTRAINT uk_ti_image UNIQUE (task_id, image_id)
);

CREATE INDEX idx_task_image_orders ON task_image (task_id, orders);

CREATE TABLE task_application (
	task_application_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    task_id BIGINT NOT NULL,
    helper_id BIGINT NOT NULL,
    message TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN')),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_ta_task FOREIGN KEY (task_id) REFERENCES task(task_id),
    CONSTRAINT fk_ta_helper FOREIGN KEY (helper_id) REFERENCES user(user_id),
    CONSTRAINT uk_ta_helper UNIQUE (task_id, helper_id)
);

CREATE INDEX idx_ta_status ON task_application(status);
CREATE INDEX idx_ta_task_status ON task_application(task_id, status);
CREATE INDEX idx_ta_helper_status ON task_application(helper_id, status);

CREATE TABLE options (
	option_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    option_name VARCHAR(50) UNIQUE  NOT NULL,
    description TEXT NOT NULL
);

INSERT INTO options (option_name, description) VALUES
('URGENT', '緊急対応が必要'), 
('PHOTO_REQUIRED', '写真撮影が必要'), 
('HEAVY_LIFTING','重い荷物の運搬あり'), 
('PET_FRIENDLY', 'ペット対応可能');

CREATE TABLE task_options (
	task_id BIGINT NOT NULL,
    option_id BIGINT NOT NULL,
    
    PRIMARY KEY (task_id, option_id),
    CONSTRAINT fk_to_task FOREIGN KEY (task_id) REFERENCES task(task_id),
    CONSTRAINT fk_to_options FOREIGN KEY (option_id) REFERENCES options(option_id),
    CONSTRAINT uk_task_option UNIQUE(task_id, option_id)
);

CREATE TABLE question (
	question_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    task_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_question_task FOREIGN KEY (task_id) REFERENCES task(task_id),
    CONSTRAINT fk_question_user FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE INDEX idx_question_task ON question(task_id);

CREATE TABLE answer (
	answer_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    parent_id BIGINT,
    content TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_answer_user FOREIGN KEY (user_id) REFERENCES user(user_id),
    CONSTRAINT fk_answer_question FOREIGN KEY (question_id) REFERENCES question(question_id),
    CONSTRAINT fk_answer_parent FOREIGN KEY (parent_id) REFERENCES answer(answer_id)
);

CREATE INDEX idx_answer_question ON answer(question_id);
CREATE INDEX idx_answer_user ON answer(user_id);
CREATE INDEX idx_answer_parent ON answer(parent_id);