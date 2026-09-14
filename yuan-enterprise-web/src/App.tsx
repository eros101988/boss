import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import QuickOrder from './pages/QuickOrder';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import About from './pages/About';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="quick-order" element={<QuickOrder />} />
            <Route path="cart" element={<Cart />} />
            <Route path="about" element={<About />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
