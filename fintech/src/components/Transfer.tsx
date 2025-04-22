import { useState } from "react";
import toast from "react-hot-toast";

const Transfer = () => {
  const [sourceId, setSourceId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    sourceId: false,
    destinationId: false,
    amount: false,
  });
  

  const handleTransfer = async () => {
    const newErrors = {
      sourceId: !sourceId.trim(),
      destinationId: !destinationId.trim(),
      amount: !amount.trim(),
    };
  
    setErrors(newErrors);
  
    const hasError = Object.values(newErrors).some(Boolean);
    if (hasError) {
      toast.error("Please fill in all fields.");
      return;
    }
  
    try {
      setLoading(true);
      toast.loading("Processing transfer...", { id: "transfer" });
  
      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceId,
          destinationId,
          amount,
        }),
      });
  
      if (!res.ok) throw new Error("Transfer failed");
  
      const data = await res.json();
      setBalance(data.updatedBalance);
  
      toast.success("Transfer successful!", { id: "transfer" });
    } catch (err) {
      toast.error("Transfer failed. Please try again.", { id: "transfer" });
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="flex-1 bg-[#1E1E1E] p-6 sm:p-10 text-white flex flex-col items-center">
      <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-center">Transfer Funds</h2>

      {/*Transfer*/}
      <div className="w-full max-w-md flex flex-col gap-6 text-center">
        <div className="bg-[#323232] p-6 sm:p-8 rounded-2xl shadow-md">

          {/*Source ID*/}
          <div className="flex flex-col mb-4">
            <label htmlFor="sourceId" className="text-sm text-gray-300 mb-2 text-left">Source ID</label>
            <input
                type="text"
                id="sourceId"
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                placeholder="Enter Source ID"
                className={`w-full p-3 text-black rounded-lg bg-white border ${
                    errors.sourceId ? "border-red-500" : "border-transparent"
                }`}
                />
          </div>

          {/*Destination ID*/}
          <div className="flex flex-col mb-4">
            <label htmlFor="destinationId" className="text-sm text-gray-300 mb-2 text-left">Destination ID</label>
            <input
              type="text"
              id="destinationId"
              value={destinationId}
              onChange={(e) => setDestinationId(e.target.value)}
              placeholder="Enter Destination ID"
              className={`w-full p-3 text-black rounded-lg bg-white border ${
                errors.destinationId ? "border-red-500" : "border-transparent"
                }`}
            />
          </div>

          {/*Amount*/}
          <div className="flex flex-col mb-4">
            <label htmlFor="amount" className="text-sm text-gray-300 mb-2 text-left">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 10000"
              className={`w-full p-3 text-black rounded-lg bg-white border ${
                errors.amount ? "border-red-500" : "border-transparent"
                }`}              
            />
          </div>

          <button
            onClick={handleTransfer}
            className={`w-full px-6 py-3 text-white font-medium rounded-xl transition duration-300 ${
              loading ? "bg-blue-300 cursor-wait" : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "Processing..." : "Transfer"}
          </button>
        </div>

        {balance !== null && (
          <div className="bg-[#323232] p-6 sm:p-8 rounded-2xl shadow-md mt-6">
            <p className="text-gray-300 text-lg sm:text-xl">Updated Balance</p>
            <h3 className="text-3xl sm:text-5xl font-bold mt-2">${balance}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transfer;
