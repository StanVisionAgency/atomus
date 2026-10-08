import { Button, Checkbox, Input } from '../../../../../react/src';
import { Brand, Stars } from './parts';

export const anatomy = ['Logo, title and one line of context', 'Form: email, password, "Remember me" and "Forgot password" row, full-width primary button', 'Divider and social sign-in', 'Footer link to the other flow (Sign up / Log in)', 'Desktop adds a brand panel with a testimonial; Type switches between Log in, Sign up, Forgot password and Verification'];

export default function AuthSection() {
  return (
    <div className="ws-auth">
      <div className="ws-auth__form">
        <Brand />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}><p className="ws-title text-web-heading-md">Log in to your account</p><p className="text-web-body">Welcome back! Please enter your details.</p></div>
        <div className="ws-form" style={{ gap: 'var(--spacing-xl)' }}>
          <Input label="Email" type="email" placeholder="you@company.com" />
          <Input label="Password" type="password" defaultValue="password" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Checkbox label="Remember me" /><Button hierarchy="link" size="sm">Forgot password</Button></div>
          <Button hierarchy="primary" size="lg" fullWidth>Sign in</Button>
          <div className="ws-or">or</div>
          <Button hierarchy="outline" size="lg" fullWidth>Sign in with Google</Button>
        </div>
        <p className="ws-small" style={{ textAlign: 'center' }}>Don’t have an account? <Button hierarchy="link" size="sm">Sign up</Button></p>
      </div>
      <div className="ws-auth__aside">
        <Stars />
        <p className="ws-title text-web-heading-sm">“Atomus cut our design-to-production time in half. Every new client starts from the same solid base.”</p>
        <p className="ws-small" style={{ opacity: 0.8 }}>Mila Petrova · Head of Design, Northwind</p>
      </div>
    </div>
  );
}
