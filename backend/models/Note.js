const mongoose = require("mongoose");


const noteSchema = new mongoose.Schema(

    {

        userId: {

            type:
                mongoose.Schema.Types.ObjectId,

            ref:
                "User",

            required:
                true

        },


        title: {

            type:
                String,

            default:
                "Voice Note",

            trim:
                true

        },


        content: {

            type:
                String,

            required:
                true

        },


        category: {

            type:
                String,

            enum: [

                "College",
                "Office",
                "Personal",
                "Other"

            ],

            default:
                "Personal"

        },


        language: {

            type:
                String,

            default:
                "English"

        },


        summary: {

            type:
                String,

            default:
                ""

        },


        keyPoints: {

            type:
                [String],

            default:
                []

        }

    },

    {

        timestamps:
            true

    }

);


module.exports =
    mongoose.model(
        "Note",
        noteSchema
    );

