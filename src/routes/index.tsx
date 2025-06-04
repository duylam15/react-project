import { createBrowserRouter } from 'react-router-dom';
import LayoutDefault from '../layouts/LayoutDefault';

import React, { Suspense } from 'react';
import Home from '../pages/home';
import Error from '../pages/error';
import MyProfile from '../pages/my_profile';
import Messages from '../pages/messages';
import Explore from '../pages/explore';
import Login from '../pages/login';
import Register from '../pages/register';
import ForgotPassword from '../pages/forgotpassword';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './ProtectedRoute/GuestRoute';
import RequireAuth from './ProtectedRoute/RequireAuth';

const AdminPage = React.lazy(() => import('../pages/admin'));
export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RequireAuth>
        <LayoutDefault />
      </RequireAuth>
    ),
    errorElement: <Error />, // Hiển thị NotFound khi có lỗi
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/profile',
        element: <MyProfile />,
      },
      {
        path: '/messages',
        element: <Messages />,
      },
      {
        path: '/explore',
        element: <Explore />,
      },
    ],
  },
  {
    path: '/admin',
    element: <LayoutDefault />, // thêm layout vào
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: (
      <GuestRoute><Login /> </GuestRoute>
    ),
  },
  { path: '/register', element: <Register /> },
  { path: '/forgotpassword', element: <ForgotPassword /> },
]);
