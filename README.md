# Survey App

A full-stack survey application that allows users to create surveys, vote, and view survey results.

## Tech Stack

### Backend

* Java 21
* Spring Boot
* Spring Data JPA / Hibernate
* Spring Security
* JWT Authentication
* PostgreSQL
* Maven

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* Recharts

## Features

* User registration and login
* JWT-based authentication and authorization
* Survey creation and management
* Survey voting
* Survey result visualization
* Admin functionality
* RESTful API architecture
* Relational data persistence with PostgreSQL and JPA

## Project Structure

```text
survey-app/
├── backend/     # Spring Boot REST API
└── frontend/    # React frontend
```

## Backend

The backend is built with Spring Boot and follows a layered architecture with controllers, services, repositories, DTOs, and JPA entities.

Spring Data JPA and Hibernate are used for persistence, while Spring Security and JWT are used for authentication and authorization.

## Frontend

The frontend is built with React and Vite, with Tailwind CSS for styling and Recharts for data visualization.
