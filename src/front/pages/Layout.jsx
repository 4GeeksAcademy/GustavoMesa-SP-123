import React from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Navbar } from "../components/Navbar";
import { InternalNavbar } from "../components/InternalNavbar";
import ScrollToTop from "../components/ScrollToTop";
import { Footer } from "../components/Footer";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Layout = () => {
  const location = useLocation();

  // Si tenéis una página tipo splash
  const isSplashPage = location.pathname === "/splash";

  // Se recalcula en cada render
  const isLoggedIn = !!localStorage.getItem("JWT-STORAGE-KEY");

  const renderNavbar = () => {
    if (isSplashPage) return <Navbar />;
    return isLoggedIn ? <InternalNavbar /> : <Navbar />;
  };

  return (
    <div className="d-flex flex-column ">
      <ScrollToTop />
      {renderNavbar()}
      <main className="">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer
        position="top-center"
        autoClose={4000}
        theme="dark"
        closeOnClick
        pauseOnHover
      />

    </div>
  );
};