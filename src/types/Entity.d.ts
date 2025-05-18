interface LoginFormValues {
  email: string;
  password: string;
}

interface User {
  _id: number;
  name: string;
  phone_number: string;
  email: string;
  role: string;
  createdAt: string;
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

interface InsuranceCompany {
  _id: string;
  name: string;
  createdAt: string;
}

interface InsuranceAgent {
  _id: string;
  name: string;
  phoneNumber?: string;
  email?: string;
  insuranceCompanyId: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface Car {
  _id: string;
  make: string;
  model: string;
  manufacturingYear: number;
  engineCapacity: string;
  chasisNo: string;
  engineNo: string;
  regNo: string;
  gearType: "Auto" | "Manual" | "Column";
  carType: "Petrol" | "Diesel" | "Electric";
  createdAt: string;
}

interface CarFormValues {
  make: string;
  model: string;
  manufacturingYear: Dayjs;
  engineCapacity: string;
  chasisNo: string;
  engineNo: string;
  regNo: string;
  gearType: "Auto" | "Manual" | "Column";
  carType: "Petrol" | "Diesel" | "Electric";
}
