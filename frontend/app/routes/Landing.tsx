import React from "react";
import { Navbar } from "../shared/components/Navbar";
import { Home } from "../features/home/components/Home";

const HomePage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Home />
    </div>
  );
};

export default HomePage;
