import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AppList } from "./assets/Apps/AppList";
import AppCard from "./assets/Components/AppCard";
import "./App.css";

function App() {
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.slice(1) === "") {
            document.title = "Steam Magician";
        }

        if (location.pathname.slice(1) !== "") {
            const app = AppList.find(
                (app) =>
                    app.name.replace(/<[^>]*>?/gm, "") ===
                    location.pathname.slice(1),
            );
            if (app) {
                document.title = app.name.replace(/<[^>]*>?/gm, "");
            }
        }
    }, [location]);

    return (
        <>
            <section id="center">
                <div className="hero">
                    <img
                        src="./img/logo_Steam_magician-noBG.png"
                        className="base"
                        alt=""
                    />
                </div>
                <div>
                    <h1>Steam Magician</h1>
                    <p>Des outils suplémentaires pour les joueurs Steam.</p>
                </div>
            </section>
            <section className="app_liste">
                {AppList.map((app) => (
                    <AppCard key={app.id} app={app} />
                ))}
            </section>
        </>
    );
}

export default App;
