const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface UserInfo {
  name: string;
  email: string;
  gender: string;
  birthyear: string;
  birthday: string;
}

export interface PendingSignupResponse {
  valid: boolean;
  user?: UserInfo;
  message?: string;
}

export interface InviteTokenValidationResponse {
  valid: boolean;
  message: string;
  tokenInfo?: {
    id: number;
    createdAt: string;
    expiresAt: string | null;
  };
}

export interface CompleteSignupResponse {
  customer: {
    id: number;
    email: string;
    name: string;
  };
  accessToken: string;
}

// 임시 저장된 사용자 정보 조회
export async function getPendingSignup(signupToken: string): Promise<PendingSignupResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/pending-signup/${signupToken}`);
  return await response.json();
}

// 초대 토큰 검증
export async function validateInviteToken(token: string): Promise<InviteTokenValidationResponse> {
  const response = await fetch(`${API_BASE_URL}/invite-tokens/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });
  return await response.json();
}

// 가입 완료
export async function completeSignup(
  signupToken: string,
  inviteToken: string
): Promise<CompleteSignupResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/complete-signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      signupToken,
      inviteToken,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '가입 처리 중 오류가 발생했습니다');
  }

  return await response.json();
}

// 카카오 로그인 시작
export function startKakaoLogin() {
  const url = new URL(`${API_BASE_URL}/auth/kakao`);
  window.location.href = url.toString();
}

// 프로필 조회
export async function getProfile(token: string) {
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
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