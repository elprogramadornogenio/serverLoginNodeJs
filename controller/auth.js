const { response, json } = require('express');
const { validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');
const bycript = require('bcryptjs');
const {generarJWT} = require('../helpers/jwt');

const crearUsuario = async (req, res = response)=>{

    const {email, name, password} = req.body;

    try {

        // Verificar el email
        const usuario = await Usuario.findOne({email});

        if(usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese email'
            });
        }

        //Crear usuario con el modelo
        const dbUser = new Usuario(req.body);

        // Crear un hash para la contraseña
        const salt = bycript.genSaltSync();
        dbUser.password = bycript.hashSync( password, salt );



        // Generar un JWT
        const token = await generarJWT(dbUser.id, name)

        // Crear usuario de DB
        await dbUser.save();
        
        //Generar respuesta exitosa
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name: name,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: true,
            msg: 'Hable con el administrador'
        });
    }


    

}


const loginUsuario = async(req, res = response)=>{

    const {email, password} = req.body;

    try {

        const dbUser = await Usuario.findOne({email});
        if(!dbUser) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            });
        }

        //Confirmar si el password es valido
        const validPassword = bycript.compareSync(password, dbUser.password)
        if(!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'El password no es valido'
            });
        }

        // Generar el JWT
        const token = await generarJWT(dbUser.id, dbUser.name);

        // Respuesta
        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const revalidarToken = async(req, res)=>{

    const {uid, name} = req;

    const token = await generarJWT(uid, name);

    return res.json({
        ok: true,
        uid,
        name,
        token
    });

}


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken

}