// ============================================
// VOICENOTES - COMPLETE SCRIPT.JS
// Modern UI + Title Modal + Full Note View
// Toast Notifications + Password Toggle
// Existing API / Auth / AI / Speech Preserved
// ============================================


// ============================================
// CONFIGURATION
// ============================================

const API_URL =
    "https://ai-voice-to-text-web.onrender.com/api";


// ============================================
// ELEMENTS
// ============================================

const loginPage =
    document.getElementById("loginPage");

const registerPage =
    document.getElementById("registerPage");

const dashboard =
    document.getElementById("dashboard");

const loginForm =
    document.getElementById("loginForm");

const registerForm =
    document.getElementById("registerForm");

const showRegister =
    document.getElementById("showRegister");

const showLogin =
    document.getElementById("showLogin");

const logoutBtn =
    document.getElementById("logoutBtn");

const welcomeUser =
    document.getElementById("welcomeUser");

const micBtn =
    document.getElementById("micBtn");

const recordingText =
    document.getElementById("recordingText");

const statusText =
    document.getElementById("status");

const transcript =
    document.getElementById("transcript");

const translatedText =
    document.getElementById("translatedText");

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


// ============================================
// EDIT ELEMENTS
// ============================================

const editModal =
    document.getElementById("editModal");

const editText =
    document.getElementById("editText");

const editTitle =
    document.getElementById("editTitle");

const cancelEdit =
    document.getElementById("cancelEdit");

const saveEdit =
    document.getElementById("saveEdit");


// ============================================
// TITLE MODAL
// ============================================

const titleModal =
    document.getElementById("titleModal");

const noteTitleInput =
    document.getElementById("noteTitleInput");

const cancelTitle =
    document.getElementById("cancelTitle");

const confirmSaveNote =
    document.getElementById("confirmSaveNote");

const titleCharacterCount =
    document.getElementById(
        "titleCharacterCount"
    );


// ============================================
// FULL NOTE MODAL
// ============================================

const noteViewModal =
    document.getElementById("noteViewModal");

const fullNoteTitle =
    document.getElementById("fullNoteTitle");

const fullNoteDate =
    document.getElementById("fullNoteDate");

const fullNoteContent =
    document.getElementById("fullNoteContent");

const fullNoteSummarySection =
    document.getElementById(
        "fullNoteSummarySection"
    );

const fullNoteSummary =
    document.getElementById(
        "fullNoteSummary"
    );

const fullNoteKeyPointsSection =
    document.getElementById(
        "fullNoteKeyPointsSection"
    );

const fullNoteKeyPoints =
    document.getElementById(
        "fullNoteKeyPoints"
    );

const closeNoteView =
    document.getElementById(
        "closeNoteView"
    );

const noteMenuBtn =
    document.getElementById(
        "noteMenuBtn"
    );

const noteMenu =
    document.getElementById(
        "noteMenu"
    );

const fullNoteEdit =
    document.getElementById(
        "fullNoteEdit"
    );

const fullNoteDelete =
    document.getElementById(
        "fullNoteDelete"
    );


// ============================================
// DELETE MODAL
// ============================================

const deleteModal =
    document.getElementById(
        "deleteModal"
    );

const cancelDelete =
    document.getElementById(
        "cancelDelete"
    );

const confirmDelete =
    document.getElementById(
        "confirmDelete"
    );


// ============================================
// TOAST
// ============================================

const toastContainer =
    document.getElementById(
        "toastContainer"
    );


// ============================================
// AI ELEMENTS
// ============================================

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
    localStorage.getItem(
        "voiceNotesToken"
    );

let currentUser = null;


try {

    currentUser =
        JSON.parse(
            localStorage.getItem(
                "voiceNotesUser"
            )
        ) || null;

} catch (error) {

    currentUser = null;

}


let currentEditId = null;

let currentViewNote = null;

let pendingDeleteId = null;


// ============================================
// AI STATE
// ============================================

let latestSummary = "";

let latestKeyPoints = [];

let latestImprovedNote = "";


// ============================================
// TOAST NOTIFICATION SYSTEM
// ============================================

