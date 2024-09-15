import mongoose from "mongoose";

const infectionSchema = new mongoose.Schema({
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    isSent: {
        type: Boolean,
        default: false
    },
    genre: {
        type: String,
        enum: ["Masculino", "Femenino"],
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
});

export const InfectionModel = mongoose.model("Infection", infectionSchema);
