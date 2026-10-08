// Atomus 4.0 — Sign-in block for product apps. MIT licence, https://docs.atomus.io
// A centered card: email, password, remember me, forgot password, SSO and a sign-up link. Wire onSubmit to your auth.
import { useState, type FormEvent } from 'react';
import { Alert } from '../alert';
import { Button } from '../button';
import { Card } from '../card';
import { Checkbox } from '../checkbox-radio-toggle';
import { Input } from '../input';

export interface AuthProps {
  /** Called with the form values; return an error message to show it. */
  onSubmit?: (values: { email: string; password: string; remember: boolean }) => string | void | Promise<string | void>;
}

export function Auth({ onSubmit }: AuthProps) {
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setBusy(true);
    const message = await onSubmit?.({ email: String(data.get('email') ?? ''), password: String(data.get('password') ?? ''), remember: data.get('remember') === 'on' });
    setBusy(false);
    setError(message || undefined);
  };
  return (
    <main className="ab-auth">
      <Card variant="elevated" padding="lg" className="ab-auth__card">
        <div className="ab-auth__head">
          <span className="ab-brand"><span className="ab-brand__mark" aria-hidden="true" />Atomus</span>
          <h1 className="ab-auth__title text-headline-h5">Log in to your account</h1>
          <p className="ab-auth__lead text-content-body">Welcome back! Please enter your details.</p>
        </div>
        {error ? <Alert color="error" size="sm" title="Couldn’t sign in">{error}</Alert> : null}
        <form className="ab-auth__form" onSubmit={submit}>
          <Input label="Email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required />
          <Input label="Password" name="password" type="password" autoComplete="current-password" required />
          <div className="ab-auth__row">
            <Checkbox label="Remember me" name="remember" />
            <a className="ab-auth__link" href="#forgot-password">Forgot password?</a>
          </div>
          <Button hierarchy="primary" size="lg" type="submit" fullWidth loading={busy}>Sign in</Button>
          <Button hierarchy="outline" size="lg" fullWidth>Sign in with SSO</Button>
        </form>
        <p className="ab-auth__foot">Don’t have an account? <a className="ab-auth__link" href="#sign-up">Sign up</a></p>
      </Card>
    </main>
  );
}

export default Auth;
