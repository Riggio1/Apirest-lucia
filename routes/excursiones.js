import express  from "express";
import Excursion from "../models/Excursiones.js";
import verificarToken from "../middlewares/auth.js";

const ruta = express.Router();


ruta.get("/",verificarToken,  (req, res) => {
    let resultado = listarExcursiones();
    resultado.then(Excursion => {
        res.json({
            Excursion
        })
    }).catch(err => {
        res.status(400).json({err})
    })
})

ruta.post('/', verificarToken, (req, res) => {
    console.log(req)
    let resultado = crearExcursion(req);

    resultado.then(excursion => {
        res.json({
           excursion
        })
    }).catch(err => {
        res.status(400).json({
            err: err.message
        })
    })
});

ruta.put("/:titulo", (req, res)=> {
    let resultado = actualizarExcursion(req.body, req.params.titulo);
    resultado.then(excursion => {
        res.json({
            excursion
        })
    }).catch(err => {
            res.status(400).json({err})
        })
})

// -----PAGINACION----- http://localhost:3000/excursiones/resultados?pagina=2&limite=2 url para mandar por postman

ruta.get('/resultados', (req, res) => {
    let resultado = resultadosPaginado(req.query.pagina , req.query.limite);
    resultado.then(Excursion => {
        res.json(Excursion)
    }).catch(err => {
        res.status(400).json({err})
    })
});



// --------ORDENAMIENTO-----
ruta.get("/precio",  (req, res) => {
    let resultado = ordenarPrecio();
    resultado.then(Excursion => {
        res.json({
            Excursion
        })
    }).catch(err => {
        res.status(400).json({err})
    })
})


ruta.get("/:id",  (req, res) => {
    let resultado = excursionId(req.params.id);
    resultado.then(Excursion => {
        res.json({
            Excursion
        })
    }).catch(err => {
        res.status(400).json({err})
    })
})

ruta.delete("/:id",  (req, res) => {
    let resultado = borrarExcursion(req.params.id);
    resultado.then(Excursion => {
        res.json({
            Excursion
        })
    }).catch(err => {
        res.status(400).json({err})
    })
})


// -----FILTRADO---
ruta.get("/ubicacion/:ubicacion",  (req, res) => {
    let resultado = filtradoUbicacion(req.params.ubicacion);
    resultado.then(Excursion => {
        res.json({
            Excursion
        })
    }).catch(err => {
        res.status(400).json({err})
    })
})




// ----FUNCIONES----

async function actualizarExcursion(body,titulo){
    let excursion = await Excursion.updateOne({"titulo": titulo}, {
        $set:{
            titulo: body.titulo,
            descripcion: body.descripcion,
            precio: body.precio
 
        }
    })
    return excursion;
}

async function crearExcursion(req){
    let excursion = new Excursion({
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        precio: req.body.precio,
        ubicacion: req.body.ubicacion
    })
    return await excursion.save();
}

async function listarExcursiones(){
    let excursiones = await Excursion.find({estado: true});
    return excursiones;

}   

async function excursionId(id){
    let excursiones = await Excursion.find({_id: id});
    return excursiones;

} 

async function borrarExcursion(id){
    let excursiones = await Excursion.deleteOne({_id: id});
    return excursiones;
} 


// -----FUNCION DE FILTRADO-----
async function filtradoUbicacion(ubicacion){
    let excursiones = await Excursion.find({ubicacion: ubicacion});
    return excursiones;

} 

// --------ORDENAMIENTO----- Esta funcion esta ordenando de menor a mayor el precio

async function ordenarPrecio(){
    let excursiones = await Excursion.find().sort({precio:1});
    return excursiones;

} 

// ----------PAGINADO-----------

async function resultadosPaginado(pagina, limite) {
    const skip = (pagina - 1) * limite;
    let excursiones = await Excursion.find().limit(limite).skip(skip);
    return excursiones;
}


export default ruta;