import { createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AddTemple from "./pages/AddTemple";
import TempleDetails from "./pages/TempleDetails";
import About from "./pages/About";
import AddNiti from "./pages/AddNiti";
import EditTemple from "./pages/EditTemple";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/about", element: <About /> },
            { path: "/signin", element: <SignIn /> },
            { path: "/signup", element: <SignUp /> },
            { path: "/add-temple", element: <AddTemple /> },
            { path: "/temple/:id", element: <TempleDetails /> },
            { path: "/edit-temple/:id", element: <EditTemple /> },
            { path: "/add-niti/:templeId", element: <AddNiti /> },
            { path: "/edit-niti/:templeId/:nitiId", element: <AddNiti /> },
        ]
    }
])

export default router;