import { Route, Routes } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import HomeProductGrid from './components/homeProductGrid';
import HomeDressGrid from './components/homeDressGrid';
import ToysBeauty from './components/ToysBeauty';
import HomeAppliances from './components/homeAppliances';
import ProductDetails from './pages/ProductListPage';
import Ads from './components/ads';
import ProductDetailPage from './components/ProductDetailPage';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup.jsx';
import Profile from './pages/Profile.jsx';
import CartPage from './pages/CartPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword"; // from earlier
import SearchResults from "./pages/SearchResults";

function App() {
  return (
    <div className='bg-[#E6C989]'>
      <Navbar />

      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
              <Ads />
              <HomeProductGrid />
              <HomeDressGrid />
              <HomeAppliances />
              <ToysBeauty />
            </>
          }
        />
        {/* Product Details Page */}
        <Route path="/products/:category" element={<ProductDetails />} />
        <Route path="/product/:category/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<Login />} />
           <Route path="/signup" element={<Signup />} />
           <Route path="/profile" element={<Profile />} />
           <Route path="/cart" element={<CartPage />} />
           <Route path="/orders" element={<OrdersPage />} />
           <Route path="/wishlist" element={<WishlistPage />} />
           <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/search" element={<SearchResults />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
