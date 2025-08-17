import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  getPendingSignup, 
  validateInviteToken, 
  completeSignup,
  type UserInfo 
} from '../services/api';

export default function SignupPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const signupToken = searchParams.get('token');

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [inviteToken, setInviteToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    if (!signupToken) {
      setError('잘못된 접근입니다.');
      setLoading(false);
      return;
    }

    loadUserInfo();
  }, [signupToken]);

  const loadUserInfo = async () => {
    try {
      const response = await getPendingSignup(signupToken!);
      if (response.valid && response.user) {
        setUserInfo(response.user);
      } else {
        setError(response.message || '사용자 정보를 불러올 수 없습니다.');
      }
    } catch (err) {
      setError('사용자 정보 조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleValidateToken = async () => {
    if (!inviteToken.trim()) {
      setValidationMessage('초대 토큰을 입력해주세요.');
      return;
    }

    try {
      const response = await validateInviteToken(inviteToken.trim());
      if (response.valid) {
        setValidationMessage('✅ ' + response.message);
        setError('');
      } else {
        setValidationMessage('❌ ' + response.message);
      }
    } catch (err) {
      setValidationMessage('❌ 토큰 검증 중 오류가 발생했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteToken.trim()) {
      setError('초대 토큰을 입력해주세요.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await completeSignup(signupToken!, inviteToken.trim());
      
      // 토큰 저장
      localStorage.setItem('accessToken', response.accessToken);
      
      // 메인 페이지로 이동
      navigate('/?signup=success');
    } catch (err) {
      setError(err instanceof Error ? err.message : '가입 처리 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <h2>사용자 정보를 불러오는 중...</h2>
      </div>
    );
  }

  if (error && !userInfo) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <h2>오류</h2>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={() => navigate('/')}>메인으로 돌아가기</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 500, margin: '0 auto' }}>
      <h1>회원가입</h1>
      
      {userInfo && (
        <div style={{ 
          background: '#f5f5f5', 
          padding: 16, 
          borderRadius: 8, 
          marginBottom: 24 
        }}>
          <h3>카카오 계정 정보</h3>
          <p><strong>이름:</strong> {userInfo.name}</p>
          <p><strong>이메일:</strong> {userInfo.email}</p>
          <p><strong>성별:</strong> {userInfo.gender}</p>
          <p><strong>생년:</strong> {userInfo.birthyear}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="inviteToken" style={{ 
            display: 'block', 
            marginBottom: 8, 
            fontWeight: 'bold' 
          }}>
            초대 토큰
          </label>
          <input
            type="text"
            id="inviteToken"
            value={inviteToken}
            onChange={(e) => setInviteToken(e.target.value)}
            placeholder="관리자로부터 받은 초대 토큰을 입력하세요"
            style={{
              width: '100%',
              padding: 12,
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 16
            }}
            disabled={submitting}
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <button
            type="button"
            onClick={handleValidateToken}
            style={{
              padding: '8px 16px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 14
            }}
            disabled={submitting}
          >
            토큰 검증
          </button>
          {validationMessage && (
            <p style={{ 
              marginTop: 8, 
              fontSize: 14,
              color: validationMessage.startsWith('✅') ? 'green' : 'red'
            }}>
              {validationMessage}
            </p>
          )}
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
          disabled={submitting || !inviteToken.trim()}
          style={{
            width: '100%',
            padding: 16,
            background: submitting || !inviteToken.trim() ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            fontSize: 16,
            cursor: submitting || !inviteToken.trim() ? 'not-allowed' : 'pointer'
          }}
        >
          {submitting ? '처리 중...' : '가입 완료'}
        </button>
      </form>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <button 
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: '#007bff',
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