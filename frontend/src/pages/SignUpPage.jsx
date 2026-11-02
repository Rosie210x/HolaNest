import { useState } from 'react';
import { Form as RouterForm, useActionData, useNavigation, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import FormField from '@/components/FormField';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^0\d{9}$/;

const EMPTY_FORM = { fullName: '', email: '', phone: '', password: '', confirmPassword: '', acceptTerms: false };

// BR02
function validate(values) {
  const errors = {};
  if (!values.fullName.trim()) errors.fullName = 'Vui lòng nhập họ tên.';
  if (!values.email.trim()) errors.email = 'Vui lòng nhập email.';
  else if (!EMAIL_REGEX.test(values.email.trim())) errors.email = 'Email không đúng định dạng.';
  if (!values.phone.trim()) errors.phone = 'Vui lòng nhập số điện thoại.';
  else if (!PHONE_REGEX.test(values.phone.trim())) errors.phone = 'Số điện thoại gồm 10 chữ số, bắt đầu bằng 0.';
  if (!values.password) errors.password = 'Vui lòng nhập mật khẩu.';
  else if (values.password.length < 8 || !/\p{L}/u.test(values.password) || !/\d/.test(values.password)) {
    errors.password = 'Mật khẩu từ 8 ký tự, có cả chữ và số.';
  }
  if (values.confirmPassword !== values.password) errors.confirmPassword = 'Mật khẩu nhập lại không khớp.';
  if (!values.acceptTerms) errors.acceptTerms = 'Vui lòng đồng ý điều khoản sử dụng.';
  return errors;
}

export default function SignUpPage() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const setValue = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    const newErrors = validate(values);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      e.preventDefault();
    }
  };

  const errorFor = (name) => errors[name] || actionData?.fieldErrors?.[name];

  const textField = (name, label, type, autoComplete, extra) => (
    <FormField
      id={name}
      label={label}
      type={type}
      autoComplete={autoComplete}
      value={values[name]}
      onChange={(e) => setValue(name, e.target.value)}
      error={errorFor(name)}
      {...extra}
    />
  );

  const termsError = errorFor('acceptTerms');

  return (
    <div className="page-container flex justify-center py-8 md:py-12">
      <Card className="w-full max-w-[480px]">
        <CardHeader>
          <h1 className="text-center text-h1">
            Tạo tài khoản
          </h1>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {actionData?.error && (
            <Alert variant="destructive">
              <AlertDescription>{actionData.error}</AlertDescription>
            </Alert>
          )}

          <RouterForm method="post" onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {textField('fullName', 'Họ và tên', 'text', 'name')}
            {textField('email', 'Email', 'email', 'username')}
            {textField('phone', 'Số điện thoại', 'tel', 'tel', { inputMode: 'tel' })}
            {textField('password', 'Mật khẩu', 'password', 'new-password')}
            {textField('confirmPassword', 'Nhập lại mật khẩu', 'password', 'new-password')}

            <div className="flex flex-col gap-1.5">
              {/* The whole row is the touch target (§6.1) */}
              <Label htmlFor="acceptTerms" className="flex min-h-12 items-start gap-3 py-2 font-normal leading-6">
                <Checkbox
                  id="acceptTerms"
                  name="acceptTerms"
                  className="mt-1"
                  checked={values.acceptTerms}
                  onCheckedChange={(checked) => setValue('acceptTerms', checked === true)}
                  aria-invalid={termsError ? true : undefined}
                  aria-describedby={termsError ? 'acceptTerms-error' : undefined}
                />
                Tôi đồng ý với Điều khoản sử dụng và Chính sách quyền riêng tư của Hola Nest.
              </Label>
              {termsError && (
                <p id="acceptTerms-error" className="text-body-sm text-destructive">
                  {termsError}
                </p>
              )}
            </div>

            <Button type="submit" className="mt-2 w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" aria-hidden="true" />}
              Tạo tài khoản
            </Button>
          </RouterForm>

          <p className="text-center text-body-sm text-muted-foreground">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
              Đăng nhập
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
