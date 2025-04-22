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
    <div className="text-center mt-20">
      <h2 className="text-3xl font-bold">🎉 Payment Successful!</h2>
      <p className="text-gray-600 mt-4">Thanks for Subscribing!</p>
    </div>
  );
};

export default SuccessPage;
