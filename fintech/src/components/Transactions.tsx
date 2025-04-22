import { useEffect, useState } from "react";

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

  useEffect(() => {
    const fetchTransactions = async () => {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data);
    };

    fetchTransactions();
  }, []);

  const handleGenerateInvoice = async () => {
    if (!dateRange.start || !dateRange.end) return;

    setLoading(true);

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
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-10">
      {/*Invoice Part */}
      <div className="bg-[#323232] p-6 rounded-2xl shadow-md mx-auto w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Generate Invoice</h2>
        <div className="flex justify-between items-center gap-4 mb-4">
          <div className="flex gap-4">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="bg-white text-black p-2 rounded-lg"
            />
            <span className="text-gray-400">To</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="bg-white text-black p-2 rounded-lg"
            />
          </div>
          <button
            onClick={handleGenerateInvoice}
            disabled={loading}
            className={`px-6 py-3 text-white font-medium rounded-xl transition ${loading ? "bg-blue-300 cursor-wait" : "bg-blue-500 hover:bg-blue-600"}`}
          >
            {loading ? "Generating..." : "Generate Invoice"}
          </button>
        </div>
      </div>

      {/*Transaction History*/}
      <div className="bg-[#323232] p-6 rounded-2xl shadow-md w-full">
        <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
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
                <p><strong>ID:</strong> {txn.id}</p>
                <p><strong>Amount:</strong> ${txn.amount}</p>
                <p><strong>Date:</strong> {txn.date}</p>
                <p><strong>Status:</strong> {txn.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
