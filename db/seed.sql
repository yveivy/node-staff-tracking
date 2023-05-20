USE employee_db;

INSERT INTO department (name)
VALUES ('Service'), ('Engineering'), ('Sales');

INSERT INTO role (title, salary, department_id)
VALUES ('Technician', 102000, 1),('Senior Technician', 150000, 1),('Service Coordinator', 180000, 1),('Electrical', 130000, 2),( 'Mechanical',130000, 2), ('Lead Engineer',150000, 2),('Sales Associate',120000, 3),('Sales Manager', 160000, 3)

INSERT INTO employee (first_name, last_name, role_id)
VALUES ('Paul', 'McCartney', 1), ('George', 'Harrison', 1), ('John', 'Lennon', 2), ('Ringo', 'Starr', 3), ('Axl', 'Rose', 4), ('Izzy','Stradlin', 4), ('Duff', 'McKagan', 5), ('Steven', 'Adler', 5), ('Eddie', 'Van Halen', 7), ('Alex', 'Van Halen', 7)

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Yoko', 'Ono', 3, 1),('Slash', 'Hudson', 6, 2), ('David', 'Lee Roth', 8, 3);