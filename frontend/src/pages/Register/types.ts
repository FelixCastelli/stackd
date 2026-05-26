export type RegisterCredentials = {
  email: string;
  username: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
};

export type ApiErrorResponse = {
  detail?: string;
};
