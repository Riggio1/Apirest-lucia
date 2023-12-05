import mongoose from "mongoose";

const usuariosSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    },
    edad:{
        type: Number,
        required:false
    }
})

export default mongoose.model("Usuarios", usuariosSchema);