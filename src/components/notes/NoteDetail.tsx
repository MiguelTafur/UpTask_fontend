import { deleteNote } from "@/api/NoteAPI"
import { userAuth } from "@/hooks/userAuth"
import type { Note, Project, Task } from "@/types/index"
import { formatDate } from "@/utils/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { toast } from "react-toastify"

type NoteDetailProps = {
    note: Note
    projectId: Project['_id']
    taskId: Task['_id']
}

export default function NoteDetail({ note, projectId, taskId }: NoteDetailProps) {

  const { data, isLoading } = userAuth()
  const canDelete = useMemo(() => data?._id === note.createdBy._id, [data])

  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: deleteNote,
    onError: ({ message }) => {
        toast.error(message)
    },
    onSuccess: (data) => {
        toast.success(data)
        queryClient.invalidateQueries({queryKey: ['task', taskId]})
    }
  })

  if(isLoading) return 'Cargando...'

  return (
    <div className="p-3 flex justify-between items-center">
        <div>
            <p>
                { note.content } por: <span className="font-bold">{ note.createdBy.name }</span>
            </p>
            <p className="text-xs text-slate-600">
                { formatDate(note.createdAt) }
            </p>
        </div>
        { canDelete && (
            <button 
                className="bg-red-400 hover:bg-red-500 p-2 text-xs text-white font-bold cursor-pointer transition-colors" 
                type="button"
                onClick={() => mutate({projectId, taskId, noteId: note._id})}
            >Eliminar
            </button>
        ) }
    </div>
  )
}
