'use strict'

const {validateData, checkUpdate} = require('../utils/validate');
const Animal = require('../models/animal.model');

exports.testAnimal = (req, res)=>{
    return res.send({message: 'Function testAnimal is running'});
}

exports.saveAnimal = async (req, res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name,
            age: params.age,
            type: params.type,
            user: req.user.sub
        };
        const msg = validateData(data);
        if(!msg){
        data.description = params.description;
        const animal = new Animal(data);
        await animal.save();
        return res.send({message: 'Animal saved', animal});
        }else return res.status(400).send(msg);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.getAnimals = async(req, res)=>{
    try{
        const animals = await Animal.find();
        return res.send({animals});
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.getAnimal = async(req, res)=>{
    try{
        const animalId = req.params.id;
        const animal = await Animal.findOne({_id: animalId});
        if(!animal) return res.send({message: 'Animal not found'});
        return res.send({animal});
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.searchAnimal = async(req, res)=>{
    try{
        const params = req.body;
        const data = {
            name: params.name
        };
        const msg = validateData(data);
        if(!msg){
            const animal = await Animal.find({name: {$regex:params.name, $options: 'i'}});
            return res.send({animal});
        }else return res.status(400).send(msg);
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.updateAnimal = async(req, res)=>{
    try{
        const params = req.body;
        const animalId = req.params.id;
        const check = await checkUpdate(params);
        if(check === false) return res.status(400).send({message: 'Data not received'});
        const updateAnimal = await Animal.findOneAndUpdate({_id: animalId}, params, {new: true})
        .populate('user');
        updateAnimal.user.password = undefined;
        updateAnimal.user.role = undefined;
        return res.send({message: 'Updated animal', updateAnimal});
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.deleteAnimal = async(req, res)=>{
    try{
       const animalId = req.params.id;
       const animalDeleted = await Animal.findOneAndDelete({_id: animalId});
       if(!animalDeleted) return res.send({message: 'Animal not found or already deleted'});
       return res.send({animalDeleted, message: 'Animal deleted'}); 
    }catch(err){
        console.log(err);
        return err;
    }
}