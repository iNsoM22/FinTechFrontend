import { getCurrentAccountBalance } from "@/service/BackendService";
import { useState } from "react";
import toast from "react-hot-toast";

interface BalanceComponentProps {
  user: string;
  data: {
    amount: Number;
    currency: string;
    started_at: string;
    ended_at: string;
    status: string;
  };
}

const Balance = ({ user, data }: BalanceComponentProps) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [lastModified, setLastModified] = useState<string | null>(null); // State for last modified timestamp
  const [loading, setLoading] = useState(false);

  const getBalance = async () => {
    try {
      setLoading(true);
      toast.loading("Fetching Balance...", { id: "balance" });

      const response = await getCurrentAccountBalance();

      setBalance(response.balance);
      setTimestamp(new Date().toLocaleString());
      const lastUpdatedDate = new Date(response.last_updated);
      setLastModified(lastUpdatedDate.toLocaleString());

      toast.success("Balance Fetched!", { id: "balance" });
    } catch (err) {
      toast.error("Server Busy, Unable to Fetch Balance", { id: "balance" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#1E1E1E] p-6 sm:p-10 text-white flex flex-col items-center">
      <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-center">
        Welcome Back {user.toUpperCase()}
      </h2>

      <button
        onClick={getBalance}
        className={`mb-8 px-6 py-3 text-white font-medium rounded-xl transition duration-300 ${
          loading ? "bg-blue-300 cursor-wait" : "bg-blue-500 hover:bg-blue-600"
        }`}
        disabled={loading}
      >
        {loading ? "Fetching..." : "Get Balance"}
      </button>

      <div className="w-full max-w-2xl flex flex-col gap-6 text-center">
        <div className="bg-[#323232] p-6 sm:p-8 rounded-2xl shadow-md">
          <p className="text-gray-300 text-lg sm:text-xl">
            Subscription Period
          </p>
          <h3 className="text-xl sm:text-2xl mt-2">
            {`from ${data.started_at} to ${data.ended_at}` || "Loading..."}
          </h3>
        </div>

        {balance !== null && (
          <>
            <div className="bg-[#323232] p-6 sm:p-8 rounded-2xl shadow-md">
              <p className="text-gray-300 text-lg sm:text-xl">
                Current Balance
              </p>
              <h3 className="text-3xl sm:text-5xl font-bold mt-2">
                ${balance}
              </h3>
            </div>

            <div className="bg-[#323232] p-6 sm:p-8 rounded-2xl shadow-md">
              <p className="text-gray-300 text-lg sm:text-xl">Fetched At</p>
              <h3 className="text-xl sm:text-2xl mt-2">{timestamp}</h3>
            </div>

            {lastModified && (
              <div className="bg-[#323232] p-6 sm:p-8 rounded-2xl shadow-md">
                <p className="text-gray-300 text-lg sm:text-xl">
                  Last Balance Modified
                </p>
                <h3 className="text-xl sm:text-2xl mt-2">{lastModified}</h3>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Balance;
