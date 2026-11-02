import { useState } from 'react';
import { Form as RouterForm, useActionData, useNavigation, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import FormField from '@/components/FormField';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignInPage() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập email.';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      newErrors.email = 'Email không đúng định dạng.';
    }
    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    if (!validate()) {
      e.preventDefault();
    }
  };

  return (
    <div className="page-container flex justify-center py-8 md:py-12">
      <Card className="w-full max-w-[420px]">
        <CardHeader>
          <h1 className="text-center text-h1">
            Đăng nhập
          </h1>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {actionData?.error && (
            <Alert variant="destructive">
              <AlertDescription>{actionData.error}</AlertDescription>
            </Alert>
          )}

          <RouterForm method="post" onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <FormField
              id="email"
              label="Email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email || actionData?.fieldErrors?.email}
            />
            <FormField
              id="password"
              label="Mật khẩu"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password || actionData?.fieldErrors?.password}
            />

            <Button type="submit" className="mt-2 w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" aria-hidden="true" />}
              Đăng nhập
            </Button>
          </RouterForm>

          <p className="text-center text-body-sm text-muted-foreground">
            Chưa có tài khoản?{' '}
            <Link to="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
              Đăng ký
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
