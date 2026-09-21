import { useEffect, useRef, useState } from "react";

const GameCard = ({ infos, onImageStatusChange }) => {
    const imageSources = [
        `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${infos.appid}/header.jpg`,
        `https://cdn.cloudflare.steamstatic.com/steam/apps/${infos.appid}/header.jpg`,
        `https://cdn.cloudflare.steamstatic.com/steam/apps/${infos.appid}/capsule_616x353.jpg`,
        `https://cdn.cloudflare.steamstatic.com/steam/apps/${infos.appid}/capsule_231x87.jpg`,
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
            imageSourceIndex < 4 ? "cover" : "icon-only",
        );
    };

    const handleImageError = () => {
        if (imageSourceIndex < 4) {
            setImageSourceIndex((currentIndex) => currentIndex + 1);
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
            />

            <h4>{infos.name}</h4>
        </div>
    );
};

export default GameCard;
