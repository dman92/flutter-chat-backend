const{ response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {

    const{ email, password } = req.body;

    try{

        const existeEmail = await Usuario.findOne({email});
        if( existeEmail ){
            return res.status(400).json({ // Bad request
                ok: false,
                msg: 'El correo ya está registrado',
                test: existeEmail
            });
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        // Un salt es para generar numeros de manera alatoria
        // Para utilizar encryptacion hash
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt);


        await usuario.save();

        //Generar mi JW
        const token = await generarJWT( usuario.id );
    
        res.json({
            ok: true,
            usuario,
            token
        });

    } catch(error) {
        console.log(error);
        res.status(500).json({ //Error del servidor
            ok: false,
            msg: "Hable con el administrador",
        });
    }
}; 


const loginUsuario = async (req, res = response) =>{

    const{ email, password } = req.body;
    console.log('Login usuario')

    try{
        const usuarioDB = await Usuario.findOne({email});
        if( usuarioDB ){
            
            if( bcrypt.compareSync(password, usuarioDB.password) ){
                //Usuario Correcto
                //Generar JWT
                const token = await generarJWT( usuarioDB.id );
                
                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                });

            } else{
                // Contraseña incorrecta
                res.json({
                    ok: false,
                    msg: 'Contraseña incorrecta',
                });
            }
        } else {
            // No se ha encontrado ningun usuario con ese email
            return res.status(400).json({ // Bad request
                ok: false,
                msg: 'El usuario no existe'
            });
        };

    } catch(error){
        console.log(error);
        res.status(500).json({ //Error del servidor
            ok: false,
            msg: "Hable con el administrador",
        });
    }
}

const renewToken = async (req, res = response) => {

    const uid = req.uid;

    const token = await generarJWT( uid );

    //obetener usuario por uid usuario.findbyid
    const usuario = await Usuario.findById(uid);


    res.json({ //Error del servidor
        ok: true,
        usuario,
        token,
    });

};


module.exports = {
    crearUsuario,
    loginUsuario,
    renewToken,
}