import { createBrowserRouter, redirect } from 'react-router-dom';
import { CalendarCheck, Heart, Store } from 'lucide-react';
import App from './App';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import Home from './pages/Home';
import AccountPage from './pages/AccountPage';
import PlaceholderPage from './pages/PlaceholderPage';
import AccessCheckPage from './pages/AccessCheckPage';
import ForbiddenPage from './pages/ForbiddenPage';
import NotFoundPage from './pages/NotFoundPage';
import ErrorPage from './pages/ErrorPage';
import { authApi } from './api/authApi';
import { loadCurrentUser, safeNextPath } from './auth/session';

const toLogin = (request) => {
  const { pathname, search } = new URL(request.url);
  return redirect(`/login?next=${encodeURIComponent(pathname + search)}`);
};

// Ask for login only when needed, then resume (blueprint §1.3 principle 5)
const requireAuth = async ({ request }) => ((await loadCurrentUser()) ? null : toLogin(request));

// UI convenience only: the backend enforces every permission (SRS 3.1.3)
const requireRole = (role) => async ({ request }) => {
  const user = await loadCurrentUser();
  if (!user) {
    return toLogin(request);
  }
  return user.roles.includes(role) ? null : redirect('/forbidden');
};

// Already signed in: the login and sign-up pages have nothing to offer
const redirectIfSignedIn = async () => ((await loadCurrentUser()) ? redirect('/') : null);

const toActionError = (err) => ({ error: err.message, fieldErrors: err.fieldErrors });

export const router = createBrowserRouter([
  {
    id: 'root',
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    // The session lives in httpOnly cookies, so the server is the only source of "who is signed in".
    // React Router re-runs this loader after every action, which keeps the UI in step after login and logout.
    loader: loadCurrentUser,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <SignInPage />,
        loader: redirectIfSignedIn,
        handle: { hideTabBar: true },
        action: async ({ request }) => {
          const formData = await request.formData();
          try {
            const user = await authApi.signin({
              email: formData.get('email')?.trim() ?? '',
              password: formData.get('password') ?? '',
            });
            // UC02: Admin goes to the dashboard; everyone else back to where they were
            const next = safeNextPath(new URL(request.url).searchParams.get('next'));
            return redirect(user.roles.includes('ADMIN') ? '/admin' : next);
          } catch (err) {
            return toActionError(err);
          }
        },
      },
      {
        path: 'signup',
        element: <SignUpPage />,
        loader: redirectIfSignedIn,
        handle: { hideTabBar: true },
        action: async ({ request }) => {
          const formData = await request.formData();
          try {
            await authApi.signup({
              fullName: formData.get('fullName')?.trim() ?? '',
              email: formData.get('email')?.trim() ?? '',
              phone: formData.get('phone')?.trim() ?? '',
              password: formData.get('password') ?? '',
              acceptTerms: formData.get('acceptTerms') === 'on',
            });
            return redirect('/');
          } catch (err) {
            return toActionError(err);
          }
        },
      },
      {
        path: 'logout',
        action: async () => {
          try {
            await authApi.signout();
          } catch {
            // The next root loader run shows whether the session really ended
          }
          return redirect('/');
        },
      },
      {
        // SC10
        path: 'saved',
        loader: requireAuth,
        element: (
          <PlaceholderPage
            title="Phòng đã lưu"
            icon={Heart}
            emptyTitle="Chưa có phòng nào được lưu"
            emptyDescription="Bấm biểu tượng trái tim trên tin đăng để lưu lại và so sánh sau."
          />
        ),
      },
      {
        // SC12
        path: 'requests',
        loader: requireAuth,
        element: (
          <PlaceholderPage
            title="Yêu cầu xem phòng"
            icon={CalendarCheck}
            emptyTitle="Chưa có yêu cầu xem phòng nào"
            emptyDescription="Chọn một phòng và gửi yêu cầu để hẹn lịch xem với chủ trọ."
          />
        ),
      },
      {
        path: 'account',
        loader: requireAuth,
        element: <AccountPage />,
      },
      {
        // SC15
        path: 'become-landlord',
        loader: requireAuth,
        element: (
          <PlaceholderPage
            title="Cho thuê phòng"
            icon={Store}
            emptyTitle="Đăng ký làm chủ trọ"
            emptyDescription="Chức năng đăng ký chủ trọ đang được xây dựng."
            actionLabel="Về trang chủ"
          />
        ),
      },
      {
        path: 'landlord',
        element: <AccessCheckPage title="Kênh chủ trọ" check={authApi.checkLandlord} />,
        loader: requireRole('LANDLORD'),
      },
      {
        path: 'admin',
        element: <AccessCheckPage title="Quản trị" check={authApi.checkAdmin} />,
        loader: requireRole('ADMIN'),
      },
      {
        path: 'forbidden',
        element: <ForbiddenPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
