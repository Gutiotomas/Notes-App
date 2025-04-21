import React from "react";
import { Navbar } from "../shared/components/Navbar";
import { Archive } from "../features/note/components/ArchiveNote";

const ArchiveNotesPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Archive />
    </div>
  );
};

export default ArchiveNotesPage;