function showToast(
    message,
    type = "success",
    title = ""
) {

    if (!toastContainer) {
        return;
    }


    const toast =
        document.createElement(
            "div"
        );


    toast.className =
        `toast toast-${type}`;


    let icon = "✓";


    if (type === "error") {
        icon = "!";
    }

    if (type === "info") {
        icon = "i";
    }


    if (!title) {

        if (type === "success") {
            title = "Success";
        }

        if (type === "error") {
            title = "Something went wrong";
        }

        if (type === "info") {
            title = "Information";
        }

    }


    toast.innerHTML = `

        <div class="toast-icon">
            ${icon}
        </div>

        <div class="toast-content">

            <div class="toast-title">
                ${escapeHTML(title)}
            </div>

            <div class="toast-message">
                ${escapeHTML(message)}
            </div>

        </div>

        <button
            class="toast-close"
            type="button"
            aria-label="Close notification"
        >
            ✕
        </button>

    `;


    const closeButton =
        toast.querySelector(
            ".toast-close"
        );


    const removeToast = () => {

        toast.classList.add(
            "toast-out"
        );


        setTimeout(
            () => {

                toast.remove();

            },
            250
        );

    };


    closeButton.addEventListener(
        "click",
        removeToast
    );


    toastContainer.appendChild(
        toast
    );


    setTimeout(
        removeToast,
        4500
    );

}


// ============================================
// PASSWORD VISIBILITY
// ============================================

document
    .querySelectorAll(
        ".password-toggle"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const targetId =
                        button.dataset.target;

                    const input =
                        document.getElementById(
                            targetId
                        );


                    if (!input) {
                        return;
                    }


                    const isPassword =
                        input.type ===
                        "password";


                    input.type =
                        isPassword
                            ? "text"
                            : "password";


                    button.textContent =
                        isPassword
                            ? "🙈"
                            : "👁️";


                    button.setAttribute(
                        "aria-label",
                        isPassword
                            ? "Hide password"
                            : "Show password"
                    );

                    button.setAttribute(
                        "title",
                        isPassword
                            ? "Hide password"
                            : "Show password"
                    );

                }
            );

        }
    );


// ============================================
// PAGE SWITCHING
// ============================================

if (showRegister) {

    showRegister.addEventListener(
        "click",
        () => {

            loginPage.classList.add(
                "hidden"
            );

            registerPage.classList.remove(
                "hidden"
            );

        }
    );

}


if (showLogin) {

    showLogin.addEventListener(
        "click",
        () => {

            registerPage.classList.add(
                "hidden"
            );

            loginPage.classList.remove(
                "hidden"
            );

        }
    );

}


// ============================================
// REGISTER
// ============================================

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const name =
                document
                    .getElementById(
                        "registerName"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "registerEmail"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "registerPassword"
                    )
                    .value;


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

                            body:
                                JSON.stringify({
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


                registerForm.reset();


                registerPage.classList.add(
                    "hidden"
                );

                loginPage.classList.remove(
                    "hidden"
                );


                showToast(
                    "Account created successfully. You can now login.",
                    "success",
                    "Account Created"
                );

            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );


                showToast(
                    error.message ||
                    "Registration failed.",
                    "error",
                    "Registration Failed"
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
        async event => {

            event.preventDefault();


            const email =
                document
                    .getElementById(
                        "loginEmail"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "loginPassword"
                    )
                    .value;


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

                            body:
                                JSON.stringify({
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


                showToast(
                    "You have been logged in successfully.",
                    "success",
                    "Login Successful"
                );

            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                showToast(
                    error.message ||
                    "Login failed.",
                    "error",
                    "Login Failed"
                );

            }

        }
    );

}


// ============================================
// SHOW DASHBOARD
// ============================================

function showDashboard() {

    loginPage.classList.add(
        "hidden"
    );

    registerPage.classList.add(
        "hidden"
    );

    dashboard.classList.remove(
        "hidden"
    );


    if (
        welcomeUser &&
        currentUser
    ) {

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

            stopRecording();


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


            showToast(
                "You have been logged out safely.",
                "success",
                "Logged Out"
            );

        }
    );

}


// =========================================================
// SPEECH RECOGNITION — CONTINUOUS & FAST
// =========================================================

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
let shouldKeepRecording = false;
let isStarting = false;

let finalTranscript = "";
let interimTranscript = "";

let restartTimer = null;


// =========================================================
// GET SELECTED SPEECH LANGUAGE
// =========================================================

function getRecognitionLanguage() {
    return speechLanguages[getSpeechLanguage()] || "en-US";
}


// =========================================================
// UPDATE TRANSCRIPT UI
// =========================================================

function updateTranscriptDisplay() {
    if (!transcript) return;

    const finalText = finalTranscript.trim();
    const interimText = interimTranscript.trim();

    let displayText = finalText;

    if (interimText) {
        displayText +=
            (displayText ? " " : "") + interimText;
    }

    transcript.textContent = displayText;
}


// =========================================================
// CREATE SPEECH RECOGNITION
// =========================================================

