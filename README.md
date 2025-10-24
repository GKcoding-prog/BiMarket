# BiMarket 🛒

A modern, professional e-commerce platform built with React and Django REST Framework. BiMarket provides a seamless shopping experience with distinct interfaces for both customers and vendors, featuring real-time data integration and mobile-optimized design.

## 🌟 Features

### For Customers
- **Smart Product Browsing** - Browse real products with grid/list views and advanced filters
- **Mobile-Optimized Filters** - Professional slide-out filter drawer on mobile devices
- **Full Cart System** - Add, update, and remove items with real-time total calculations
- **Wishlist System** - Save favorite products with heart icon and badge counter
- **Integrated Payments** - LumiCash and EcoCash payment options with test mode
- **Order Management** - Track orders with detailed view including items, prices, and shipping info
- **Order Details Dialog** - View complete order information with product images and quantities
- **Responsive Design** - 2-column layout on mobile, 3 on tablet, 4 on desktop
- **Dark Mode** - Toggle between light, dark, and system theme preferences

### For Vendors
- **Sales Dashboard** - Real-time analytics with order statistics
- **Order Processing** - View and manage customer orders with detailed information
- **Product Management** - Create, edit, and manage product inventory
- **Revenue Tracking** - Monitor sales performance and trends
- **Category Management** - Organize products into categories

## 🎨 Design Highlights

- **Professional UI/UX** - Modern, clean interface using shadcn-ui components
- **Role-Based Dashboards** - Distinct experiences for customers (client) and vendors (vendeur)
- **Mobile-First Design** - Optimized layouts for mobile, tablet, and desktop
- **Dark Mode Support** - Persistent theme selection with localStorage
- **Smooth Animations** - Engaging transitions and interactions throughout
- **Localized Currency** - All prices displayed in FBu (Burundian Franc)
- **Custom Branding** - BiMarket favicon with "B" logo

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite 7.1.11** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **shadcn-ui** - High-quality component library (Dialog, Sheet, Card, Button, Badge, etc.)
- **React Router** - Client-side routing
- **Context API** - State management (AuthContext, ThemeProvider)
- **Lucide React** - Beautiful icon library

### Backend
- **Django REST Framework** - RESTful API backend
- **JWT Authentication** - Secure token-based authentication
- **PostgreSQL** - Robust relational database
- **CORS Headers** - Cross-origin resource sharing enabled

### Integration
- **Axios** - HTTP client for API requests
- **API Client** - Centralized request handling with interceptors
- **Test Mode Payments** - Simplified payment flow for development

## 📦 Project Structure

```
BiMarket/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/         # shadcn-ui components (40+ components)
│   │   ├── Navbar.tsx  # Navigation with auth, cart, wishlist, theme toggle
│   │   ├── ProductCard.tsx  # Responsive product card with grid/list views
│   │   ├── theme-provider.tsx  # Dark mode context provider
│   │   └── mode-toggle.tsx     # Theme switcher dropdown
│   ├── pages/          # Page components
│   │   ├── Index.tsx   # Main app routing
│   │   ├── Home.tsx    # Landing page with featured products
│   │   ├── Products.tsx # Product catalog with mobile filters
│   │   ├── Categories.tsx  # Category browsing
│   │   ├── Cart.tsx    # Shopping cart with checkout
│   │   ├── Login.tsx   # JWT authentication
│   │   ├── ClientDashboard.tsx  # Customer orders & wishlist
│   │   ├── SellerDashboard.tsx  # Vendor sales & orders
│   │   └── Dashboard.tsx  # Role-based routing
│   ├── contexts/       # React contexts
│   │   └── AuthContext.tsx  # Authentication state management
│   ├── lib/           # Utilities and helpers
│   │   ├── api.ts     # Centralized API client
│   │   └── utils.ts   # Utility functions (formatCurrency, cn)
│   ├── hooks/         # Custom React hooks
│   │   ├── use-mobile.tsx  # Mobile breakpoint detection
│   │   └── use-toast.ts    # Toast notification hook
│   └── integrations/  # External integrations
│       └── client.ts  # API client instance
├── public/            # Static assets
│   ├── favicon.svg    # Custom BiMarket "B" logo
│   └── robots.txt
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
The frontend communicates with Django REST Framework backend at `http://127.0.0.1:8000/`. 

