import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

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
            revenue: res.revenue || 0,
          });
        })
        .catch((err) => setError(err.message || 'Không thể lấy thông tin khách hàng'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'revenue' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (isEdit) {
        await axiosClient.put(`/customers/${id}`, formData);
      } else {
        await axiosClient.post('/customers', formData);
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

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="name">Tên Khách Hàng *</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              placeholder="Nhập tên khách hàng"
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="email@example.com"
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="address">Địa chỉ</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              style={styles.input}
              placeholder="Nhập địa chỉ"
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="mobileNo">Điện thoại</label>
            <input
              type="text"
              id="mobileNo"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              style={styles.input}
              placeholder="0901234567"
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="revenue">Doanh thu (VND)</label>
            <input
              type="number"
              id="revenue"
              name="revenue"
              min="0"
              value={formData.revenue}
              onChange={handleChange}
              style={styles.input}
              placeholder="0"
            />
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
  error: { color: 'red', marginBottom: '1rem' },
};