function createRecognition() {

    if (!SpeechRecognition) {
        return null;
    }

    const instance = new SpeechRecognition();

    // IMPORTANT:
    // Keep recognition running continuously.
    instance.continuous = true;

    // Show words while the user is speaking.
    instance.interimResults = true;

    instance.maxAlternatives = 1;

    instance.lang = getRecognitionLanguage();


    // =====================================================
    // ON START
    // =====================================================

    instance.onstart = () => {

        isStarting = false;
        isRecording = true;

        if (micBtn) {
            micBtn.classList.add("recording");
        }

        if (recordingText) {
            recordingText.textContent = "Listening...";
        }

        if (statusText) {
            statusText.textContent =
                `Listening in ${getSpeechLanguage()}. Speak now.`;
        }

        console.log(
            "Speech recognition started:",
            instance.lang
        );
    };
}
// =====================================================
// ON RESULT
// =====================================================

instance.onresult = (event) => {

    let currentInterim = "";

    for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
    ) {

        const result = event.results[i];

        if (!result || !result[0]) {
            continue;
        }

        const text =
            result[0].transcript.trim();

        if (!text) {
            continue;
        }


        // FINAL SPEECH
        if (result.isFinal) {

            finalTranscript +=
                (finalTranscript ? " " : "") +
                text;

            console.log(
                "Final speech:",
                text
            );
        }


        // LIVE / INTERIM SPEECH
        else {

            currentInterim +=
                (currentInterim ? " " : "") +
                text;
        }
    }


    interimTranscript =
        currentInterim;

    updateTranscriptDisplay();
};
    
    

    // =====================================================
    // ON ERROR
    // =====================================================

    instance.onerror = (event) => {

        isStarting = false;

        console.error(
            "Speech recognition error:",
            event.error
        );


        // ---------------------------------------------
        // MICROPHONE PERMISSION
        // ---------------------------------------------

        if (event.error === "not-allowed") {

            shouldKeepRecording = false;
            isRecording = false;

            if (statusText) {
                statusText.textContent =
                    "Microphone permission denied.";
            }

            if (micBtn) {
                micBtn.classList.remove("recording");
            }

            if (recordingText) {
                recordingText.textContent =
                    "Start Recording";
            }

            showToast(
                "Please allow microphone access in your browser.",
                "error",
                "Microphone Permission"
            );

            return;
        }


        // ---------------------------------------------
        // NETWORK ERROR
        // ---------------------------------------------

        if (event.error === "network") {

            if (statusText) {
                statusText.textContent =
                    "Speech network error. Check your internet.";
            }

            showToast(
                "Check your internet connection and try again.",
                "error",
                "Speech Network Error"
            );

            /*
             * Don't immediately stop the whole recording.
             * Browser may recover automatically.
             */
            if (shouldKeepRecording) {
                scheduleRecognitionRestart(500);
            }

            return;
        }


        // ---------------------------------------------
        // NO SPEECH
        // ---------------------------------------------

        if (event.error === "no-speech") {

            /*
             * Do NOT stop recording.
             * Keep microphone active.
             */
            if (shouldKeepRecording) {
                scheduleRecognitionRestart(300);
            }

            return;
        }


        // ---------------------------------------------
        // ABORTED
        // ---------------------------------------------

        if (event.error === "aborted") {

            /*
             * Aborted can happen during automatic restart.
             * Don't show an error to the user.
             */

            if (shouldKeepRecording) {
                scheduleRecognitionRestart(300);
            }

            return;
        }


        // ---------------------------------------------
        // OTHER ERRORS
        // ---------------------------------------------

        if (statusText) {
            statusText.textContent =
                "Speech error: " + event.error;
        }
    };

// =====================================================
// ON END
// =====================================================

instance.onend = () => {

    isStarting = false;

    console.log(
        "Speech recognition ended."
    );


    /*
     * User ne STOP nahi dabaya hai,
     * to recording continue rakho.
     */

    if (shouldKeepRecording) {

        isRecording = true;

        if (micBtn) {
            micBtn.classList.add("recording");
        }

        if (recordingText) {
            recordingText.textContent =
                "Listening...";
        }

        scheduleRecognitionRestart(300);

        return;
    }


    // User actually stopped recording

    isRecording = false;

    interimTranscript = "";

    updateTranscriptDisplay();

    if (micBtn) {
        micBtn.classList.remove("recording");
    }

    if (recordingText) {
        recordingText.textContent =
            "Start Recording";
    }
};

    

// =========================================================
// AUTOMATIC RESTART
// =========================================================

function scheduleRecognitionRestart(delay = 250) {

    if (!shouldKeepRecording) {
        return;
    }

    if (restartTimer) {
        clearTimeout(restartTimer);
        restartTimer = null;
    }

    restartTimer = setTimeout(() => {

        restartTimer = null;

        if (!shouldKeepRecording) {
            return;
        }

        startRecognitionSession();

    }, delay);
}

