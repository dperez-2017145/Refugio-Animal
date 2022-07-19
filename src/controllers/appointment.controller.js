'use strict'

const {validateData, deleteSensitiveData, checkPermission, dataNoRequired} = require('../utils/validate');
const Animal = require('../models/animal.model');
const Appointment = require('../models/appointment.model');

exports.testAppointment = (req, res)=>{
    return res.send({message: 'Function testAppointment is running'});
}

exports.createAppointment = async(req, res)=>{
    try {
        const params = req.body;
        const data = {
            date: params.date,
            animal: params.animal,
            user: req.user.sub,
            status: 'created'
        }
        const msg = validateData(data);
        if(!msg){
            const animal = await Animal.findOne({_id: params.animal})
            if(!animal) return res.send({message: 'Animal not found'});
            const alreadyAppo = await Appointment.findOne({
                $and: [
                    {animal: data.animal}, 
                    {user: data.user}
                ]});
            if(alreadyAppo) return res.send({message: 'Appointment already created with this animal'});
            const dateAlready = await Appointment.findOne({
                $and: [
                    {date:  data.date}, 
                    {user: data.user}
                ]}); 
            if (dateAlready) return res.send({message: 'Appointment already created on this date'});
            const appointment = new Appointment(data);
            await appointment.save();
            return res.send({message: 'Appointment created successfully'})
        }else return res.status(400).send(msg);
    }catch (err) {
        console.log(err);
        return err;
    }
}

exports.getAppointments = async (req, res)=>{
    try {
        const userId = req.user.sub;
        const appointments = await Appointment.find({user: userId}).populate('user')
        .populate('animal')
        .populate('user')
        .lean()
        if(!appointments) return res.send({message: 'Appointments not found'});
        const clearAppointments = [];
        for(let appo of appointments){
            clearAppointments.push(await deleteSensitiveData(appo)) //push: agregar un nuevo dato al arreglo.
        }
        return res.send({clearAppointments});
    } catch (err) {
        console.log(err);
        return err;
    }
}

exports.updateAppointment = async (req, res)=>{
    try{
        const params = req.body;
        const appoId = req.params.id;
        const data = {
            date: params.date,
            animal: params.animal,
            user: req.user.sub
        }
        const msg = validateData(data)
        if(msg) return res.status(400).send(msg);
        const appointment = await Appointment.findOne({_id: appoId});
        if(!appointment) return res.send({message: 'Appointment not found'});
        const permission = await checkPermission(appointment.user, req.user.sub)
        if(permission === false) {
            return res.status(403).send({message:'Unauthorized to update'})
        }else{
            if(params.user || params.status) return res.send({message:'Unauthorized to update user and status'});
            const animal = await Animal.findOne({_id: params.animal})
            if (!animal) {
                return res.send({message:'Animal not found'});
            }else{
                const alreadyAppo = await Appointment.findOne({
                    $and: [
                        {animal: data.animal}, 
                        {user: data.user}
                    ]});
                const dateAlready = await Appointment.findOne({
                    $and: [
                        {date:  data.date}, 
                        {user: data.user}
                    ]}); 
                if (alreadyAppo && dateAlready) return res.send({message: 'Appointment already created with this animal or this date'});
                const appoUpdated = await Appointment.findOneAndUpdate({_id: appoId}, data, {new:true}).lean(); 
                return res.send({appoUpdated ,message:'Appointment updated successfully'});                                               
            }

            
        }
    
        
    }catch(err){
        console.log(err);
        return err;
    }
}

exports.updateStatus = async (req, res) => {
    try {
        const params = req.body;
        const appoId = req.params.id;
        const data = {
            status: params.status
        }
        const msg = validateData(data);
        if(msg) return res.send(msg);
            if(params.date || params.user || params.animal){
                return res.send({message:'el usuario no es requerido'});
           
            }else{
                const statusAppoUpdated = await Appointment.findOneAndUpdate({_id: appoId}, data, {new: true})
                .populate('user')
                .populate('animal').lean();
                const statusUpdated = await deleteSensitiveData(statusAppoUpdated);
                return res.send({message:'Appointment status has been updated', statusUpdated});
            }
    } catch (err) {
        console.log(err);
        return err;
    }
}