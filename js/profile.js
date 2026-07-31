const API =
    "https://api.lanyard.rest/v1/users/1187401892435869737";

const overlay =
    document.getElementById("profile-overlay");

const loading =
    document.getElementById("profile-loading");

const card =
    document.getElementById("profile-card");

/* Banner */

const banner =
    document.getElementById("profile-banner");

/* Avatar */

const avatar =
    document.getElementById("profile-avatar");

const decoration =
    document.getElementById("profile-decoration");

const statusDot =
    document.getElementById("profile-status-dot");

/* Profile */

const displayName =
    document.getElementById("profile-display-name");

const username =
    document.getElementById("profile-username");

const status =
    document.getElementById("profile-status");

const about =
    document.getElementById("profile-about");

/* Activity */

const activity =
    document.getElementById("profile-activity");

/* Devices */

const devices =
    document.getElementById("profile-devices");

/* Member Since */

const created =
    document.getElementById("profile-created");

/* Discord ID */

const discordID =
    document.getElementById("profile-id");

const copyButton =
    document.getElementById("copy-id");

/* Badges */

const badges =
    document.getElementById("profile-badges");

let profileRefreshTimer = null;
let profileRefreshIntervalMs = 15000;

const STATUS = {

    online: {

        name: "Online",

        colour: "#23a55a"

    },

    idle: {

        name: "Idle",

        colour: "#f0b232"

    },

    dnd: {

        name: "Do Not Disturb",

        colour: "#f23f43"

    },

    offline: {

        name: "Offline",

        colour: "#80848e"

    }

};

export async function openProfile(){

    overlay.style.display = "flex";

    loading.style.display = "block";

    card.style.display = "none";

    loading.textContent =
        "Connecting to Discord...";

    startProfileAutoRefresh();

    await fetchProfile();

}

export function closeProfile(){

    stopProfileAutoRefresh();
    overlay.style.display = "none";

}

function startProfileAutoRefresh(){

    stopProfileAutoRefresh();

    profileRefreshTimer =
        window.setInterval(() => {

            fetchProfile({ silent: true });

        }, profileRefreshIntervalMs);

}

function stopProfileAutoRefresh(){

    if(profileRefreshTimer){

        clearInterval(profileRefreshTimer);
        profileRefreshTimer = null;

    }

}

async function fetchProfile(options = {}){

    const { silent = false } = options;

    try{

        if(!silent){

            loading.textContent =
                "Connecting to Discord...";

        }

        const response =
            await fetch(API);

        if(!response.ok){

            throw new Error(
                "Failed to fetch profile."
            );

        }

        const json =
            await response.json();

        const payload =
            json?.data || {};

        if(overlay.style.display !== "flex"){

            return;

        }

        renderProfile(payload);

        loading.style.display =
            "none";

        card.style.display =
            "block";

    }

    catch(error){

        console.error(error);

        if(!silent){

            loading.textContent =
                "Failed to connect to Discord.";

        }

    }

}

overlay.addEventListener("click", event => {

    if(event.target === overlay){

        closeProfile();

    }

});

copyButton.addEventListener("click", async () => {

    try{

        await navigator.clipboard.writeText(

            discordID.textContent

        );

        const oldText =
            copyButton.textContent;

        copyButton.textContent =
            "Copied!";

        setTimeout(() => {

            copyButton.textContent =
                oldText;

        }, 1500);

    }

    catch(error){

        console.error(error);

    }

});

function renderProfile(data){

    const user =
        data.discord_user || {};

    renderBanner(data);

    renderAvatar(user, data);

    renderProfileInfo(user, data);

    renderActivity(data);

    renderDevices(data);

    renderBadges(user);

    renderMemberSince(user);

}

function renderBanner(data){

    const colour =

        STATUS[data.discord_status]?.colour ||

        "#5865f2";

    banner.style.background = `

        linear-gradient(

            135deg,

            ${colour},

            #2b2d31

        )

    `;

}

function renderAvatar(user, data){

    const avatarId = user.id || "0";
    const avatarHash = user.avatar || null;

    avatar.src =
        avatarHash ?
        `https://cdn.discordapp.com/avatars/${avatarId}/${avatarHash}.png?size=512` :
        "https://cdn.discordapp.com/embed/avatars/0.png";

    avatar.alt =
        user.username || "Discord user";

    if(user.avatar_decoration_data){

        decoration.src =
            `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatar_decoration_data.asset}.png`;

        decoration.style.display =
            "block";

    }

    else{

        decoration.removeAttribute("src");

        decoration.style.display =
            "none";

    }

    statusDot.style.background =

        STATUS[data.discord_status]?.colour ||

        STATUS.offline.colour;

}

