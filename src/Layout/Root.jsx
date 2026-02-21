import { Outlet } from "react-router";
import Navber from "../Shared/Navber";


const Root = () => {
    return (
        <div>
            <Navber></Navber>
            <Outlet></Outlet>
        </div>
    );
};

export default Root;