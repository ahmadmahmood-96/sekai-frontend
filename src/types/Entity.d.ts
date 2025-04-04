interface LoginFormValues {
  email: string;
  password: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface LoginReturnValues {
  message: string;
  token: string;
  user: User;
}

interface SignupFormValues {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  role: "admin" | "salesperson";
}

interface APIReturnResponse {
  message: string;
}

interface Company {
  _id: string;
  name: string;
}
