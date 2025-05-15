import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThirdwebProvider } from 'thirdweb/react';
import '@/src/index.css';

import ErrorPage from '@/src/pages/ErrorPage';
import Governance from '@/src/pages/Governance';
import Dashboard from '@/src/pages/Dashboard';
import Layout from '@/src/components/layout/Layout';
import Finance from '@/src/pages/Finance';
import Settings from '@/src/pages/Settings';
import NewProposal from '@/src/pages/NewProposal';
import Verification from '@/src/pages/Verification';
import ViewProposal from '@/src/pages/ViewProposal';
import { Toaster } from '@/src/components/ui/Toaster';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    id: 'root',
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Dashboard />,
      },
      {
        path: 'governance',
        children: [
          {
            path: '',
            element: <Governance />,
          },
          {
            path: 'new-proposal',
            element: <NewProposal />,
          },
          {
            path: 'proposals/:id',
            element: <ViewProposal />,
          },
        ],
      },
      {
        path: 'finance',
        element: <Finance />,
      },
      {
        path: 'verification',
        element: <Verification />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThirdwebProvider>
      <Toaster />
      <RouterProvider router={router} />
    </ThirdwebProvider>
  </React.StrictMode>
);
