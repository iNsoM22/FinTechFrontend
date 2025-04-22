import { getUserTransactions } from "@/service/BackendService";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface Transaction {
  id: string;
  sender_username: string;
  receiver_username: string;
  transfer_amount: number;
  made_at: string;
  status: string;
}

interface TransactionProps {
  user: string;
}

const Transactions = ({ user }: TransactionProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ start?: boolean; end?: boolean }>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [invoiceGenerated, setInvoiceGenerated] = useState(false); // State to track if invoice is generated
  const [pdfUrl, setPdfUrl] = useState<string | null>(null); // Store PDF URL
  const navigate = useNavigate();

  const fetchTransactions = async (pageNum: number = 1) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Token Expired, Login Again");
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const data = await getUserTransactions({
        page: pageNum,
        date_from: dateRange.start,
        date_till: dateRange.end,
      });

      if (data && Array.isArray(data)) {
        setTransactions(data);
        setHasMore(data.length === 50);
      } else {
        setTransactions([]);
        setHasMore(false);
      }
    } catch (error) {
      toast.error("Failed to Fetch Transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  // Add a function to generate the PDF summary
  const generatePDF = (transactions: Transaction[]) => {
    const doc = new jsPDF();

    // Set title font size
    doc.setFontSize(12); // Further reduced font size for title
    doc.text("Invoice Summary", doc.internal.pageSize.width / 2, 20, {
      align: "center",
    });

    // Generate the summary content
    let totalAmount = 0;
    let totalTransactions = transactions.length;

    transactions.forEach((txn) => {
      totalAmount += txn.transfer_amount;
    });

    // Add Summary Details to PDF with smaller text
    doc.setFontSize(8); // Further reduced font size for text
    doc.text(
      `Total Transactions: ${totalTransactions}`,
      doc.internal.pageSize.width / 2,
      30,
      { align: "center" }
    );
    doc.text(
      `Total Amount: $${totalAmount.toFixed(2)}`,
      doc.internal.pageSize.width / 2,
      40,
      { align: "center" }
    );

    // Manually create a table
    const startY = 50;
    const cellHeight = 6; // Further reduced cell height for smaller table
    const cellPadding = 2; // Adjusted padding for readability

    const headers = [
      "Transaction ID",
      "Sender",
      "Receiver",
      "Amount",
      "Date",
      "Status",
    ];
    const rows = transactions.map((txn) => [
      txn.id,
      txn.sender_username,
      txn.receiver_username,
      txn.transfer_amount,
      txn.made_at,
      txn.status,
    ]);

    // Draw the header row
    let currentY = startY;
    headers.forEach((header, index) => {
      const xPos = 20 + index * 30; // Adjust x positions for each column
      doc.text(header, xPos + cellPadding, currentY + cellHeight / 2);
    });

    // Draw the table content rows
    currentY += cellHeight;

    rows.forEach((row) => {
      row.forEach((cell, index) => {
        const xPos = 20 + index * 30; // Adjust x positions for each column
        doc.text(
          cell.toString(),
          xPos + cellPadding,
          currentY + cellHeight / 2
        );
      });
      currentY += cellHeight; // Move down for the next row
    });

    // Draw table borders (optional)
    const tableWidth = 180; // Adjust table width
    doc.setLineWidth(0.5);
    doc.rect(20, startY, tableWidth, currentY - startY);

    // Create PDF URL and set it
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);

    setPdfUrl(pdfUrl);
    setInvoiceGenerated(true);
  };

  const handleGenerateInvoice = async () => {
    const { start, end } = dateRange;
    const newErrors: typeof errors = {};

    if (!start) newErrors.start = true;
    if (!end) newErrors.end = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setPage(1);
    await fetchTransactions(1); // Wait for transactions to be fetched

    // Generate the PDF after fetching transactions
    if (transactions.length > 0) {
      generatePDF(transactions);
    } else {
      toast.error("No transactions to generate invoice.");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1) {
      setPage(newPage);
    }
  };

  return (
    <div className="flex flex-col gap-10 px-4 sm:px-6 lg:px-12 xl:px-20 py-8 max-w-screen-xl mx-auto w-full">
      {/* Invoice Section */}
      <div className="bg-[#323232] p-6 mt-20 rounded-2xl shadow-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">
          Generate Invoice / View Transactions
        </h2>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
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
            <span className="text-gray-400 text-center sm:text-left">To</span>
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
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={() => fetchTransactions(1)}
              disabled={loading}
              className={`px-6 py-3 text-white font-medium rounded-xl transition w-full sm:w-auto ${
                loading
                  ? "bg-gray-400 cursor-wait"
                  : "bg-gray-600 hover:bg-gray-700"
              }`}
            >
              {loading ? "Loading..." : "Show Transactions"}
            </button>
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
            {/* Invoice Download Button */}
            {invoiceGenerated && pdfUrl && (
              <a href={pdfUrl} download="invoice_summary.pdf">
                <button className="font-medium text-center bg-green-500 text-white px-6 py-3 rounded-xl transition w-full sm:w-auto hover:bg-green-600">
                  Download Invoice
                </button>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-[#323232] p-6 rounded-2xl shadow-md w-full">
        <h2 className="text-2xl font-bold text-center mb-4 text-white">
          Transaction History
        </h2>
        {transactions.length === 0 && !loading ? (
          <div className="text-center text-gray-400 italic py-10">
            No Transactions Found.
          </div>
        ) : (
          <>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {transactions.map((txn) => {
                const isSender = txn.sender_username === user;

                return (
                  <div
                    key={txn.id}
                    className={`p-4 rounded-xl border shadow-md transition-transform transform hover:scale-[0.99] overflow-hidden ${
                      isSender
                        ? "bg-red-900/70 border-red-600"
                        : "bg-green-900/70 border-green-600"
                    }`}
                  >
                    <p className="text-white">
                      <strong>ID:</strong> {txn.id}
                    </p>
                    <p className="text-white">
                      <strong>Sender:</strong> {txn.sender_username}
                    </p>
                    <p className="text-white">
                      <strong>Receiver:</strong> {txn.receiver_username}
                    </p>
                    <p className="text-white">
                      <strong>Amount:</strong> ${txn.transfer_amount}
                    </p>
                    <p className="text-white">
                      <strong>Date:</strong> {txn.made_at}
                    </p>
                    <p className="text-white">
                      <strong>Status:</strong> {txn.status}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
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
          </>
        )}
      </div>
    </div>
  );
};

export default Transactions;
