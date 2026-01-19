import { ReactNode } from 'react';
import Header from './Header';
import Navigation from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <Navigation />
      <main>{children}</main>
    </div>
  );
}
