import { useEffect, useState } from 'react';
import { CircleCheck, CircleX } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Placeholder for the landlord and admin areas: shows what the backend answers for this role
export default function AccessCheckPage({ title, check }) {
  const [result, setResult] = useState(null);

  useEffect(() => {
    let active = true;
    check()
      .then((res) => active && setResult({ ok: true, text: res.message }))
      .catch((err) => active && setResult({ ok: false, text: err.message }));
    return () => {
      active = false;
    };
  }, [check]);

  return (
    <div className="page-container flex flex-col gap-4 py-6">
      <h1 className="text-display">{title}</h1>
      {result && (
        <Alert variant={result.ok ? 'default' : 'destructive'}>
          {result.ok ? <CircleCheck className="text-available" aria-hidden="true" /> : <CircleX aria-hidden="true" />}
          <AlertDescription>{result.text}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
