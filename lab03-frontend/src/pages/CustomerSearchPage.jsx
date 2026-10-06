import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

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
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Quản lý & Tìm kiếm Khách hàng</h2>

      {/* Form tìm kiếm */}
      <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
        <input
          type="text"
          placeholder="Tìm theo Tên..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Tìm theo Email..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.searchBtn}>
          Tìm kiếm
        </button>
        <button type="submit" style={styles.searchBtn}>
          <Link to={`/customers/add`} style={styles.btnDetail}>
                        Thêm mới
                      </Link> 
        </button>
        
      </form>

      {error && <div style={styles.error}>{error}</div>}

      {/* Bảng hiển thị danh sách */}
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <>
          <table style={styles.table}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Tên</th>

                <th style={styles.th}>Địa chỉ</th>
                <th style={styles.th}>Số điện thoại</th>
                <th style={styles.th}>Doanh thu</th>
                <th style={styles.th}></th>
                <th style={styles.th}></th>

              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map((c) => (
                  <tr key={c.customerId}>
                    <td style={styles.td}>{c.customerId}</td>
                    <td style={styles.td}>{c.email}</td>
                    <td style={styles.td}>{c.name}</td>
                    <td style={styles.td}>{c.address}</td>
                    <td style={styles.td}>{c.mobileNo}</td>
                    <td style={styles.td}>
                      {c.revenue ? c.revenue.toLocaleString('vi-VN') : 0} VNĐ
                    </td>
                    <td>

                    </td>
                    <td style={styles.td}>
                      <Link to={`/customers/${c.customerId}`} style={styles.btnDetail}>
                        Xem chi tiết
                      </Link> </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ ...styles.td, textAlign: 'center' }}>
                    Không tìm thấy khách hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Thanh phân trang */}
          <div style={styles.pagination}>
            <span>
              Tổng số: <strong>{totalElements}</strong> kết quả (Trang {page + 1}/{totalPages})
            </span>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                disabled={page === 0}
                onClick={() => setPage((prev) => prev - 1)}
                style={styles.pageBtn}
              >
                Trang trước
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((prev) => prev + 1)}
                style={styles.pageBtn}
              >
                Trang sau
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  searchForm: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  input: {
    flex: 1,
    padding: '0.6rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  searchBtn: {
    padding: '0.6rem 1.2rem',
    backgroundColor: '#288ea7',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
  },
  th: {
    border: '1px solid #ddd',
    padding: '10px',
    textAlign: 'left',
  },
  td: {
    border: '1px solid #ddd',
    padding: '10px',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1rem',
  },
  pageBtn: {
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginBottom: '1rem',
  },
};