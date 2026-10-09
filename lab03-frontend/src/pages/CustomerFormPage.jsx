import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

  if (loading) return <div style={styles.container}>Đang tải thông tin...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2>{isEdit ? 'Chỉnh sửa Khách hàng' : 'Thêm mới Khách hàng'}</h2>
          <button type="button" onClick={() => navigate(-1)} style={styles.backBtn}>
            ← Quay lại
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          <div style={styles.formGroup}>
            <label htmlFor="name">Tên Khách Hàng *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
              placeholder="Nhập tên khách hàng"
            />
            {errors.name && <span style={styles.fieldErrorText}>{errors.name}</span>}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
              placeholder="email@example.com"
            />
            {errors.email && <span style={styles.fieldErrorText}>{errors.email}</span>}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="address">Địa chỉ *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ ...styles.input, ...(errors.address ? styles.inputError : {}) }}
              placeholder="Nhập địa chỉ"
            />
            {errors.address && <span style={styles.fieldErrorText}>{errors.address}</span>}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="mobileNo">Điện thoại *</label>
            <input
              type="tel"
              id="mobileNo"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ ...styles.input, ...(errors.mobileNo ? styles.inputError : {}) }}
              placeholder="0901234567"
            />
            {errors.mobileNo && <span style={styles.fieldErrorText}>{errors.mobileNo}</span>}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="revenue">Doanh thu (VND) *</label>
            <input
              type="number"
              id="revenue"
              name="revenue"
              min="0"
              step="100000"
              value={formData.revenue}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ ...styles.input, ...(errors.revenue ? styles.inputError : {}) }}
              placeholder="0"
            />
            {errors.revenue && <span style={styles.fieldErrorText}>{errors.revenue}</span>}
          </div>

          <div style={styles.btnGroup}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={styles.cancelBtn}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={styles.submitBtn}
            >
              {submitting ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '2rem', display: 'flex', justifyContent: 'center' },
  card: { width: '100%', maxWidth: '500px', border: '1px solid #ccc', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#fff' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  backBtn: { padding: '0.4rem 0.8rem', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  input: { padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc', outline: 'none' },
  btnGroup: { display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' },
  cancelBtn: { padding: '0.6rem 1.2rem', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  submitBtn: { padding: '0.6rem 1.2rem', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  inputError: { borderColor: '#dc3545' },
  fieldErrorText: { color: '#dc3545', fontSize: '0.85rem' },
  error: { color: 'red', marginBottom: '1rem' },
};