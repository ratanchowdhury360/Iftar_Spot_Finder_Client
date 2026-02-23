import { Outlet } from "react-router";
import Navber from "../Shared/Navber";
import Footer from "../Shared/Footer";

const Root = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      {/* Navbar Section */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <Navber />
      </header>

      {/* Main Content Section */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer Section */}
      <footer className=" text-white">
        <Footer />
      </footer>

    </div>
  );
};

export default Root;