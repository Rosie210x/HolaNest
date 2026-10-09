import { useNavigate } from 'react-router';
import { Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export function LogoutButton() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Button variant="outline-danger" size="sm" onClick={handleLogout}>
      Đăng xuất
    </Button>
  );
}
