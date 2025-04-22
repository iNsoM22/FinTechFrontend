import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const SuccessPage = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");

  useEffect(() => {
    if (sessionId) {
      toast.success("Subscription Successful!");
    }
  }, [sessionId]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-600 via-pink-500 to-red-400">
      <div className="text-center bg-white p-10 rounded-3xl shadow-xl max-w-md mx-auto space-y-8">
        <h2 className="text-5xl font-bold text-gradient text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500 mb-6">
          🎉 Payment Successful!
        </h2>
        <p className="text-gray-700 text-xl mb-6">
          Your subscription was completed successfully. We're thrilled to have
          you as part of our community!
        </p>
        <div className="mb-8">
          <span className="text-green-600 font-semibold text-lg">
            Subscription completed successfully.
          </span>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 px-8 rounded-full shadow-md transform hover:scale-105 transition-all duration-300"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
