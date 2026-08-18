const express = require("express");
const jwt = require("jsonwebtoken");

const Note = require("../models/Note");

const router = express.Router();


// =====================================================
// AUTHENTICATION MIDDLEWARE
// =====================================================

function authenticate(req, res, next) {

    try {

        const authHeader =
            req.headers.authorization;


        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {

            return res.status(401).json({

                message:
                    "Authentication required."

            });

        }


        const token =
            authHeader.split(" ")[1];


        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        req.userId =
            decoded.userId;


        next();


    } catch (error) {

        return res.status(401).json({

            message:
                "Invalid or expired token."

        });

    }

}


// =====================================================
// GET ALL NOTES
// =====================================================

router.get(
    "/",
    authenticate,
    async (req, res) => {

        try {

            const search =
                req.query.search || "";


            const filter = {

                userId:
                    req.userId

            };


            if (search.trim()) {

                filter.$or = [

                    {
                        content: {
                            $regex: search,
                            $options: "i"
                        }
                    },

                    {
                        title: {
                            $regex: search,
                            $options: "i"
                        }
                    },

                    {
                        category: {
                            $regex: search,
                            $options: "i"
                        }
                    },

                    {
                        language: {
                            $regex: search,
                            $options: "i"
                        }
                    }

                ];

            }


            const notes =
                await Note.find(filter)
                    .sort({
                        createdAt: -1
                    });


            res.json(notes);


        } catch (error) {

            console.error(
                "Get notes error:",
                error
            );


            res.status(500).json({

                message:
                    "Unable to fetch notes."

            });

        }

    }
);


// =====================================================
// CREATE NOTE
// =====================================================

router.post(
    "/",
    authenticate,
    async (req, res) => {

        try {

            const {

                title,
                content,
                category,
                language,
                summary,
                keyPoints

            } = req.body;


            if (
                !content ||
                !content.trim()
            ) {

                return res.status(400).json({

                    message:
                        "Note content is required."

                });

            }


            const note =
                await Note.create({

                    userId:
                        req.userId,

                    title:
                        title ||
                        "Voice Note",

                    content:
                        content.trim(),

                    category:
                        category ||
                        "Personal",

                    language:
                        language ||
                        "English",

                    summary:
                        summary ||
                        "",

                    keyPoints:
                        Array.isArray(keyPoints)
                            ? keyPoints
                            : []

                });


            res.status(201).json(
                note
            );


        } catch (error) {

            console.error(
                "Create note error:",
                error
            );


            res.status(500).json({

                message:
                    "Unable to create note."

            });

        }

    }
);


// =====================================================
// UPDATE NOTE
// =====================================================

router.put(
    "/:id",
    authenticate,
    async (req, res) => {

        try {

            const {

                title,
                content,
                category,
                language,
                summary,
                keyPoints

            } = req.body;


            const note =
                await Note.findOne({

                    _id:
                        req.params.id,

                    userId:
                        req.userId

                });


            if (!note) {

                return res.status(404).json({

                    message:
                        "Note not found."

                });

            }


            if (
                title !== undefined
            ) {

                note.title =
                    title;

            }


            if (
                content !== undefined
            ) {

                if (
                    !content.trim()
                ) {

                    return res.status(400).json({

                        message:
                            "Note content cannot be empty."

                    });

                }


                note.content =
                    content.trim();

            }


            if (
                category !== undefined
            ) {

                note.category =
                    category;

            }


            if (
                language !== undefined
            ) {

                note.language =
                    language;

            }


            if (
                summary !== undefined
            ) {

                note.summary =
                    summary;

            }


            if (
                keyPoints !== undefined
            ) {

                note.keyPoints =
                    Array.isArray(keyPoints)
                        ? keyPoints
                        : [];

            }


            await note.save();


            res.json(
                note
            );


        } catch (error) {

            console.error(
                "Update note error:",
                error
            );


            res.status(500).json({

                message:
                    "Unable to update note."

            });

        }

    }
);


// =====================================================
// DELETE NOTE
// =====================================================

router.delete(
    "/:id",
    authenticate,
    async (req, res) => {

        try {

            const note =
                await Note.findOneAndDelete({

                    _id:
                        req.params.id,

                    userId:
                        req.userId

                });


            if (!note) {

                return res.status(404).json({

                    message:
                        "Note not found."

                });

            }


            res.json({

                message:
                    "Note deleted successfully."

            });


        } catch (error) {

            console.error(
                "Delete note error:",
                error
            );


            res.status(500).json({

                message:
                    "Unable to delete note."

            });

        }

    }
);


module.exports = router;
