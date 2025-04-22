import { useState, useEffect } from "react";
import Sidebar from "@/components/SideBar";
import Balance from "@/components/Balance";
import Transfer from "@/components/Transfer";
import Transactions from "@/components/Transactions";
import { checkMySubscription } from "@/service/BackendService";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [selectedPage, setSelectedPage] = useState("Balance");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const verifySubscription = async () => {
      const subscription = await checkMySubscription();
      if (!subscription) {
        navigate("/pricing");
      } else {
        setLoading(false);
      }
    };

    verifySubscription();
  }, []);

  if (loading) {
    return <div className="text-center text-white p-10">Checking Subscription...</div>;
  }

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
