import type { Project, Task } from "@/types/index";
import AddNoteForm from "./AddNoteForm";
import NoteDetail from "./NoteDetail";

type NotesPanelProps = {
    projectId: Project['_id']
    taskId: Task['_id']
    notes: Task['notes']
}

export default function NotesPanel({ projectId, taskId, notes }: NotesPanelProps) {
  return (
    <>
      <AddNoteForm projectId={projectId} taskId={taskId} />
      <div className="divide-y mt-10 divide-gray-100">
        { notes.length ? (
          <>
            <p className="font-bold text-2xl my-5 text-slate-600">Notas: </p>
            { notes.map( note => <NoteDetail key={note._id} note={note} projectId={projectId} taskId={taskId} />) }
          </>
        ) : <p className="text-gray-500 text-center pt-3">No hay Notas</p> }
      </div>
    </>

    
  )
}
