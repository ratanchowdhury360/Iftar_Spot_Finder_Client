import { Outlet } from "react-router";
import Navber from "../Shared/Navber";


const Root = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navber />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Root;