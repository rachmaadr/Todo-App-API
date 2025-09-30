# 📝 Todo API with Express, MySQL & Prisma

A simple RESTful API for managing todos, built with Express.js, MySQL, and
Prisma ORM. This project demonstrates how to set up a backend server, connect to
a MySQL database, and implement CRUD operations using Prisma.

---

## 🚀 Features

- Create, Read, Update, Delete (CRUD) todos
- Database powered by MySQL with Prisma as ORM
- Request logging with Morgan
- Security middleware with Helmet and CORS
- Error handling middleware
- Database seeding with Faker

## 🚀 Tech Stack

- [Express.js](https://expressjs.com/) - Web framework for Node.js
- [Prisma](https://www.prisma.io/) - ORM for database
- [MySQL](https://www.mysql.com/) - Relational Database
- [Faker.js](https://fakerjs.dev/) - For generate data dummy (seeding)

---

## ⚙️ Installation

Clone the repository:

```
git clone https://github.com/your-username/express-mysql-prisma-todo.git
cd express-mysql-prisma-todo
```

## Install dependencies:

```
npm install
```

---

## 🔑 Environment Variables

This project uses an .env file to store environment variables. Since .env should
never be committed, an example file is provided:

.env.example

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=todos

DATABASE_URL="mysql://root:your_password_here@localhost:3306/todos"
```

Copy it before running the project:

```
cp .env.example .env
```

---

## 🗄️ Prisma Setup

Initialize Prisma:

```
npx prisma init
```

Pull existing database schema:

```
npx prisma db pull
```

Generate Prisma client:

```
npx prisma generate
```

---

## 🌱 Database Seeding

To populate the database with fake data:

```
npx prisma db seed
```

The seed script is located in prisma/seed.js.

---

## ▶️ Running the Server

Start the server:

```
npm start
```

---

## 📌 API Endpoints

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| GET    | `/api/todos`     | Get all todos     |
| GET    | `/api/todos/:id` | Get todo by ID    |
| POST   | `/api/todos`     | Create a new todo |
| PUT    | `/api/todos/:id` | Update a todo     |
| DELETE | `/api/todos/:id` | Delete a todo     |

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to
discuss what you would like to change.
