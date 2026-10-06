import { Form } from 'react-router';
import { Button } from 'react-bootstrap';

export function LogoutButton() {
  return (
    <Form method="post" action="/logout">
      <Button type="submit" variant="outline-danger" size="sm">
        Đăng xuất
      </Button>
    </Form>
  );
}