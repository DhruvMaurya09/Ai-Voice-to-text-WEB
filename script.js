// ============================================
// VOICENOTES - COMPLETE SCRIPT.JS
// ============================================


// ============================================
// CONFIGURATION
// ============================================

const API_URL = "https://ai-voice-to-text-web.onrender.com/api";


// ============================================
// ELEMENTS
// ============================================

const loginPage = document.getElementById("loginPage");
const registerPage = document.getElementById("registerPage");
const dashboard = document.getElementById("dashboard");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

const logoutBtn = document.getElementById("logoutBtn");
const welcomeUser = document.getElementById("welcomeUser");

const micBtn = document.getElementById("micBtn");
const recordingText = document.getElementById("recordingText");
const statusText = document.getElementById("status");

const transcript = document.getElementById("transcript");
const translatedText = document.getElementById("translatedText");

const speechLanguage =
    document.getElementById("speechLanguage");

const languageSelect =
    document.getElementById("languageSelect");

const translateBtn =
    document.getElementById("translateBtn");

const saveVoiceNote =
    document.getElementById("saveVoiceNote");

const clearTranscript =
    document.getElementById("clearTranscript");

const notesContainer =
    document.getElementById("notesContainer");

const emptyMessage =
    document.getElementById("emptyMessage");

const searchInput =
    document.getElementById("searchInput");

const themeBtn =
    document.getElementById("themeBtn");

const editModal =
    document.getElementById("editModal");

const editText =
    document.getElementById("editText");

const cancelEdit =
    document.getElementById("cancelEdit");

const saveEdit =
    document.getElementById("saveEdit");


// AI ELEMENTS

const summaryBtn =
    document.getElementById("summaryBtn");

const keyPointsBtn =
    document.getElementById("keyPointsBtn");

const improveBtn =
    document.getElementById("improveBtn");

const aiResultBox =
    document.getElementById("aiResultBox");

const aiResultTitle =
    document.getElementById("aiResultTitle");

const aiResultContent =
    document.getElementById("aiResultContent");

const closeAIResult =
    document.getElementById("closeAIResult");


// ============================================
// AUTH STATE
// ============================================

let token =
    localStorage.getItem("voiceNotesToken");

let currentUser = null;

try {

    currentUser =
        JSON.parse(
            localStorage.getItem("voiceNotesUser")
        ) || null;

} catch (error) {

    currentUser = null;

}


let currentEditId = null;


// ============================================
// AI STATE
// ============================================

let latestSummary = "";

let latestKeyPoints = [];

let latestImprovedNote = "";


// ============================================
// PAGE SWITCHING
// ============================================

if (showRegister) {

    showRegister.addEventListener("click", () => {

        loginPage.classList.add("hidden");
        registerPage.classList.remove("hidden");

    });

}


if (showLogin) {

    showLogin.addEventListener("click", () => {

        registerPage.classList.add("hidden");
        loginPage.classList.remove("hidden");

    });

}


// ============================================
// REGISTER
// ============================================

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const name =
                document.getElementById(
                    "registerName"
                ).value.trim();

            const email =
                document.getElementById(
                    "registerEmail"
                ).value.trim();

            const password =
                document.getElementById(
                    "registerPassword"
                ).value;


            try {

                const response =
                    await fetch(
                        `${API_URL}/auth/register`,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name,
                                email,
                                password
                            })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Registration failed."
                    );

                }


                alert(
                    "Account created successfully!"
                );


                registerForm.reset();

                registerPage.classList.add(
                    "hidden"
                );

                loginPage.classList.remove(
                    "hidden"
                );


            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );

                alert(
                    error.message ||
                    "Registration failed."
                );

            }

        }
    );

}


// ============================================
// LOGIN
// ============================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const email =
                document.getElementById(
                    "loginEmail"
                ).value.trim();

            const password =
                document.getElementById(
                    "loginPassword"
                ).value;


            try {

                const response =
                    await fetch(
                        `${API_URL}/auth/login`,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email,
                                password
                            })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Login failed."
                    );

                }


                token =
                    data.token;

                currentUser =
                    data.user || null;


                localStorage.setItem(
                    "voiceNotesToken",
                    token
                );


                localStorage.setItem(
                    "voiceNotesUser",
                    JSON.stringify(
                        currentUser
                    )
                );


                loginForm.reset();

                showDashboard();


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );

                alert(
                    error.message ||
                    "Login failed."
                );

            }

        }
    );

}


