# Personal Expense Tracker

A full-stack web application that helps users manage their personal income and expenses. Users can securely register, log in, track transactions, and monitor their financial activities through a dashboard.

## 🚀 Tech Stack

### Frontend
- React.js
- Vite
- React Router DOM
- Axios
- CSS

### Backend
- Java 17
- Spring Boot
- Spring Data JPA
- Hibernate
- Spring Security
- JWT Authentication

### Database
- MySQL

### Tools
- IntelliJ IDEA
- Visual Studio Code
- Postman
- Git & GitHub

## ✨ Features

### User Authentication
- User Registration
- User Login
- JWT-based Authentication
- Protected Routes
- Logout Functionality

### Transaction Management
- Add Income and Expenses
- View All Transactions
- Edit Transactions
- Delete Transactions
- Search Transactions

### Transaction Filtering
- Filter by Transaction Type
- Filter by Category
- Filter by Date Range

### Dashboard
- Display Total Balance
- Display Total Income
- Display Total Expenses
- Display Total Transactions
- Recent Transactions
- Income vs Expenses Comparison
- Expense Category Breakdown

## 📁 Project Structure

```text
Personal-Expense-Tracker/
│
├── Backend/
│   ├── src/
│   ├── pom.xml
│   └── mvnw
│
├── Fronted/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Viru-mhatre/Personal-Expense-Tracker.git
```

```bash
cd Personal-Expense-Tracker
```

### 2. Database Configuration

- Install and start MySQL Server.
- Create a database:

```sql
CREATE DATABASE expense_tracker_db;
```

### 3. Backend Setup

Open the Backend folder:

```bash
cd Backend
```

Configure your environment variables:

| Variable | Description |
|---|---|
| DB_USERNAME |
| DB_PASSWORD |
| JWT_SECRET | 


Run the Spring Boot application using IntelliJ IDEA or:

```bash
./mvnw spring-boot:run
```

Backend runs at:

```text
http://localhost:8081
```

### 4. Frontend Setup

Open a new terminal in the Fronted folder:

```bash
cd Fronted
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## 🔗 API Overview

Base URL:

```text
http://localhost:8081/api
```

### Transaction APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/transactions` | Add transaction |
| GET | `/transactions` | Get all transactions |
| GET | `/transactions/{id}` | Get transaction by ID |
| PUT | `/transactions/{id}` | Update transaction |
| DELETE | `/transactions/{id}` | Delete transaction |
| GET | `/transactions/summary` | Get transaction summary |

Transaction APIs support filtering using type, category, startDate and endDate query parameters.

## 🔐 Security

- JWT-based authentication.
- Protected frontend routes.
- Authenticated API requests.
- User-specific transaction access.
- Credentials and secret keys should be stored outside GitHub.

## 🧪 API Testing

Backend APIs were tested using Postman.

## 👨‍💻 Developer

**Viraj Mhatre**

GitHub: [Viru-mhatre](https://github.com/Viru-mhatre)

## 📌 Project Status

Core frontend and backend functionality has been implemented. Final testing and improvements are ongoing.

---

⭐ If you find this project useful, feel free to explore the repository!
