import { useState, useEffect } from "react";

/* Importar componentes */
import Intro from "./components-react/Intro";
import Sobre from "./components-react/Sobre";
import Educacao from "./components-react/Educacao";
import Trabalhos from "./components-react/Trabalhos";
import Contatos from "./components-react/Contatos";
import Footer from "./components-react/Footer";
import Navbar from "./components-react/NavBar";
import CurvedLoop from './Components-animations/CurvedLoop';
import CurvedLoopFooter from "./Components-animations/CurvedLoopFooter";

export default function App() {
  const [lightMode, setLightMode] = useState(false);

  useEffect(() => {
    if (lightMode) {
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
    }
  }, [lightMode]);

  const toggleTheme = () => setLightMode((prev) => !prev);



  return (
    <div className="container">
      <Navbar toggleTheme={toggleTheme} lightMode={lightMode} />

      <section id="inicio">
        <Intro />
      </section>

      <CurvedLoop marqueeText="Criatividade ✦ Modernidade ✦" />

      <section id="sobre">
        <Sobre />
      </section>

      <section id="educacao">
        <Educacao />
      </section>

      <section id="trabalhos">
        <Trabalhos />
      </section>

      <CurvedLoopFooter
        marqueeText="  Ideias ✦ em ✦ desenvolvimento ✦"
        speed={1.5}
        curveAmount={260}
        interactive
      />

      <section id="contatos">
        <Contatos />
      </section>
      <Footer />
    </div>
  );
}
