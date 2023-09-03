var models  		= require('../models');
var express 		= require('express');
var sequelize 	= require('sequelize');
var fs          = require('fs');
const mime      = require('mime');
var router      = express.Router();
var utils       = require('../services/utils');
const Op 			  = sequelize.Op;

router
.get('/getAll', async function(req,res){
  try{
    const devices = await models.Device.findAll({
      where:{
        estado:'ENABLED'
      },
      order: [
          ['name', 'ASC']
      ],
    });
    res.send({success:devices});
  }
  catch(err){
    res.send({error:err});
  }
})

.get('/getOne/:id', async function(req,res){
  try{
    const device = await models.Device.findOne({
      where:{
        id:req.params.id
      }
    });
    res.send({success:device});
  }
  catch(err){
    res.send({error:err});
  }
})

.post('/getAllDevicessPlusSignals', async function(req,res){
  const idsRoots = req.body.idsRoots;

  try{
    var devices;
    devices = await models.Device.findAll({
      where:{
        uuid:idsRoots,
        state: 'ENABLED'
      },
      include:[
        {
          model: models.Signal,
          as: 'signals',
          where: {
          	state: 'ENABLED'
          },
          required: false,
          include:[{
            model:models.SignalTemplate,
            as: 'signalTemplate'
          }]
        }/*,
        {
          model: models.Device,
          as: 'devices',
          where: {
          	state: 'ENABLED'
          },
          required: false,
          include:[
            {
              model: models.Signal,
              as: 'signals',
              where: {
	          	state: 'ENABLED'
	          },
          	  required: false,
              include:[{
                model:models.SignalTemplate,
                as: 'signalTemplate'
              }]
            },
            {
              model: models.Device,
              as: 'devices',
              where: {
	          	state: 'ENABLED'
	          },
          	  required: false,
              include:[
                {
                  model: models.Signal,
                  as: 'signals',
                  where: {
		          	state: 'ENABLED'
		          },
          		  required: false,
                  include:[{
                    model:models.SignalTemplate,
                    as: 'signalTemplate'
                  }]
                },
                {
                  model: models.Device,
                  as: 'devices',
                  where: {
		          	state: 'ENABLED'
		          },
          		  required: false,
                  include:[
                    {
                      model: models.Signal,
                      as: 'signals',
                      where: {
			          	state: 'ENABLED'
			          },
          			  required: false,
                      include:[{
                        model:models.SignalTemplate,
                        as: 'signalTemplate'
                      }]	
                    },
                    {
                      model: models.Device,
                      as: 'devices',
                      where: {
			          	state: 'ENABLED'
			          },
          			  required: false
                    }
                  ]
                }
              ]
            }
          ]
        }*/
      ]
    });
    
    res.send({success:devices});
  }
  catch(err){
    res.send({error:err});
  }
})

.post('/create', async function(req,res){

  const name          = req.body.name;
  const uuid          = req.body.uuid ? req.body.uuid : 'd' + utils.generateUUID();
  const description   = req.body.description;
  const deviceType    = req.body.deviceType;
  const deviceId      = req.body.deviceId;

  try{
    var device = await models.Device.findOne({
      where:{
        uuid:uuid
      }
    });

    if(device){
      device = await device.update({
        name:name,
        description:description,
        deviceId:deviceId,
        deviceType:deviceType,
        state:'ENABLED'
      },{omitNull: true})
    }else{
      device = await models.Device.create({
        uuid:uuid,
        name:name,
        description:description,
        deviceType:deviceType,
        deviceId:deviceId,
        state:'ENABLED'
      })
    }
    res.send({success:device});
  }
  catch(err){
      res.send({error:err});
  }
})

.post('/update', async function (req, res, next){

  console.log(req.body);

  const name          = req.body.name;
  const uuid          = req.body.uuid;
  const description   = req.body.description;
  const state         = req.body.state;
  const deviceType    = req.body.deviceType;
  const deviceId      = req.body.deviceId;

  try{
    var device = await models.Device.findOne({
      where:{
        uuid:uuid
      }
    });

    if(device){
      device = await device.update({
        name:name,
        description:description,
        deviceId:deviceId,
        deviceType:deviceType,
        state:state
      },{omitNull: true})
    }else{
      res.send({error:"Device does not exist"});
    }
    res.send({success:device});
  }
  catch(err){
      res.send({error:err});
  }
})

.post('/delete', async function(req,res){

    const uuid          = req.body.uuid;
    var device;

    try{
      
        device = await models.Device.findOne({
            where:{
                uuid: uuid
            }
        })

        if(!device){
        	throw "Devide not found with uuid: " + uuid;
        	return -1;
        }

        await device.update({state:'DISABLED'});

        var result = await device.destroy();
        res.send({success:result});

    }catch(err){

        console.log({error:err});
        res.send({error:err});
    }
})

module.exports = router;