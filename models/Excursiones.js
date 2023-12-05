import mongoose from "mongoose";
const Schema = mongoose.Schema;


const excursionSchema = new mongoose.Schema({
    titulo: {
        type:String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },    
    estado: {
        type: Boolean,
        default: true
    },
    imagen: {
        type: String,
        required: false        
    },
    precio: {
        type: Number,
        required: true
    },
    ubicacion: {
        type: String,
        required: true
    },
 
});

export default mongoose.model('Excursion', excursionSchema);