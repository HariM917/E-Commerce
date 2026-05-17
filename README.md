# Full-Stack E-Commerce Platform

A complete, end-to-end e-commerce web application built using the MERN stack. This project features secure user authentication, a dynamic product catalog, a shopping cart, and a custom data pipeline that seeds real-world products from an Amazon dataset into the database.

## 🚀 Key Features
- **Secure Authentication**: User login and registration using JSON Web Tokens (JWT) and bcrypt.
- **Product Catalog**: Dynamic product listings and detailed view pages loaded from a MongoDB database.
- **Shopping Cart**: Seamless cart management for adding/removing items before checkout.
- **User & Admin Dashboards**: Personalized dashboards for managing orders and user state.
- **Data Seeding Script**: Automated backend script (`seed.js`) to parse massive CSV files and populate the database with real Amazon product data.

## 🛠️ Tech Stack
- **Frontend**: React.js, Vite, React Router, plain CSS, Lucide React icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB & Mongoose.
- **Tools**: Axios for API calls, `csv-parser` for data ingestion, dotenv for environment variable management.

## 📦 Getting Started

### Prerequisites
- Node.js installed on your machine
- MongoDB instance (local or Atlas)

### Installation
1. Clone the repository.
2. Install dependencies for the backend:
   ```bash
   cd backend
   npm install
   ```
3. Install dependencies for the frontend:
   ```bash
   cd ../frontend
   npm install
   ```
4. Create a `.env` file in the `backend` directory with your MongoDB URI and JWT Secret:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
5. Seed the database with products:
   ```bash
   cd backend
   node seed.js
   ```
6. Start the development servers:
   - Backend: `npm start` (inside the `backend` directory)
   - Frontend: `npm run dev` (inside the `frontend` directory)