function renderProfileInfo(user, data){

    /* Display Name */

    displayName.textContent =

        user.display_name ||

        user.global_name ||

        user.username;

    /* Username */

    username.textContent =

        "@" + user.username;

    /* Status */

    status.textContent =

        STATUS[data.discord_status]?.name ||

        STATUS.offline.name;

    status.style.color =

        STATUS[data.discord_status]?.colour ||

        STATUS.offline.colour;

    /* Discord ID */

    discordID.textContent =

        user.id;

    /* About Me */

    about.textContent =

        "No bio available.";

}

function renderMemberSince(user){

    const discordEpoch =

        1420070400000;

    const timestamp =

        Number(

            BigInt(user.id) >> 22n

        ) + discordEpoch;

    created.textContent =

        new Date(timestamp).toLocaleDateString(

            undefined,

            {

                year: "numeric",

                month: "long",

                day: "numeric"

            }

        );

}

function renderActivity(data){

    activity.innerHTML = "";

    const activities =
        Array.isArray(data.activities) ?
        data.activities :
        [];

    const listeningToSpotify =
        Boolean(data.listening_to_spotify && data.spotify);

    if(!listeningToSpotify && !activities.length){

        activity.innerHTML = `

            <div class="activity-card">

                <div class="activity-info">

                    <div class="activity-title">

                        No current activity

                    </div>

                    <div class="activity-extra">

                        Nothing is being shared right now.

                    </div>

                </div>

            </div>

        `;

        return;

    }

    const spotify = data.spotify;
    const richActivity = activities[0];

    const isSpotify =
        Boolean(listeningToSpotify && spotify);

    const hasMultipleActivities =
        activities.length > 1 ||
        (isSpotify && activities.length > 0 && activities[0]?.name && activities[0].name !== "Spotify");

    const act = isSpotify ? spotify : richActivity;
    const image = isSpotify ?
        spotify.album_art_url :
        resolveActivityImage(richActivity);

    const title =
        isSpotify ? spotify.song : richActivity?.name || "Activity";

    const subtitle =
        isSpotify ? spotify.artist : richActivity?.details;

    const extra =
        isSpotify ? spotify.album : richActivity?.state;

    const timestamp =
        formatActivityTimestamp(act);

    const progress =
        buildActivityProgress(act);

    const summaryText =
        hasMultipleActivities ?
        buildActivitySummary(activities, spotify) :
        null;

    activity.innerHTML = `

        <div class="activity-card">

            ${image ? `

                <div class="activity-assets">

                    <img
                        class="activity-large"
                        src="${image}"
                        draggable="false"
                    >

                </div>` : ""

            }

            <div class="activity-info">

                <div class="activity-app">

                    ${hasMultipleActivities ? "Multiple activities" : isSpotify ? "Spotify" : richActivity?.name || "Activity"}

                </div>

                <div class="activity-title">

                    ${hasMultipleActivities ? summaryText.title : title}

                </div>

                ${subtitle && !hasMultipleActivities ? `<div class="activity-details">${subtitle}</div>` : ""}

                ${extra && !hasMultipleActivities ? `<div class="activity-extra">${extra}</div>` : ""}

                ${hasMultipleActivities ? `<div class="activity-details">${summaryText.details}</div>` : ""}

                ${timestamp ? `<div class="activity-timestamp">${timestamp}</div>` : ""}

                ${progress ? `

                    <div class="activity-progress-container" style="display:block;">

                        <div class="activity-progress-bar">

                            <div
                                class="activity-progress-fill"
                                style="width:${progress.percent}%"
                            ></div>

                        </div>

                        <div class="activity-progress-text">

                            <span>${progress.elapsed}</span>
                            <span>${progress.total}</span>

                        </div>

                    </div>` : ""

                }

            </div>

        </div>

    `;

}

function buildActivitySummary(activities, spotify){

    const names = [];

    if(spotify){

        names.push("Spotify");

    }

    for(const activity of activities.slice(0, 3)){

        if(activity?.name && !names.includes(activity.name)){

            names.push(activity.name);

        }

    }

    const title =
        names.length > 1 ?
        `${names[0]} + ${names.length - 1} more` :
        "Multiple activities";

    const details =
        names.length > 1 ?
        `${names.join(" • ")}` :
        "More than one activity is running.";

    return { title, details };

}

