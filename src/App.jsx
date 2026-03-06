import { useState, useEffect } from "react";

/* Importar componentes */
import Intro from "./components-react/Intro";
import Sobre from "./components-react/Sobre";
import Educacao from "./components-react/Educacao";
import Trabalhos from "./components-react/Trabalhos";
import Contatos from "./components-react/Contatos";
import Footer from "./components-react/Footer";
import Navbar from "./components-react/NavBar";

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
      <section id="sobre">
        <Sobre />
      </section>
      <section id="educacao">
        <Educacao />
      </section>
      <section id="trabalhos">
        <Trabalhos />
      </section>
      <section id="contatos">
        <Contatos />
      </section>
      <Footer />
    </div>
  );
}
