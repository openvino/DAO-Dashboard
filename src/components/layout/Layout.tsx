import Navbar from '@/src/components/layout/Navbar';
import { Outlet } from 'react-router';

const Layout = () => {
  return (
    <div className="flex min-h-full w-full justify-center bg-background pb-20 text-foreground">
      <div className="w-full max-w-7xl px-1 sm:px-4 md:px-10 lg:px-6">
        <div className="mb-10 flex w-full items-center justify-center">
          <Navbar />
        </div>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
