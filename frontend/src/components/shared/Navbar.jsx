import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../../assets/shedulux.png";
const links = [
  { to: "/", label: "HOME" },
  { to: "/simulator", label: "SIMULATOR" },
  { to: "/compare", label: "COMPARE" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass border-b border-accent/20 px-6 py-3 flex items-center justify-between flex-shrink-0"
    >
      <Link to="/" className="flex items-center gap-3">
        <img src={logo} alt="SHEDULUX" className="logo" />
        <div className="flex flex-col">
          <span className="font-hud text-xl font-black tracking-widest bg-gradient-to-r from-accent to-cyan bg-clip-text text-transparent">
            SHEDULUX
          </span>
          <span className="font-mono text-[9px] text-gray-600 tracking-[4px]">
            CPU SCHEDULING ENGINE
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-6">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`font-hud text-[10px] tracking-[2px] transition-all duration-200 ${
              pathname === l.to
                ? "text-accent glow-text"
                : "text-gray-500 hover:text-accent"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-cyan animate-pulse shadow-[0_0_8px_#00e5b0]" />
        <span className="font-mono text-[10px] text-gray-500">LIVE</span>
      </div>
    </motion.nav>
  );
}