// =========================================================
// START RECOGNITION SESSION
// =========================================================

function startRecognitionSession() {

    if (!shouldKeepRecording) {
        return;
    }

    if (isStarting) {
        return;
    }

    /*
     * IMPORTANT:
     * Do NOT abort the existing recognition here.
     * This function is called again only when the browser
     * has ended the previous session.
     */

    if (recognition) {
        try {
            recognition.lang = getRecognitionLanguage();
            isStarting = true;
            recognition.start();

            console.log("Recognition restarted.");

            return;

        } catch (error) {

            console.log(
                "Existing recognition could not restart:",
                error
            );

            recognition = null;
            isStarting = false;
        }
    }


    // Create a new recognition instance only when needed
    recognition = createRecognition();

    if (!recognition) {

        if (statusText) {
            statusText.textContent =
                "Speech Recognition is not supported.";
        }

        return;
    }


    recognition.lang =
        getRecognitionLanguage();

    isStarting = true;


    try {

        recognition.start();

        console.log(
            "Starting microphone recognition..."
        );

    } catch (error) {

        isStarting = false;

        console.error(
            "Recognition start error:",
            error
        );

        if (shouldKeepRecording) {
            scheduleRecognitionRestart(700);
        }
    }
}



// =========================================================
// START RECORDING
// =========================================================

function startRecording() {

    if (!SpeechRecognition) {

        showToast(
            "Speech Recognition is not supported. Please use Google Chrome.",
            "error",
            "Browser Not Supported"
        );

        return;
    }


    // Already recording
    if (
        isRecording ||
        shouldKeepRecording
    ) {
        return;
    }


    // Clear previous transcript
    finalTranscript = "";
    interimTranscript = "";


    // Start continuous recording
    shouldKeepRecording = true;


    if (transcript) {
        transcript.textContent = "";
    }


    if (statusText) {
        statusText.textContent =
            "Starting microphone...";
    }


    startRecognitionSession();
}


// =========================================================
// STOP RECORDING
// =========================================================

function stopRecording() {

    /*
     * This is the ONLY place where we intentionally
     * stop the continuous recording.
     */

    shouldKeepRecording = false;
    isRecording = false;
    isStarting = false;


    // Cancel pending restart
    if (restartTimer) {

        clearTimeout(restartTimer);

        restartTimer = null;
    }


    if (recognition) {

        try {

            recognition.onend = null;

            recognition.stop();

        } catch (error) {

            console.log(
                "Recognition already stopped."
            );
        }

        recognition = null;
    }


    // Remove temporary/interim text
    interimTranscript = "";

    updateTranscriptDisplay();


    if (micBtn) {
        micBtn.classList.remove("recording");
    }

    if (recordingText) {
        recordingText.textContent =
            "Start Recording";
    }

    if (statusText) {
        statusText.textContent =
            "Recording stopped.";
    }


    console.log(
        "Microphone recording stopped by user."
    );
}


// =========================================================
// INITIALIZE SPEECH RECOGNITION
// =========================================================

if (SpeechRecognition) {

    recognition = null;

    console.log(
        "Speech Recognition supported."
    );

} else {

    if (statusText) {

        statusText.textContent =
            "Speech Recognition is not supported. Use Google Chrome.";
    }

    console.warn(
        "Speech Recognition is not supported in this browser."
    );
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

            /*
             * If recording is NOT running,
             * update the recognition language.
             *
             * If recording is already running,
             * don't change it in the middle of a session.
             * User can stop and start again with the new language.
             */

            if (
                recognition &&
                !shouldKeepRecording
            ) {

                recognition.lang =
                    speechLanguages[language] ||
                    "en-US";
            }


            if (statusText) {

                statusText.textContent =
                    `Speak in ${language} and click the microphone.`;
            }

        }
    );

}


// ============================================
// MICROPHONE BUTTON
// ============================================

if (micBtn) {

    micBtn.addEventListener(
        "click",
        () => {

            if (!SpeechRecognition) {

                showToast(
                    "Please use Google Chrome.",
                    "error",
                    "Browser Not Supported"
                );

                return;
            }


            if (shouldKeepRecording) {

                // STOP
                stopRecording();

            } else {

                // START
                startRecording();

            }

        }
    );

}


// ============================================
// RESET SPEECH STATE
// ============================================

