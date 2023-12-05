import express  from "express";
import Usuario from "../models/Usuarios.js";
import bcrypt from "bcrypt"
import verificarToken from "../middlewares/auth.js";
import Joi from "joi";

const ruta = express.Router();

const schema = Joi.object({
    nombre: Joi.string()
            .alphanum()
            .min(3)
            .max(20)
            .required(),
        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,10}$')),
        email: Joi.string()
            .email({minDomainSegments: 2, tlds: {allow: ['com', 'net']}}),
        edad: Joi.number()

})

ruta.get("/", verificarToken, (req, res) => {
    let resultado = listarUsuarios();
    resultado.then(users => {
        res.json({
            users
        })
    }).catch(err => {
        res.status(400).json({err})
    })
})

ruta.post("/", (req, res) => {
    let body = req.body;

    const {error, value} = schema.validate({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        edad: body.edad
    })

    if(!error){
            let resultado = crearUsuario(body);
        resultado.then(user => {
            res.json({
                valor: user
            })
        }).catch(err => {
            res.status(400).json({err})
        })
    }else{
        res.status(400).json({
            error
        })
    }

   

})

ruta.get("/:nombre",  (req, res) => {
    let resultado = nombreUsuario(req.params.nombre);
    resultado.then(usuario => {
        res.json({
            usuario
        })
    }).catch(err => {
        res.status(400).json({err})
    })
})

// -----FILTRADO---

ruta.get("/edad/:edad",  (req, res) => {
    let resultado = filtradoEdad(req.params.edad);
    resultado.then(usuario => {
        res.json({
            usuario
        })
    }).catch(err => {
        res.status(400).json({err})
    })
})



// -------FUNCIONES----

async function crearUsuario(body){
    let usuario = new Usuario({
        email: body.email,
        nombre: body.nombre,
        password: bcrypt.hashSync(body.password, 10),
        edad: body.edad
    })
    return await usuario.save();
}

async function listarUsuarios(){
    let usuarios = await Usuario.find({estado: true});
    return usuarios;
}


async function nombreUsuario(nombre){
    let usuarios = await Usuario.find({nombre:nombre});
    return usuarios;

} 

// -----FUNCION DE FILTRADO EDAD----- filtra segun la edad que mandas por parametro
async function filtradoEdad(edad){
    let usuarios = await Usuario.find({edad: edad});
    return usuarios;

} 

export default ruta;