# Coffee Shop - Full-Stack E-commerce Platform

## About the Project
Coffee Shop is a full-stack e-commerce web application that allows users to browse coffee products, manage their cart, and complete orders securely. The project is built with Vue.js on the frontend and Node.js (Express) with Prisma ORM on the backend to ensure scalability, security, and smooth user experience.

## Features
- **User Authentication** - Secure login & registration using JWT (HTTP-only cookies)
- **Shopping Cart & Checkout** - Add products, update quantities, and place orders
- **Order Management** - Users can view their orders, admins can manage them
- **Payment Integration** - (Planned feature)
- **Cloud Storage for Images** - Uses Cloudinary to manage product images
- **Security Best Practices** - CSRF, XSS protection, and middleware authentication

## Tech Stack
### Frontend:
- Vue.js 3 (Composition API, Pinia)
- Tailwind CSS (Responsive UI)
- Vue Router (Navigation)
- Axios (API calls)
- DaisyUI
- 
### Backend:
- Node.js (Express.js) - REST API
- Prisma ORM - Database management
- MySQL / PostgreSQL - Relational database
- Cloudinary - Image storage
- JWT Authentication (Access & Refresh Tokens)
- Crypto, Bcrypt - Hash data and Password
## Installation & Setup
### 1. Clone the Repository
```sh
git clone https://github.com/khuongminhhuy1/Coffee-Shop.git
cd Coffee-Shop
```

### 2. Backend Setup
```sh
cd backend
npm install
```
- Create a `.env` file in the backend directory and add:
  ```env
  DATABASE_URL="your-database-url"
  JWT_SECRET="your-secret-key"
  CLOUDINARY_CLOUD_NAME="your-cloud-name"
  CLOUDINARY_API_KEY="your-api-key"
  CLOUDINARY_API_SECRET="your-api-secret"
  ```
- Run database migrations
  ```sh
  npx prisma migrate dev --name init
  ```
- Start the backend
  ```sh
  npm run dev
  ```

### 3. Frontend Setup
```sh
cd ../frontend
npm install
```
- Run the frontend
  ```sh
  npm run dev
  ```
- Open `http://localhost:5173/` in your browser

## To-Do List
- ✅ User Authentication
- ✅ Shopping Cart
- ✅ Order Management
- ⬜ Payment Gateway Integration
- ⬜ Admin Dashboard

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository
2. Create a new branch (`feature-new-functionality`)
3. Commit your changes
4. Push to your fork and open a Pull Request

## Contact
📧 Email: khuongminhhuy1505@gmail.com
🔗 GitHub: [khuongminhhuy1](https://github.com/khuongminhhuy1)
🔗 LinkedIn: [Khương Minh Huy](https://www.linkedin.com/in/khuong-minh-huy/)

## License
This project is licensed under the MIT License.

---
🚀 Let's build something great together!

