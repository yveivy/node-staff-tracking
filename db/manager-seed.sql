USE employee_db;

-- Then had to do an update to assign managers because it was seeding the manager_id simultaneously with the employee_id and some didn't exist at the same time.


UPDATE employee SET manager_id = 5 WHERE first_name IN ('Paul', 'George', 'John', 'Ringo');

UPDATE employee SET manager_id = 10 WHERE first_name IN ('Axl', 'Izzy', 'Duff', 'Steven');

UPDATE employee SET manager_id = 13 WHERE first_name IN ('Eddie', 'Alex')