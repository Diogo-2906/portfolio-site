import { useState } from "react";
import "../styles/Slidebar.css";
import { h3 } from "motion/react-client";

const menuItems = [
  { label: "Início", href: "#inicio", section: "inicio" },
  { label: "Sobre mim", href: "#sobre", section: "sobre" },
  { label: "Formações", href: "#educacao", section: "educacao" },
  { label: "Trabalhos", href: "#trabalhos", section: "trabalhos" },
  { label: "Contatos", href: "#contatos", section: "contatos" },
];

function Overlay({ onClose }) {
  return <div className="overlay" onClick={onClose} />;
}

function MenuItem({ label, href, active, onClick }) {
  return (

    <a href={href}
      className={`menu-item ${active ? "active" : ""}`
      }
      onClick={onClick}
    >
      {label}
    </a >
  );
}

export default function Slidebar({ toggleTheme, lightMode }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("inicio");

  const handleClick = (section) => {
    setActive(section);
    setOpen(false);
  };

  return (
    <>
      <button className="open-button" onClick={() => setOpen(true)}>
        <i className="bi bi-list"></i>
      </button>

      {open && <Overlay onClose={() => setOpen(false)} />}

      <div className={`slidebar ${open ? "open" : ""}`}>
        <div className="slidebar-header">
          <h2 className="slidebar-title"><strong>Portfolio</strong></h2>
          <button className="close-button" onClick={() => setOpen(false)}>✕</button>
        </div>

        {menuItems.map((item) => (
          <MenuItem
            key={item.section}
            label={item.label}
            href={item.href}
            active={active === item.section}
            onClick={() => handleClick(item.section)}
          />
        ))}

        <div className="slidebar-footer">
          <button className="theme-toggle" onClick={toggleTheme}>
            {lightMode ? (
              <h5>Modo Escuro  <i className="bi bi-moon-fill"></i></h5>
            ) : (
              <h5>Modo Claro  <i className="bi bi-sun-fill"></i></h5>
            )}
          </button>
        </div>
      </div>
    </>
  );
}