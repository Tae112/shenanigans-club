// ==========================================
// SUPABASE
// ==========================================

// REPLACE THESE TWO VALUES

const SUPABASE_URL = "https://hxwrcupnzjlkzgtnsnzc.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4d3JjdXBuempsa3pndG5zbnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzNTU1MTksImV4cCI6MjEwNTkzMTUxOX0.y3acbh7iQif5MEbtq6UhVxqDRPexs8hzHOUoAZD-0Hg";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ==========================================
// NAVIGATION
// ==========================================

function showSection(id) {

    document.querySelectorAll(".section")
        .forEach(section => {
            section.classList.remove("active");
        });

    document.getElementById(id)
        .classList.add("active");

    window.scrollTo({
        top: document.getElementById(id).offsetTop - 20,
        behavior: "smooth"
    });

}


// ==========================================
// ANONYMOUS MESSAGES
// ==========================================

async function sendAnonymous() {

    const category =
        document.getElementById("anonymousCategory").value;

    const message =
        document.getElementById("anonymousMessage").value.trim();


    if (!message) {

        alert("💌 You forgot to write the message!");

        return;
    }


    const { error } = await supabaseClient
        .from("anonymous_messages")
        .insert([
            {
                category: category,
                message: message
            }
        ]);


    if (error) {

        console.error(error);

        alert("Something went wrong 😭");

        return;
    }


    document.getElementById("anonymousMessage").value = "";

    alert("💌 Your anonymous message has disappeared into the void!");

    loadAnonymous();

}


// ==========================================
// LOAD ANONYMOUS
// ==========================================

async function loadAnonymous() {

    const { data, error } =
        await supabaseClient
            .from("anonymous_messages")
            .select("*")
            .order("created_at", { ascending: false });


    if (error) {

        console.error(error);

        return;
    }


    const list =
        document.getElementById("anonymousList");


    list.innerHTML = "";


    data.forEach(item => {

        const div = document.createElement("div");

        div.className = "post";


        div.innerHTML = `

            <small>
                ${escapeHTML(item.category)}
            </small>

            <p>
                ${escapeHTML(item.message)}
            </p>

            <small>
                💌 Anonymous
            </small>

        `;


        list.appendChild(div);

    });

}


// ==========================================
// NOTEBOOK
// ==========================================

async function addNotebook() {

    const name =
        document.getElementById("notebookName")
            .value.trim();


    const note =
        document.getElementById("notebookText")
            .value.trim();


    if (!name || !note) {

        alert("📖 Please fill in both boxes!");

        return;
    }


    const { error } =
        await supabaseClient
            .from("notebook")
            .insert([
                {
                    name: name,
                    note: note
                }
            ]);


    if (error) {

        console.error(error);

        alert("Something went wrong 😭");

        return;
    }


    document.getElementById("notebookName").value = "";

    document.getElementById("notebookText").value = "";


    loadNotebook();

}


// ==========================================
// LOAD NOTEBOOK
// ==========================================

async function loadNotebook() {

    const { data, error } =
        await supabaseClient
            .from("notebook")
            .select("*")
            .order("created_at", { ascending: false });


    if (error) {

        console.error(error);

        return;
    }


    const list =
        document.getElementById("notebookList");


    list.innerHTML = "";


    data.forEach(item => {

        const div =
            document.createElement("div");


        div.className = "post";


        div.innerHTML = `

            <small>
                🌷 ${escapeHTML(item.name)}
            </small>

            <p>
                ${escapeHTML(item.note)}
            </p>

        `;


        list.appendChild(div);

    });

}


// ==========================================
// TEA
// ==========================================

async function addTea() {

    const name =
        document.getElementById("teaName")
            .value.trim();


    const tea =
        document.getElementById("teaText")
            .value.trim();


    const level =
        document.getElementById("teaLevel").value;


    if (!name || !tea) {

        alert("🫖 You forgot the tea!");

        return;
    }


    const { error } =
        await supabaseClient
            .from("tea")
            .insert([
                {
                    name: name,
                    tea: tea,
                    level: level
                }
            ]);


    if (error) {

        console.error(error);

        alert("Something went wrong 😭");

        return;
    }


    document.getElementById("teaName").value = "";

    document.getElementById("teaText").value = "";


    loadTea();

}


// ==========================================
// LOAD TEA
// ==========================================

async function loadTea() {

    const { data, error } =
        await supabaseClient
            .from("tea")
            .select("*")
            .order("created_at", { ascending: false });


    if (error) {

        console.error(error);

        return;
    }


    const list =
        document.getElementById("teaList");


    list.innerHTML = "";


    data.forEach(item => {

        const div =
            document.createElement("div");


        div.className = "post";


        div.innerHTML = `

            <small>
                ${escapeHTML(item.level)}
            </small>

            <p>
                ${escapeHTML(item.tea)}
            </p>

            <small>
                🫖 ${escapeHTML(item.name)}
            </small>

        `;


        list.appendChild(div);

    });

}


// ==========================================
// MEMORY WALL
// ==========================================

async function addMemory() {

    const name =
        document.getElementById("memoryName")
            .value.trim();


    const caption =
        document.getElementById("memoryCaption")
            .value.trim();


    const image =
        document.getElementById("memoryImage")
            .value.trim();


    if (!name || !caption) {

        alert("📸 Please add your name and memory!");

        return;
    }


    const { error } =
        await supabaseClient
            .from("memories")
            .insert([
                {
                    name: name,
                    caption: caption,
                    image_url: image || null
                }
            ]);


    if (error) {

        console.error(error);

        alert("Something went wrong 😭");

        return;
    }


    document.getElementById("memoryName").value = "";

    document.getElementById("memoryCaption").value = "";

    document.getElementById("memoryImage").value = "";


    loadMemories();

}


// ==========================================
// LOAD MEMORIES
// ==========================================

async function loadMemories() {

    const { data, error } =
        await supabaseClient
            .from("memories")
            .select("*")
            .order("created_at", { ascending: false });


    if (error) {

        console.error(error);

        return;
    }


    const grid =
        document.getElementById("memoryGrid");


    grid.innerHTML = "";


    data.forEach(item => {

        const div =
            document.createElement("div");


        div.className = "memory";


        let imageHTML = "";


        if (item.image_url) {

            imageHTML = `
                <img
                    src="${escapeHTML(item.image_url)}"
                    alt="Memory"
                >
            `;

        }


        div.innerHTML = `

            ${imageHTML}

            <strong>
                🌷 ${escapeHTML(item.name)}
            </strong>

            <p>
                ${escapeHTML(item.caption)}
            </p>

        `;


        grid.appendChild(div);

    });

}


// ==========================================
// SAFETY
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ==========================================
// START
// ==========================================

showSection("anonymous");

loadAnonymous();

loadNotebook();

loadTea();

loadMemories();
