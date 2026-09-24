import { useEffect, useRef, useState } from "react";
import GameCard from "../Components/GameCard";
import UserCard from "../Components/UserCard";

const LetsPlay = () => {
    const selfID = useRef(null);
    const [friendsIDs, setFriends] = useState([]);

    const [selfUser, setSelfUser] = useState(null);
    const [friendsUsers, setFriendsUsers] = useState([]);
    const [commonGames, setCommonGames] = useState([]);

    const [sort, setSort] = useState("");

    const fetchSelfData = async () => {
        const response = await fetch(
            `/steam_api/ISteamUser/GetFriendList/v0001/?steamid=${selfID.current.value}&relationship=friend`,
        );
        const fiends = await response.json();
        console.log(fiends.friendslist.friends);
        setFriends(fiends.friendslist.friends);
    };

    const getCommonGames = async (e) => {
        const form = e.target;
        const formData = new FormData(form);

        // récup des tag amis sélectionées
        const selectedUsersIds = formData.getAll("users");

        const selfLibrary = await fetch(
            `/steam_api/IPlayerService/GetOwnedGames/v0001/?steamid=${selfID.current.value}&include_played_free_games=true&include_appinfo=true&format=json`,
        );

        const selfGames = await selfLibrary
            .json()
            .then((data) => data.response?.games ?? []);
        const selfGamesIds = selfGames.map((game) => game.appid);

        const friendsLibraries = await Promise.all(
            selectedUsersIds.map(async (friendId) => {
                const response = await fetch(
                    `/steam_api/IPlayerService/GetOwnedGames/v0001/?steamid=${friendId}&include_played_free_games=true&format=json&json=${encodeURIComponent(JSON.stringify({ appids_filter: selfGamesIds }))}`,
                );
                const data = await response.json();
                return (data.response?.games ?? []).map((game) => game.appid);
            }),
        );

        const commonGamesIds =
            selectedUsersIds.length === 0
                ? []
                : friendsLibraries.reduce(
                      (commonIds, friendGamesIds) =>
                          commonIds.filter((id) => friendGamesIds.includes(id)),
                      selfGamesIds,
                  );

        console.log(commonGamesIds);

        const commonGamesInfos = selfGames.filter((game) =>
            commonGamesIds.includes(game.appid),
        );

        console.log(commonGamesInfos);
        setCommonGames(commonGamesInfos);
    };

    useEffect(() => {
        if (friendsIDs.length === 0) return;

        const fetchUsersData = async () => {
            const response = await fetch(
                `/steam_api/ISteamUser/GetPlayerSummaries/v0002/?steamids=${selfID.current.value},${friendsIDs.map((friend) => friend.steamid).join(",")}`,
            );
            const users = await response.json().then((data) => data.response);
            console.log(
                users.players
                    .filter((player) => player.steamid !== selfID.current.value)
                    .sort((a, b) =>
                        a.personaname.toLowerCase().trim() <
                        b.personaname.toLowerCase().trim()
                            ? -1
                            : 1,
                    ),
            );
            setSelfUser(
                users.players.find(
                    (player) => player.steamid === selfID.current.value,
                ),
            );
            setFriendsUsers(
                users.players
                    .filter((player) => player.steamid !== selfID.current.value)
                    .sort((a, b) =>
                        a.personaname.toLowerCase().trim() <
                        b.personaname.toLowerCase().trim()
                            ? -1
                            : 1,
                    ),
            );
        };
        fetchUsersData();
    }, [friendsIDs]);

    return (
        <div className="letsPlay">
            <section id="center">
                <div className="hero">
                    <img
                        src="./img/LetsPlay_Logo.png"
                        className="base"
                        alt=""
                    />
                    <h1>
                        Lets<span className="degrade">Play</span>
                    </h1>
                    <p>
                        Entre ton identifiant Steam et regarde les jeux que tu a
                        en commun avec tes amis.
                    </p>
                </div>
            </section>
            <section className="letsPlay__recherche">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        fetchSelfData();
                    }}
                >
                    <input
                        ref={selfID}
                        type="text"
                        placeholder="Friend code, SteamID64, ..."
                    />
                    <button type="submit">Send</button>
                </form>
            </section>

            {selfUser != null && (
                <>
                    <section className="letsPlay__self">
                        <UserCard user={selfUser} size="large" />
                    </section>
                    <section className="letsPlay__resuslt">
                        <div className="letsPlay__friends">
                            <form
                                id="friend form"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    getCommonGames(e);
                                }}
                            >
                                <div className="user_cards_filter">
                                    <input
                                        type="text"
                                        title="search"
                                        value={sort}
                                        onChange={(e) =>
                                            setSort(e.target.value)
                                        }
                                    />
                                    <button type="submit">reload</button>
                                </div>
                                {friendsUsers.map((friend) => {
                                    const search = sort.toLowerCase().trim();

                                    const matches =
                                        !search ||
                                        friend.personaname
                                            ?.toLowerCase()
                                            .includes(search) ||
                                        friend.realname
                                            ?.toLowerCase()
                                            .includes(search) ||
                                        friend.steamid?.includes(search);

                                    return (
                                        <div
                                            className="user_card_wraper"
                                            hidden={!matches}
                                        >
                                            <UserCard
                                                key={friend.steamid}
                                                user={friend}
                                            />
                                        </div>
                                    );
                                })}
                            </form>
                        </div>
                        <div style={{ flex: 1 }}>
                            {commonGames.length > 0 ? (
                                <div className="letsPlay__Games">
                                    {commonGames.map((game) => (
                                        <GameCard
                                            key={game.appid}
                                            infos={game}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div>
                                    <div>
                                        <p>Sélectionner des amis</p>
                                        <button
                                            form="friend form"
                                            type="submit"
                                        >
                                            Reload
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export default LetsPlay;
