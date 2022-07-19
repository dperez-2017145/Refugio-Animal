'use strict'
/**
 * Verificar que el token no haya expirado
 */

const jwt = require('jwt-simple');
const secretKey = 'CualquierDato';

exports.ensureAuth = (req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(401).send({message: 'The request does not contain the authentication header'})
    }else{
        try{
            let token = req.headers.authorization.replace(/['"]+/g, ''); //remplazar comillas por espacios
            var payload = jwt.decode(token, secretKey); //verificación de tiempo fuera automática
        }catch(err){
            console.log(err);
            return res.status(401).send({message: 'Token is not valid or expired'});
        }
        req.user = payload; //setear a la solicitud un nuevo parámetro
        next();
    }
}

exports.isAdmin = (req, res, next)=>{
    try{
        const role = req.user.role;
        if(role === 'ADMIN') return next();
        else return res.status(401).send({message: 'Unautorized to this function'});
    }catch(err){
        console.log(err);
        return err
    }
}