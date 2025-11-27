import { addUserToProject } from "@/api/TeamAPI"
import type { Project, TeamMember } from "@/types/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

type SearchResultProps = {
    user: TeamMember
    projectId: Project['_id']
    reset: () => void
}

export default function SearchResult({ user, projectId, reset }: SearchResultProps) {

  const navigate = useNavigate()  
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: addUserToProject,
    onError: ({ message }) => {
        toast.error(message)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({queryKey: ['projectTeam', projectId]})
      toast.success(data)
      reset()
      navigate(location.pathname, { replace: true })
    }
  })  

  const handleAddUserToProject = () => {
    const data = { id: user._id, projectId }
    mutate(data)
  }

  return (
    <>
        <p className="mt-10 text-center font-bold">Resultado: </p>
        <div className="flex justify-between items-center">
            <p>{user.name}</p>
            <button className="text-purple-600 hover:bg-purple-100 px-10 py-3 font-bold cursor-pointer transition-colors" onClick={handleAddUserToProject}>
                Agregar al Proyecto
            </button>
        </div>
    </>
  )
}
