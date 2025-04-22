import { useState, useEffect } from "react";
import Sidebar from "@/components/SideBar";
import Balance from "@/components/Balance";
import Transfer from "@/components/Transfer";
import Transactions from "@/components/Transactions";
import { checkMySubscription } from "@/service/BackendService";
import { useNavigate } from "react-router-dom";

interface SubscriptionData {
  amount: Number;
  currency: string;
  started_at: string;
  ended_at: string;
  status: string;
}

const Dashboard = () => {
  const [selectedPage, setSelectedPage] = useState("Balance");
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    null
  );
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const verifySubscription = async () => {
      const response = await checkMySubscription();
      if (!response) {
        navigate("/pricing");
      } else {
        const sub = response.subscription;

        const temp: SubscriptionData = {
          amount: sub.amount,
          currency: sub.current,
          started_at: sub.started_at.substring(0, 10),
          ended_at: sub.ended_at.substring(0, 10),
          status: sub.status,
        };
        setUsername(response.user);
        setSubscription(temp);
        setLoading(false);
      }
    };

    verifySubscription();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-white p-10">
        Checking Subscription...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#1E1E1E] text-white">
      {/* Sidebar */}
      <div className="sticky top-0 self-start">
        <Sidebar
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen p-6 sm:p-10 overflow-hidden">
        {selectedPage === "Balance" && (
          <Balance data={subscription!} user={username} />
        )}
        {selectedPage === "Transfer Funds" && <Transfer />}
        {selectedPage === "Transactions" && <Transactions user={username} />}
      </main>
    </div>
  );
};

export default Dashboard;
