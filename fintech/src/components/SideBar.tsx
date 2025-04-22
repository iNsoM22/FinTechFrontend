import { Home, ArrowRightLeft, CreditCard, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SidebarProps {
  selectedPage: string;
  setSelectedPage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedPage, setSelectedPage }) => {
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleToggle = () => {
    setOpen(!open);
    resetAutoClose();
  };

const handleClickOutside = (e: MouseEvent) => {
    if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
    ) {
        setOpen(false);
    }
};

  const resetAutoClose = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setOpen(false), 5000);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/*SideBar Button*/}
        {!open && (
        <button
            className="absolute top-4 left-4 z-50 text-white"
            onClick={handleToggle}
        >
            <Menu size={28} />
        </button>
        )}


      {/*Sidebar*/}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-screen w-64 bg-[#323232] text-white p-4 transition-transform duration-300 z-40 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h1 className="text-2xl font-bold mb-8">iNsoM22</h1> // Replace it with whatever u want moiz
        <ul className="space-y-4">
          <li
            onClick={() => {
              setSelectedPage("Balance");
              setOpen(false);
            }}
            className={`cursor-pointer flex items-center gap-2 ${
              selectedPage === "Balance"
                ? "text-blue-500"
                : "hover:text-blue-500"
            }`}
          >
            <CreditCard size={20} />
            Balance
          </li>
          <li
            onClick={() => {
              setSelectedPage("Transfer Funds");
              setOpen(false);
            }}
            className={`cursor-pointer flex items-center gap-2 ${
              selectedPage === "Transfer Funds"
                ? "text-blue-500"
                : "hover:text-blue-500"
            }`}
          >
            <ArrowRightLeft size={20} />
            Transfer Funds
          </li>
          <li
            onClick={() => {
              setSelectedPage("Transactions");
              setOpen(false);
            }}
            className={`cursor-pointer flex items-center gap-2 ${
              selectedPage === "Transactions"
                ? "text-blue-500"
                : "hover:text-blue-500"
            }`}
          >
            <Home size={20} />
            Transactions
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
