import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Separator } from '../components/ui/separator';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const loginData = await login(email, password);

      if (loginData.role === 'admin') {
        navigate('/admin');
      } else {
        try {
          await api.get('/roadmap/');
          navigate('/roadmap');
        } catch {
          navigate('/select-profile');
        }
      }
    } catch {
      alert('Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-xl">
        <div className="mb-8 space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Sign in</p>
          <h1 className="text-3xl font-semibold text-slate-900">Welcome back</h1>
          <p className="text-sm text-slate-500">Continue your learning journey with a clean workspace.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" className="w-full">Sign in</Button>
        </form>

        <Separator />

        <p className="text-center text-sm text-slate-600">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-sky-600 hover:text-sky-700">
            Create one
          </Link>
        </p>
      </Card>
    </div>
  );
}