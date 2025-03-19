export interface CheckAuthResponse {
    authorized: boolean;
    message?: string;
  }
  
  export interface UserResponse {
    message: string;
    user: {
      id: string;
      email: string;
      name: string;
    };
    error?: string;
  }