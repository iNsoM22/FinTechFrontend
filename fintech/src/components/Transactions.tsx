import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Transactions = () => {
  interface Transaction {
    id: string;
    amount: number;
    date: string;
    status: string;
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ start?: boolean; end?: boolean }>({});

  useEffect(() => {
    const fetchTransactions = async () => {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data);
    };

    fetchTransactions();
  }, []);

  const handleGenerateInvoice = async () => {
    let newErrors = {};
    if (!dateRange.start) newErrors = { ...newErrors, start: true };
    if (!dateRange.end) newErrors = { ...newErrors, end: true };

    if (!dateRange.start || !dateRange.end) {
      setErrors(newErrors);
      toast.error(
        "Please select both start and end dates to generate an invoice."
      );
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/generate-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dateRange),
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "invoice.pdf";
      a.click();
    } catch (error) {
      toast.error("An error occurred while generating the invoice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 px-4 sm:px-6 lg:px-12 xl:px-20 py-8 max-w-screen-xl mx-auto w-full">
      {/*Invoice Part */}
      <div className="bg-[#323232] p-6 rounded-2xl shadow-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">
          Generate Invoice
        </h2>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="flex flex-col">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => {
                  setDateRange({ ...dateRange, start: e.target.value });
                  setErrors({ ...errors, start: false });
                }}
                className={`bg-white text-black p-2 rounded-lg w-full sm:w-auto border-2 ${
                  errors.start ? "border-red-500" : "border-transparent"
                }`}
              />
            </div>
            <span className="text-gray-400 text-center sm:text-left">To</span>
            <div className="flex flex-col">
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => {
                  setDateRange({ ...dateRange, end: e.target.value });
                  setErrors({ ...errors, end: false });
                }}
                className={`bg-white text-black p-2 rounded-lg w-full sm:w-auto border-2 ${
                  errors.end ? "border-red-500" : "border-transparent"
                }`}
              />
            </div>
          </div>

          <button
            onClick={handleGenerateInvoice}
            disabled={loading}
            className={`px-6 py-3 text-white font-medium rounded-xl transition w-full sm:w-auto ${
              loading
                ? "bg-blue-300 cursor-wait"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Generating..." : "Generate Invoice"}
          </button>
        </div>
      </div>

      {/*Transaction History*/}
      <div className="bg-[#323232] p-6 rounded-2xl shadow-md w-full">
        <h2 className="text-2xl font-bold text-center mb-4 text-white">
          Transaction History
        </h2>
        {transactions.length === 0 ? (
          <div className="text-center text-gray-400 italic py-10">
            No transactions found.
          </div>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {transactions.map((txn, idx) => (
              <div
                key={idx}
                className="bg-[#1E1E1E] p-4 rounded-xl border border-gray-700"
              >
                <p className="text-white">
                  <strong>ID:</strong> {txn.id}
                </p>
                <p className="text-white">
                  <strong>Amount:</strong> ${txn.amount}
                </p>
                <p className="text-white">
                  <strong>Date:</strong> {txn.date}
                </p>
                <p className="text-white">
                  <strong>Status:</strong> {txn.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