// ============================================
// SHOW DASHBOARD
// ============================================

function showDashboard() {

    loginPage.classList.add("hidden");
    registerPage.classList.add("hidden");

    dashboard.classList.remove("hidden");


    if (welcomeUser && currentUser) {

        welcomeUser.textContent =
            `Hello, ${currentUser.name} 👋`;

    }


    displayNotes();

}


// ============================================
// LOGOUT
// ============================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            token = null;
            currentUser = null;


            localStorage.removeItem(
                "voiceNotesToken"
            );

            localStorage.removeItem(
                "voiceNotesUser"
            );


            dashboard.classList.add(
                "hidden"
            );

            loginPage.classList.remove(
                "hidden"
            );

        }
    );

}


// ============================================
// SPEECH RECOGNITION
// ============================================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


const speechLanguages = {

    English: "en-US",

    Hindi: "hi-IN",
    Bengali: "bn-IN",
    Gujarati: "gu-IN",
    Kannada: "kn-IN",
    Malayalam: "ml-IN",
    Marathi: "mr-IN",
    Punjabi: "pa-IN",
    Tamil: "ta-IN",
    Telugu: "te-IN",
    Urdu: "ur-IN",

    German: "de-DE",
    French: "fr-FR",
    Spanish: "es-ES",
    Italian: "it-IT",
    Portuguese: "pt-PT",
    Japanese: "ja-JP",
    Korean: "ko-KR",
    Chinese: "zh-CN",
    Russian: "ru-RU",

    Arabic: "ar-SA",
    Turkish: "tr-TR",
    Dutch: "nl-NL"

};


let recognition = null;
let isRecording = false;


// ============================================
// SPEECH LANGUAGE
// ============================================

function getSpeechLanguage() {

    return speechLanguage
        ? speechLanguage.value
        : "English";

}


// ============================================
// INITIALIZE SPEECH
// ============================================

if (SpeechRecognition) {

    recognition =
        new SpeechRecognition();


    recognition.continuous =
        true;

    recognition.interimResults =
        true;


    recognition.lang =
        speechLanguages[
            getSpeechLanguage()
        ] || "en-US";


    recognition.onstart = () => {

        isRecording = true;


        micBtn.classList.add(
            "recording"
        );


        recordingText.textContent =
            "Listening...";


        statusText.textContent =
            `Listening in ${getSpeechLanguage()}. Speak now.`;

    };


    recognition.onresult = (event) => {

        let finalText = "";


        for (
            let i = event.resultIndex;
            i < event.results.length;
            i++
        ) {

            const text =
                event.results[i][0].transcript;


            if (
                event.results[i].isFinal
            ) {

                finalText +=
                    text + " ";

            }

        }


        if (
            finalText &&
            transcript
        ) {

            transcript.textContent +=
                finalText;

        }

    };


    recognition.onerror = (event) => {

        console.error(
            "Speech recognition error:",
            event.error
        );


        if (
            event.error === "not-allowed"
        ) {

            statusText.textContent =
                "Microphone permission denied.";

        } else if (
            event.error === "network"
        ) {

            statusText.textContent =
                "Speech network error. Try Chrome/Edge and check internet.";

        } else {

            statusText.textContent =
                "Speech error: " +
                event.error;

        }

    };


    recognition.onend = () => {

        isRecording = false;

        micBtn.classList.remove(
            "recording"
        );

        recordingText.textContent =
            "Start Recording";

    };

} else {

    statusText.textContent =
        "Speech Recognition is not supported. Use Google Chrome or Microsoft Edge.";

}


// ============================================
// SPEECH LANGUAGE CHANGE
// ============================================

