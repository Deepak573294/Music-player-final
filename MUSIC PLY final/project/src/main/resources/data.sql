-- Create tables
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS music (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert sample data
INSERT INTO users (name, email, password) VALUES
('John Doe', 'john@example.com', '$2a$10$Xt5H8kXXOGy7OTZnFXYAOeZuVZZtVKxkOLZNXDNO9Uy6Aw6Aw6Aw6'),
('Jane Smith', 'jane@example.com', '$2a$10$Xt5H8kXXOGy7OTZnFXYAOeZuVZZtVKxkOLZNXDNO9Uy6Aw6Aw6Aw6');

INSERT INTO music (title, file_path, user_id) VALUES
('Song 1', 'song1.mp3', 1),
('Song 2', 'song2.mp3', 1),
('Song 3', 'song3.mp3', 2);

