import { createBrowserRouter } from "react-router";
import Root from "../Layout/Root";
import Home from "../Pages/Home";
import CreateIftarSpot from "../Pages/CreateIftarSpot";
import MapView from "../Pages/MapView";
import SignIn from "../SignIn/SignIn";
import SignUp from "../SignUp/SignUp";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "create", Component: CreateIftarSpot },
      { path: "spots", Component: Home },
      { path: "map", Component: MapView },
      { path: "login", Component: SignIn },
      { path: "signup", Component: SignUp },
    ],
  },
]);