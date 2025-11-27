import ProfileForm from "@/components/profiles/ProfileForm"
import { userAuth } from "@/hooks/userAuth"

export default function ProfileView() {

  const { data, isLoading } = userAuth()
  if(isLoading) return 'Cargando...'
  if(data) return <ProfileForm data={data} />  

}
