import React from "react";
import { Navbar } from "../shared/components/Navbar";
import Welcome from "../features/home/components/Welcome";

const WelcomePage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Welcome />
    </div>
  );
};

export default WelcomePage;
