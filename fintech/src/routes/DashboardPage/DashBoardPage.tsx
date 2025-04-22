import { useState, useEffect } from "react";
import Sidebar from "@/components/SideBar";
import Balance from "@/components/Balance";
import Transfer from "@/components/Transfer";
import Transactions from "@/components/Transactions";
import {
  checkMySubscription,
  validateTokenUser,
} from "@/service/BackendService";
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
  const [userRole, setUserRole] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const verifyUserAndSubscription = async () => {
      const response = await validateTokenUser();

      if (!response || !response.role) {
        navigate("/login");
        return;
      }

      setUserRole(response.role);
      setUsername(response.username || "");

      if (response.role === "Admin") {
        setLoading(false);
        return;
      }

      const subRes = await checkMySubscription();
      if (!subRes) {
        navigate("/pricing");
        return;
      }

      const temp: SubscriptionData = {
        amount: subRes.amount,
        currency: subRes.currency,
        started_at: subRes.started_at.substring(0, 10),
        ended_at: subRes.ended_at.substring(0, 10),
        status: subRes.status,
      };

      setSubscription(temp);
      setLoading(false);
    };

    verifyUserAndSubscription();
  }, [navigate]);

  if (loading) {
    return (
      <div className="text-center text-white p-10">
        Checking Subscription...
      </div>
    );
  }

  if (userRole === "Admin") {
    return <AdminDashBoard />;
  }

  return (
    <div className="flex h-screen bg-[#1E1E1E] text-white">
      {/* Sidebar */}
      <div className="sticky top-0 self-start">
        <Sidebar
          username={username}
          mode="Developer"
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

const AdminDashBoard = () => {
  return (
    <div className="h-screen flex items-center justify-center text-white text-2xl">
      Welcome Admin – Dashboard Content Goes Here
    </div>
  );
};

export default Dashboard;
