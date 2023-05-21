USE employee_db;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Paul', 'McCartney', 1, 1),
('George', 'Harrison', 1, 1), 
('John', 'Lennon', 2, 1), 
('Ringo', 'Starr', 3, 1),
('Yoko', 'Ono', 1, NULL),
('Axl', 'Rose', 4, 2),
('Izzy','Stradlin', 4, 2), 
('Duff', 'McKagan', 5, 3), 
('Steven', 'Adler',5, 2), 
('Slash', 'Hudson', 6, NULL),
('Eddie', 'Van Halen', 7, 3), 
('Alex', 'Van Halen', 7, 3), 
('David', 'Lee Roth', 8, NULL)

-- Could not get this table to seed until I pulled it into another schema. I seed the first two tables and then I run this file.