if (speechLanguage) {

    speechLanguage.addEventListener(
        "change",
        () => {

            const language =
                speechLanguage.value;


            if (
                recognition &&
                !isRecording
            ) {

                recognition.lang =
                    speechLanguages[
                        language
                    ] || "en-US";

            }


            statusText.textContent =
                `Speak in ${language} and click the microphone.`;

        }
    );

}

// ============================================
// START / STOP RECORDING
// ============================================

if (micBtn) {

    micBtn.addEventListener(
        "click",
        () => {

            if (!recognition) {

                alert(
                    "Please use Google Chrome or Microsoft Edge."
                );

                return;

            }


            // ===============================
            // STOP RECORDING
            // ===============================

            if (isRecording) {

                // Immediately update UI
                isRecording = false;

                if (micBtn) {
                    micBtn.classList.remove("recording");
                }

                if (recordingText) {
                    recordingText.textContent =
                        "Start Recording";
                }

                if (statusText) {
                    statusText.textContent =
                        "Stopping recording...";
                }

                // Stop browser speech recognition
                try {

                    recognition.stop();

                } catch (error) {

                    console.error(
                        "Error stopping recognition:",
                        error
                    );

                }

                return;
            }


            // ===============================
            // START RECORDING
            // ===============================

            const selectedLanguage =
                getSpeechLanguage();


            recognition.lang =
                speechLanguages[selectedLanguage] ||
                "hi-IN";


            try {

                recognition.start();

            } catch (error) {

                console.error(
                    "Could not start recognition:",
                    error
                );

            }

        }
    );

}




// ============================================
// GET NOTE TEXT
// ============================================

function getNoteText() {

    if (!transcript) {
        return "";
    }


    return transcript.textContent.trim();

}


// ============================================
// TRANSLATE
// ============================================

async function translateText() {

    const text =
        getNoteText();


    if (!text) {

        alert(
            "Please speak or enter some text first."
        );

        return;

    }


    const targetLanguage =
        languageSelect.value;


    try {

        statusText.textContent =
            `Translating to ${targetLanguage}...`;


        translateBtn.disabled =
            true;


        const response =
            await fetch(
                `${API_URL}/ai/translate`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        text,

                        language:
                            targetLanguage

                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Translation failed."
            );

        }


        if (!data.result) {

            throw new Error(
                "No translated text received."
            );

        }


        // IMPORTANT:
        // Original text is NOT overwritten.

        translatedText.textContent =
            data.result;


        statusText.textContent =
            `Translated to ${targetLanguage} successfully.`;


    } catch (error) {

        console.error(
            "Translation error:",
            error
        );


        statusText.textContent =
            "Translation failed.";


        alert(
            "Translation failed: " +
            error.message
        );


    } finally {

        translateBtn.disabled =
            false;

    }

}


if (translateBtn) {

    translateBtn.addEventListener(
        "click",
        translateText
    );

}


// ============================================
// AI HELPER
// ============================================

async function callAI(endpoint, text) {

    if (!text) {

        throw new Error(
            "Please enter or record a note first."
        );

    }


    const response =
        await fetch(
            `${API_URL}/ai/${endpoint}`,
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({
                    text
                })

            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "AI request failed."
        );

    }


    return data.result;

}


// ============================================
// SHOW AI RESULT
// ============================================

function showAIResult(
    title,
    result,
    type = "text"
) {

    aiResultTitle.textContent =
        title;


    aiResultContent.innerHTML =
        "";


    if (
        type === "keypoints" &&
        Array.isArray(result)
    ) {

        const ul =
            document.createElement("ul");


        result.forEach(
            point => {

                const li =
                    document.createElement("li");

                li.textContent =
                    point;

                ul.appendChild(li);

            }
        );


        aiResultContent.appendChild(
            ul
        );

    } else {

        const p =
            document.createElement("p");

        p.textContent =
            result;

        aiResultContent.appendChild(
            p
        );

    }


    aiResultBox.classList.remove(
        "hidden"
    );

}


// ============================================
// AI SUMMARY
// ============================================

