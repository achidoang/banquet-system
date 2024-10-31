# Banquet System

A web-based application designed for event management, including user authentication, event form submissions, and history tracking, with role-based access control.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication & Authorization**: Role-based access control using JWT (Admin, IT, User).
- **Dynamic Event Form**: Create events with multiple rundowns and jobdesks, department selection, and inline validation.
- **Event Preview**: Preview events before submitting.
- **History Management**: View past events with sorting, filtering, and pagination features.
- **Print-ready Event Details**: Generate printable versions of event details.

## Technologies

### Backend
- **Node.js** with **Express.js**
- **JWT** for authentication
- **bcrypt** for password hashing
- **Mongoose** for MongoDB integration

### Frontend
- **React.js** for the user interface
- **Context API** or **Redux** for state management

### Database
- **MongoDB** for storing users, events, rundowns, and jobdesks

### Testing
- **Jest** for unit testing

### Deployment
- Local deployment with **Docker** (optional)

## Project Structure



### Backend (Node.js)

- **Middleware**:
  - JWT-based role authentication and authorization.
  - Input validation using a custom validator.
- **Controllers**:
  - `UserController`: Manages user registration, login, update, and delete operations.
  - `EventController`: Handles event form input, preview, session saving, and database interactions.
- **Models**:
  - `User`: User schema for authentication and role management (passwords hashed with bcrypt).
  - `Event`, `Rundown`, `Jobdesk`: Schemas for managing events, rundowns, and jobdesks.
- **Routes**:
  - `User Routes`: `/login`, `/register`, `/update`, `/delete`.
  - `Event Routes`: `/create`, `/preview`, `/submit`, `/history`, `/detail`.
- **Session Management**:
  - Uses client-side sessions via LocalStorage or Cookies.

### Frontend (React.js)

- **Pages**:
  - `Login Page`: Basic login form with inline validation.
  - `Event Form Page`: Dynamic form for creating events, rundowns, and jobdesks.
  - `Preview Page`: Displays a preview of the event before submission.
  - `History Page`: Displays event history with sorting, filtering, and pagination.
  - `Detail Page`: Shows event details in a print-friendly format.
- **Components**:
  - `Input Components`: Text inputs, date picker, time picker, dropdowns for jobdesk.
  - `History Components`: Filters, pagination, and horizontal sorting pager.
  - `Preview Components`: Displays form data for preview.
- **State Management**:
  - State managed using either **Redux** or **Context API**.

### Database (MongoDB)

- **Collections**:
  - `users`: Stores user information, hashed passwords, and roles.
  - `events`: Stores event information with references to rundowns and jobdesks.
  - `rundowns`: Stores rundown details linked to events.
  - `jobdesks`: Stores jobdesk details linked to events.
- **Indexing**:
  - Indexing by `date`, `bookingBy`, and `status` for optimal query performance on the history page.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Docker](https://www.docker.com/) (optional)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/achidoang/banquet-system.git
   cd banquet-system
2. Install dependecies:
   ```bash
   cd ../frontend
   npm install
3. Set up environment variables:
   -Create a .env file in the root directory with the following fields:
   ```bash
   MONGO_URI=mongodb://localhost:27017/banquet-system
   JWT_SECRET=your_jwt_secret
4. Start the backend server:
   ```bash
   cd backend
   node src/index.js
5. Start the frontend:
   ```bash
   cd ../frontend
   npm start

### Usage
- **Backend**:
  - **Authentication**:
    - Register a user with `/register`.
    - Log in with `/login` to receive a JWT for protected routes.
  - **Event Management**:
    - Use `/create` to submit new events.
    - Preview the event with `/preview`.
    -Submit the event to the database with `/submit`.


-**Frontend**:
  - **Login**:
    - Navigate to the `/login` page and enter credentials.
  - **Create Event**:
    - Fill in the event form on `/create-event`, then preview and submit.
  - **History**:
    - View past events and use the filter, sort, and pagination features on `/history`.

## Contributing
- Contributions are welcome! Please open an issue or submit a pull request for new features or bug fixes.

### Steps to Contribute:
  1. Fork the repository.
  2. Create your feature branch: `git checkout -b feature/my-new-feature`.
  3. Commit your changes: `git commit -m 'Add some feature'`.
  4. Push to the branch: `git push origin feature/my-new-feature`.
  5. Open a pull request.


### License
- This project is licensed under the MIT License. See the LICENSE file for details.
---



   
