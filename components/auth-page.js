'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authService } from '@/lib/store-services';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthPage({ mode }) {
  const [values, setValues] = useState({ firstName: '', lastName: '', phone: '', email: '', password: '', confirmation: '', terms: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const isSignup = mode === 'signup';
  const isForgot = mode === 'forgot-password';

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    if (!values.email.trim()) return setError('Enter your email address.');
    if (!emailPattern.test(values.email)) return setError('Enter a valid email address.');
    if (!isForgot && !values.password) return setError('Enter your password.');
    if (isSignup && (!values.firstName.trim() || !values.lastName.trim() || !values.phone.trim())) return setError('Enter your first name, last name, and phone number.');
    if (isSignup && !values.terms) return setError('Please accept the Terms & Conditions.');
    if ((isSignup || (!isForgot && mode === 'login')) && values.password.length < 8) {
      return setError('Use at least 8 characters for your password.');
    }
    if (isSignup && values.password !== values.confirmation) return setError('Passwords do not match.');

    setLoading(true);
    try {
      if (isForgot) await authService.requestPasswordReset(values.email);
      else if (isSignup) await authService.register({ name: `${values.firstName.trim()} ${values.lastName.trim()}`, phone: values.phone.trim(), email: values.email, password: values.password });
      else await authService.login({ email: values.email, password: values.password });
      setMessage('Request completed.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'This service is unavailable right now.');
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setLoading(true);
    setError('');
    try {
      await authService.signInWithGoogle();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Google sign-in is unavailable right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-layout" aria-labelledby="auth-title">
        <div className="auth-art" aria-label="Dokan Lebss clothing accessories"><span className="auth-tag auth-tag-light"><strong>DOKAN<br />LEBSS</strong><small>CLOTHING · SHOES<br />ACCESSORIES</small><b>WEAR YOUR VIBE</b></span><span className="auth-tag auth-tag-dark"><strong>DOKAN<br />LEBSS</strong><small>SPRING 26<br />WINTER 26</small></span></div>
        <div className="auth-card">
        <Link className="auth-back" href="/" aria-label="Back to home">←</Link>
        <h1 id="auth-title">{isForgot ? 'Forgot password' : isSignup ? 'Create an account' : 'Log in'}</h1>
        {isSignup && <p className="auth-subtitle">Already have an account? <Link href="/login">Log in</Link></p>}
        {mode === 'login' && <button className="outline-button" type="button" onClick={google} disabled={loading}>Continue with Google</button>}
        {!isForgot && mode === 'login' && <p className="auth-divider">or continue with email</p>}
        <form onSubmit={submit} noValidate>
          {isSignup && <div className="auth-name-fields"><label>First Name<input autoComplete="given-name" placeholder="First Name" value={values.firstName} onChange={(event) => setValues({ ...values, firstName: event.target.value })} required /></label><label>Last Name<input autoComplete="family-name" placeholder="Last Name" value={values.lastName} onChange={(event) => setValues({ ...values, lastName: event.target.value })} required /></label></div>}
          <label>Email<input type="email" autoComplete="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} required /></label>
          {isSignup && <label>Phone Number<div className="auth-phone-field"><span>+20</span><input type="tel" autoComplete="tel-national" placeholder="Phone Number" value={values.phone} onChange={(event) => setValues({ ...values, phone: event.target.value })} required /></div></label>}
          {!isForgot && <label>Password<div className="password-field"><input type={showPassword ? 'text' : 'password'} autoComplete={isSignup ? 'new-password' : 'current-password'} value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} required minLength={8} /><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button></div></label>}
          {isSignup && <><p className="auth-hint">Use at least 8 characters.</p><label>Confirm password<input type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={values.confirmation} onChange={(event) => setValues({ ...values, confirmation: event.target.value })} required /></label><label className="auth-terms"><input type="checkbox" checked={values.terms} onChange={(event) => setValues({ ...values, terms: event.target.checked })} /> I agree to the <a href="/refund-policy">Terms &amp; Conditions</a></label></>}
          {error && <p className="form-error" role="alert">{error}</p>}
          {message && <p role="status">{message}</p>}
          <button className="black-button" type="submit" disabled={loading}>{loading ? 'Please wait…' : isForgot ? 'Send reset request' : isSignup ? 'Create account' : 'Log in'}</button>
        </form>
        {mode === 'login' && <Link className="auth-link" href="/forgot-password">Forgot password?</Link>}
        <p className="auth-switch">{isSignup ? 'Already have an account?' : isForgot ? 'Remembered your password?' : 'New to Dokan Lebss?'} <Link href={isSignup || isForgot ? '/login' : '/signup'}>{isSignup || isForgot ? 'Log in' : 'Sign up'}</Link></p>
        </div>
      </section>
    </main>
  );
}
