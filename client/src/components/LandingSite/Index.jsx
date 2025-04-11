import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"
export default function Index() {
  return (
    <>
      <Navbar />
      <Outlet />
      {/* the child routes (defined in react-router-dom) will be rendered dynamically */}
    </>
  )
}
