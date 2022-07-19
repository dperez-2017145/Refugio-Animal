'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const secretKey = 'CualquierDato';

exports.createToken = async(user)=>{
    try{
        const payload = {
            sub: user._id,
            name: user.name,
            surname: user.surname,
            username: user.username,
            email: user.email,
            role: user.role,
            iat: moment().unix(),
            exp: moment().add(2, 'hours').unix()
        }
        return jwt.encode(payload, secretKey);
    }catch(err){
        console.log(err);
        return err;
    }
}