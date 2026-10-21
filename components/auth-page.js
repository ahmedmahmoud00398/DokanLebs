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
    <main className="grid min-h-[75vh] place-items-center bg-[#f1f1ef] px-5 py-9 max-[820px]:px-[18px] max-[700px]:px-3 max-[700px]:py-4">
      <section className="grid min-h-[650px] w-full max-w-[1120px] grid-cols-2 gap-7 rounded-[20px] bg-white p-3 max-[820px]:min-h-0 max-[700px]:block max-[700px]:p-2" aria-labelledby="auth-title">
        <div className="flex min-h-[620px] items-center justify-center gap-[18px] overflow-hidden rounded-[14px] bg-[linear-gradient(145deg,#e4e5e4,#cfd1d0)] max-[820px]:min-h-[500px] max-[700px]:hidden" aria-label="Dokan Lebss clothing accessories">
          <span className="flex h-[78%] w-[43%] rotate-[10deg] flex-col justify-between bg-[#f8f8f6] p-6 text-[#111] shadow-[0_18px_35px_#0003]">
            <strong className="text-[clamp(25px,4vw,52px)] leading-[.85]">DOKAN<br />LEBSS</strong>
            <small className="text-xs leading-[1.8] tracking-[2px]">CLOTHING · SHOES<br />ACCESSORIES</small>
            <b className="text-[10px] tracking-[2px]">WEAR YOUR VIBE</b>
          </span>
          <span className="flex h-[78%] w-[43%] rotate-[5deg] flex-col justify-between bg-[#111] p-6 text-white shadow-[0_18px_35px_#0003]">
            <strong className="text-[clamp(25px,4vw,52px)] leading-[.85]">DOKAN<br />LEBSS</strong>
            <small className="text-xs leading-[1.8] tracking-[2px]">SPRING 26<br />WINTER 26</small>
          </span>
        </div>
        <div className="flex flex-col justify-center px-[clamp(20px,4vw,56px)] py-7 max-[700px]:px-3 max-[700px]:py-[22px]">
        <Link className="w-fit text-2xl text-[#111]" href="/" aria-label="Back to home">←</Link>
        <h1 className="my-2 text-[34px] max-[700px]:text-[28px]" id="auth-title">{isForgot ? 'Forgot password' : isSignup ? 'Create an account' : 'Log in'}</h1>
        {isSignup && <p className="mb-5 text-[13px]">Already have an account? <Link className="text-[#111] underline" href="/login">Log in</Link></p>}
        {mode === 'login' && <button className="outline-button min-h-[44px] w-full" type="button" onClick={google} disabled={loading}>Continue with Google</button>}
        {!isForgot && mode === 'login' && <p className="text-[13px]">or continue with email</p>}
        <form className="grid gap-[14px]" onSubmit={submit} noValidate>
          {isSignup && <div className="grid grid-cols-2 gap-3 max-[700px]:gap-2"><label className="grid gap-[7px] text-[13px]">First Name<input className="min-h-[42px] w-full rounded-lg border border-[#ddd] px-3" autoComplete="given-name" placeholder="First Name" value={values.firstName} onChange={(event) => setValues({ ...values, firstName: event.target.value })} required /></label><label className="grid gap-[7px] text-[13px]">Last Name<input className="min-h-[42px] w-full rounded-lg border border-[#ddd] px-3" autoComplete="family-name" placeholder="Last Name" value={values.lastName} onChange={(event) => setValues({ ...values, lastName: event.target.value })} required /></label></div>}
          <label className="grid gap-[7px] text-[13px]">Email<input className="min-h-[42px] w-full rounded-lg border border-[#ddd] px-3" type="email" autoComplete="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} required /></label>
          {isSignup && <label className="grid gap-[7px] text-[13px]">Phone Number<div className="flex items-center gap-[10px] rounded-lg border border-[#ddd] px-[10px]"><span>+20</span><input className="min-h-[42px] w-full border-0 px-3" type="tel" autoComplete="tel-national" placeholder="Phone Number" value={values.phone} onChange={(event) => setValues({ ...values, phone: event.target.value })} required /></div></label>}
          {!isForgot && <label className="grid gap-[7px] text-[13px]">Password<div className="password-field"><input className="min-h-[42px] w-full rounded-lg border border-[#ddd] px-3" type={showPassword ? 'text' : 'password'} autoComplete={isSignup ? 'new-password' : 'current-password'} value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} required minLength={8} /><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button></div></label>}
          {isSignup && <><p className="text-[13px]">Use at least 8 characters.</p><label className="grid gap-[7px] text-[13px]">Confirm password<input className="min-h-[42px] w-full rounded-lg border border-[#ddd] px-3" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={values.confirmation} onChange={(event) => setValues({ ...values, confirmation: event.target.value })} required /></label><label className="flex w-full items-center justify-start gap-2 self-start text-left text-xs leading-[1.4]"><input className="m-0 size-4 shrink-0 p-0" type="checkbox" checked={values.terms} onChange={(event) => setValues({ ...values, terms: event.target.checked })} /><span>I agree to the <span className="underline">Terms &amp; Conditions</span></span></label></>}
          {error && <p className="form-error" role="alert">{error}</p>}
          {message && <p role="status">{message}</p>}
          <button className="black-button min-h-[44px]" type="submit" disabled={loading}>{loading ? 'Please wait…' : isForgot ? 'Send reset request' : isSignup ? 'Create account' : 'Log in'}</button>
        </form>
        {mode === 'login' && <Link className="mt-3 text-[13px] text-[#111] underline" href="/forgot-password">Forgot password?</Link>}
        <p className="mt-[18px] text-center text-[13px]">{isSignup ? 'Already have an account?' : isForgot ? 'Remembered your password?' : 'New to Dokan Lebss?'} <Link className="text-[#111] underline" href={isSignup || isForgot ? '/login' : '/signup'}>{isSignup || isForgot ? 'Log in' : 'Sign up'}</Link></p>
        </div>
      </section>
    </main>
  );
}
