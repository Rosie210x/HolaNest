import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="border-top bg-light mt-auto py-3 text-muted small">
      <Container fluid>
        <Row>
          <Col md={6}>
            <div>@2015, Bản Quyền Thuộc Công Ty ABC</div>
            <div>Địa Chỉ: Khu Công Nghệ Cao Hòa Lạc</div>
            <div>Liên Hệ: agent@fpt.edu.vn</div>
          </Col>
          <Col md={6} className="text-end align-self-end">
            <span className="me-2">Giới Thiệu</span>|
            <span className="mx-2">Hỗ Trợ</span>|
            <span className="ms-2">Nghề Nghiệp</span>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}