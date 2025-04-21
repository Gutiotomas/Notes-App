import React from "react";
import { Navbar } from "../shared/components/Navbar";
import { Login } from "../features/auth/components/Login";

const LoginPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Login />
    </div>
  );
};

export default LoginPage;