function resetSpeechState() {

    /*
     * Completely stop automatic recording/restarts.
     */

    shouldKeepRecording = false;
    isRecording = false;
    isStarting = false;


    // Cancel pending restart
    if (restartTimer) {

        clearTimeout(
            restartTimer
        );

        restartTimer = null;
    }


    // Clear transcript variables
    finalTranscript = "";
    interimTranscript = "";


    // Stop recognition
    if (recognition) {

        try {

            recognition.onend = null;
            recognition.onerror = null;

            recognition.abort();

        } catch (error) {

            console.log(
                "Recognition already stopped."
            );
        }

        recognition = null;
    }


    // Reset microphone UI
    if (micBtn) {

        micBtn.classList.remove(
            "recording"
        );
    }


    if (recordingText) {

        recordingText.textContent =
            "Start Recording";
    }


    updateTranscriptDisplay();
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

        showToast(
            "Please speak or enter some text first.",
            "error",
            "No Text"
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

                    body:
                        JSON.stringify({

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


        translatedText.textContent =
            data.result;


        statusText.textContent =
            `Translated to ${targetLanguage} successfully.`;


        showToast(
            `Your note was translated to ${targetLanguage}.`,
            "success",
            "Translation Complete"
        );

    } catch (error) {

        console.error(
            "Translation error:",
            error
        );


        statusText.textContent =
            "Translation failed.";


        showToast(
            error.message ||
            "Translation failed.",
            "error",
            "Translation Failed"
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

async function callAI(
    endpoint,
    text
) {

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

                body:
                    JSON.stringify({
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
            document.createElement(
                "ul"
            );


        result.forEach(
            point => {

                const li =
                    document.createElement(
                        "li"
                    );


                li.textContent =
                    point;


                ul.appendChild(
                    li
                );

            }
        );


        aiResultContent.appendChild(
            ul
        );

    } else {

        const p =
            document.createElement(
                "p"
            );


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

                showToast(
                    "Please create a note first.",
                    "error",
                    "No Note"
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


                showToast(
                    "AI summary is ready.",
                    "success",
                    "Summary Generated"
                );

            } catch (error) {

                console.error(
                    "Summary error:",
                    error
                );


                showToast(
                    error.message ||
                    "AI Summary failed.",
                    "error",
                    "AI Summary Failed"
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

                showToast(
                    "Please create a note first.",
                    "error",
                    "No Note"
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


                if (
                    Array.isArray(result)
                ) {

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


                showToast(
                    "Key points are ready.",
                    "success",
                    "Key Points Generated"
                );

            } catch (error) {

                console.error(
                    "Key points error:",
                    error
                );


                showToast(
                    error.message ||
                    "AI Key Points failed.",
                    "error",
                    "AI Key Points Failed"
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

                showToast(
                    "Please create a note first.",
                    "error",
                    "No Note"
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


                transcript.textContent =
                    result;


                finalTranscript =
                    result;


                statusText.textContent =
                    "Note improved successfully.";


                showToast(
                    "Your note has been improved with AI.",
                    "success",
                    "Note Improved"
                );

            } catch (error) {

                console.error(
                    "Improve error:",
                    error
                );


                showToast(
                    error.message ||
                    "AI Improve failed.",
                    "error",
                    "AI Improve Failed"
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
// OPEN TITLE MODAL
// ============================================

function openTitleModal() {

    if (!titleModal) {
        return;
    }


    noteTitleInput.value =
        "";


    updateTitleCharacterCount();


    titleModal.classList.remove(
        "hidden"
    );


    setTimeout(
        () => {

            noteTitleInput.focus();

        },
        100
    );

}


// ============================================
// CLOSE TITLE MODAL
// ============================================

function closeTitleModal() {

    if (!titleModal) {
        return;
    }


    titleModal.classList.add(
        "hidden"
    );


    noteTitleInput.value =
        "";

}


// ============================================
// TITLE CHARACTER COUNT
// ============================================

function updateTitleCharacterCount() {

    if (!noteTitleInput ||
        !titleCharacterCount) {

        return;

    }


    const length =
        noteTitleInput.value.length;


    titleCharacterCount.textContent =
        `${length} / 100`;

}


if (noteTitleInput) {

    noteTitleInput.addEventListener(
        "input",
        updateTitleCharacterCount
    );


    noteTitleInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();

                saveNoteWithTitle();

            }

            if (
                event.key ===
                "Escape"
            ) {

                closeTitleModal();

            }

        }
    );

}


if (cancelTitle) {

    cancelTitle.addEventListener(
        "click",
        closeTitleModal
    );

}


if (confirmSaveNote) {

    confirmSaveNote.addEventListener(
        "click",
        saveNoteWithTitle
    );

}


// ============================================
// SAVE BUTTON
// ============================================

if (saveVoiceNote) {

    saveVoiceNote.addEventListener(
        "click",
        () => {

            const originalText =
                getNoteText();


            if (!originalText) {

                showToast(
                    "Please create a voice note first.",
                    "error",
                    "No Note"
                );

                return;

            }


            if (!token) {

                showToast(
                    "Please login first.",
                    "error",
                    "Login Required"
                );

                return;

            }


            openTitleModal();

        }
    );

}


// ============================================
// SAVE NOTE WITH TITLE
// ============================================

async function saveNoteWithTitle() {

    const originalText =
        getNoteText();


    if (!originalText) {

        closeTitleModal();

        showToast(
            "Please create a voice note first.",
            "error",
            "No Note"
        );

        return;

    }


    if (!token) {

        closeTitleModal();

        showToast(
            "Please login first.",
            "error",
            "Login Required"
        );

        return;

    }


    const title =
        noteTitleInput
            ? noteTitleInput.value.trim()
            : "";


    if (!title) {

        showToast(
            "Please enter a title before saving.",
            "error",
            "Title Required"
        );


        if (noteTitleInput) {

            noteTitleInput.focus();

        }


        return;

    }


    const translated =
        translatedText
            ? translatedText.textContent.trim()
            : "";


    let content =
        originalText;


    if (translated) {

        content +=
            `\n\nTranslation (${languageSelect.value}):\n${translated}`;

    }


    try {

        if (confirmSaveNote) {

            confirmSaveNote.disabled =
                true;

            confirmSaveNote.textContent =
                "⏳ Saving...";

        }


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

                    body:
                        JSON.stringify({

                            title,

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


        closeTitleModal();


        clearNoteEditor();


        latestSummary =
            "";

        latestKeyPoints =
            [];

        latestImprovedNote =
            "";


        await displayNotes();


        showToast(
            `"${title}" has been saved successfully.`,
            "success",
            "Note Saved"
        );

    } catch (error) {

        console.error(
            "Save note error:",
            error
        );


        showToast(
            error.message ||
            "Could not save note.",
            "error",
            "Save Failed"
        );

    } finally {

        if (confirmSaveNote) {

            confirmSaveNote.disabled =
                false;

            confirmSaveNote.textContent =
                "💾 Save Note";

        }

    }

}


// ============================================
// CLEAR NOTE
// ============================================

function clearNoteEditor() {

    resetSpeechState();


    if (transcript) {

        transcript.textContent =
            "";

    }


    if (translatedText) {

        translatedText.textContent =
            "";

    }


    latestSummary =
        "";

    latestKeyPoints =
        [];

    latestImprovedNote =
        "";


    if (aiResultBox) {

        aiResultBox.classList.add(
            "hidden"
        );

    }


    if (statusText) {

        statusText.textContent =
            "Ready for a new voice note.";

    }

}


if (clearTranscript) {

    clearTranscript.addEventListener(
        "click",
        () => {

            clearNoteEditor();

            showToast(
                "The note editor has been cleared.",
                "success",
                "Editor Cleared"
            );

        }
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
            (note, index) => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "note-card";


                card.setAttribute(
                    "role",
                    "button"
                );


                card.setAttribute(
                    "tabindex",
                    "0"
                );


                const title =
                    note.title ||
                    "Voice Note";


                const content =
                    note.content ||
                    "";


                const preview =
                    getPreviewText(
                        content
                    );


                const date =
                    note.createdAt
                        ? new Date(
                            note.createdAt
                        ).toLocaleString()
                        : "";


                const language =
                    note.language ||
                    "English";


                card.innerHTML = `

                    <h3>
                        🎙️ ${escapeHTML(title)}
                    </h3>

                    <p class="note-preview">
                        ${escapeHTML(preview)}
                    </p>

                    <div class="note-card-meta">

                        <span class="note-date">
                            📅 ${escapeHTML(date)}
                        </span>

                        <span class="note-language">
                            ${escapeHTML(language)}
                        </span>

                    </div>

                `;


                card.style.animationDelay =
                    `${Math.min(index * 0.035, 0.3)}s`;


                card.addEventListener(
                    "click",
                    () => {

                        openFullNote(
                            note
                        );

                    }
                );


                card.addEventListener(
                    "keydown",
                    event => {

                        if (
                            event.key ===
                                "Enter" ||
                            event.key ===
                                " "
                        ) {

                            event.preventDefault();

                            openFullNote(
                                note
                            );

                        }

                    }
                );


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


        showToast(
            "Unable to load your notes.",
            "error",
            "Notes Loading Failed"
        );

    }

}


// ============================================
// PREVIEW TEXT
// ============================================

function getPreviewText(
    content
) {

    if (!content) {
        return "No content available.";
    }


    return String(content)
        .replace(
            /Translation\s*\([^)]*\):[\s\S]*$/i,
            ""
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim()
        .slice(
            0,
            180
        ) ||
        "No content available.";

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
// OPEN FULL NOTE
// ============================================

function openFullNote(note) {

    if (!noteViewModal) {
        return;
    }


    currentViewNote =
        note;


    if (fullNoteTitle) {

        fullNoteTitle.textContent =
            note.title ||
            "Voice Note";

    }


    if (fullNoteDate) {

        fullNoteDate.textContent =
            note.createdAt
                ? new Date(
                    note.createdAt
                ).toLocaleString()
                : "";

    }


    if (fullNoteContent) {

        fullNoteContent.textContent =
            note.content ||
            "";

    }


    if (
        fullNoteSummarySection &&
        fullNoteSummary
    ) {

        if (note.summary) {

            fullNoteSummary.textContent =
                note.summary;

            fullNoteSummarySection.classList.remove(
                "hidden"
            );

        } else {

            fullNoteSummarySection.classList.add(
                "hidden"
            );

        }

    }


    if (
        fullNoteKeyPointsSection &&
        fullNoteKeyPoints
    ) {

        fullNoteKeyPoints.innerHTML =
            "";


        if (
            Array.isArray(
                note.keyPoints
            ) &&
            note.keyPoints.length
        ) {

            note.keyPoints.forEach(
                point => {

                    const li =
                        document.createElement(
                            "li"
                        );


                    li.textContent =
                        point;


                    fullNoteKeyPoints.appendChild(
                        li
                    );

                }
            );


            fullNoteKeyPointsSection.classList.remove(
                "hidden"
            );

        } else {

            fullNoteKeyPointsSection.classList.add(
                "hidden"
            );

        }

    }


    closeNoteMenu();


    noteViewModal.classList.remove(
        "hidden"
    );

}


// ============================================
// CLOSE FULL NOTE
// ============================================

function closeFullNote() {

    if (noteViewModal) {

        noteViewModal.classList.add(
            "hidden"
        );

    }


    closeNoteMenu();


    currentViewNote =
        null;

}


if (closeNoteView) {

    closeNoteView.addEventListener(
        "click",
        closeFullNote
    );

}


// ============================================
// THREE DOT MENU
// ============================================

if (noteMenuBtn) {

    noteMenuBtn.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            noteMenu.classList.toggle(
                "hidden"
            );

        }
    );

}


function closeNoteMenu() {

    if (noteMenu) {

        noteMenu.classList.add(
            "hidden"
        );

    }

}


document.addEventListener(
    "click",
    event => {

        if (
            noteMenu &&
            noteMenuBtn &&
            !noteMenu.contains(event.target) &&
            !noteMenuBtn.contains(event.target)
        ) {

            closeNoteMenu();

        }

    }
);


// ============================================
// FULL NOTE EDIT
// ============================================

if (fullNoteEdit) {

    fullNoteEdit.addEventListener(
        "click",
        () => {

            closeNoteMenu();


            if (!currentViewNote) {

                return;

            }


            openEdit(
                currentViewNote._id
            );

        }
    );

}


// ============================================
// OPEN EDIT
// ============================================

async function openEdit(id) {

    if (!token) {

        showToast(
            "Please login first.",
            "error",
            "Login Required"
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

            showToast(
                "The selected note could not be found.",
                "error",
                "Note Not Found"
            );

            return;

        }


        currentEditId =
            id;


        if (editTitle) {

            editTitle.value =
                note.title ||
                "Voice Note";

        }


        if (editText) {

            editText.value =
                note.content ||
                "";

        }


        if (editModal) {

            editModal.classList.remove(
                "hidden"
            );

        }


        if (noteViewModal) {

            noteViewModal.classList.add(
                "hidden"
            );

        }


        setTimeout(
            () => {

                if (editTitle) {

                    editTitle.focus();

                }

            },
            100
        );

    } catch (error) {

        console.error(
            "Open edit error:",
            error
        );


        showToast(
            error.message ||
            "Unable to open note.",
            "error",
            "Edit Failed"
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


            const title =
                editTitle
                    ? editTitle.value.trim()
                    : "";


            if (!title) {

                showToast(
                    "Note title cannot be empty.",
                    "error",
                    "Title Required"
                );

                editTitle.focus();

                return;

            }


            if (!content) {

                showToast(
                    "Note content cannot be empty.",
                    "error",
                    "Content Required"
                );

                editText.focus();

                return;

            }


            if (!currentEditId) {

                showToast(
                    "No note selected.",
                    "error",
                    "Edit Error"
                );

                return;

            }


            try {

                saveEdit.disabled =
                    true;

                saveEdit.textContent =
                    "⏳ Saving...";


                /*
                 * We send both title and content.
                 *
                 * If your backend already accepts
                 * title updates, both will be updated.
                 *
                 * If your backend only accepts content,
                 * content will still work.
                 */

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

                            body:
                                JSON.stringify({

                                    title,

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


                if (editModal) {

                    editModal.classList.add(
                        "hidden"
                    );

                }


                currentEditId =
                    null;


                await displayNotes(
                    searchInput
                        ? searchInput.value.trim()
                        : ""
                );


                showToast(
                    "Your note has been updated successfully.",
                    "success",
                    "Note Updated"
                );

            } catch (error) {

                console.error(
                    "Edit error:",
                    error
                );


                showToast(
                    error.message ||
                    "Update failed.",
                    "error",
                    "Update Failed"
                );

            } finally {

                saveEdit.disabled =
                    false;

                saveEdit.textContent =
                    "✓ Save Changes";

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
// FULL NOTE DELETE
// ============================================

if (fullNoteDelete) {

    fullNoteDelete.addEventListener(
        "click",
        () => {

            closeNoteMenu();


            if (!currentViewNote) {

                return;

            }


            pendingDeleteId =
                currentViewNote._id;


            if (noteViewModal) {

                noteViewModal.classList.add(
                    "hidden"
                );

            }


            if (deleteModal) {

                deleteModal.classList.remove(
                    "hidden"
                );

            }

        }
    );

}


// ============================================
// CONFIRM DELETE
// ============================================

if (confirmDelete) {

    confirmDelete.addEventListener(
        "click",
        async () => {

            if (!pendingDeleteId) {

                return;

            }


            try {

                confirmDelete.disabled =
                    true;

                confirmDelete.textContent =
                    "⏳ Deleting...";


                const id =
                    pendingDeleteId;


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


                if (deleteModal) {

                    deleteModal.classList.add(
                        "hidden"
                    );

                }


                pendingDeleteId =
                    null;

                currentViewNote =
                    null;


                await displayNotes(
                    searchInput
                        ? searchInput.value.trim()
                        : ""
                );


                showToast(
                    "The note has been permanently deleted.",
                    "success",
                    "Note Deleted"
                );

            } catch (error) {

                console.error(
                    "Delete error:",
                    error
                );


                showToast(
                    error.message ||
                    "Delete failed.",
                    "error",
                    "Delete Failed"
                );

            } finally {

                confirmDelete.disabled =
                    false;

                confirmDelete.textContent =
                    "🗑️ Delete";

            }

        }
    );

}


// ============================================
// CANCEL DELETE
// ============================================

if (cancelDelete) {

    cancelDelete.addEventListener(
        "click",
        () => {

            deleteModal.classList.add(
                "hidden"
            );

            pendingDeleteId =
                null;

        }
    );

}


// ============================================
// BACKDROP CLICK TO CLOSE MODALS
// ============================================

[
    titleModal,
    noteViewModal,
    editModal,
    deleteModal
].forEach(
    modal => {

        if (!modal) {
            return;
        }


        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target !==
                    modal
                ) {

                    return;

                }


                if (
                    modal ===
                    titleModal
                ) {

                    closeTitleModal();

                }


                if (
                    modal ===
                    noteViewModal
                ) {

                    closeFullNote();

                }


                if (
                    modal ===
                    editModal
                ) {

                    editModal.classList.add(
                        "hidden"
                    );

                    currentEditId =
                        null;

                }


                if (
                    modal ===
                    deleteModal
                ) {

                    deleteModal.classList.add(
                        "hidden"
                    );

                    pendingDeleteId =
                        null;

                }

            }
        );

    }
);


// ============================================
// ESCAPE KEY
// ============================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        if (
            titleModal &&
            !titleModal.classList.contains(
                "hidden"
            )
        ) {

            closeTitleModal();

            return;

        }


        if (
            deleteModal &&
            !deleteModal.classList.contains(
                "hidden"
            )
        ) {

            deleteModal.classList.add(
                "hidden"
            );

            pendingDeleteId =
                null;

            return;

        }


        if (
            editModal &&
            !editModal.classList.contains(
                "hidden"
            )
        ) {

            editModal.classList.add(
                "hidden"
            );

            currentEditId =
                null;

            return;

        }


        if (
            noteViewModal &&
            !noteViewModal.classList.contains(
                "hidden"
            )
        ) {

            closeFullNote();

        }

    }
);


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
    localStorage.getItem(
        "theme"
    ) === "dark"
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
