//import packages
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
require('dotenv').config();
// const chalk = require('chalk');
//thought this would be fun but couldn't get it to work
const util = require('util');
//server connection
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection({
  host: 'localhost',
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

});

db.connect(err => {
  if (err) throw err;
  console.log('----------------------------------');
  promptUser();
});


const query = util.promisify(db.query).bind(db);

//Inquirer prompts Module 12-24
async function promptUser() {
  const answers = await inquirer.prompt({
    name: 'makeSelection',
    type: 'list',
    message: 'What would you like to do?',
    choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', 'Quit']

  });

  //switch case Module 11-28
  switch (answers.makeSelection) {
    case 'View All Departments':
      viewDepartments();
      break;
    case 'View All Roles':
      viewRoles();
      break;
    case 'View All Employees':
      viewEmployees();
      break;
    case 'Add Department':
      addDepartment();
      break;
    case 'Add Role':
      addRole();
      break;
    case 'Add Employee':
      addEmployee();
      break;
    case 'Update Employee Role':
      updateRole();
      break;
    case 'Quit':
      quit();
      break;
  }

};

async function viewDepartments() {
  const res = await query('SELECT * FROM department');
  const allDepartments = [];
  console.log('----------------------------------');

  for (let i of res) {
    allDepartments.push({ ID: i.id, NAME: i.department_name });
  }
  console.table(allDepartments);
  promptUser();


};

async function viewRoles() {
  const res = await query('SELECT role.id, role.title, role.salary, department.department_name FROM role RIGHT JOIN department ON role.department_id = department.id');
  const allRoles = [];
  console.log('----------------------------------');

  for (let i of res) {
    allRoles.push({ ID: i.id, TITLE: i.title, SALARY: i.salary, DEPARTMENT: i.department_name });
  }
  console.table(allRoles);
  promptUser();
};

async function viewEmployees() { //this sql JOIN was a doozy but so beautiful when the  table join finally happened the way I needed them to. Also Concatenated the employee names and manager names which looks so much better.
  const res = await query("SELECT employee.id, CONCAT(employee.first_name,' ', employee.last_name) AS employee_name, role.title, department.department_name, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id");
  const allEmployees = [];
  console.log('----------------------------------');

  for (let i of res) {
    allEmployees.push({ ID: i.id, NAME: i.employee_name, ROLE: i.title, SALARY: i.salary, MANAGER: i.manager_name });
  }
  console.table(allEmployees);
  promptUser();
};

async function addDepartment() {
 
  const answer = await inquirer.prompt({
    name: 'department_name',
    type: 'input',
    message: 'What is the name of the department?',

  });

  await query('INSERT INTO department SET ?', { department_name: answer.department_name });
  console.log('Success! A new department has been added');
  promptUser();

};

async function addRole() {
  const departments = await query('SELECT * FROM department');
  const departmentChoice = departments.map(department => department.department_name);
  const answer = await inquirer.prompt([
    {
      name: 'role',
      type: 'input',
      message: 'What is the name of the role?'
    },
    {
      name: 'salary',
      type: 'input',
      message: 'What is the salary of the role?',
      validate: value => {
        if (isNaN(value) === false) return true;
        return false;
      }
    },
    {
      name: 'department_name',
      type: 'list',
      message: 'Which department does the role belong to?',
      choices: departmentChoice
    },
  ]);


  const selectedDepartment = departments.find(department => department.department_name === answer.department_name);

  const roleData = {
    title: answer.role,
    salary: answer.salary,
    department_id: selectedDepartment.id
  };
  await query('INSERT INTO role SET ?', roleData);
  console.log('Success! A new role has been added.');
  promptUser();
};

async function addEmployee() {
  const roles = await query('SELECT role.id, role.title, role.salary, department.department_name FROM role RIGHT JOIN department ON role.department_id = department.id');
  const roleChoice = roles.map(role => role.role_title);

  const managers = await query('SELECT DISTINCT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS full_name FROM employee WHERE employee.id IN (SELECT DISTINCT manager_id FROM employee WHERE manager_id IS NOT NULL)');
  const managerChoice = managers.map(manager => manager.full_name);
  console.log('managerChoice:', managerChoice);
  


  const answerRole = await inquirer.prompt([
    {
      name: 'first_name',
      type: 'input',
      message: `What is the employee's first name?`,
    },
    {
      name: 'last_name',
      type: 'input',
      message: `What is the employee's last name?`,
    },
    {
      name: 'title',
      type: 'list',
      message: `What is the employee's role?`,
      choices: roleChoice
    },
    {//This is where my application breaks. I have tried debugging but Im still getting the same error which suggests that inquirer is seeing the value as undefined. But I've console.log the managerChoice and verified that it returns the 3 managers names in a string. Not sure what else I can do to address it.
      name: 'manager',
      type: 'list',
      message: `Who is the employee's manager?`,
      choices: [{name: 'None'}, ...managerChoice],
    },

  ]);

  const selectedRole = roles.find(role => role.title === answerRole.title);
  const roleId = selectedRole.id;

  let managerId = null;
  if (answer.manager !== 'None') {
    const selectedManager = managers.find(manager => manager.full_name === answerRole.manager);
    managerId = selectedManager.id;
  }
  const employeeData = {
    first_name: answer.first_name,
    last_name: answer.last_name,
    role_id: roleId,
    manager_id: managerId
  };
  await query('INSERT INTO employee SET ?', employeeData);
  console.log('Success! The new employee ${answerRole.first_name } ${answerRole.last_name} has been added to the database.');
  promptUser();

};

async function updateRole() {
  const resEmployee = await query('SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS employeeName, employee.role_id FROM employee');
  const answerEmployee = await inquirer.prompt({
    name: 'employee',
    type: 'list',
    message: `Which employee's role would you like to update`,
    choices: () => {
      const names = [];
      for (let i of resEmployee) {
        names.push(i.employeeName);
      }
      return names;
    }


  });

  const resRole = await query('SELECT * FROM role');
  const answerRole = await inquirer.prompt({
    name: 'role',
    type: 'list',
    message: 'Which role do you want to assign the selected employee?',
    choices: () => {
      const roles = [];
      for (let i of resRole) {
        roles.push(i.title);
      }
      return roles;
    }
  });

  const selectedEmployee = resEmployee.find(employee => employee.employeeName === answerEmployee.employee);
  const employeeId = selectedEmployee.id;

  const selectedRole = resRole.find(role => role.title === answerRole.role);
  const newRoleId = selectedRole.id;

  await query('UPDATE employee SET role_id = ? WHERE id = ?', [newRoleId, employeeId]);
  console.log('Success! Employee role has been updated.');
  promptUser();


};

async function quit() {
  console.log('Goodbye');
  process.exit();
  
};


