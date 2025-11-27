import { Fragment } from "react"
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react"
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid"
import { useNavigate, useParams } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { taskProject } from "@/types/index"
import { deleteTask } from "@/api/TaskAPI"
import { toast } from "react-toastify"
import { useDraggable } from '@dnd-kit/core'

type TaskCardProps = {
    task: taskProject
    canEdit: boolean
}

export default function TaskCard({ task, canEdit }: TaskCardProps) {

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task._id
    })

    const navigate = useNavigate()
    const queryClient = useQueryClient()

    /** Obtener projectId */
    const params = useParams()
    const projectId = params.projectId!

    const { mutate } = useMutation({
        mutationFn: deleteTask,
        onError: ({message}) => {
            toast.error(message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['project', projectId]})
            toast.success(data)
            navigate(location.pathname, {replace:true})
        }
    })

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
    } : undefined

  return (
    <li className="p-5 bg-white border border-slate-300 flex justify-between gap-3" {...listeners} {...attributes} ref={setNodeRef} style={style}>
        <div className="min-w-0 flex flex-col gap-y-4" >
            <button type="button" className="cursor-pointer text-xl font-bold text-slate-600 text-left" onClick={() => navigate(location.pathname + `?viewTask=${task._id}`)} >
                {task.name}
            </button>
            <p className="text-slate-500">{task.description}</p>
        </div>
        <div className="flex shrink-0  gap-x-6" onPointerDown={e => e.stopPropagation()}>
            <Menu as="div" className="relative flex-none">
                <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                    <span className="sr-only">opciones</span>
                    <EllipsisVerticalIcon className="h-9 w-9 cursor-pointer" aria-hidden="true" />
                </MenuButton>
                <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                    <MenuItems
                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        <MenuItem>
                            <button type='button' className='cursor-pointer block px-3 py-1 text-sm leading-6 text-gray-900' onClick={() => navigate(location.pathname + `?viewTask=${task._id}`)}>
                                Ver Tarea
                            </button>
                        </MenuItem>
                        { canEdit && (
                            <>
                                <MenuItem>
                                    <button type='button' className='cursor-pointer block px-3 py-1 text-sm leading-6 text-gray-900' onClick={() => navigate(location.pathname + `?editTask=${task._id}`)}>
                                        Editar Tarea
                                    </button>
                                </MenuItem>

                                <MenuItem>
                                    <button type='button' className='cursor-pointer block px-3 py-1 text-sm leading-6 text-red-500' onClick={() => mutate({projectId, taskId: task._id}) }>
                                        Eliminar Tarea
                                    </button>
                                </MenuItem>
                            </>
                        ) }
                    </MenuItems>
                </Transition>
            </Menu>
        </div>
    </li>
  )
}
