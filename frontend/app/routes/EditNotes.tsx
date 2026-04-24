import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { Navbar } from "../shared/components/Navbar";
import { EditNote } from "../features/note/components/EditNote";

const EditNotesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigationState = location.state as
    | { from?: string; focusNoteId?: number }
    | undefined;

  return (
    <div>
      <Navbar />
      <EditNote
        id={id}
        returnTo={navigationState?.from}
        focusNoteId={navigationState?.focusNoteId}
      />
    </div>
  );
};

export default EditNotesPage;
