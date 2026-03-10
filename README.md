# Bristar E-commerce Platform

Full-stack e-commerce web application built with **React, Node.js, and MongoDB**.

This project demonstrates a modern web architecture with a React frontend and a Node.js/Express backend API.

## Features

* Product catalog with category filtering
* Admin dashboard for product management
* RESTful API for product data
* Image upload with AWS S3
* Authentication for admin access
* Responsive UI design

## Tech Stack

Frontend

* React
* JavaScript
* CSS / UI components

Backend

* Node.js
* Express
* MongoDB
* Mongoose

Cloud / Services

* AWS S3 for image storage

## Project Structure

```
bristar
├── react-app      # React frontend
├── server         # Node.js / Express backend
```

## Installation

### 1. Clone the repository

```
git clone https://github.com/Shengyi-Zhang/bristar.git
cd bristar
```

### 2. Install dependencies

Frontend

```
cd react-app
npm install
```

Backend

```
cd server
npm install
```

### 3. Start the development server

Backend

```
npm run dev
```

Frontend

```
npm start
```

## API Overview

Example endpoint:

```
GET /api/products
```

Returns product list stored in MongoDB.

## Author

Shengyi Zhang
Full Stack Developer