if (summaryBtn) {

    summaryBtn.addEventListener(
        "click",
        async () => {

            const text =
                getNoteText();


            if (!text) {

                alert(
                    "Please create a note first."
                );

                return;

            }


            try {

                summaryBtn.disabled =
                    true;

                summaryBtn.textContent =
                    "⏳ Generating...";


                statusText.textContent =
                    "Generating AI summary...";


                const result =
                    await callAI(
                        "summarize",
                        text
                    );


                latestSummary =
                    result;


                showAIResult(
                    "📝 AI Summary",
                    result
                );


                statusText.textContent =
                    "AI summary generated successfully.";


            } catch (error) {

                console.error(
                    "Summary error:",
                    error
                );


                alert(
                    "AI Summary failed: " +
                    error.message
                );


                statusText.textContent =
                    "AI Summary failed.";

            } finally {

                summaryBtn.disabled =
                    false;

                summaryBtn.textContent =
                    "📝 AI Summary";

            }

        }
    );

}


// ============================================
// AI KEY POINTS
// ============================================

if (keyPointsBtn) {

    keyPointsBtn.addEventListener(
        "click",
        async () => {

            const text =
                getNoteText();


            if (!text) {

                alert(
                    "Please create a note first."
                );

                return;

            }


            try {

                keyPointsBtn.disabled =
                    true;

                keyPointsBtn.textContent =
                    "⏳ Generating...";


                statusText.textContent =
                    "Extracting key points...";


                const result =
                    await callAI(
                        "key-points",
                        text
                    );


                if (Array.isArray(result)) {

                    latestKeyPoints =
                        result;

                } else {

                    latestKeyPoints =
                        String(result)
                            .split("\n")
                            .map(
                                x =>
                                    x
                                        .replace(
                                            /^[-*•]\s*/,
                                            ""
                                        )
                                        .trim()
                            )
                            .filter(Boolean);

                }


                showAIResult(
                    "🔑 AI Key Points",
                    latestKeyPoints,
                    "keypoints"
                );


                statusText.textContent =
                    "Key points generated successfully.";


            } catch (error) {

                console.error(
                    "Key points error:",
                    error
                );


                alert(
                    "AI Key Points failed: " +
                    error.message
                );


                statusText.textContent =
                    "AI Key Points failed.";

            } finally {

                keyPointsBtn.disabled =
                    false;

                keyPointsBtn.textContent =
                    "🔑 AI Key Points";

            }

        }
    );

}


// ============================================
// AI IMPROVE
// ============================================

if (improveBtn) {

    improveBtn.addEventListener(
        "click",
        async () => {

            const text =
                getNoteText();


            if (!text) {

                alert(
                    "Please create a note first."
                );

                return;

            }


            try {

                improveBtn.disabled =
                    true;

                improveBtn.textContent =
                    "⏳ Improving...";


                statusText.textContent =
                    "Improving your note...";


                const result =
                    await callAI(
                        "improve",
                        text
                    );


                latestImprovedNote =
                    result;


                showAIResult(
                    "✨ Improved Note",
                    result
                );


                // Put improved note into editor

                transcript.textContent =
                    result;


                statusText.textContent =
                    "Note improved successfully.";


            } catch (error) {

                console.error(
                    "Improve error:",
                    error
                );


                alert(
                    "AI Improve failed: " +
                    error.message
                );


                statusText.textContent =
                    "AI Improve failed.";

            } finally {

                improveBtn.disabled =
                    false;

                improveBtn.textContent =
                    "✨ Improve Note";

            }

        }
    );

}


// ============================================
// CLOSE AI RESULT
// ============================================

if (closeAIResult) {

    closeAIResult.addEventListener(
        "click",
        () => {

            aiResultBox.classList.add(
                "hidden"
            );

        }
    );

}


// ============================================
// SAVE NOTE
// ============================================

