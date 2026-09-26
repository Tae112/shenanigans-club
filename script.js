const SUPABASE_URL =
    "https://hxwrcupnzjlkzgtnsnzc.supabase.co";

const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4d3JjdXBuempsa3pndG5zbnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzNTU1MTksImV4cCI6MjEwNTkzMTUxOX0.y3acbh7iQif5MEbtq6UhVxqDRPexs8hzHOUoAZD-0Hg";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* =========================
   NAVIGATION
========================= */

function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(section => {
        section.classList.remove("active");
    });

    const section = document.getElementById(sectionId);

    if (section) {
        section.classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}


/* =========================
   RANDOM SHENANIGANS
========================= */

const shenanigans = [
    "Send someone in the group a completely unnecessary compliment. 💕",
    "Everyone must send their current facial expression. No explanation. 😂",
    "Change your profile picture for exactly 10 minutes. 🎀",
    "Someone owes the group snacks. We don't make the rules. 🍪",
    "Send the group the last photo in your gallery. 👀",
    "Everyone vote for the person most likely to survive a zombie apocalypse. 🧟",
    "Start a conversation using only emojis for five minutes. 😭",
    "Someone needs to tell an embarrassing childhood story. 🥹",
    "Send a random 'I appreciate you' message to someone. 💗",
    "Everyone must reveal their current obsession. 👀",
    "Pick someone and give them a ridiculous award. 🏆",
    "The group needs a spontaneous photo challenge. 📸",
    "Someone is officially responsible for bringing chaos today. 🎲",
    "Send a song that perfectly describes your mood. 🎵",
    "Everyone must say what snack represents their personality. 🍓",
    "Ask the group the most unnecessary question you can think of. 😂",
    "Someone must reveal their most used emoji. 👀",
    "Everybody say one thing they love about the group. 🥹",
    "Choose a random group member and make them your bestie of the hour. 💕",
    "Send a GIF that describes your life right now. 😭",
    "The next person who sends a message owes everyone cake. 🎂",
    "Tell the group one secret talent. ✨",
    "Everyone needs to send a picture of what is directly in front of them. 📷",
    "Create a completely fake conspiracy theory about the group. 🔮"
];

function randomShenanigan() {
    const result =
        shenanigans[Math.floor(Math.random() * shenanigans.length)];

    const elements = [
        document.getElementById("randomText"),
        document.getElementById("homeRandom")
    ];

    elements.forEach(element => {
        if (element) {
            element.textContent = result;
        }
    });
}


/* =========================
   MEMBERS
========================= */

async function addMember(event) {
    event.preventDefault();

    const name = document.getElementById("memberName").value.trim();
    const nickname = document.getElementById("memberNickname").value.trim();

    if (!name) return;

    const { error } = await supabaseClient
        .from("members")
        .insert({
            name,
            nickname
        });

    if (error) {
        alert("Couldn't add bestie: " + error.message);
        return;
    }

    event.target.reset();
    loadMembers();
}


async function loadMembers() {
    const container = document.getElementById("membersList");

    if (!container) return;

    container.innerHTML =
        `<div class="loading">Loading our little chaos-makers... 👭💗</div>`;

    const { data, error } = await supabaseClient
        .from("members")
        .select("*")
        .order("created_at", { ascending: true });

    if (error) {
        container.innerHTML =
            `<div class="data-card">Couldn't load members 💔</div>`;
        return;
    }

    if (!data.length) {
        container.innerHTML =
            `<div class="data-card">No besties yet... add the first one! 🎀</div>`;
        return;
    }

    container.innerHTML = data.map(member => `
        <div class="member-card">
            <div class="avatar">👩🏻‍🎀</div>
            <h3>${escapeHtml(member.name)}</h3>
            ${
                member.nickname
                    ? `<p>“${escapeHtml(member.nickname)}”</p>`
                    : ""
            }
            <small>Official Shenanigans Club member 💗</small>
        </div>
    `).join("");
}


