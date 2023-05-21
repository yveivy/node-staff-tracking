USE employee_db;

INSERT INTO department (department_name)
VALUES ('Service'), ('Engineering'), ('Sales');

INSERT INTO role (title, salary, department_id)
VALUES ('Technician', 102000, 1),('Senior Technician', 150000, 1),('Service Coordinator', 180000, 1),('Electrical', 130000, 2),( 'Mechanical',130000, 2), ('Lead Engineer',150000, 2),('Sales Associate',120000, 3),('Sales Manager', 160000, 3)


