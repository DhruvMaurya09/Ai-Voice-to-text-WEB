const express = require("express");
const OpenAI = require("openai");

const router = express.Router();


const client =
    new OpenAI({

        apiKey:
            process.env.OPENAI_API_KEY

    });


// =====================================================
// AI FUNCTION
// =====================================================

async function generateAI(prompt) {

    try {

        const response =
            await client.responses.create({

                model:
                    process.env.OPENAI_MODEL ||
                    "gpt-5",

                input:
                    prompt

            });


        return response.output_text;


    } catch (error) {

        console.error(
            "OPENAI API ERROR:",
            error
        );


        throw error;

    }

}


// =====================================================
// HELPER - AI ERROR
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


    if (
        error.status === 401
    ) {

        return res.status(401).json({

            message:
                "Invalid OpenAI API key."

        });

    }


    if (
        error.status === 429
    ) {

        return res.status(429).json({

            message:
                "OpenAI API has no available credits/quota. Please use an API key with available credits."

        });

    }


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
4. Keep the original meaning.
5. Do not add new facts.
6. Return only the improved note.
7. Do not explain the changes.

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
5. Do not explain the translation.
6. Return ONLY the translated text.

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


module.exports =
    router;
