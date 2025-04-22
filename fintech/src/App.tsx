// import React from "react";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router"

function App() {
  return<>
  <Outlet />;
  <Toaster position="top-right" />
  
  </>
}

export default App;