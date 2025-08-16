import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_BASE_URL;

export default function App() {
  const [out, setOut] = useState("Ready.");
  const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'));
  
  useEffect(() => {
    // URL에서 토큰 확인 (로그인 성공 후 리다이렉트)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    console.log('URL 파라미터:', window.location.search);
    console.log('토큰 from URL:', tokenFromUrl);
    console.log('기존 토큰:', localStorage.getItem('accessToken'));
    
    if (tokenFromUrl) {
      localStorage.setItem('accessToken', tokenFromUrl);
      setToken(tokenFromUrl);
      // URL에서 토큰 제거
      window.history.replaceState({}, document.title, window.location.pathname);
      setOut("로그인 성공!");
    }
  }, []);
  
  const login = () => {
    const url = new URL(`${API}/auth/kakao`);
    location.href = url.toString();
  };
  
  const me = async () => {
    if (!token) {
      setOut("로그인이 필요합니다.");
      return;
    }
    
    try {
      console.log('API 호출 시작:', `${API}/auth/profile`);
      console.log('토큰:', token);
      
      setOut("API 호출 중...");
      
      const r = await fetch(`${API}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('응답 상태:', r.status);
      console.log('응답 헤더:', r.headers);
      
      if (r.ok) {
        const data = await r.json();
        console.log('응답 데이터:', data);
        setOut(JSON.stringify(data, null, 2));
      } else {
        const errorText = await r.text();
        console.log('에러 응답:', errorText);
        setOut(JSON.stringify({ error: r.status, message: errorText }, null, 2));
      }
    } catch (error) {
      console.error('API 호출 에러:', error);
      setOut(JSON.stringify({ error: 'Network Error', message: error.message }, null, 2));
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
        <button onClick={login}>카카오로 로그인</button>
      ) : (
        <>
          <button onClick={me}>내 정보 확인</button>{" "}
          <button onClick={logout}>로그아웃</button>
        </>
      )}
      <pre>{out}</pre>
    </div>
  );
}

