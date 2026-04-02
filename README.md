# Asset Tracker

A modern, full-stack web application designed to efficiently track and manage company assets, categories, and employee assignments. Built with a robust architecture using Next.js for the frontend and NestJS for the backend.

## Features

- **Interactive Dashboard:** Overview of total assets, available vs. assigned status, and employee metrics.
- **Asset Management:** Full CRUD operations for company resources (Laptops, Monitors, Furniture, etc.).
- **Employee Assignment:** Seamlessly track which employee is holding which asset.

## Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites
- Node.js (v18 or higher)
- A Neon PostgreSQL database URL

### Backend Setup

1. Clone the repository and navigate to the backend folder:
   ```bash
   git clone https://github.com/thyuhtooaung-dev/Assets-Tracker.git
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your Neon database URL:
   ```env
   DATABASE_URL="postgresql://<user>:<password>@<neon-hostname>.neon.tech/<dbname>?sslmode=require"
   ```
4. Run the database seed script to generate dummy data (Categories, Employees, and Assets):
   ```bash
   npm run seed
   ```
5. Start the development server:
   ```bash
   npm run start:dev
   ```

### Frontend Setup

1. Open a new terminal instance and navigate to your frontend directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root of your frontend directory and link it to your backend API:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:8080"
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
