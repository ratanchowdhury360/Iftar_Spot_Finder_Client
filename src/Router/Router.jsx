/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Link } from "react-router";
import Root from "../Layout/Root";
import Home from "../Pages/Home";
import CreateIftarSpot from "../Pages/CreateIftarSpot";
import MapView from "../Pages/MapView";
import ArchivedIftar from "../Pages/ArchivedIftar";
import MySpots from "../Pages/MySpots";
import MyReview from "../Pages/MyReview";
import SignIn from "../SignIn/SignIn";
import SignUp from "../SignUp/SignUp";

function MapErrorFallback() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-base-content/80">ম্যাপ লোড হয়নি। পেজ রিফ্রেশ করে আবার চেষ্টা করুন।</p>
      <Link to="/" className="btn btn-primary rounded-xl">হোমে ফিরে যান</Link>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "create", Component: CreateIftarSpot },
      { path: "archive", Component: ArchivedIftar },
      { path: "my-spots", Component: MySpots },
      { path: "my-review", Component: MyReview },
      { path: "map", Component: MapView, errorElement: <MapErrorFallback /> },
      { path: "login", Component: SignIn },
      { path: "signup", Component: SignUp },
    ],
  },
]);