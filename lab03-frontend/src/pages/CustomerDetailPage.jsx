import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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

  if (loading) return <div style={styles.container}>Đang tải thông tin...</div>;
  if (error) return <div style={styles.container}><p style={{ color: 'red' }}>{error}</p><button onClick={() => navigate(-1)} style={styles.backBtn}>Quay lại</button></div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2>Chi tiết Khách hàng</h2>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>
            ← Quay lại
          </button>
        </div>

        <div style={styles.infoGroup}>
          <label style={styles.label}>Tên Khách Hàng:</label>
          <span style={styles.value}>{customer.name}</span>
        </div>

        <div style={styles.infoGroup}>
          <label style={styles.label}>Email:</label>
          <span style={styles.value}>{customer.email}</span>
        </div>

        <div style={styles.infoGroup}>
          <label style={styles.label}>Địa chỉ:</label>
          <span style={styles.value}>{customer.address || 'N/A'}</span>
        </div>

        <div style={styles.infoGroup}>
          <label style={styles.label}>Điện thoại:</label>
          <span style={styles.value}>{customer.mobileNo || 'N/A'}</span>
        </div>

        <div style={styles.infoGroup}>
          <label style={styles.label}>Doanh thu (VND):</label>
          <span style={styles.value}>
            {customer.revenue ? Number(customer.revenue).toLocaleString('vi-VN') : 0} VNĐ
          </span>
        </div>

        <div style={styles.actions}>
          <Link to={`/customers/edit/${id}`} style={styles.editBtn}>
            Chỉnh sửa
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '2rem', display: 'flex', justifyContent: 'center' },
  card: { width: '100%', maxWidth: '550px', border: '1px solid #ccc', borderRadius: '8px', padding: '1.5rem', backgroundColor: '#fff' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  backBtn: { padding: '0.4rem 0.8rem', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  infoGroup: { display: 'flex', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' },
  label: { width: '150px', fontWeight: 'bold', color: '#555' },
  value: { flex: 1, color: '#333' },
  actions: { marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' },
  editBtn: { padding: '0.6rem 1.2rem', backgroundColor: '#ffc107', color: '#000', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' },
};