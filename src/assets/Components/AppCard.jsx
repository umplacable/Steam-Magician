import { Link } from "react-router-dom";

const AppCard = ({
    app = {
        name: "",
        description: "",
        image_logo: "",
        image_bg: "",
    },
}) => {
    return (
        <Link
            to={`/${app.name.replace(/<[^>]*>?/gm, "")}`}
            className="app_card"
            style={{ backgroundImage: `url(${app.image_bg})` }}
        >
            <div className="app_logo">
                <img src={`../img/${app.image_logo}`} alt={app.name} />
            </div>
            <div className="app_content">
                {/** biome-ignore lint/security/noDangerouslySetInnerHtml: It' a Controled injection */}
                <h2 dangerouslySetInnerHTML={{ __html: app.name }} />
                <p>{app.description}</p>
            </div>
        </Link>
    );
};

export default AppCard;
