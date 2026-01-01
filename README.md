# Electronics Repair Management System (ERMS)

A comprehensive web-based application designed to streamline operations for electronics repair shops. It manages the entire lifecycle of repair requests, from intake to completion, along with inventory tracking and user management.

## 🚀 Features

*   **Admin Dashboard**: Real-time overview of KPIs, active repairs, and low stock alerts.
*   **User Management**: Full CRUD capabilities for Admins, Technicians, and Customers with soft-delete and restore functionality.
*   **Device Management**: Register and track customer devices, linked to repair history.
*   **Repair Workflow**: Track repair status (Pending, Diagnosing, In Progress, Waiting for Parts, Completed).
*   **Inventory System**: Manage spare parts, track usage in repairs, and monitor stock levels.
*   **Notifications**: Real-time updates for status changes and assignments.
*   **Reports**: Generate insights on repair volume and technician performance.
*   **Authentication**: Secure JWT-based login and Role-Based Access Control (RBAC).

## 🛠️ Tech Stack

*   **Frontend**: React, Vite, Redux Toolkit
*   **Backend**: Node.js, Express.js
*   **Database**: MongoDB (Mongoose ODM)
*   **State Management**: Redux Toolkit (Slices & AsyncThunks)
*   **HTTP Client**: Axios

## ⚙️ Installation & Setup

### Prerequisites
*   Node.js (v16+)
*   MongoDB (Local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/erms.git
cd erms
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/erms
JWT_SECRET=your_super_secret_key_here
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
