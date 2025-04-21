import React from "react";
import { Navbar } from "../shared/components/Navbar";
import { Note } from "../features/note/components/Note";

const NotesPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Note />
    </div>
  );
};

export default NotesPage;
