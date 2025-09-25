import React, { useState } from 'react';
import { Heart, Eye, EyeOff, UserPlus } from 'lucide-react';
import api from '../api';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      localStorage.setItem('token', response.data.token);
      window.location.href = '/';
    } catch (error) {
      setError(error?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mb-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">Sohopathi</h1>
          <p className="text-gray-600 mt-2">AI-Powered Accessibility Assistant</p>
        </div>

        {/* Register Form */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-center text-gray-900">Create Account</h2>
            <p className="text-gray-600 text-center">Join us in making education accessible for all</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className="text-lg"
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="text-lg"
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  className="text-lg pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <Button
                type="submit"
                loading={loading}
                disabled={!formData.name || !formData.email || !formData.password}
                className="w-full text-lg py-4"
                size="lg"
              >
                {loading ? 'Creating Account...' : (
                  <>
                    <UserPlus className="h-5 w-5 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Sign in here
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-500">Join thousands of educators worldwide</p>
          <div className="flex justify-center space-x-6 text-xs text-gray-400">
            <span>✓ Free to Start</span>
            <span>✓ Privacy First</span>
            <span>✓ Always Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;