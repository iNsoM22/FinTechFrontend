import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Balance = () => {
  const [balance, setBalance] = useState(null);
  const [timestamp, setTimestamp] = useState<String | null>(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await fetch("/api/subscription"); //Replace
        const data = await res.json();
        setSubscription(data.subscription);
      } catch (err) {
        toast.error("Failed to fetch subscription");
      }
    };

    fetchSubscription();
  }, []);

  const getBalance = async () => {
    try {
      setLoading(true);
      toast.loading("Fetching balance...", { id: "balance" });

      const res = await fetch("/api/balance"); //Replace
      const data = await res.json();

      setBalance(data.balance);
      setTimestamp(new Date().toLocaleString());

      toast.success("Balance fetched!", { id: "balance" });
    } catch (err) {
      toast.error("Failed to fetch balance", { id: "balance" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#1E1E1E] p-6 sm:p-10 text-white flex flex-col items-center">
      <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-center">Welcome Back</h2>

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
          <p className="text-gray-300 text-lg sm:text-xl">Subscription Period</p>
          <h3 className="text-xl sm:text-2xl mt-2">
            {subscription || "Loading..."}
          </h3>
        </div>

        {balance !== null && (
          <>
            <div className="bg-[#323232] p-6 sm:p-8 rounded-2xl shadow-md">
              <p className="text-gray-300 text-lg sm:text-xl">Current Balance</p>
              <h3 className="text-3xl sm:text-5xl font-bold mt-2">${balance}</h3>
            </div>

            <div className="bg-[#323232] p-6 sm:p-8 rounded-2xl shadow-md">
              <p className="text-gray-300 text-lg sm:text-xl">Fetched At</p>
              <h3 className="text-xl sm:text-2xl mt-2">{timestamp}</h3>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Balance;
