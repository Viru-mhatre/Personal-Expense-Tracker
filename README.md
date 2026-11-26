# 💰 Personal Expense Tracker 

A full-stack **Personal Expense Tracker** web application built using React.js, Spring Boot and MySQL. It helps users manage their daily income and expenses, track their financial balance and view a summary of their financial activities through an interactive dashboard.

---

## 🚀 Project Overview

**Personal Expense Tracker** is a full-stack web application designed to simplify personal financial management. Users can securely register, log in, manage transactions, monitor income and expenses, and track their financial activities through a dashboard.

The application features JWT-based authentication, transaction management, form validation and a responsive user interface.

---

## ✨ Features

### 🔐 Authentication & Security
- User Registration
- User Login
- JWT-based authentication
- Protected routes
- Secure password handling
- Login and Registration form validations
- Show/Hide password functionality
- Forgot Password functionality
- Logout functionality

### 📊 Dashboard
- Dynamic financial dashboard
- Total Income overview
- Total Expenses overview
- Available Balance calculation
- Total Transaction count
- Recent transactions
- Financial summary

### 💸 Transaction Management
- Add Income and Expense transactions
- View all transactions
- Edit existing transactions
- Delete transactions
- Transaction categories
- Transaction descriptions
- Transaction date management
- Amount validation

### 🎨 User Interface
- Responsive UI design
- Login and Registration pages
- Dashboard layout
- Navigation bar
- Form validation messages
- Interactive UI elements

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- React Router DOM
- Axios
- CSS
- SweetAlert2
- Lucide React

### Backend
- Java 17
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT (JSON Web Token)
- Maven

### Database
- MySQL

### Tools
- IntelliJ IDEA
- VS Code
- Postman
- MySQL Workbench
- Git
- GitHub

---

## 🏗️ Project Architecture

```text
Personal-Expense-Tracker/
│
├── Backend/
│   ├── src/main/java/
│   │   └── com/settribe/personal_expense_tracker/
│   │       ├── controller/
│   │       ├── dto/
│   │       ├── entity/
│   │       ├── repository/
│   │       ├── security/
│   │       ├── service/
│   │       └── ...
│   │
│   └── pom.xml
│
├── Fronted/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 📸 Application Modules

### 🔑 Login & Registration
- User account creation
- Login authentication
- Input validations
- Password visibility toggle

### 🔄 Forgot Password
- Forgot Password interface
- Password recovery workflow

### 📈 Dashboard
- Financial summary
- Income and expense overview
- Balance
- Recent transactions

### 📝 Transactions
- View transaction records
- Add new transactions
- Edit transactions
- Delete transactions

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Viru-mhatre/Personal-Expense-Tracker.git
```

```bash
cd Personal-Expense-Tracker
```

### 2. Backend Setup

Navigate to the Backend folder:

```bash
cd Backend
```

Configure your MySQL database in `application.properties`.

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/expense_tracker
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Run the Spring Boot application using IntelliJ IDEA or Maven.

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd Fronted
```

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

The application will run at:

**http://localhost:5173**

---

## 🔗 Application URLs

| Component | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8081 |
| API Base URL | http://localhost:8081/api |

---

## 🔒 Authentication

The application uses **JWT (JSON Web Token)** authentication.

- Users register and log in through the frontend.
- The backend authenticates user credentials.
- A JWT token is generated after successful authentication.
- The frontend stores the authentication token.
- Axios attaches the token to protected API requests.
- Spring Security validates the token.
- Protected routes restrict access to authenticated users.

---

## 📡 API Modules

| Module | Functionality |
|---|---|
| Authentication | Register and Login |
| Password Recovery | Forgot Password workflow |
| Transactions | CRUD operations |
| Dashboard | Financial summary |
| Security | JWT authentication and authorization |

---

## 🎯 Project Objectives

- Develop a full-stack web application.
- Implement secure authentication using JWT.
- Perform CRUD operations using Spring Boot and React.
- Integrate MySQL with Spring Data JPA.
- Build a responsive frontend using React.
- Implement REST APIs.
- Understand frontend-backend integration.
- Practice Git and GitHub version control.

---

## 🔮 Future Enhancements

- Monthly financial reports
- Expense charts and analytics
- Budget planning
- Download reports as PDF or Excel
- Category-wise expense analysis
- Notifications and reminders
- Deployment to cloud platforms

---

## 👨‍💻 Developer

**Viraj Mhatre**

BSc Information Technology | Full Stack Developer

---

## 📌 GitHub Repository

[Personal Expense Tracker][(https://github.com/Viru-mhatre/Personal-Expense-Tracker)]

---

⭐ If you find this project interesting, feel free to explore the repository!
