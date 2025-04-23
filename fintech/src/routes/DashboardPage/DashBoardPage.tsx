import { useState, useEffect } from "react";
import Sidebar from "@/components/SideBar";
import Balance from "@/components/Balance";
import Transfer from "@/components/Transfer";
import Transactions from "@/components/Transactions";
import {
  checkMySubscription,
  getAllSubscriptions,
  getAllUsers,
  updateSubscription,
  validateTokenUser,
} from "@/service/BackendService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";

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
    return <AdminDashBoard username={username} />;
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

interface DataLoaderProps {
  view: string;
  title: string;
  records: any;
  setRecords: any;
}

const DataLoader = ({ view, title, records, setRecords }: DataLoaderProps) => {
  const handleCancelSubscription = async (id: string) => {
    // Implement cancel logic here, e.g., making a request to the backend to cancel the subscription
    const payload = {
      status: "Cancelled",
    };

    try {
      const response = await updateSubscription(id, payload);
      if (response) {
        toast.success(`Cancelled Subscription with id: ${id}`);
        // Update the status of the cancelled subscription in the records
        const updatedRecords = records.map((record: any) =>
          record.id === id ? { ...record, status: "Cancelled" } : record
        );
        setRecords(updatedRecords); // This assumes you're maintaining state of records
      }
    } catch (error) {
      toast.error(`Failed to Cancel Subscription with id: ${id}`);
    }
  };

  return (
    <div className="bg-[#323232] p-6 rounded-2xl shadow-md w-full">
      <h2 className="text-2xl font-bold text-center mb-4 text-white">
        {title.toUpperCase()}
      </h2>
      {records.length <= 0 ? (
        <div className="text-center text-gray-400 italic py-10">
          No Records Found.
        </div>
      ) : (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {records.map((record: any) => (
            <div
              key={record?.id}
              className="p-4 rounded-xl border shadow-md transition-transform transform hover:scale-[0.99] overflow-hidden bg-[#3d3d3d] relative"
            >
              <div className="flex flex-col space-y-2">
                {Object.entries(record).map(([key, value]) => (
                  <p key={key} className="text-white">
                    <strong>{key.replace(/_/g, " ")}:</strong>{" "}
                    {typeof value === "string" || typeof value === "number"
                      ? value
                      : JSON.stringify(value)}
                  </p>
                ))}
              </div>

              {/* Show cancel button if the view is "subscriptions" */}
              {view === "subscriptions" && (
                <button
                  onClick={() => handleCancelSubscription(record.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-all"
                >
                  {/* Using ReactFa Icon for a cross button */}
                  <FaTimes className="h-6 w-6" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
const AdminLogs = () => (
  <div className="text-white text-xl p-6">📜 System Logs and Activities</div>
);

interface AdminProps {
  username: string;
}

interface AdminProps {
  username: string;
}

const AdminDashBoard = ({ username }: AdminProps) => {
  const [activeView, setActiveView] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch data when activeView or page changes
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Token Expired, Login Again");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      try {
        let data: any[] | null = null;

        // Fetch data based on the active view
        if (activeView === "users") {
          data = await getAllUsers({ page });
        } else if (activeView === "subscriptions") {
          data = await getAllSubscriptions({
            status: "",
            start_date: "",
            end_date: "",
            page,
          });
        }

        if (Array.isArray(data)) {
          setRecords(data);
          setHasMore(data.length === 50); // Assuming 50 items per page
        } else {
          setRecords([]);
          setHasMore(false);
        }
      } catch (error) {
        toast.error("Failed to Fetch Records.");
        console.error(error);
      }
    };

    // Only fetch if an active view is selected
    if (activeView) {
      fetchData();
    }
  }, [activeView, page, navigate]); // Dependency on activeView and page

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1) {
      setPage(newPage);
    }
  };

  // ✅ Render selected component (without setState)
  const renderComponent = () => {
    switch (activeView) {
      case "users":
        return (
          <DataLoader
            title="👥 All Registered Users"
            records={records}
            view="users"
            setRecords={setRecords}
          />
        );
      case "subscriptions":
        return (
          <DataLoader
            view="subscriptions"
            title="💳 User Subscriptions Overview"
            records={records}
            setRecords={setRecords}
          />
        );
      case "logs":
        return <AdminLogs />;
      default:
        return (
          <div className="text-white text-xl mt-10">
            Select an Option to View Admin Data.
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-[#1E1E1E] p-8">
      <div className="text-2xl text-white mb-6">Welcome Admin {username}</div>
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveView("users")}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          Show Users
        </button>
        <button
          onClick={() => setActiveView("logs")}
          className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-all"
        >
          Show Logs
        </button>
        <button
          onClick={() => setActiveView("subscriptions")}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-all"
        >
          Show Subscription
        </button>
      </div>

      {/* Render Selected Component */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        {renderComponent()}
      </div>

      {/* Pagination */}
      {activeView !== "logs" && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={!hasMore}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
