import React from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../shared/components/Navbar";
import { EditNote } from "../features/note/components/EditNote";

const EditNotesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <Navbar />
      <EditNote id={id} />
    </div>
  );
};

export default EditNotesPage;