/* =========================
   ANONYMOUS MESSAGES
========================= */

async function sendAnonymous(event) {
    event.preventDefault();

    const category =
        document.getElementById("messageCategory").value;

    const message =
        document.getElementById("anonymousMessage").value.trim();

    const { error } = await supabaseClient
        .from("anonymous_messages")
        .insert({
            category,
            message
        });

    if (error) {
        alert("Couldn't send message: " + error.message);
        return;
    }

    event.target.reset();
    loadMessages();
}


async function loadMessages() {
    const container = document.getElementById("messagesList");

    if (!container) return;

    container.innerHTML =
        `<div class="loading">Opening the anonymous mailbox... 💌</div>`;

    const { data, error } = await supabaseClient
        .from("anonymous_messages")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        container.innerHTML =
            `<div class="data-card">Couldn't load messages 💔</div>`;
        return;
    }

    container.innerHTML = data.map(item => `
        <div class="data-card">
            <h3>💌 ${escapeHtml(item.category)}</h3>
            <p>${escapeHtml(item.message)}</p>
            <small>Anonymous • ${formatDate(item.created_at)}</small>
        </div>
    `).join("");
}


/* =========================
   NOTEBOOK
========================= */

async function addNotebook(event) {
    event.preventDefault();

    const name =
        document.getElementById("notebookName").value.trim();

    const note =
        document.getElementById("notebookNote").value.trim();

    const { error } = await supabaseClient
        .from("notebook")
        .insert({
            name,
            note
        });

    if (error) {
        alert("Couldn't add notebook entry: " + error.message);
        return;
    }

    event.target.reset();
    loadNotebook();
}


async function loadNotebook() {
    const container = document.getElementById("notebookList");

    if (!container) return;

    const { data, error } = await supabaseClient
        .from("notebook")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        container.innerHTML =
            `<div class="data-card">Couldn't load notebook 💔</div>`;
        return;
    }

    container.innerHTML = data.map(item => `
        <div class="data-card">
            <h3>📖 ${escapeHtml(item.name)}</h3>
            <p>${escapeHtml(item.note)}</p>
            <small>${formatDate(item.created_at)}</small>
        </div>
    `).join("");
}


/* =========================
   TEA
========================= */

async function addTea(event) {
    event.preventDefault();

    const name =
        document.getElementById("teaName").value.trim();

    const tea =
        document.getElementById("teaText").value.trim();

    const level =
        document.getElementById("teaLevel").value;

    const { error } = await supabaseClient
        .from("tea")
        .insert({
            name,
            tea,
            level
        });

    if (error) {
        alert("Couldn't spill the tea: " + error.message);
        return;
    }

    event.target.reset();
    loadTea();
}


async function loadTea() {
    const container = document.getElementById("teaList");

    if (!container) return;

    const { data, error } = await supabaseClient
        .from("tea")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        container.innerHTML =
            `<div class="data-card">Couldn't load tea 💔</div>`;
        return;
    }

    container.innerHTML = data.map(item => `
        <div class="data-card">
            <h3>${escapeHtml(item.level)}</h3>
            <p>${escapeHtml(item.tea)}</p>
            <small>Spilled by ${escapeHtml(item.name)} • ${formatDate(item.created_at)}</small>
        </div>
    `).join("");
}


/* =========================
   MEMORY UPLOAD
========================= */

async function uploadImage(file) {
    if (!file) {
        throw new Error("No photo selected.");
    }

    if (!file.type.startsWith("image/")) {
        throw new Error("Please select an image.");
    }

    if (file.size > 10 * 1024 * 1024) {
        throw new Error("Photo is too large. Maximum size is 10 MB.");
    }

    const extension =
        file.name.split(".").pop().toLowerCase();

    const fileName =
        `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${extension}`;

    const { error } =
        await supabaseClient.storage
            .from("memories")
            .upload(fileName, file, {
                cacheControl: "3600",
                upsert: false,
                contentType: file.type
            });

    if (error) {
        throw error;
    }

    const { data } =
        supabaseClient.storage
            .from("memories")
            .getPublicUrl(fileName);

    if (!data.publicUrl) {
        throw new Error("Could not create public image URL.");
    }

    return data.publicUrl;
}


