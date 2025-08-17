const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminRegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AdminLoginResponse {
  admin: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
  accessToken: string;
}

export interface InviteToken {
  id: number;
  token: string;
  isUsed: boolean;
  usedBy: number | null;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
  creator?: {
    name: string;
    email: string;
  };
}

// 관리자 로그인
export async function adminLogin(data: AdminLoginRequest): Promise<AdminLoginResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '로그인에 실패했습니다');
  }

  return await response.json();
}

// 관리자 등록
export async function adminRegister(data: AdminRegisterRequest): Promise<AdminLoginResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '등록에 실패했습니다');
  }

  return await response.json();
}

// 관리자 프로필 조회
export async function getAdminProfile(token: string) {
  const response = await fetch(`${API_BASE_URL}/admin/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('프로필 조회에 실패했습니다');
  }

  return await response.json();
}

// 초대 토큰 생성
export async function createInviteToken(
  token: string, 
  expiresAt?: string
): Promise<InviteToken> {
  const response = await fetch(`${API_BASE_URL}/invite-tokens`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ expiresAt }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '토큰 생성에 실패했습니다');
  }

  return await response.json();
}

// 모든 초대 토큰 조회
export async function getAllInviteTokens(token: string): Promise<InviteToken[]> {
  const response = await fetch(`${API_BASE_URL}/invite-tokens`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('토큰 목록 조회에 실패했습니다');
  }

  return await response.json();
}

// 내가 생성한 토큰 조회
export async function getMyInviteTokens(token: string): Promise<InviteToken[]> {
  const response = await fetch(`${API_BASE_URL}/invite-tokens/my-tokens`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('내 토큰 목록 조회에 실패했습니다');
  }

  return await response.json();
}