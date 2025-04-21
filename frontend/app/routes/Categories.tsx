import React from "react";
import { Navbar } from "../shared/components/Navbar";
import { Category } from "../features/note/components/Category";

const CategoriesPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Category />
    </div>
  );
};

export default CategoriesPage;
