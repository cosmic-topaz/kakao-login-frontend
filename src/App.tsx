import { useState } from 'react'

const API = import.meta.env.VITE_API_BASE_URL;


export default function App() {
  const [out, setOut] = useState("Ready.");
  const login = () => {
    const url = new URL(`${API}/auth/kakao`);
    url.searchParams.set("returnTo", "/auth/kakao/callback");
    location.href = url.toString();
  };
  const me = async () => {
    const r = await fetch(`${API}/auth/me`, { credentials: "include" });
    setOut(JSON.stringify(r.ok ? await r.json() : { error: r.status }, null, 2));
  };
  return (
    <div style={{ padding: 24 }}>
      <h1>Kakao OAuth Test</h1>
      <button onClick={login}>카카오로 로그인</button>{" "}
      <button onClick={me}>나 누구임(/auth/me)</button>
      <pre>{out}</pre>
    </div>
  );
}

