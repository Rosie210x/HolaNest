import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';

export default function Header({ user, isAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const currentDate = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <header className="border-bottom bg-light mb-3">
      <Container fluid className="py-2">
        <Row className="align-items-center">
          <Col md={3} className="border-end text-center fw-bold fs-4">
            SBA301 Lab03
          </Col>
          <Col md={6} className="text-center fw-bold fs-3">
            Quản Lý Khách Hàng
          </Col>
          <Col md={3} className="text-end small">
            {isAuthenticated ? (
              <div>
                Chào <strong>{user?.email || user?.username || 'Admin'}</strong>{' '}
                <Button
                  variant="link"
                  className="p-0 text-decoration-underline ms-1 text-danger"
                  onClick={handleLogout}
                >
                  đăng xuất
                </Button>
              </div>
            ) : (
              <div>
                <Link to="/login" className="fw-bold text-primary">
                  Đăng nhập
                </Link>
              </div>
            )}
            <div>Ngày: {currentDate}</div>
          </Col>
        </Row>
      </Container>

      <div className="bg-white border-top border-bottom py-1 px-3 fs-6">
        <Link to="/" className="text-decoration-none fw-bold me-2">
          Trang Chủ
        </Link>
        <span className="text-muted">/</span>
        <Link to="customers/search" className="text-decoration-none fw-bold me-2">
          Danh Sách Khách Hàng
        </Link>
      </div>
    </header>
  );
}