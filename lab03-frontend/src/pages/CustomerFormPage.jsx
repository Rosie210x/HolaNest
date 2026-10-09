import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Spinner, InputGroup } from 'react-bootstrap';
import axiosClient from '../api/axiosClient';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(0|\+84)[35789]\d{8}$/;
const REVENUE_MAX = 9999999999999.99;

const validateField = (name, value) => {
  const v = String(value ?? '').trim();
  switch (name) {
    case 'name':
      if (!v) return 'Vui lòng nhập tên khách hàng';
      if (v.length > 100) return 'Tên tối đa 100 ký tự';
      return '';
    case 'email':
      if (!v) return 'Vui lòng nhập email';
      if (!EMAIL_REGEX.test(v)) return 'Email không đúng định dạng';
      if (v.length > 100) return 'Email tối đa 100 ký tự';
      return '';
    case 'address':
      if (!v) return 'Vui lòng nhập địa chỉ';
      if (v.length > 255) return 'Địa chỉ tối đa 255 ký tự';
      return '';
    case 'mobileNo':
      if (!v) return 'Vui lòng nhập số điện thoại';
      if (!PHONE_REGEX.test(v)) return 'Số điện thoại không đúng định dạng (VD: 0901234567 hoặc +84901234567)';
      return '';
    case 'revenue': {
      if (v === '') return 'Vui lòng nhập doanh thu';
      const num = Number(v);
      if (Number.isNaN(num)) return 'Doanh thu phải là số';
      if (num < 0) return 'Doanh thu phải lớn hơn hoặc bằng 0';
      if (num > REVENUE_MAX) return 'Doanh thu vượt quá giới hạn cho phép';
      if (!/^\d+(\.\d{1,2})?$/.test(v)) return 'Doanh thu tối đa 2 chữ số thập phân';
      return '';
    }
    default:
      return '';
  }
};

const FIELDS = ['name', 'email', 'address', 'mobileNo', 'revenue'];

export default function CustomerFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    mobileNo: '',
    revenue: 0,
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      axiosClient
        .get(`/customers/${id}`)
        .then((res) => {
          setFormData({
            name: res.name || '',
            email: res.email || '',
            address: res.address || '',
            mobileNo: res.mobileNo || '',
            revenue: res.revenue ?? 0,
          });
        })
        .catch((err) => setError(err.message || 'Không thể lấy thông tin khách hàng'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateAll = () => {
    const newErrors = {};
    FIELDS.forEach((f) => {
      const msg = validateField(f, formData[f]);
      if (msg) newErrors[f] = msg;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    setSubmitting(true);
    setError(null);

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      mobileNo: formData.mobileNo.trim(),
      revenue: Number(formData.revenue),
    };

    try {
      if (isEdit) {
        await axiosClient.put(`/customers/${id}`, { customerId: Number(id), ...payload });
      } else {
        await axiosClient.post('/customers', payload);
      }
      navigate('/customers/search');
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi lưu dữ liệu');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" className="me-2" />
        Đang tải thông tin...
      </Container>
    );
  }

  const renderField = ({ name, label, type = 'text', placeholder, ...rest }) => (
    <Form.Group className="mb-3" controlId={name}>
      <Form.Label>
        {label} <span className="text-danger">*</span>
      </Form.Label>
      <Form.Control
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        isInvalid={!!errors[name]}
        {...rest}
      />
      <Form.Control.Feedback type="invalid">{errors[name]}</Form.Control.Feedback>
    </Form.Group>
  );

  return (
    <Container className="d-flex justify-content-center py-4">
      <Card className="shadow-sm w-100" style={{ maxWidth: 550 }}>
        <Card.Header className="d-flex justify-content-between align-items-center bg-white py-3">
          <h2 className="h4 mb-0">{isEdit ? 'Chỉnh sửa Khách hàng' : 'Thêm mới Khách hàng'}</h2>
          <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
            ← Quay lại
          </Button>
        </Card.Header>

        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit} noValidate>
            {renderField({ name: 'name', label: 'Tên Khách Hàng', placeholder: 'Nhập tên khách hàng' })}
            {renderField({ name: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com' })}
            {renderField({ name: 'address', label: 'Địa chỉ', placeholder: 'Nhập địa chỉ' })}
            {renderField({ name: 'mobileNo', label: 'Điện thoại', type: 'tel', placeholder: '0901234567' })}

            <Form.Group className="mb-3" controlId="revenue">
              <Form.Label>
                Doanh thu <span className="text-danger">*</span>
              </Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="number"
                  name="revenue"
                  min="0"
                  step="100000"
                  value={formData.revenue}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="0"
                  isInvalid={!!errors.revenue}
                />
                <InputGroup.Text>VNĐ</InputGroup.Text>
                <Form.Control.Feedback type="invalid">{errors.revenue}</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                Hủy
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting && <Spinner animation="border" size="sm" className="me-2" />}
                {submitting ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
