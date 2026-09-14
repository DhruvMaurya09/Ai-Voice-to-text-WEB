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
// AUTOMATIC NOTE CATEGORIZATION
// =====================================================

function categorizeNote(title = "", content = "") {

    const text =
        `${title} ${content}`.toLowerCase();


    // ================================
    // COLLEGE
    // ================================

    const collegeKeywords = [

        "college",
        "university",
        "class",
        "lecture",
        "assignment",
        "exam",
        "semester",
        "professor",
        "teacher",
        "student",
        "lab",
        "practical",
        "subject",
        "dsa",
        "data structure",
        "algorithm",
        "computer science",
        "attendance",
        "internal",
        "mid sem",
        "end sem"

    ];


    // ================================
    // WORK
    // ================================

    const workKeywords = [

        "office",
        "work",
        "meeting",
        "client",
        "project",
        "deadline",
        "employee",
        "manager",
        "boss",
        "company",
        "business",
        "task for work",
        "team",
        "presentation",
        "report",
        "professional",
        "internship"

    ];


    // ================================
    // SHOPPING
    // ================================

    const shoppingKeywords = [

        "buy",
        "purchase",
        "shopping",
        "shop",
        "order",
        "amazon",
        "flipkart",
        "cart",
        "price",
        "product",
        "grocery",
        "groceries",
        "clothes",
        "shoes",
        "laptop",
        "phone",
        "headphones",
        "charger"

    ];


    // ================================
    // TASKS
    // ================================

    const taskKeywords = [

        "todo",
        "to do",
        "task",
        "tasks",
        "reminder",
        "remember",
        "complete",
        "finish",
        "submit",
        "call",
        "email",
        "tomorrow",
        "today",
        "schedule",
        "deadline",
        "need to",
        "have to",
        "should do"

    ];


    // ================================
    // IDEAS
    // ================================

    const ideaKeywords = [

        "idea",
        "ideas",
        "concept",
        "innovation",
        "innovative",
        "startup",
        "feature",
        "build",
        "create",
        "invention",
        "app idea",
        "project idea",
        "business idea",
        "new idea",
        "thought",
        "brainstorm"

    ];


    // ================================
    // SCORE CALCULATION
    // ================================

    const scores = {

        College: 0,
        Work: 0,
        Ideas: 0,
        Shopping: 0,
        Personal: 0,
        Tasks: 0

    };


    collegeKeywords.forEach(keyword => {

        if (text.includes(keyword)) {
            scores.College++;
        }

    });


    workKeywords.forEach(keyword => {

        if (text.includes(keyword)) {
            scores.Work++;
        }

    });


    shoppingKeywords.forEach(keyword => {

        if (text.includes(keyword)) {
            scores.Shopping++;
        }

    });


    taskKeywords.forEach(keyword => {

        if (text.includes(keyword)) {
            scores.Tasks++;
        }

    });


    ideaKeywords.forEach(keyword => {

        if (text.includes(keyword)) {
            scores.Ideas++;
        }

    });


    // ================================
    // FIND HIGHEST SCORE
    // ================================

    let bestCategory = "Personal";
    let highestScore = 0;


    Object.keys(scores).forEach(category => {

        if (
            scores[category] > highestScore
        ) {

            highestScore =
                scores[category];

            bestCategory =
                category;

        }

    });


    return bestCategory;

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


            
            const detectedCategory =
    categorizeNote(
        title || "",
        content
    );


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
            detectedCategory,

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
