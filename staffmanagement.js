const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const chalk = require('chalk');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL Username
    user: 'root',
    // TODO: Add MySQL Password
    password: '',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)
);
//STARTER CODE Module 12-24


// Query database using COUNT() and GROUP BY
db.query('SELECT COUNT(id) AS total_count FROM favorite_books GROUP BY in_stock', function (err, results) {
  console.log(results);
});

// Query database using SUM(), MAX(), MIN() AVG() and GROUP BY
db.query('SELECT SUM(quantity) AS total_in_section, MAX(quantity) AS max_quantity, MIN(quantity) AS min_quantity, AVG(quantity) AS avg_quantity FROM favorite_books GROUP BY section', function (err, results) {
  console.log(results);
});

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

inquirer
.prompt ([
    {
        type: 'list',
        name: 'shape',
        message: 'How would you like your logo to take shape?',
        choices: ['Triangle', 'Square', 'Circle'],
      },
      {
        type: 'input',
        name: 'textColor',
        message: 'Please enter a color OR hexadecimal code for the text color of your logo.',
      },
      {
        type: 'input',
        name: 'shapeColor',
        message: 'Please enter a color OR hexadecimal code for the background color of your logo.',
      },
      {
        type: 'input',
        name: 'text',
        message: 'Please provide 3 characters you would like to display on your logo.',
      },
])
// catch to make sure user doesn't enter too many characters
.then((answers) => {
    if (answers.text.length > 3) {
        console.log("Must enter a value of no more than 3 characters");
    }else {
        writeToFile("logo.svg", answers);
    }
});

// call the prompt function to initiate questions
promptUser();