function formatActivityTimestamp(activity){

    if(!activity?.timestamps?.start){

        return null;

    }

    const start =
        new Date(Number(activity.timestamps.start));

    const end =
        activity.timestamps.end ?
        new Date(Number(activity.timestamps.end)) :
        null;

    const isLive = !end || end.getTime() > Date.now();

    const timeText =
        start.toLocaleTimeString([], {

            hour: "numeric",
            minute: "2-digit"

        });

    return isLive ?
        `Started ${timeText}` :
        `Ended ${timeText}`;

}

function buildActivityProgress(activity){

    if(!activity?.timestamps?.start){

        return null;

    }

    const start = Number(activity.timestamps.start);
    const end = activity.timestamps.end ?
        Number(activity.timestamps.end) :
        null;

    const elapsedMs = Math.max(0, Date.now() - start);

    if(!end){

        return {
            elapsed: formatDuration(elapsedMs),
            total: "Live",
            percent: 0
        };

    }

    const totalMs = Math.max(1, end - start);
    const percent = Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));

    return {
        elapsed: formatDuration(elapsedMs),
        total: formatDuration(totalMs),
        percent
    };

}

function formatDuration(ms){

    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${String(seconds).padStart(2, "0")}`;

}

function resolveActivityImage(activity){

    if(

        !activity ||

        !activity.assets ||

        !activity.assets.large_image

    ){

        return null;

    }

    const image =

        activity.assets.large_image;

    /* Spotify */

    if(image.startsWith("spotify:")){

        return `https://i.scdn.co/image/${image.slice(8)}`;

    }

    /* Lanyard External Images */

    if(image.startsWith("mp:external/")){

        const parts =

            image.split("/");

        const index =

            parts.findIndex(part =>

                part.startsWith("http")

            );

        if(index !== -1){

            return decodeURIComponent(

                parts.slice(index).join("/")

            );

        }

        return null;

    }

    /* Discord Application Assets */

    if(activity.application_id){

        return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${image}.png`;

    }

    return null;

}

function renderDevices(data){

    devices.innerHTML = "";

    const deviceList = [];

    if(data.active_on_discord_desktop){

        deviceList.push("Desktop");

    }

    if(data.active_on_discord_web){

        deviceList.push("Web");

    }

    if(data.active_on_discord_mobile){

        deviceList.push("Mobile");

    }

    if(data.active_on_discord_embedded){

        deviceList.push("Embedded");

    }

    if(data.active_on_discord_vr){

        deviceList.push("VR");

    }

    if(!deviceList.length){

        deviceList.push("Offline");

    }

    for(const device of deviceList){

        const div =
            document.createElement("div");

        div.className =
            "device";

        div.textContent =
            device;

        devices.appendChild(div);

    }

}

function renderBadges(user){

    badges.innerHTML = "";

    const flags =
        user.public_flags || 0;

    const badgeList = [];

    if(flags & 1){

        badgeList.push({
            image: "staff",
            title: "Discord Staff"
        });

    }

    if(flags & 2){

        badgeList.push({
            image: "partner",
            title: "Partnered Server Owner"
        });

    }

    if(flags & 4){

        badgeList.push({
            image: "hypesquad-events",
            title: "HypeSquad Events"
        });

    }

    if(flags & 8){

        badgeList.push({
            image: "bug-hunter",
            title: "Bug Hunter"
        });

    }

    if(flags & 64){

        badgeList.push({
            image: "active-developer",
            title: "Active Developer"
        });

    }

    if(flags & 512){

        badgeList.push({
            image: "early-supporter",
            title: "Early Supporter"
        });

    }

    if(flags & 16384){

        badgeList.push({
            image: "bug-hunter-level-2",
            title: "Bug Hunter Level 2"
        });

    }

    if(flags & 4194304){

        badgeList.push({
            image: "active-developer",
            title: "Active Developer"
        });

    }

    for(const badge of badgeList){

        const img =
            document.createElement("img");

        img.className =
            "badge";

        img.src =
            `assets/badges/${badge.image}.png`;

        img.alt =
            badge.title;

        img.title =
            badge.title;

        badges.appendChild(img);

    }

}

avatar.addEventListener("error", () => {

    avatar.src =
        "https://cdn.discordapp.com/embed/avatars/0.png";

});

decoration.addEventListener("error", () => {

    decoration.style.display =
        "none";

});

activity.addEventListener("error", event => {

    if(event.target.tagName !== "IMG"){

        return;

    }

    event.target.style.display =
        "none";

}, true);