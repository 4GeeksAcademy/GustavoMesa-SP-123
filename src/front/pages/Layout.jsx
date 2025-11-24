// src/front/pages/Layout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";

import { Navbar } from "../components/Navbar";
import { InternalNavbar } from "../components/InternalNavbar";
import ScrollToTop from "../components/ScrollToTop";
import { Footer } from "../components/Footer";

export const Layout = () => {
  const location = useLocation();

  // ¿Estamos en página "especial" tipo splash? (si no la usáis, da igual)
  const isSplashPage = location.pathname === "/splash";

  // Calcula si hay token en cada render
  const isLoggedIn = !!localStorage.getItem("token");

  const renderNavbar = () => {
    if (isSplashPage) return <Navbar />;       // splash siempre navbar público
    return isLoggedIn ? <InternalNavbar /> : <Navbar />;
  };

  return (
    <>
      <ScrollToTop />
      {renderNavbar()}
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
