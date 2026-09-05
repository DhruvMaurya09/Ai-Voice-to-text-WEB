const express = require("express");

const router = express.Router();


// =====================================================
// GEMINI CLIENT
// =====================================================

// We use dynamic import because the backend project
// is using CommonJS (require/module.exports).

let geminiClient = null;


async function getGeminiClient() {

    if (geminiClient) {
        return geminiClient;
    }

    if (!process.env.GEMINI_API_KEY) {

        throw new Error(
            "GEMINI_API_KEY is missing in the .env file."
        );

    }

    const { GoogleGenAI } =
        await import("@google/genai");


    geminiClient =
        new GoogleGenAI({

            apiKey:
                process.env.GEMINI_API_KEY

        });


    return geminiClient;

}


// =====================================================
// AI FUNCTION
// =====================================================

async function generateAI(prompt) {

    try {

        const ai =
            await getGeminiClient();


        const model =
            process.env.GEMINI_MODEL ||
            "gemini-3.7-flash";


        console.log(
            "Gemini AI request using model:",
            model
        );


        const response =
            await ai.models.generateContent({

                model: model,

                contents: prompt

            });


        const result =
            response.text;


        if (
            !result ||
            !result.trim()
        ) {

            throw new Error(
                "Gemini returned an empty response."
            );

        }


        return result.trim();


    } catch (error) {

        console.error(
            "GEMINI API ERROR:"
        );

        console.error(
            error
        );


        throw error;

    }

}


// =====================================================
// GEMINI ERROR HANDLER
// =====================================================

function handleAIError(
    error,
    res,
    defaultMessage
) {

    console.error(
        defaultMessage,
        error
    );


    const status =
        error?.status ||
        error?.statusCode ||
        error?.code;


    // -------------------------------------------------
    // INVALID API KEY
    // -------------------------------------------------

    if (
        status === 401 ||
        status === "401"
    ) {

        return res.status(401).json({

            message:
                "Invalid Gemini API key. Please check GEMINI_API_KEY in your .env file."

        });

    }


    // -------------------------------------------------
    // PERMISSION ERROR
    // -------------------------------------------------

    if (
        status === 403 ||
        status === "403"
    ) {

        return res.status(403).json({

            message:
                "Gemini API permission denied. Please check your Gemini API key and project."

        });

    }


    // -------------------------------------------------
    // QUOTA / RATE LIMIT
    // -------------------------------------------------

    if (
        status === 429 ||
        status === "429"
    ) {

        return res.status(429).json({

            message:
                "Gemini API quota or rate limit reached. Please wait and try again, or check your Gemini API limits."

        });

    }


    // -------------------------------------------------
    // MODEL NOT FOUND
    // -------------------------------------------------

    if (
        status === 404 ||
        status === "404"
    ) {

        return res.status(404).json({

            message:
                "Gemini model was not found. Check GEMINI_MODEL in your .env file."

        });

    }


    // -------------------------------------------------
    // GENERAL ERROR
    // -------------------------------------------------

    return res.status(500).json({

        message:
            defaultMessage

    });

}


// =====================================================
// SUMMARY
// =====================================================

router.post(
    "/summarize",
    async (req, res) => {

        try {

            const {
                text
            } = req.body;


            if (
                !text ||
                !text.trim()
            ) {

                return res.status(400).json({

                    message:
                        "Text is required."

                });

            }


            const result =
                await generateAI(`

You are an AI note assistant.

Summarize the following note in simple and clear language.

Rules:

1. Keep the important information.
2. Do not add information.
3. Do not change the meaning.
4. Do not mention that you are an AI.
5. Return only the summary.
6. Keep the summary concise but useful.

NOTE:

${text}

`);


            res.json({

                result:
                    result.trim()

            });


        } catch (error) {

            return handleAIError(
                error,
                res,
                "AI summary failed."
            );

        }

    }
);


// =====================================================
// KEY POINTS
// =====================================================

router.post(
    "/key-points",
    async (req, res) => {

        try {

            const {
                text
            } = req.body;


            if (
                !text ||
                !text.trim()
            ) {

                return res.status(400).json({

                    message:
                        "Text is required."

                });

            }


            const result =
                await generateAI(`

Extract the most important key points from the following note.

Rules:

1. Return 5 to 10 concise points.
2. Each point must be on a separate line.
3. Do not add information.
4. Do not explain anything else.
5. Do not use numbering.
6. Use only bullet points starting with "-".

NOTE:

${text}

`);


            const keyPoints =
                result
                    .split("\n")
                    .map(
                        line =>
                            line
                                .replace(
                                    /^[-*•]\s*/,
                                    ""
                                )
                                .replace(
                                    /^\d+[\.\)]\s*/,
                                    ""
                                )
                                .trim()
                    )
                    .filter(Boolean);


            res.json({

                result:
                    keyPoints

            });


        } catch (error) {

            return handleAIError(
                error,
                res,
                "Key point generation failed."
            );

        }

    }
);


// =====================================================
// IMPROVE NOTE
// =====================================================

router.post(
    "/improve",
    async (req, res) => {

        try {

            const {
                text
            } = req.body;


            if (
                !text ||
                !text.trim()
            ) {

                return res.status(400).json({

                    message:
                        "Text is required."

                });

            }


            const result =
                await generateAI(`

Improve the following note.

Rules:

1. Fix grammar.
2. Fix spelling.
3. Improve clarity.
4. Improve sentence structure.
5. Keep the original meaning.
6. Do not add new facts.
7. Do not remove important information.
8. Return only the improved note.
9. Do not explain the changes.

NOTE:

${text}

`);


            res.json({

                result:
                    result.trim()

            });


        } catch (error) {

            return handleAIError(
                error,
                res,
                "Note improvement failed."
            );

        }

    }
);


// =====================================================
// TRANSLATE
// =====================================================

router.post(
    "/translate",
    async (req, res) => {

        try {

            const {
                text,
                language
            } = req.body;


            if (
                !text ||
                !text.trim() ||
                !language
            ) {

                return res.status(400).json({

                    message:
                        "Text and language are required."

                });

            }


            const result =
                await generateAI(`

You are a professional translator.

Translate the following text into ${language}.

Rules:

1. Translate naturally.
2. Preserve the original meaning.
3. Do not summarize.
4. Do not add new information.
5. Do not remove information.
6. Keep the same overall tone.
7. Do not explain the translation.
8. Return ONLY the translated text.

TEXT:

${text}

`);


            res.json({

                result:
                    result.trim()

            });


        } catch (error) {

            return handleAIError(
                error,
                res,
                "Translation failed."
            );

        }

    }
);


// =====================================================
// TEST AI ROUTE
// =====================================================

router.get(
    "/test",
    async (req, res) => {

        try {

            const result =
                await generateAI(
                    "Reply with exactly: Gemini AI is working."
                );


            res.json({

                success: true,

                result:
                    result

            });


        } catch (error) {

            return handleAIError(
                error,
                res,
                "Gemini AI test failed."
            );

        }

    }
);


// =====================================================
// EXPORT
// =====================================================

module.exports =
    router;

