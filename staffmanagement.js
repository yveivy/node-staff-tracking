//import packages
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
require ('dotenv').config();
// const chalk = require('chalk');
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

async function viewEmployees() {
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
    message: 'Department Name:'
  });

  await query('INSERT INTO department SET ?', { department_name: answer.department_name });
  console.log(chalk.bold.bgCyan('New Department Added'))
  viewDepartments();

};

async function addRole() {
  const res = await query('SELECT * FROM department');
  const answer = await inquirer.prompt([
    {
      name: 'role',
      type: 'input',
      message: 'Role Name:'
    },
    {
      name: 'salary',
      input: 'input',
      message: 'Salary:',
      validate: value => {
        if (isNaN(value) === false) return true;
        return false;
      }
    },
    {
      name: 'department_name',
      input: 'list',
      message: 'Department:',
      choices: () => {
        const departments = [];
        for (let i of res) {
          departments.push(i.department_name);
        }
        return departments;
      }
    }

  ])


  let departmentId;
  for (let i of res) {
    if (i.name === answer.departments) {
      department_id = i.id;
    }
  }
  await query('INSERT INTO role SET ?', { title: answer.role, salary: answer.salary, department_id: department_id });
  console.log(chalk.bold.bgCyan('New Role Added'))
  viewRoles();
};

async function addEmployee() {
  const resRole = await query('SELECT * FROM role');
  const answerRole = await inquirer.prompt([
    {
      name: 'first_name',
      type: 'input',
      message: 'First Name:'
    },
    {
      name: 'last_name',
      input: 'input',
      message: 'Last Name:',
    },
    {
      name: 'role',
      input: 'list',
      message: 'Role:',
      choices: () => {
        const roles = [];
        for (let i of resRole) {
          departments.push(i.title);
        }
        return roles;
      }
    }

  ]);

  const resEmployee = await  query('SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name), AS employee_name, employee.role_id, employee.manager_id, FROM employee');
  const answerEmployee = await inquirer.prompt({
    
      name: 'employee',
      input: 'list',
      message: 'Manager:',
      choices: () => {
        const names = ['None'];
        for (let i of resEmployee) {
          names.push(i.employee_name);
        }
        return names;
      }
    });
    let roleId;
    for (let i of resRole) {
      if (i.title === answerRes.role) {
        roleId = i.id;
      }
    }
    let managerId;
    for (let i of resEmployee) {
      if (i.employee_name === answerEmployee.employee) {
        managerId = i.id;
      }
    }
    await query('INSERT INTO employee SET ?', { firstName: answerRole.firstName, lastName: answerRole.lastName, roleId, managerId: managerId});
    console.log(chalk.bold.bgCyan('New Employee Added.'));
    viewEmployees();

  };

  async function updateRole() {
    const resEmployee = await query('SELECT employee.id, CONCAT(employee.firstName, "" employee.lastName) AS employeeName, employee.roleId, employee.manager.Id FROM employee');
    const answerEmployee = await inquirer.prompt ({
      name: 'employee',
      input: 'list',
      message: 'Employee to Update:',
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
      input: 'list',
      message: 'New Role:',
      choices: () => {
        const roles = [];
        for (let i of resRole) {
          roles.push(i.title);
        }
        return roles;
      }

    });
    const select = await query('SELECT employee.id, CONCAT(employee.firstName, "", employee.lastName) AS employeeName, employee.roleId, role.title FROM employee INNER JOIN role ON employee.role.Id = role.id');
    let employeeId;
    for (let i of select) {
      if (i.employeeName === answerEmployee.employee) {
        employeeId = i.id;
      }
    }
    let newRoleId;
    for (let i of resRole) {
      if (i.title === answerRole.role) {
        newRoleId = i.id;
    
      }
    }
    await query('UPDATE employee SET roleId = ? WHERE id = ?', [newRoleId, employeeId]);
    console.log(chalk.bold.bgCyan('Role Was Updated'));
    viewEmployees();
  }
  

// call the prompt function to initiate questions
