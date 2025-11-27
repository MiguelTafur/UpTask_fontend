import Tabs from "@/components/profiles/Tabs";
import { Outlet } from "react-router-dom";


export default function ProfileLayout() {
  return (
    <>
        <Tabs />
        <Outlet />
    </>
  )
}
