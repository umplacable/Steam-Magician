import { useState } from "react";
import { Link } from "react-router-dom";

const UserCard = ({
    user = {
        avatarfull: "",
        personaname: "",
        profileurl: "",
        steamid: "",
    },
    size = "small", // "small" | "medium" | "large"
}) => {
    const [checkBox, setCheckBox] = useState(null);

    const handleCheckBox = () => {
        setCheckBox((prev) => !prev);
    };

    return (
        <button
            type="button"
            onClick={handleCheckBox}
            className={`user_card ${size}`}
        >
            <img src={user.avatarfull} alt={user.personaname} />
            <div className="user_content">
                <h3>{user.personaname}</h3>
                {size === "large" && (
                    <div className="user_details">
                        <p>SteamID: {user.steamid}</p>
                        <Link to={user.profileurl} target="_blank">
                            View Profile
                        </Link>
                    </div>
                )}
            </div>
            <input
                name="users"
                type={size === "small" ? "checkbox" : "hidden"}
                value={user.steamid}
                checked={checkBox}
                readOnly={true}
            />
        </button>
    );
};

export default UserCard;
