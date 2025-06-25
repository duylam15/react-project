import { createBrowserRouter } from 'react-router-dom';
import LayoutDefault from '../layouts/LayoutDefault';
import Home from '../pages/home';
import Error from '../pages/error';
import MyProfile from '../pages/my_profile';
import Messages from '../pages/messages';
import Explore from '../pages/explore';
import Login from '../pages/login';
import Register from '../pages/register';
import ForgotPassword from '../pages/forgotpassword';
import GuestRoute from './ProtectedRoute/GuestRoute';
import RequireAuth from './ProtectedRoute/RequireAuth';
import LayoutAdmin from '../layouts/LayoutAdmin';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminPostPage from '../pages/admin/AdminPostPage';
import AdminUserPage from '../pages/admin/AdminUserPage';

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
        path: '/profile/:id',
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
    element: (
      <LayoutAdmin />
    ),
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <AdminDashboardPage />, // Trang tổng quan mặc định
      },
      {
        path: 'posts',
        element: <AdminPostPage />, // Quản lý bài viết
      },
      {
        path: 'users',
        element: <AdminUserPage />, // Quản lý người dùng
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
