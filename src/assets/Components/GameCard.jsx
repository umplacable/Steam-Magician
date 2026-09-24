import { useEffect, useRef, useState } from "react";
import { StaticImages } from "../Constantes/StaticImages";

const GameCard = ({ infos, onImageStatusChange }) => {
    const imageSources = [
        `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${infos.appid}/header.jpg`,
        StaticImages[infos.appid],
        `https://media.steampowered.com/steamcommunity/public/images/apps/${infos.appid}/${infos.img_icon_url}.jpg`,
    ];

    const [imageSourceIndex, setImageSourceIndex] = useState(0);
    const statusReported = useRef(false);

    useEffect(() => {
        setImageSourceIndex(0);
        statusReported.current = false;
    }, [infos.appid]);

    const handleImageLoad = () => {
        if (statusReported.current) return;

        statusReported.current = true;
        onImageStatusChange?.(
            infos.appid,
            imageSourceIndex < 2 ? "cover" : "icon-only",
        );
    };

    const handleImageError = () => {
        if (imageSourceIndex < 2) {
            console.log(StaticImages[infos.appid] === undefined);
            if (StaticImages[infos.appid] === undefined) {
                setImageSourceIndex((currentIndex) => currentIndex + 2);
            } else {
                setImageSourceIndex((currentIndex) => currentIndex + 1);
            }
            return;
        }

        if (!statusReported.current) {
            statusReported.current = true;
            onImageStatusChange?.(infos.appid, "none");
        }
    };

    // biome-ignore lint/style/useConst: image source changes after fallback errors
    let gameImage = imageSources[imageSourceIndex];

    return (
        <div className="game_card">
            <img
                src={gameImage}
                alt={infos.name}
                onLoad={handleImageLoad}
                onError={handleImageError}
                width={imageSourceIndex <= 1 ? "460px" : ""}
                height={imageSourceIndex <= 1 ? "215px" : ""}
            />

            <h4>{infos.name}</h4>
        </div>
    );
};

export default GameCard;
