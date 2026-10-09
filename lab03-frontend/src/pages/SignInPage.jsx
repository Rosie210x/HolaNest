import React, { useEffect, useState } from 'react';
import { Form as RouterForm, useActionData, useNavigation, useNavigate, Link } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export default function SignInPage() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const isSubmitting = navigation.state === 'submitting';

  useEffect(() => {
    if (actionData?.token) {
      login(actionData.token, { email: actionData.email });
      navigate('/', { replace: true });
    }
  }, [actionData, login, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({ email: '', password: '' });

  const validate = () => {
    let valid = true;
    const newErrors = { email: '', password: '' };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
      valid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Email không đúng định dạng';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    if (!validate()) {
      e.preventDefault();
    }
  };

  return (
    <Container className="d-flex justify-content-center py-5">
      <Card className="shadow-sm w-100" style={{ maxWidth: 420 }}>
        <Card.Body className="p-4">
          <Card.Title as="h2" className="text-center mb-4">
            Đăng nhập hệ thống
          </Card.Title>

          {actionData?.error && <Alert variant="danger">{actionData.error}</Alert>}

          <Form as={RouterForm} method="post" onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="email@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                }}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="password">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                }}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Đang xử lý...
                </>
              ) : (
                'Đăng nhập'
              )}
            </Button>
          </Form>

          <div className="text-center mt-3 small">
            Chưa có tài khoản? <Link to="/signup">Đăng ký</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