async function addMemory(event) {
    event.preventDefault();

    const name =
        document.getElementById("memoryName").value.trim();

    const caption =
        document.getElementById("memoryCaption").value.trim();

    const file =
        document.getElementById("memoryPhoto").files[0];

    const button = event.target.querySelector("button");

    try {
        button.disabled = true;
        button.textContent = "Uploading... 📸💗";

        const image_url = await uploadImage(file);

        const { error } = await supabaseClient
            .from("memories")
            .insert({
                name,
                caption,
                image_url
            });

        if (error) {
            throw error;
        }

        event.target.reset();
        await loadMemories();

        alert("Memory added! 📸💕");

    } catch (error) {
        console.error(error);
        alert("Couldn't add memory: " + error.message);

    } finally {
        button.disabled = false;
        button.textContent = "📸 Add Memory";
    }
}


async function loadMemories() {
    const container = document.getElementById("memoriesList");

    if (!container) return;

    container.innerHTML =
        `<div class="loading">Developing our memories... 📸✨</div>`;

    const { data, error } = await supabaseClient
        .from("memories")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        container.innerHTML =
            `<div class="data-card">Couldn't load memories 💔</div>`;
        return;
    }

    if (!data.length) {
        container.innerHTML =
            `<div class="data-card">No memories yet. Let's make some! 📸💕</div>`;
        return;
    }

    container.innerHTML = data.map(memory => `
        <div class="memory-card">
            <img
                src="${escapeAttribute(memory.image_url)}"
                alt="${escapeAttribute(memory.caption)}"
                loading="lazy"
            >

            <h3>📸 ${escapeHtml(memory.caption)}</h3>

            <p>— ${escapeHtml(memory.name)}</p>

            <small>${formatDate(memory.created_at)}</small>
        </div>
    `).join("");
}


/* =========================
   MUSIC
========================= */

async function addMusic(event) {
    event.preventDefault();

    const title =
        document.getElementById("musicTitle").value.trim();

    const artist =
        document.getElementById("musicArtist").value.trim();

    const url =
        document.getElementById("musicUrl").value.trim();

    const added_by =
        document.getElementById("musicAddedBy").value.trim();

    const { error } = await supabaseClient
        .from("music")
        .insert({
            title,
            artist,
            url,
            added_by
        });

    if (error) {
        alert("Couldn't add song: " + error.message);
        return;
    }

    event.target.reset();
    loadMusic();
}


async function loadMusic() {
    const container = document.getElementById("musicList");

    if (!container) return;

    const { data, error } = await supabaseClient
        .from("music")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        container.innerHTML =
            `<div class="data-card">Couldn't load soundtrack 💔</div>`;
        return;
    }

    container.innerHTML = data.map(song => `
        <div class="data-card music-card">
            <div class="music-icon">🎵</div>

            <div>
                <h3>${escapeHtml(song.title)}</h3>

                ${
                    song.artist
                        ? `<p>by ${escapeHtml(song.artist)}</p>`
                        : ""
                }

                <a
                    href="${escapeAttribute(song.url)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ▶️ Open Song
                </a>

                <br>

                <small>
                    Added by ${escapeHtml(song.added_by)}
                </small>
            </div>
        </div>
    `).join("");
}


/* =========================
   AWARDS
========================= */

