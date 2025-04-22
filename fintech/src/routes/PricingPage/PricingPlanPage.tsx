import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { DollarSign, Star } from "lucide-react";
import Tilt from "react-parallax-tilt";

const plans = [
  {
    name: "Basic",
    priceMonthly: "Free",
    priceYearly: "Free",
    icon: <Star className="h-6 w-6 text-yellow-400" />,
    features: ["3 Projects", "Email Support", "Community Access"],
  },
  {
    name: "Professional",
    priceMonthly: "$10/month",
    priceYearly: "$100/year",
    icon: <DollarSign className="h-6 w-6 text-green-400" />,
    features: ["Unlimited Projects", "Priority Support", "Custom Branding"],
  },
];

export default function PricingPlans() {
  const [selected, setSelected] = useState<string>("");
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const handleSelect = (planName: string) => {
    setSelected(planName);
    toast.success(`${planName} plan selected`);

    const burst = document.getElementById("confetti");
    burst?.classList.add("active");
    setTimeout(() => burst?.classList.remove("active"), 1200);
  };

  return (
    <>
      <Toaster position="top-center" />
      <div
        className="relative min-h-screen bg-[#1a1a1a] text-white px-4 py-10 overflow-hidden"
        style={{ overflowX: 'hidden', overflowY: 'hidden', height: '100vh' }}
      >

        <div className="absolute w-[500px] h-[500px] bg-pink-500 rounded-full blur-3xl opacity-20 top-[-100px] left-[-150px] z-0 animate-pulse-slow" />
        <div className="absolute w-[400px] h-[400px] bg-cyan-500 rounded-full blur-2xl opacity-20 bottom-[-100px] right-[-150px] z-0 animate-pulse-slow" />
        <div id="confetti" className="absolute inset-0 pointer-events-none z-50"></div>
        <h2 className="relative text-5xl font-extrabold text-center z-10 mb-8 drop-shadow-glow">
          Choose Your Plan
        </h2>
        <div className="relative z-10 mb-6 text-center">
          <button
            onClick={() => setBilling(billing === "monthly" ? "yearly" : "monthly")}
            className="text-sm bg-slate-800 px-6 py-2 rounded-full border border-white/20 hover:bg-slate-700 transition duration-300"
          >
            {billing === "monthly" ? "🔥 Monthly Billing" : "🌟 Yearly Billing"}
          </button>
        </div>
        <div className="grid gap-10 md:grid-cols-2 max-w-6xl mx-auto relative z-10">
          {plans.map((plan) => (
            <Tilt
              key={plan.name}
              glareEnable
              tiltMaxAngleX={10}
              tiltMaxAngleY={10}
              glareColor="white"
              className="transform-gpu"
            >
              <div
                className={`group relative rounded-2xl p-6 bg-white/5 backdrop-blur-md border-2 transition-all duration-500 shadow-lg hover:scale-105 hover:shadow-2xl neon-glow ${selected === plan.name ? "border-white" : "border-white/10"
                  }`}
              >
                <div className="flex items-center gap-3 mb-4 text-white">
                  {plan.icon}
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                </div>

                <p className="text-white/80 text-xl mb-6 font-bold">
                  {billing === "monthly" ? plan.priceMonthly : plan.priceYearly}
                </p>

                <ul className="text-white/80 space-y-2 mb-6 text-sm">
  {plan.features.map((f, i) => (
    <li key={i} className="flex items-center gap-2">
      <span className="text-green-400">✔</span>
      <span className="hover:text-white transition font-bold">{f}</span>
    </li>
  ))}
</ul>

                <button
                  onClick={() => handleSelect(plan.name)}
                  disabled={selected === plan.name}
                  className={`w-full py-2 rounded-md text-sm font-semibold transition-all relative overflow-hidden ${selected === plan.name
                    ? "bg-white text-black cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                >
                  <span className="relative z-10">
                    {selected === plan.name ? "Selected" : "Choose Plan"}
                  </span>
                  {!selected && (
                    <span className="absolute inset-0 bg-white/10 animate-shimmer" />
                  )}
                </button>
              </div>
            </Tilt>
          ))}
        </div>
      </div>

      <style>{`
      html, body {
      margin: 0;
      padding: 0;
      overflow-x: hidden;
      overflow-y: hidden;
      background: #1a1a1a;
}

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
        }
        .animate-pulse-slow {
          animation: pulse 10s infinite ease-in-out;
        }
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .neon-glow:hover {
          box-shadow: 0 0 20px rgba(0, 200, 255, 0.4),
            0 0 40px rgba(0, 200, 255, 0.2);
        }
        .drop-shadow-glow {
          text-shadow: 0 0 8px rgba(0, 200, 255, 0.7);
        }

        .cursor-wow {
          cursor: url("https://cdn-icons-png.flaticon.com/512/833/833472.png"), auto;
        }

        #confetti.active::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle, white 2px, transparent 2px);
          background-size: 20px 20px;
          animation: explode 1s ease-out forwards;
        }

        @keyframes explode {
          0% {
            opacity: 1;
            transform: scale(0.5);
          }
          100% {
            opacity: 0;
            transform: scale(3);
          }
        }
      `}</style>
    </>
  );
}
