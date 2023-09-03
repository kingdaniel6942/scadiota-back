var models  		= require('../models');
var express 		= require('express');
var sequelize 		= require('sequelize');
var utils           = require('../services/utils');
var router          = express.Router();
const Op 			= sequelize.Op;

router
.post('/getAll/:deviceId', async function(req, res){

    const deviceId = req.params.deviceId;

    try{
        const signals = await models.Signal.findAll({
          where:{
            deviceId:deviceId
          },
          include:[
            {
                model: models.SignalTemplate,
                as: 'signalTemplate'
            }
          ],
          order: [
              ['id', 'ASC']
          ],
        });
        res.send({success:signals});
    }

    catch(err){

        console.log({error:err});
        res.send({error:err});
    }
})
.post('/create', async function(req,res){

    const name          = req.body.name ? String(req.body.name).toUpperCase() : null;
    const deviceId      = req.body.deviceId;
    const description   = req.body.description;
    const signalType    = req.body.signalType;
    const max           = req.body.max;
    const min           = req.body.min;
    const uuid          = 's' + utils.generateUUID();
  
    var signalTemplate;
    var signal;

    try{
        signalTemplate = await models.SignalTemplate.findOne({
            where:{
                name:{
                    [Op.iLike]:name
                },
                signalType:signalType
            }
        });

        if(!signalTemplate){
            signalTemplate = await models.SignalTemplate.create({
                name: name,
                signalType: signalType,
                state: 'ENABLED'
            })
        }else{
            signal = await models.Signal.findOne({
                where:{
                    signalTemplateId:signalTemplate.id,
                    deviceId: deviceId,
                    description: description
                }
            })
        }

        if(signal){
            return res.send({error:"Signal for device already exists"});
        }
        else{
            signal = await models.Signal.create({
                uuid:uuid,
                signalTemplateId:signalTemplate.id,
                deviceId:deviceId,
                description:description,
                state: 'ENABLED',
                max: max,
                min: min
            })
        }

        res.send({success:signal});
    }
    catch(err){

        console.log({error:err});
        res.send({error:err});
    }
})
.post('/update', async function(req,res){

    const name          = req.body.name ? String(req.body.name).toUpperCase() : null;
    const signalType    = req.body.signalType;
    const uuid          = req.body.uuid;
    const state         = req.body.state;
    const description   = req.body.description;
    const max           = req.body.max;
    const min           = req.body.min;
  
    var signalTemplate;
    var signal;

    try{
        signal = await models.Signal.findOne({
            where:{
                uuid: uuid
            },
            include:[
                {
                    model: models.SignalTemplate,
                    as: 'signalTemplate'
                }
            ]
        })

        if(!signal){
            return res.send({error:"Signal does not exists"});
        }

        if(name != null && signalType != null){
            signalTemplate = await models.SignalTemplate.findOne({
                where:{
                    name:{
                        [Op.iLike]:name
                    },
                    signalType: signalType
                }
            })

            if(!signalTemplate){
                signalTemplate = await models.SignalTemplate.create({
                    name: name,
                    signalType: signalType,
                    state: 'ENABLED'
                })
            }

            signal = await signal.update({
                state: state,
                signalTemplateId:signalTemplate.id,
                description: description,
                max: max,
                min: min
            })
        }else{
            return res.send({error:"Complete the fields"});
        }

        res.send({success:signal});
    }
    catch(err){
        console.log({error:err});
        res.send({error:err});
    }
})

.post('/delete', async function(req,res){

    const uuid          = req.body.uuid;
    var signal;

    try{

        signal = await models.Signal.findOne({
            where:{
                uuid: uuid
            }
        })

        var result = signal.destroy();
        res.send({success:result});

    }catch(err){

        console.log({error:err});
        res.send({error:err});
    }
})

.post('/getAvailableManual', async function(req, res){

    const idsSignals = req.body.idsSignals;

    try{
        const signals = await models.Signal.findAll({
          where:{
            id:idsSignals,
            signalManualId: null,
          },
          include:[
                {
                    model: models.Device,
                    as: 'device',
                    where:{
                        deviceType: 'MAINTENANCE'
                    },
                    required: true
                },
                {
                    model: models.SignalTemplate,
                    as: 'signalTemplate'
                }
          ],
          order: [
              ['id', 'ASC']
          ],
        });
        res.send({success:signals});
    }

    catch(err){

        console.log({error:err});
        res.send({error:err});
    }
})

module.exports = router;