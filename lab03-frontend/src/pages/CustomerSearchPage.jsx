import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Form, Button, Table, Alert, Spinner, Row, Col } from 'react-bootstrap';

import axiosClient from '../api/axiosClient';

export default function CustomerSearchPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get('/customers', {
        params: {
          page,
          size,
          name: searchName.trim() || undefined,
          email: searchEmail.trim() || undefined,
        },
      });

      if (res.content) {
        setCustomers(res.content);
        setTotalPages(res.totalPages || 1);
        setTotalElements(res.totalElements || 0);
      } else if (Array.isArray(res)) {
        setCustomers(res);
        setTotalPages(1);
        setTotalElements(res.length);
      }
    } catch (err) {
      setError(err.message || 'Không thể tải danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, size]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchCustomers();
  };

  return (
    <Container className="py-4" style={{ maxWidth: 1100 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h3 mb-0">Quản lý & Tìm kiếm Khách hàng</h2>
        <Button as={Link} to="/customers/add" variant="success">
          + Thêm mới
        </Button>
      </div>

      {/* Form tìm kiếm */}
      <Form onSubmit={handleSearchSubmit} className="mb-3">
        <Row className="g-2">
          <Col md={5}>
            <Form.Control
              type="text"
              placeholder="Tìm theo Tên..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </Col>
          <Col md={5}>
            <Form.Control
              type="text"
              placeholder="Tìm theo Email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
          </Col>
          <Col md={2} className="d-grid">
            <Button type="submit" variant="primary">
              Tìm kiếm
            </Button>
          </Col>
        </Row>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Bảng hiển thị danh sách */}
      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" className="me-2" />
          Đang tải dữ liệu...
        </div>
      ) : (
        <>
          <Table striped bordered hover responsive className="align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Tên</th>
                <th>Địa chỉ</th>
                <th>Số điện thoại</th>
                <th className="text-end">Doanh thu</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map((c) => (
                  <tr key={c.customerId}>
                    <td>{c.customerId}</td>
                    <td>{c.email}</td>
                    <td>{c.name}</td>
                    <td>{c.address}</td>
                    <td>{c.mobileNo}</td>
                    <td className="text-end">
                      {c.revenue ? c.revenue.toLocaleString('vi-VN') : 0} VNĐ
                    </td>
                    <td className="text-center">
                      <Button as={Link} to={`/customers/${c.customerId}`} variant="outline-primary" size="sm">
                        Xem chi tiết
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-3">
                    Không tìm thấy khách hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Thanh phân trang */}
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <span>
              Tổng số: <strong>{totalElements}</strong> kết quả (Trang {page + 1}/{totalPages})
            </span>

            <div className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Trang trước
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Trang sau
              </Button>
            </div>
          </div>
        </>
      )}
    </Container>
  );
}
