/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { StudioDetailPage } from './pages/StudioDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AddStudioPage } from './pages/AddStudioPage';
import { EditStudioPage } from './pages/EditStudioPage';
import { MyListingsPage } from './pages/MyListingsPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { WishlistPage } from './pages/WishlistPage';
import { NotFoundPage } from './pages/NotFoundPage';

function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [searchParams, setSearchParams] = useState<URLSearchParams>(() => {
    return new URLSearchParams(window.location.search);
  });

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname || '/');
      setSearchParams(new URLSearchParams(window.location.search));
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigate = (path: string) => {
    // If it's an anchor on the same page
    if (path.includes('#')) {
      const [route, hash] = path.split('#');
      if (route === '' || route === currentPath) {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
    }

    const [route, search] = path.split('?');
    window.history.pushState({}, '', path);
    setCurrentPath(route || '/');
    setSearchParams(new URLSearchParams(search || ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentPage = () => {
    // Route: /
    if (currentPath === '/') {
      return <HomePage navigate={navigate} />;
    }

    // Route: /studios
    if (currentPath === '/studios') {
      const catParam = searchParams.get('category') || undefined;
      return <ExplorePage key={catParam || 'all'} navigate={navigate} initialCategory={catParam} />;
    }

    // Route: /studios/edit/:id
    if (currentPath.startsWith('/studios/edit/')) {
      const id = currentPath.replace('/studios/edit/', '');
      return <EditStudioPage studioId={id} navigate={navigate} />;
    }

    // Route: /studios/:id
    if (currentPath.startsWith('/studios/')) {
      const id = currentPath.replace('/studios/', '');
      return <StudioDetailPage studioId={id} navigate={navigate} />;
    }

    // Route: /login
    if (currentPath === '/login') {
      return <LoginPage navigate={navigate} />;
    }

    // Route: /register
    if (currentPath === '/register') {
      return <RegisterPage navigate={navigate} />;
    }

    // Route: /dashboard
    if (currentPath === '/dashboard') {
      return <DashboardPage navigate={navigate} />;
    }

    // Route: /add-studio
    if (currentPath === '/add-studio') {
      return <AddStudioPage navigate={navigate} />;
    }

    // Route: /my-listings
    if (currentPath === '/my-listings') {
      return <MyListingsPage navigate={navigate} />;
    }

    // Route: /my-bookings
    if (currentPath === '/my-bookings') {
      return <MyBookingsPage navigate={navigate} />;
    }

    // Route: /wishlist
    if (currentPath === '/wishlist') {
      return <WishlistPage navigate={navigate} />;
    }

    // Default 404
    return <NotFoundPage navigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#10151F] text-[#F8FAFC] antialiased selection:bg-[#C5F36A] selection:text-[#10151F]">
      <Navbar currentPath={currentPath} navigate={navigate} />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      <Footer navigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
