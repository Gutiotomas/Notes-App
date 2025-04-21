import React from "react";
import { Navbar } from "../shared/components/Navbar";
import { Register } from "../features/auth/components/Register";

const RegisterPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Register />
    </div>
  );
};

export default RegisterPage;
