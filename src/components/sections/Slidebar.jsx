import { useState } from "react";
import "../styles/Slidebar.css";

const menuItems = [
  { label: "Início", section: "inicio" },
  { label: "Sobre mim", section: "sobre" },
  { label: "Formações", section: "educacao" },
  { label: "Trabalhos", section: "trabalhos" },
  { label: "Contatos", section: "contatos" },
];

function Overlay({ onClose }) {
  return <div className="overlay" onClick={onClose} />;
}

function MenuItem({ label, section, active, onClick }) {
  return (
    <a
      href={`#${section}`}
      className={`menu-item ${active ? "active" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        onClick(section);
      }}
    >
      {label}
    </a>
  );
}

export default function Slidebar({ toggleTheme, lightMode }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("inicio");

  const handleClick = (section) => {
    setActive(section);
    setOpen(false);

    // Aguarda a animação de fechar a sidebar (350ms) antes de rolar
    setTimeout(() => {
      const target = document.getElementById(section);
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 380);
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
            section={item.section}
            active={active === item.section}
            onClick={handleClick}
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
