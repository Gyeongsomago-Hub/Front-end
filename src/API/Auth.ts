export interface SignUpPayload {
    username: string;
    password: string;
    name: string;
    grade: string;
    classNumber: string;
    department: string;
    role: "USER";
  }
  
  export interface LoginPayload {
    username: string;
    password: string;
  }
  
  export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
  }
  
  const BASE_URL = "http://localhost:8060";
  
  /**
   * 회원가입 API 호출
   * @param data SignUpPayload
   * @returns 서버 응답(JSON)
   */
  export async function signUp(data: SignUpPayload): Promise<any> {
    const response = await fetch(`${BASE_URL}/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "회원가입에 실패했습니다.");
    }
  
    return response.json();
  }
  
  /**
   * 로그인 API 호출
   * @param data LoginPayload
   * @returns AuthResponse (accessToken, refreshToken)
   */
  export async function login(data: LoginPayload): Promise<AuthResponse> {
    const response = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "로그인에 실패했습니다.");
    }
  
    return response.json();
  }
  