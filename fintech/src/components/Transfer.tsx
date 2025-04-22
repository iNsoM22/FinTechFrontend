import { useState } from "react";
import toast from "react-hot-toast";
import { requestMoneyTransfer } from "@/service/BackendService";

const Transfer = () => {
  const [destinationId, setDestinationId] = useState("");
  const [amount, setAmount] = useState("");
  const [receiverUsername, setReceiverUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    receiverAccountId: false,
    receiverUsername: false,
    transferAmount: false
  });

  const handleTransfer = async () => {
    const newErrors = {
      receiverAccountId: !destinationId.trim(),
      transferAmount: !amount.trim() || Number(amount) <= 0,
      receiverUsername: !receiverUsername.trim(),
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some(Boolean);
    if (hasError) {
      toast.error("Please Fill in all Fields Correctly.");
      return;
    }

    try {
      setLoading(true);
      toast.loading("Processing Transfer...", { id: "transfer" });

      const response = await requestMoneyTransfer({
        receiverAccountId: destinationId,
        receiverUsername,
        transferAmount: Number(amount),
      });

      if (response) {
        toast.success("Transfer Successfull !", { id: "transfer" });

        // Reset Form
        setDestinationId("");
        setAmount("");
        setReceiverUsername("");
      }

    } catch (err) {
      toast.error("Transfer Failed. Please Try Later.", { id: "transfer" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#1E1E1E] p-6 sm:p-10 text-white flex flex-col items-center">
      <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-center">Transfer Funds</h2>

      <div className="w-full max-w-md flex flex-col gap-6 text-center">
        <div className="bg-[#323232] p-6 sm:p-8 rounded-2xl shadow-md">

          {/* Destination ID */}
          <div className="flex flex-col mb-4">
            <label htmlFor="destinationId" className="text-sm text-gray-300 mb-2 text-left">Receiver ID</label>
            <input
              type="text"
              id="destinationId"
              value={destinationId}
              onChange={(e) => setDestinationId(e.target.value)}
              placeholder="Enter Receiver ID"
              className={`w-full p-3 text-black rounded-lg bg-white border ${
                errors.receiverAccountId ? "border-red-500" : "border-transparent"
              }`}
            />
          </div>

          {/* Receiver Username */}
          <div className="flex flex-col mb-4">
            <label htmlFor="receiverUsername" className="text-sm text-gray-300 mb-2 text-left">Receiver Username</label>
            <input
              type="text"
              id="receiverUsername"
              value={receiverUsername}
              onChange={(e) => setReceiverUsername(e.target.value)}
              placeholder="Enter Receiver Username"
              className={`w-full p-3 text-black rounded-lg bg-white border ${
                errors.receiverUsername ? "border-red-500" : "border-transparent"
              }`}
            />
          </div>

          {/* Amount */}
          <div className="flex flex-col mb-4">
            <label htmlFor="amount" className="text-sm text-gray-300 mb-2 text-left">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="$10.00"
              className={`w-full p-3 text-black rounded-lg bg-white border ${
                errors.transferAmount ? "border-red-500" : "border-transparent"
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
      </div>
    </div>
  );
};

export default Transfer;
