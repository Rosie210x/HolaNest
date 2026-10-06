import { createBrowserRouter, redirect } from 'react-router-dom';
import App from './App';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import Home from './pages/Home';
import CustomerSearchPage from './pages/CustomerSearchPage';
import { authApi } from './api/authApi';
import CustomerDetailPage from './pages/CustomerDetailPage';
import CustomerFormPage from './pages/CustomerFormPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'customers/search',
                element: <CustomerSearchPage />,
            },
            {
                path: 'login',
                element: <SignInPage />,
                action: async ({ request }) => {
                    const formData = await request.formData();
                    const email = formData.get('email');
                    const password = formData.get('password');

                    try {
                        const res = await authApi.signin({
                            email: email ? email.trim() : '',
                            password: password ? password.trim() : '',
                        });

                        if (res?.token) {
                            localStorage.setItem('token', res.token);
                        }

                        return redirect('/');
                    } catch (err) {
                        return {
                            error: err.message || 'Email hoặc mật khẩu không chính xác',
                        };
                    }
                },
            },
            {
                path: 'signup',
                element: <SignUpPage />,
                action: async ({ request }) => {
                    const formData = await request.formData();
                    const email = formData.get('email');
                    const password = formData.get('password');
                    const role = formData.get('role');

                    try {
                        await authApi.signup({
                            email: email ? email.trim() : '',
                            password: password ? password.trim() : '',
                            role: role || 'user',
                        });


                        return redirect('/login');
                    } catch (err) {
                        return {
                            error: err.message || 'Đăng ký không thành công. Vui lòng thử lại!',
                        };
                    }
                },
            }, {
                path: 'customers/add',
                element: <CustomerFormPage />,
            },
            {
                path: 'customers/edit/:id',
                element: <CustomerFormPage />,
            },
            {
                path: 'customers/:id',
                element: <CustomerDetailPage />,
            },
            {
                path: 'logout',
                action: () => {
                    localStorage.removeItem('token');
                    return redirect('/login');
                },
            },
            {
                path: '*',
                element: <SignInPage />,
            },
        ],
    },
]);