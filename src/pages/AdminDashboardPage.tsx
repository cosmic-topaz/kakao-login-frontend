import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getAdminProfile, 
  getAllInviteTokens, 
  createInviteToken,
  type InviteToken 
} from '../services/adminApi';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<any>(null);
  const [tokens, setTokens] = useState<InviteToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  const adminToken = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }

    loadData();
  }, [adminToken, navigate]);

  const loadData = async () => {
    try {
      const [profileData, tokensData] = await Promise.all([
        getAdminProfile(adminToken!),
        getAllInviteTokens(adminToken!)
      ]);
      
      setAdmin(profileData);
      setTokens(tokensData);
    } catch (err) {
      setError('데이터 로드 중 오류가 발생했습니다');
      if (err instanceof Error && err.message.includes('프로필 조회에 실패했습니다')) {
        // 토큰이 유효하지 않은 경우
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateToken = async () => {
    setCreating(true);
    setError('');

    try {
      const newToken = await createInviteToken(
        adminToken!, 
        expiresAt || undefined
      );
      
      setTokens(prev => [newToken, ...prev]);
      setExpiresAt('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '토큰 생성 중 오류가 발생했습니다');
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('토큰이 클립보드에 복사되었습니다!');
  };

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <h2>로딩 중...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: '1px solid #ddd'
      }}>
        <div>
          <h1>관리자 대시보드</h1>
          {admin && (
            <p style={{ color: '#666', margin: 0 }}>
              환영합니다, {admin.name}님 ({admin.email})
            </p>
          )}
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          로그아웃
        </button>
      </header>

      <section style={{ marginBottom: 32 }}>
        <h2>초대 토큰 생성</h2>
        <div style={{ 
          background: '#f8f9fa', 
          padding: 20, 
          borderRadius: 8,
          marginBottom: 16
        }}>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="expiresAt" style={{ 
              display: 'block', 
              marginBottom: 8, 
              fontWeight: 'bold' 
            }}>
              만료 날짜 (선택사항)
            </label>
            <input
              type="datetime-local"
              id="expiresAt"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              style={{
                padding: 8,
                border: '1px solid #ddd',
                borderRadius: 4,
                marginRight: 12
              }}
              disabled={creating}
            />
            <button
              onClick={handleCreateToken}
              disabled={creating}
              style={{
                padding: '8px 16px',
                background: creating ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: creating ? 'not-allowed' : 'pointer'
              }}
            >
              {creating ? '생성 중...' : '토큰 생성'}
            </button>
          </div>
          
          {error && (
            <div style={{ 
              background: '#ffe6e6', 
              color: '#d00', 
              padding: 12, 
              borderRadius: 4 
            }}>
              {error}
            </div>
          )}
        </div>
      </section>

      <section>
        <h2>초대 토큰 목록 ({tokens.length}개)</h2>
        {tokens.length === 0 ? (
          <p style={{ color: '#666' }}>생성된 토큰이 없습니다.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              background: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: 12, textAlign: 'left', border: '1px solid #ddd' }}>토큰</th>
                  <th style={{ padding: 12, textAlign: 'left', border: '1px solid #ddd' }}>상태</th>
                  <th style={{ padding: 12, textAlign: 'left', border: '1px solid #ddd' }}>생성일</th>
                  <th style={{ padding: 12, textAlign: 'left', border: '1px solid #ddd' }}>만료일</th>
                  <th style={{ padding: 12, textAlign: 'left', border: '1px solid #ddd' }}>액션</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((token) => (
                  <tr key={token.id}>
                    <td style={{ 
                      padding: 12, 
                      border: '1px solid #ddd',
                      fontFamily: 'monospace',
                      fontSize: 12
                    }}>
                      {token.token.substring(0, 20)}...
                    </td>
                    <td style={{ padding: 12, border: '1px solid #ddd' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: 4,
                        fontSize: 12,
                        background: token.isUsed ? '#dc3545' : '#28a745',
                        color: 'white'
                      }}>
                        {token.isUsed ? '사용됨' : '미사용'}
                      </span>
                    </td>
                    <td style={{ padding: 12, border: '1px solid #ddd' }}>
                      {new Date(token.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: 12, border: '1px solid #ddd' }}>
                      {token.expiresAt 
                        ? new Date(token.expiresAt).toLocaleString()
                        : '무제한'
                      }
                    </td>
                    <td style={{ padding: 12, border: '1px solid #ddd' }}>
                      <button
                        onClick={() => copyToClipboard(token.token)}
                        style={{
                          padding: '4px 8px',
                          background: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 12
                        }}
                      >
                        복사
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}