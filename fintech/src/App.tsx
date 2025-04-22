import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router"

function App() {
  return<>
  <Outlet />;
  <Toaster />
  
  </>
}

export default App;