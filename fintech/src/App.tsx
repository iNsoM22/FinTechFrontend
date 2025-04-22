import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router";
import Navbar from "./components/NavBar";

function App() {
  return (
    <>
      <Navbar />
      <Outlet />;
      <Toaster />
    </>
  );
}

export default App;
