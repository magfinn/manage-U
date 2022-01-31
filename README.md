<h1 align="center">✨Manage-U CLI Employee Tracker✨</h1>

<p>
<a href="https://opensource.org/licenses/MIT">
<img alt = "License MIT" src="https://img.shields.io/badge/license-MIT-success.svg" target="_blank" /></a>
</p>

## 📜 Description

> This is a quick and easy to use employee tracking program. Once started, the program allows you to view, add, update and delete employees, departments, managers and roles - all through the CLI! It's a simple, but powerful tool that can make managing a small/medium team fast and effective.

🔗 <a href = 'https://www.github.com/magfinn/Manage-U'>Link<a/>

## ✅ Installing / Getting Started

> ### 🧰 Requirements

> This app is run entirely through the CLI using inquirer, mysql2, console.table and express.

You’ll need to use the MySQL2 package to connect to your MySQL database and perform queries, the Inquirer package to interact with the user via the command line, and the console.table package to print MySQL rows to the console.

To get started, clone the repo:
`git clone git@github.com:magfinn/manage-U.git`

Using the node installer package, install packages needed.
`npm i inquirer mysql2 console.table express`

The employee database structure, tables and seed data are saved in 'db'.

To create the database, log in to mysql: `mysql -u [username] -p`

Enter your password

Create your database
`source db/db.sql`

Create tables for your database
`source db/schema.sql`

Seed your starting data
`source db/seeds.sql`

You can check to make sure everything worked with the MySQL commands:
`use [db]`
`show tables`
`describe [table]`
`select * from [table]`

Exit MySQL `quit`

## MySQL Demo

## <img src="./assets/images/source_db_demo.mov/>

Once your packages are installed and your database is functioning, start the program by entering in your root directory:

`npm start`

Follow prompts and exit when finished.

## Program Demo

## <img src="./assets/images/manage_U_demo.mov/>

<>

## 🚥 Tests

I tested this app with jest. To install jest, `npm i jest`

## 🤝 Contributing

## ❓ Questions?

> Have questions or need more information? Contact me by <a href='mailto:magfin@github.com'>e-mail</a>.

**Maggie Finnegan**

- Github: [@magfinn](https://github.com/magfinn)

## 📝 License

This project is [MIT](https://opensource.org/licenses/MIT) licensed.

---

\_This README was generated with ❤️ by [Quick, Read Me!](https://github.com/magfinn/Quick-README-)
