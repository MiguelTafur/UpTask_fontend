import type { NoteFormData, Project, Task } from "@/types/index"
import { useForm } from "react-hook-form"
import ErrorMessage from "../ErrorMessage"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createNote } from "@/api/NoteAPI"
import { toast } from "react-toastify"

type AddNoteFormProps = {
    projectId: Project['_id']
    taskId: Task['_id']
}

export default function AddNoteForm({ projectId, taskId }: AddNoteFormProps) {
  
  const initialValues: NoteFormData = {
    content: ''
  }  

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues })

  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: createNote,
    onError: ({ message }) => {
        toast.error(message)
    },
    onSuccess: (data) => {
        queryClient.invalidateQueries({queryKey: ['task', taskId]})
        toast.success(data)
        reset()
    }
  })

  const handleAddNote = (formData: NoteFormData) => {
    mutate({ projectId, taskId, formData })
  }

  return (
    <form onSubmit={handleSubmit(handleAddNote)} className="space-y-3" noValidate>
        <div className="flex flex-col gap-2">
            <label htmlFor="content" className="font-bold">Crear Nota</label>
            <input 
                type="text" 
                id="content" 
                className="w-full p-3 border border-gray-300" 
                placeholder="Contenido de la Nota" 
                { ...register('content', {
                    required: 'El contenido de la Nota es obligatorio'
                }) }
            />
            { errors.content && (
                <ErrorMessage>{errors.content.message}</ErrorMessage>
            ) }
        </div>

        <input type="submit" value="Crear Nota" className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-2 text-white font-black cursor-pointer" />
    </form>
  )
}

