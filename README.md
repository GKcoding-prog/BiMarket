# BiMarket 🛒

A modern, professional e-commerce platform built with React and Django. BiMarket provides a seamless shopping experience with distinct interfaces for both customers and vendors.

## 🌟 Features

### For Customers
- **Public Product Browsing** - Browse products without authentication
- **Smart Authentication** - Login required only when adding items to cart
- **Order Management** - Track orders with real-time status updates
- **Wishlist System** - Save favorite products for later
- **Multiple Addresses** - Manage multiple shipping addresses
- **Loyalty Program** - Earn points with every purchase

### For Vendors
- **Sales Dashboard** - Comprehensive analytics and performance metrics
- **Inventory Management** - Real-time stock tracking and alerts
- **Order Processing** - Efficient order fulfillment workflow
- **Revenue Tracking** - Detailed sales reports and insights
- **Product Management** - Easy product creation and editing

## 🎨 Design Highlights

- **Professional UI/UX** - Modern, clean interface using shadcn-ui components
- **Role-Based Dashboards** - Distinct experiences for customers and vendors
- **Responsive Design** - Optimized for all screen sizes
- **Dark Mode Support** - Comfortable viewing in any environment
- **Smooth Animations** - Engaging user interactions throughout

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite 7.1.11** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **shadcn-ui** - High-quality component library
- **React Router** - Client-side routing
- **Zustand/Context API** - State management

### Backend
- **Django REST Framework** - Powerful API backend
- **JWT Authentication** - Secure token-based auth
- **PostgreSQL** - Robust database solution

## 📦 Project Structure

```
BiMarket/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/         # shadcn-ui components
│   │   ├── Navbar.tsx  # Navigation component
│   │   └── ProductCard.tsx
│   ├── pages/          # Page components
│   │   ├── Home.tsx    # Landing page
│   │   ├── Products.tsx # Product catalog
│   │   ├── Login.tsx   # Authentication
│   │   ├── ClientDashboard.tsx
│   │   └── SellerDashboard.tsx
│   ├── contexts/       # React contexts
│   │   └── AuthContext.tsx
│   ├── lib/           # Utilities and helpers
│   │   ├── api.ts     # API client
│   │   └── utils.ts
│   └── hooks/         # Custom React hooks
├── public/            # Static assets
└── index.html        # HTML entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm installed
- Django backend running on `http://127.0.0.1:8000/`

### Installation

```sh
# Clone the repository
git clone https://github.com/GKcoding-prog/BiMarket.git

# Navigate to project directory
cd BiMarket

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173/`

## 🔧 Configuration

### API Integration
The frontend uses Vite proxy to communicate with the Django backend. Configuration in `vite.config.ts`:

```typescript
proxy: {
  '/api': {
    target: 'http://127.0.0.1:8000',
    changeOrigin: true,
  }
}
```

### Environment Variables
Create a `.env` file for custom configuration (optional):

```env
VITE_API_URL=http://127.0.0.1:8000
```

## 🎯 Key Features Implementation

### Authentication Flow
1. Users can browse products without logging in
2. Login prompt appears when attempting to add to cart
3. JWT tokens stored in localStorage
4. Automatic token refresh
5. Role-based dashboard routing (client/vendor)

### State Management
- **AuthContext** - Global authentication state
- **localStorage** - Token persistence
- **sessionStorage** - Temporary cart items and redirects

### API Client
Centralized API client (`src/lib/api.ts`) handles:
- Request/response interceptors
- Token management
- Error handling
- Automatic retries

## 📱 Pages & Routes

- `/` - Home page with featured products
- `/products` - Product catalog with filters and search
- `/categories` - Product categories
- `/login` - Authentication page
- `/cart` - Shopping cart
- `/client-dashboard` - Customer dashboard
- `/seller-dashboard` - Vendor dashboard

## 🎨 UI Components

Built with shadcn-ui, featuring:
- Cards, Buttons, Badges
- Tabs, Dialogs, Dropdowns
- Forms with validation
- Toast notifications
- Responsive navigation
- Loading states

## 🔐 Security

- JWT-based authentication
- Secure token storage
- CORS protection
- XSS prevention
- CSRF protection

## 🚦 Development Status

✅ Authentication system
✅ Product browsing
✅ Role-based dashboards
✅ Professional UI/UX
🔄 Cart functionality (in progress)
🔄 Payment integration (planned)
🔄 Order fulfillment (planned)

## 📄 License

This project is part of a personal learning portfolio.

## 👨‍💻 Author

**GKcoding-prog**
- GitHub: [@GKcoding-prog](https://github.com/GKcoding-prog)

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [shadcn-ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

## Project info

**URL**: https://lovable.dev/projects/a7329c5b-b894-45b7-a13c-f14deb5dcf76

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a7329c5b-b894-45b7-a13c-f14deb5dcf76) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a7329c5b-b894-45b7-a13c-f14deb5dcf76) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
