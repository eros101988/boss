import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlobalLineContact from '../components/GlobalLineContact';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col pb-[60px] md:pb-0">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <GlobalLineContact />
    </div>
  );
}
