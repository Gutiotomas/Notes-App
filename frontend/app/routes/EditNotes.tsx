import React from "react";
import { Navbar } from "../shared/components/Navbar";
import { EditNote } from "../features/note/components/EditNote";

const EditNotesPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <EditNote />
    </div>
  );
};

export default EditNotesPage;
