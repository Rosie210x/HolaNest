import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Card, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import axiosClient from '../api/axiosClient';

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axiosClient.get(`/customers/${id}`);
        setCustomer(res);
      } catch (err) {
        setError(err.message || 'Không thể tải thông tin khách hàng');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" className="me-2" />
        Đang tải thông tin...
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5" style={{ maxWidth: 550 }}>
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </Container>
    );
  }

  const fields = [
    ['Tên Khách Hàng', customer.name],
    ['Email', customer.email],
    ['Địa chỉ', customer.address || 'N/A'],
    ['Điện thoại', customer.mobileNo || 'N/A'],
    ['Doanh thu (VND)', `${customer.revenue ? Number(customer.revenue).toLocaleString('vi-VN') : 0} VNĐ`],
  ];

  return (
    <Container className="d-flex justify-content-center py-4">
      <Card className="shadow-sm w-100" style={{ maxWidth: 550 }}>
        <Card.Header className="d-flex justify-content-between align-items-center bg-white py-3">
          <h2 className="h4 mb-0">Chi tiết Khách hàng</h2>
          <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
            ← Quay lại
          </Button>
        </Card.Header>

        <Card.Body>
          {fields.map(([label, value]) => (
            <Row key={label} className="border-bottom py-2 mx-0">
              <Col xs={5} className="fw-bold text-secondary ps-0">
                {label}:
              </Col>
              <Col xs={7}>{value}</Col>
            </Row>
          ))}
        </Card.Body>

        <Card.Footer className="bg-white text-end">
          <Button as={Link} to={`/customers/edit/${id}`} variant="warning" className="fw-bold">
            Chỉnh sửa
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
}
