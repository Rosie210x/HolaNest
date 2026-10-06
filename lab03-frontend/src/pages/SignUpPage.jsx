import React, { useState } from 'react';
import { Form, useActionData, useNavigation, Link } from 'react-router-dom';

export default function SignUpPage() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); 
  const [errors, setErrors] = useState({ email: '', password: '', role: '' });

  const validate = () => {
    let valid = true;
    const newErrors = { email: '', password: '', role: '' };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
      valid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Email không đúng định dạng';
      valid = false;
    }

    // Validate Password
    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      valid = false;
    }

    // Validate Role
    if (!role) {
      newErrors.role = 'Vui lòng chọn vai trò';
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
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Đăng Ký</h2>

        {actionData?.error && (
          <div style={styles.errorMessage}>{actionData.error}</div>
        )}

        <Form
          method="post"
          onSubmit={handleSubmit}
          style={styles.form}
          noValidate
        >
          {/* Trường Email */}
          <div style={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="email@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              style={{
                ...styles.input,
                ...(errors.email ? styles.inputError : {}),
              }}
            />
            {errors.email && (
              <span style={styles.fieldErrorText}>{errors.email}</span>
            )}
          </div>

          {/* Trường Mật khẩu */}
          <div style={styles.formGroup}>
            <label htmlFor="password">Mật khẩu:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password)
                  setErrors((prev) => ({ ...prev, password: '' }));
              }}
              style={{
                ...styles.input,
                ...(errors.password ? styles.inputError : {}),
              }}
            />
            {errors.password && (
              <span style={styles.fieldErrorText}>{errors.password}</span>
            )}
          </div>

          {/* Trường Vai trò (Dropdown) */}
          <div style={styles.formGroup}>
            <label htmlFor="role">Vai trò:</label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                if (errors.role) setErrors((prev) => ({ ...prev, role: '' }));
              }}
              style={{
                ...styles.input,
                ...styles.select,
                ...(errors.role ? styles.inputError : {}),
              }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <span style={styles.fieldErrorText}>{errors.role}</span>
            )}
          </div>

        
          <button type="submit" disabled={isSubmitting} style={styles.button}>
            {isSubmitting ? 'Đang xử lý...' : 'Đăng Ký'}
          </button>
        </Form>

        <div style={styles.footerText}>
          Bạn đã có tài khoản?{' '}
          <Link to="/login" style={styles.link}>
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    padding: '2rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  input: {
    padding: '0.6rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  select: {
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  fieldErrorText: {
    color: '#dc3545',
    fontSize: '0.85rem',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '0.5rem',
  },
  errorMessage: {
    padding: '0.5rem',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
  footerText: {
    marginTop: '1.5rem',
    textAlign: 'center',
    fontSize: '0.95rem',
  },
  link: {
    color: '#007bff',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
};