if (saveVoiceNote) {

    saveVoiceNote.addEventListener(
        "click",
        async () => {

            const originalText =
                getNoteText();


            if (!originalText) {

                alert(
                    "Please create a voice note first."
                );

                return;

            }


            if (!token) {

                alert(
                    "Please login first."
                );

                return;

            }


            let content =
                originalText;


            const translated =
                translatedText
                    ? translatedText.textContent.trim()
                    : "";


            if (translated) {

                content +=
                    `\n\nTranslation (${languageSelect.value}):\n${translated}`;

            }


            try {

                saveVoiceNote.disabled =
                    true;


                const response =
                    await fetch(
                        `${API_URL}/notes`,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`

                            },

                            body: JSON.stringify({

                                title:
                                    "Voice Note",

                                content,

                                category:
                                    "Personal",

                                language:
                                    speechLanguage
                                        ? speechLanguage.value
                                        : "English",

                                summary:
                                    latestSummary,

                                keyPoints:
                                    latestKeyPoints

                            })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Could not save note."
                    );

                }


                clearNoteEditor();

                latestSummary =
                    "";

                latestKeyPoints =
                    [];

                latestImprovedNote =
                    "";


                displayNotes();


                alert(
                    "Note saved successfully!"
                );


            } catch (error) {

                console.error(
                    "Save note error:",
                    error
                );


                alert(
                    error.message ||
                    "Could not save note."
                );

            } finally {

                saveVoiceNote.disabled =
                    false;

            }

        }
    );

}


// ============================================
// CLEAR NOTE
// ============================================

function clearNoteEditor() {

    transcript.textContent =
        "";

    translatedText.textContent =
        "";


    latestSummary =
        "";

    latestKeyPoints =
        [];

    latestImprovedNote =
        "";


    aiResultBox.classList.add(
        "hidden"
    );


    statusText.textContent =
        "Ready for a new voice note.";

}


if (clearTranscript) {

    clearTranscript.addEventListener(
        "click",
        clearNoteEditor
    );

}


// ============================================
// GET NOTES
// ============================================

async function displayNotes(
    searchTerm = ""
) {

    if (!token) {
        return;
    }


    try {

        const url =
            searchTerm
                ? `${API_URL}/notes?search=${encodeURIComponent(searchTerm)}`
                : `${API_URL}/notes`;


        const response =
            await fetch(
                url,
                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }
            );


        const notes =
            await response.json();


        if (!response.ok) {

            throw new Error(
                notes.message ||
                "Unable to load notes."
            );

        }


        notesContainer.innerHTML =
            "";


        if (
            !Array.isArray(notes) ||
            notes.length === 0
        ) {

            emptyMessage.classList.remove(
                "hidden"
            );

            return;

        }


        emptyMessage.classList.add(
            "hidden"
        );


        notes.forEach(
            note => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "note-card";


                const title =
                    escapeHTML(
                        note.title ||
                        "Voice Note"
                    );


                const content =
                    escapeHTML(
                        note.content ||
                        ""
                    )
                        .replace(
                            /\n/g,
                            "<br>"
                        );


                const date =
                    note.createdAt
                        ? new Date(
                            note.createdAt
                        ).toLocaleString()
                        : "";


                let summaryHTML =
                    "";


                if (note.summary) {

                    summaryHTML = `

                        <div class="saved-ai-section">

                            <strong>
                                📝 Summary
                            </strong>

                            <p>
                                ${escapeHTML(
                                    note.summary
                                )}
                            </p>

                        </div>

                    `;

                }


                let keyPointsHTML =
                    "";


                if (
                    Array.isArray(
                        note.keyPoints
                    ) &&
                    note.keyPoints.length
                ) {

                    keyPointsHTML = `

                        <div class="saved-ai-section">

                            <strong>
                                🔑 Key Points
                            </strong>

                            <ul>

                                ${note.keyPoints
                                    .map(
                                        point =>
                                            `<li>${escapeHTML(point)}</li>`
                                    )
                                    .join("")
                                }

                            </ul>

                        </div>

                    `;

                }


                card.innerHTML = `

                    <h3>
                        🎙️ ${title}
                    </h3>

                    <p class="note-content">
                        ${content}
                    </p>

                    ${summaryHTML}

                    ${keyPointsHTML}

                    <div class="note-date">
                        ${date}
                    </div>

                    <div class="note-actions">

                        <button
                            class="edit-btn"
                            onclick="openEdit('${note._id}')"
                        >
                            ✏️ Edit
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteNote('${note._id}')"
                        >
                            🗑️ Delete
                        </button>

                    </div>

                `;


                notesContainer.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.error(
            "Display notes error:",
            error
        );

    }

}


// ============================================
// SEARCH
// ============================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            displayNotes(
                searchInput.value.trim()
            );

        }
    );

}


// ============================================
// DELETE
// ============================================

async function deleteNote(id) {

    if (!token) {

        alert(
            "Please login first."
        );

        return;

    }


    if (
        !confirm(
            "Are you sure you want to delete this note?"
        )
    ) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/notes/${id}`,
                {

                    method: "DELETE",

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Delete failed."
            );

        }


        displayNotes(
            searchInput
                ? searchInput.value.trim()
                : ""
        );


    } catch (error) {

        console.error(
            "Delete error:",
            error
        );


        alert(
            error.message ||
            "Delete failed."
        );

    }

}


window.deleteNote =
    deleteNote;


// ============================================
// OPEN EDIT
// ============================================

async function openEdit(id) {

    if (!token) {

        alert(
            "Please login first."
        );

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/notes`,
                {

                    headers: {

                        Authorization:
                            `Bearer ${token}`

                    }

                }
            );


        const notes =
            await response.json();


        if (!response.ok) {

            throw new Error(
                notes.message ||
                "Unable to load notes."
            );

        }


        const note =
            notes.find(
                item =>
                    item._id === id
            );


        if (!note) {

            alert(
                "Note not found."
            );

            return;

        }


        currentEditId =
            id;


        editText.value =
            note.content || "";


        editModal.classList.remove(
            "hidden"
        );


    } catch (error) {

        console.error(
            "Open edit error:",
            error
        );


        alert(
            "Unable to open note."
        );

    }

}


window.openEdit =
    openEdit;


// ============================================
// SAVE EDIT
// ============================================

if (saveEdit) {

    saveEdit.addEventListener(
        "click",
        async () => {

            const content =
                editText.value.trim();


            if (!content) {

                alert(
                    "Note cannot be empty."
                );

                return;

            }


            if (!currentEditId) {

                alert(
                    "No note selected."
                );

                return;

            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/notes/${currentEditId}`,
                        {

                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`

                            },

                            body: JSON.stringify({
                                content
                            })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Update failed."
                    );

                }


                editModal.classList.add(
                    "hidden"
                );


                currentEditId =
                    null;


                displayNotes(
                    searchInput
                        ? searchInput.value.trim()
                        : ""
                );


            } catch (error) {

                console.error(
                    "Edit error:",
                    error
                );


                alert(
                    error.message ||
                    "Update failed."
                );

            }

        }
    );

}


// ============================================
// CANCEL EDIT
// ============================================

if (cancelEdit) {

    cancelEdit.addEventListener(
        "click",
        () => {

            editModal.classList.add(
                "hidden"
            );

            currentEditId =
                null;

        }
    );

}


// ============================================
// DARK MODE
// ============================================

if (themeBtn) {

    themeBtn.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark"
            );


            const dark =
                document.body.classList.contains(
                    "dark"
                );


            themeBtn.textContent =
                dark
                    ? "☀️"
                    : "🌙";


            localStorage.setItem(
                "theme",
                dark
                    ? "dark"
                    : "light"
            );

        }
    );

}


if (
    localStorage.getItem("theme") ===
    "dark"
) {

    document.body.classList.add(
        "dark"
    );


    if (themeBtn) {

        themeBtn.textContent =
            "☀️";

    }

}


// ============================================
// ESCAPE HTML
// ============================================

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value == null
            ? ""
            : String(value);


    return div.innerHTML;

}


// ============================================
// AUTO LOGIN
// ============================================

if (
    token &&
    currentUser
) {

    showDashboard();

} else {

    dashboard.classList.add(
        "hidden"
    );

    loginPage.classList.remove(
        "hidden"
    );

}


// ============================================
// END
// ============================================
