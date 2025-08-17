import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { startKakaoLogin, getProfile } from '../services/api';

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const [out, setOut] = useState("Ready.");
  const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'));
  
  useEffect(() => {
    // URL에서 토큰 확인 (로그인 성공 후 리다이렉트)
    const tokenFromUrl = searchParams.get('token');
    const signupSuccess = searchParams.get('signup');
    
    console.log('URL 파라미터:', window.location.search);
    console.log('토큰 from URL:', tokenFromUrl);
    console.log('기존 토큰:', localStorage.getItem('accessToken'));
    
    if (tokenFromUrl) {
      localStorage.setItem('accessToken', tokenFromUrl);
      setToken(tokenFromUrl);
      // URL에서 토큰 제거
      window.history.replaceState({}, document.title, window.location.pathname);
      setOut("로그인 성공!");
    } else if (signupSuccess === 'success') {
      // URL에서 signup 파라미터 제거
      window.history.replaceState({}, document.title, window.location.pathname);
      setOut("가입이 완료되었습니다! 환영합니다!");
    }
  }, [searchParams]);
  
  const login = () => {
    startKakaoLogin();
  };
  
  const me = async () => {
    if (!token) {
      setOut("로그인이 필요합니다.");
      return;
    }
    
    try {
      console.log('프로필 조회 시작');
      console.log('토큰:', token);
      
      setOut("API 호출 중...");
      
      const data = await getProfile(token);
      console.log('응답 데이터:', data);
      setOut(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('프로필 조회 에러:', error);
      if (error instanceof Error && error.message.includes('프로필 조회에 실패했습니다')) {
        // 토큰이 유효하지 않은 경우
        localStorage.removeItem('accessToken');
        setToken(null);
        setOut("토큰이 만료되었습니다. 다시 로그인해주세요.");
      } else {
        setOut(JSON.stringify({ error: 'Network Error', message: error instanceof Error ? error.message : 'Unknown error' }, null, 2));
      }
    }
  };
  
  const logout = () => {
    localStorage.removeItem('accessToken');
    setToken(null);
    setOut("로그아웃 완료");
  };
  
  return (
    <div style={{ padding: 24 }}>
      <h1>Kakao OAuth Test</h1>
      <p>토큰 상태: {token ? "있음" : "없음"}</p>
      <p>토큰 값: {token || "null"}</p>
      {!token ? (
        <button onClick={login} style={{
          padding: '12px 24px',
          background: '#fee500',
          border: 'none',
          borderRadius: 4,
          fontSize: 16,
          cursor: 'pointer'
        }}>
          카카오로 로그인
        </button>
      ) : (
        <div>
          <button onClick={me} style={{
            padding: '8px 16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            marginRight: 8,
            cursor: 'pointer'
          }}>
            내 정보 확인
          </button>
          <button onClick={logout} style={{
            padding: '8px 16px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}>
            로그아웃
          </button>
        </div>
      )}
      <pre style={{ 
        background: '#f8f9fa', 
        padding: 16, 
        borderRadius: 4, 
        marginTop: 16,
        whiteSpace: 'pre-wrap'
      }}>
        {out}
      </pre>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <a 
          href="/admin/login"
          style={{
            color: '#6c757d',
            textDecoration: 'underline',
            fontSize: 14
          }}
        >
          관리자 로그인
        </a>
      </div>
    </div>
  );
}