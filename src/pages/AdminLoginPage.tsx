import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin, adminRegister } from '../services/adminApi';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const response = await adminLogin({
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem('adminToken', response.accessToken);
        navigate('/admin/dashboard');
      } else {
        const response = await adminRegister({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        });
        localStorage.setItem('adminToken', response.accessToken);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div style={{ 
      padding: 24, 
      maxWidth: 400, 
      margin: '50px auto',
      border: '1px solid #ddd',
      borderRadius: 8,
      background: '#fff'
    }}>
      <h1>{isLogin ? '관리자 로그인' : '관리자 등록'}</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: 8 }}>
            이메일
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: 12,
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 16
            }}
            disabled={loading}
          />
        </div>

        {!isLogin && (
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: 8 }}>
              이름
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: 12,
                border: '1px solid #ddd',
                borderRadius: 4,
                fontSize: 16
              }}
              disabled={loading}
            />
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: 8 }}>
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: 12,
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 16
            }}
            disabled={loading}
          />
        </div>

        {error && (
          <div style={{ 
            background: '#ffe6e6', 
            color: '#d00', 
            padding: 12, 
            borderRadius: 4, 
            marginBottom: 16 
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 16,
            background: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            fontSize: 16,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '처리 중...' : (isLogin ? '로그인' : '등록')}
        </button>
      </form>

      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{
            background: 'none',
            border: 'none',
            color: '#007bff',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          {isLogin ? '관리자 등록하기' : '로그인하기'}
        </button>
      </div>

      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: '#6c757d',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          메인으로 돌아가기
        </button>
      </div>
    </div>
  );
}