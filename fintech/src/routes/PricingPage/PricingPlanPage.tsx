import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { DollarSign, Star } from "lucide-react";
import Tilt from "react-parallax-tilt";
import {
  getStripeProducts,
  StripeProduct,
  createCheckoutSession,
} from "@/service/BackendService";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const icons = {
  Basic: <Star className="h-6 w-6 text-yellow-400" />,
  Professional: <DollarSign className="h-6 w-6 text-green-400" />,
};

// PricingPlans Component
export default function PricingPlans() {
  const [products, setProducts] = useState<StripeProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<string>("");
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const navigate = useNavigate();

  useEffect(() => {
    getStripeProducts()
      .then((res) => {
        res && setProducts(res);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (planId: string, planName: string) => {
    setSelected(planId);
    toast.success(`${planName} Plan Selected`);

    const burst = document.getElementById("confetti");
    burst?.classList.add("active");
    setTimeout(() => burst?.classList.remove("active"), 1200);
  };

  const handleProceedToPayment = async () => {
    if (!selected) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be Logged in to Proceed.");
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    const product = products.find((p) => p.id === selected);
    const price = product?.prices?.[0]?.id;

    if (!price) {
      toast.dismiss();
      toast.error("Unable to Find the Selected Plan.");
      return;
    }

    const checkOutUrl = await createCheckoutSession(price);
    toast.dismiss();

    if (checkOutUrl) {
      window.location.href = checkOutUrl;
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="relative min-h-screen bg-[#1a1a1a] text-white px-4 py-10 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-pink-500 rounded-full blur-3xl opacity-20 top-[-100px] left-[-150px] z-0 animate-pulse-slow" />
        <div className="absolute w-[400px] h-[400px] bg-cyan-500 rounded-full blur-2xl opacity-20 bottom-[-100px] right-[-150px] z-0 animate-pulse-slow" />
        <div
          id="confetti"
          className="absolute inset-0 pointer-events-none z-50"
        />
        <h2 className="relative text-5xl font-extrabold text-center z-10 mb-8 drop-shadow-glow">
          Choose Your Plan
        </h2>

        <div className="relative z-10 mb-6 text-center">
          <button
            onClick={() =>
              setBilling(billing === "monthly" ? "yearly" : "monthly")
            }
            className="text-sm bg-slate-800 px-6 py-2 rounded-full border border-white/20 hover:bg-slate-700 transition duration-300"
          >
            {billing === "monthly" ? "🔥 Monthly Billing" : "🌟 Yearly Billing"}
          </button>
        </div>

        <div className="grid gap-10 md:grid-cols-2 max-w-6xl mx-auto relative z-10">
          {loading ? (
            <div className="col-span-2 flex justify-center items-center">
              <Loader2 className="h-10 w-10 animate-spin text-white" />
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-2 text-center text-white/80 text-xl font-medium">
              🚫 No Plans Available at the moment. Please Check Back Later.
            </div>
          ) : (
            products.map((product) => {
              const price = product.prices?.find((p) => p.unit_amount);
              return (
                <Tilt
                  key={product.id}
                  glareEnable
                  tiltMaxAngleX={10}
                  tiltMaxAngleY={10}
                  glareColor="white"
                  className="transform-gpu border-2 rounded-2xl overflow-hidden"
                >
                  <div
                    className={`group relative p-6 bg-white/5 backdrop-blur-md transition-all duration-500 shadow-lg hover:shadow-2xl neon-glow ${
                      selected === product.id
                        ? "border-white"
                        : "border-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4 text-white">
                      <span className="text-green-400">💡</span>
                      <h3 className="text-2xl font-bold">{product.name}</h3>
                    </div>

                    <p className="text-white/80 text-xl mb-6 font-bold">
                      {price
                        ? billing === "monthly"
                          ? `$${(price.unit_amount / 100).toFixed(2)} / mo`
                          : `$${((price.unit_amount * 12) / 100).toFixed(
                              2
                            )} / yr`
                        : "Free"}
                    </p>

                    <ul className="text-white/80 space-y-2 mb-6 text-sm">
                      <li className="flex items-center gap-2">
                        <span className="text-green-400">✔</span>
                        <span className="hover:text-white transition font-bold">
                          {product.description || "No description"}
                        </span>
                      </li>
                    </ul>

                    <button
                      onClick={() => handleSelect(product.id, product.name)}
                      disabled={selected === product.id}
                      className={`w-full py-2 rounded-md text-sm font-semibold transition-all relative overflow-hidden ${
                        selected === product.id
                          ? "bg-white text-black cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      <span className="relative z-10">
                        {selected === product.id ? "Selected" : "Choose Plan"}
                      </span>
                    </button>
                  </div>
                </Tilt>
              );
            })
          )}
        </div>
        {selected && (
          <div className="relative z-10 mt-12 flex justify-center items-center">
            <button
              onClick={handleProceedToPayment}
              className="bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-xl transition-all duration-300"
            >
              🚀 Proceed to Payment
            </button>
          </div>
        )}
      </div>
    </>
  );
}