API client configured in `src/lib/api.ts`:
```typescript
const API_BASE_URL = 'http://127.0.0.1:8000';

// All requests include JWT token in Authorization header
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### Backend Endpoints
- `POST /api/token/` - Login and get JWT tokens
- `GET /products/` - Fetch all products
- `GET /categories/` - Fetch all categories
- `POST /cart/add/` - Add item to cart
- `PATCH /cart/update/{id}/` - Update cart item quantity
- `POST /cart/remove/` - Remove item from cart
- `GET /cart/` - Get cart items
- `POST /wishlist/toggle/` - Toggle wishlist item
- `GET /wishlist/` - Get wishlist items
- `GET /wishlist/check/` - Check if product in wishlist
- `POST /orders/create/` - Create new order
- `GET /orders/` - Get user orders
- `GET /orders/{id}/` - Get order details

### Environment Variables
No `.env` file required for local development. Backend URL is hardcoded in `src/lib/api.ts`.

For production deployment, update the `API_BASE_URL` constant.

## 🎯 Key Features Implementation

### Authentication Flow
1. Users can browse products without logging in
2. Login required for cart, wishlist, and checkout
3. JWT tokens stored in localStorage
4. Automatic token refresh with interceptors
5. Role-based dashboard routing (client/vendeur)
6. Protected routes with redirect to login

### Cart System
- **Add to Cart** - POST request to `/cart/add/`
- **Update Quantity** - PATCH request to `/cart/update/{id}/`
- **Remove Item** - POST request to `/cart/remove/`
- **Real-time Total** - Calculated with formatCurrency()
- **Persistent Storage** - Synced with Django backend

### Wishlist System
- **Toggle Wishlist** - POST request to `/wishlist/toggle/`
- **Check Status** - GET request to `/wishlist/check/`
- **View Wishlist** - Dedicated tab in client dashboard
- **Badge Counter** - Shows count in navbar
- **Heart Icon** - Filled when in wishlist

### Payment Integration
- **LumiCash** - Mobile money payment method
- **EcoCash** - Alternative payment option
- **Test Mode** - No credentials required for testing
- **Order Creation** - POST request to `/orders/create/`
- **Redirect** - Automatic redirect to orders after payment

### Order Management
- **Order List** - GET request to `/orders/`
- **Order Details** - GET request to `/orders/{id}/`
- **Details Dialog** - Full order view with items, images, prices
- **Status Tracking** - Pending, processing, shipped, delivered
- **Shipping Address** - Display full address and phone

### Mobile Optimization
- **Responsive Grid** - 2 columns mobile, 3 tablet, 4 desktop
- **Mobile Filters** - Sheet component with slide-out drawer
- **Compact Cards** - Reduced padding and text sizes on mobile
- **Touch-Friendly** - Larger tap targets and spacing
- **Filter Button** - Shows active filter count badge

### Dark Mode
- **ThemeProvider** - Context-based theme management
- **localStorage** - Persistent theme preference
- **System Detection** - Auto-detect OS theme preference
- **Mode Toggle** - Dropdown with Light/Dark/System options
- **Smooth Transitions** - CSS transitions for theme changes

### State Management
- **AuthContext** - Global authentication state with JWT
- **ThemeProvider** - Global theme state
- **localStorage** - Token and theme persistence
- **useState/useEffect** - Component-level state

### API Client
Centralized API client (`src/lib/api.ts`) handles:
- Request/response interceptors
- JWT token injection in headers
- Error handling with toast notifications
- Base URL configuration (http://127.0.0.1:8000)
- Type-safe request methods

## 📱 Pages & Routes

- `/` - Home page with featured products (2-column grid mobile)
- `/products` - Product catalog with mobile filters, search, and sort
- `/categories` - Browse products by category
- `/login` - JWT authentication page
- `/cart` - Shopping cart with payment integration
- `/dashboard` - Role-based routing hub
- `/dashboard?tab=orders` - Client orders view
- `/dashboard?tab=wishlist` - Client wishlist view
- `/client-dashboard` - Customer dashboard (deprecated, redirects to /dashboard)
- `/seller-dashboard` - Vendor dashboard with order management
- `*` - 404 Not Found page

## 🎨 UI Components

Built with shadcn-ui, featuring 40+ components:
- **Card, Button, Badge** - Core UI elements
- **Sheet** - Mobile filter drawer (slide-out from left)
- **Dialog** - Order details modal
- **Tabs** - Dashboard navigation
- **Dropdown Menu** - Theme toggle, user menu
- **Input, Textarea** - Form controls
- **Toast** - Success/error notifications with Sonner
- **Separator** - Visual dividers
- **Avatar** - User profile images
- **Skeleton** - Loading states
- **Progress** - Loading indicators
- **Switch, Checkbox** - Toggle controls
- **Select** - Dropdown selects
- **Scroll Area** - Custom scrollbars

## 🔐 Security

- **JWT Authentication** - Secure token-based auth with refresh
- **Token Storage** - localStorage with automatic injection
- **CORS Protection** - Configured Django CORS headers
- **Protected Routes** - Authentication required for sensitive pages
- **XSS Prevention** - React's built-in protection
- **CSRF Protection** - Django middleware enabled
- **API Interceptors** - Automatic token refresh on 401

## 🚦 Development Status

✅ **Completed Features**
- JWT Authentication with role-based routing
- Product catalog with real backend data
- Advanced filtering and search
- Mobile-optimized filter drawer
- Full cart system (add, update, remove)
- Wishlist with navbar integration
- Payment integration (LumiCash/EcoCash)
- Order management with details dialog
- Client dashboard (orders & wishlist tabs)
- Seller dashboard with order processing
- Dark mode with theme persistence
- Responsive design (mobile-first)
- Custom BiMarket branding and favicon
- Currency localization (FBu - Burundian Franc)
- Toast notifications for user feedback

🔄 **In Progress**
- Advanced product analytics
- Seller inventory management
- Multi-image product gallery

📋 **Planned Features**
- Product reviews and ratings
- Advanced search with filters
- Email notifications
- Multi-language support
- Admin panel
- Shipping tracking

## 📄 License

This project is part of a personal learning portfolio.

## � API Response Examples

### Product Object
```json
{
  "id": "uuid-string",
  "name": "Product Name",
  "description": "Product description",
  "price": "50000",
  "category": "category-id",
  "category_name": "Category Name",
  "image": "product-image-url",
  "stock": 100,
  "seller": "seller-id",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Order Object
```json
{
  "id": "order-id",
  "user": "user-id",
  "items": [
    {
      "product_name": "Product Name",
      "product_image": "image-url",
      "quantity": 2,
      "price": "50000"
    }
  ],
  "total_amount": "100000",
  "status": "pending",
  "payment_method": "LumiCash",
  "shipping_address": "Full address",
  "phone_number": "+25712345678",
  "created_at": "2024-01-01T00:00:00Z"
}
```

## 💡 Key Implementation Details

### Currency Formatting
```typescript
// src/lib/utils.ts
export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('fr-FR')} FBu`;
}
```

### Mobile Filter Implementation
- Uses shadcn Sheet component
- Trigger button shows active filter count
- Auto-closes after category selection
- Desktop shows sidebar, mobile shows drawer
- Breakpoint: `lg` (1024px)

### Theme Implementation
- ThemeProvider wraps entire app
- localStorage key: `vite-ui-theme`
- Options: light, dark, system
- Smooth transitions with CSS variables

## �👨‍💻 Author

**GKcoding-prog**
- GitHub: [@GKcoding-prog](https://github.com/GKcoding-prog)
- Project: BiMarket - E-commerce Platform

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/) - Next generation frontend tooling
- UI components from [shadcn-ui](https://ui.shadcn.com/) - Beautifully designed components
- Icons from [Lucide](https://lucide.dev/) - Beautiful & consistent icon toolkit
- Backend powered by [Django REST Framework](https://www.django-rest-framework.org/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

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