async function addAward(event) {
    event.preventDefault();

    const title =
        document.getElementById("awardTitle").value.trim();

    const winner =
        document.getElementById("awardWinner").value.trim();

    const month =
        document.getElementById("awardMonth").value.trim();

    const description =
        document.getElementById("awardDescription").value.trim();

    const { error } = await supabaseClient
        .from("awards")
        .insert({
            title,
            winner,
            month,
            description
        });

    if (error) {
        alert("Couldn't give award: " + error.message);
        return;
    }

    event.target.reset();
    loadAwards();
}


async function loadAwards() {
    const container = document.getElementById("awardsList");

    if (!container) return;

    const { data, error } = await supabaseClient
        .from("awards")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        container.innerHTML =
            `<div class="data-card">Couldn't load awards 💔</div>`;
        return;
    }

    container.innerHTML = data.map(award => `
        <div class="data-card award-card">
            <div class="award-trophy">🏆</div>

            <h3>${escapeHtml(award.title)}</h3>

            <p><strong>${escapeHtml(award.winner)}</strong></p>

            ${
                award.month
                    ? `<small>${escapeHtml(award.month)}</small>`
                    : ""
            }

            ${
                award.description
                    ? `<p>${escapeHtml(award.description)}</p>`
                    : ""
            }
        </div>
    `).join("");
}


/* =========================
   MYSTERY ROOM
========================= */

async function addMystery(event) {
    event.preventDefault();

    const title =
        document.getElementById("mysteryTitle").value.trim();

    const description =
        document.getElementById("mysteryDescription").value.trim();

    const answer =
        document.getElementById("mysteryAnswer").value.trim();

    const { error } = await supabaseClient
        .from("mysteries")
        .insert({
            title,
            description,
            answer
        });

    if (error) {
        alert("Couldn't add mystery: " + error.message);
        return;
    }

    event.target.reset();
    loadMysteries();
}


async function loadMysteries() {
    const container =
        document.getElementById("mysteriesList");

    if (!container) return;

    const { data, error } = await supabaseClient
        .from("mysteries")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        container.innerHTML =
            `<div class="data-card">Couldn't load mysteries 💔</div>`;
        return;
    }

    container.innerHTML = data.map((mystery, index) => `
        <div class="data-card mystery-card">

            <h3>🔮 ${escapeHtml(mystery.title)}</h3>

            <p>${escapeHtml(mystery.description)}</p>

            ${
                mystery.answer
                    ? `
                    <button
                        class="main-button"
                        onclick="revealMystery(${index})"
                    >
                        👀 Reveal Secret
                    </button>

                    <div
                        id="mystery-answer-${index}"
                        class="mystery-answer"
                    >
                        🤫 ${escapeHtml(mystery.answer)}
                    </div>
                    `
                    : `<small>There is no answer... 👀</small>`
            }

        </div>
    `).join("");

    window.currentMysteries = data;
}


function revealMystery(index) {
    const element =
        document.getElementById(`mystery-answer-${index}`);

    if (!element) return;

    element.classList.toggle("revealed");

    if (element.classList.contains("revealed")) {
        element.previousElementSibling.textContent =
            "🙈 Hide Secret";
    } else {
        element.previousElementSibling.textContent =
            "👀 Reveal Secret";
    }
}


/* =========================
   HELPERS
========================= */

function escapeHtml(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function escapeAttribute(value) {
    return escapeHtml(value);
}


function formatDate(date) {
    if (!date) return "";

    return new Date(date).toLocaleString();
}


/* =========================
   INITIAL LOAD
========================= */

async function loadEverything() {
    await Promise.all([
        loadMembers(),
        loadMessages(),
        loadNotebook(),
        loadTea(),
        loadMemories(),
        loadMusic(),
        loadAwards(),
        loadMysteries()
    ]);
}


/* =========================
   PWA
========================= */

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("service-worker.js")
            .then(() => {
                console.log("🌸 Shenanigans Club PWA ready!");
            })
            .catch(error => {
                console.log("PWA registration failed:", error);
            });
    });
}


document.addEventListener("DOMContentLoaded", () => {
    loadEverything();
});