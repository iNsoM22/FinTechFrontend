import { useState } from "react";
import Sidebar from "@/components/SideBar";
import Balance from "@/components/Balance";
import Transfer from "@/components/Transfer";
import Transactions from "@/components/Transactions";

const Dashboard = () => {
  const [selectedPage, setSelectedPage] = useState("Balance");

  return (
    <div className="flex h-screen bg-[#1E1E1E] text-white">
      {/* Sidebar */}
      <div className="sticky top-0 self-start">
        <Sidebar selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen p-6 sm:p-10 overflow-hidden">
        {selectedPage === "Balance" && <Balance />}
        {selectedPage === "Transfer Funds" && <Transfer />}
        {selectedPage === "Transactions" && <Transactions />}
      </main>
    </div>
  );
};

export default Dashboard;
