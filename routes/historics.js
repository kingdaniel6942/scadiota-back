var models  		= require('../models');
var express 		= require('express');
var sequelize 		= require('sequelize');
var utils           = require('../services/utils');
var router          = express.Router();
const Op 			= sequelize.Op;

router
.post('/getAnalog', async function(req, res){

    let signalsId = req.body.signalsId;
    const signalsUuid = req.body.signalsUuid;

    let now = new Date();
    let lessMinutes = new Date(now.getTime() - (60000 * 20));

    const dateIn = req.body.dateIn ? req.body.dateIn : lessMinutes;
    const dateTo = req.body.dateTo ? req.body.dateTo : now;

    try{
      
      if(signalsId == null && signalsUuid != null){
        const signals = await models.Signal.findAll({
          where:{
            uuid:signalsUuid
          },
          attributes: [
           'id'
          ]
        });

        if(signals != null){
          try{
            signalsId = signals.map(s=> s.dataValues.id ); 
          }catch(e){
            console.log({error:"Error agregando elementos"});
          }
        }    
      }
      if(signalsId == null){
        console.log({error:"Señales no encontradas " + signalsUuid});
        return res.send({error:"Señales no encontradas " + signalsUuid});
      }
      console.log(signalsId);
      const historics = await models.HistoricAnalog.findAll({
        where:{
          [Op.and]:[
            {signalId: signalsId},
            {
              createdAt:{
                [Op.gte]:dateIn
              }
            },
            {
              createdAt:{
                [Op.lte]:dateTo
              }
            }
          ]
        },
        order: [
            ['createdAt', 'ASC']
        ],
        attributes: [
          'id','signalId','time','createdAt','value'
        ]
      });
      res.send({success:historics});
    }
    catch(err){
      console.log({error:err});
      res.send({error:err});
    }
})

.post('/getAnalogGroupedRanged', async function(req, res){

    let signalsId = req.body.signalsId;
    const signalsUuid = req.body.signalsUuid;

    let now = new Date();
    let lessMinutes = new Date(now.getTime() - (60000 * 20));

    const dateIn = req.body.dateIn ? new Date(req.body.dateIn) : lessMinutes;
    const dateTo = req.body.dateTo ? new Date(req.body.dateTo) : now;

    let diffInMilliSeconds = Math.abs(dateTo - dateIn) / 1000;
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;
    console.log('minutes', minutes);//Minutos de diferencia entre las dos fechas

    let rangoAgrupamiento = ''
    //Si la diferencia de minutos es menor de 10 se traen los datos en muestras segundos
    if(minutes <= 10){
      rangoAgrupamiento = 'second';
    }else if(minutes <= 300){//Si es menor de 5 horas se traen por minutos
      rangoAgrupamiento = 'minute';
    }else if(minutes <= 14400){//Si es menor de 10 días se traen por horas
      rangoAgrupamiento = 'hour';
    }else {//Si es mayor a 10 días se trae por días
      rangoAgrupamiento = 'day';
    }

    try{
      
      if(signalsId == null && signalsUuid != null){
        const signals = await models.Signal.findAll({
          where:{
            uuid:signalsUuid
          },
          attributes: [
           'id'
          ]
        });

        if(signals != null){
          try{
            signalsId = signals.map(s=> s.dataValues.id ); 
          }catch(e){
            console.log({error:"Error agregando elementos"});
          }
        }    
      }
      if(signalsId == null){
        console.log({error:"Señales no encontradas " + signalsUuid});
        return res.send({error:"Señales no encontradas " + signalsUuid});
      }
      console.log(signalsId);
      const historics = await models.HistoricAnalog.findAll({
        where:{
          [Op.and]:[
            {signalId: signalsId},
            {
              createdAt:{
                [Op.gte]:dateIn
              }
            },
            {
              createdAt:{
                [Op.lte]:dateTo
              }
            }
          ]
        },
        attributes: [
          [ sequelize.fn('date_trunc', rangoAgrupamiento, sequelize.col('createdAt')),'time' ],
          [ sequelize.fn('AVG', sequelize.col('value')), 'value' ],
          sequelize.col('signalId')
        ],
        group: [
          sequelize.fn('date_trunc', rangoAgrupamiento, sequelize.col('createdAt')),
          sequelize.col('signalId')
        ],
        order: [
            [sequelize.fn('date_trunc', rangoAgrupamiento, sequelize.col('createdAt')), 'ASC'],
        ]
      });
      res.send({success:historics});
    }
    catch(err){
      console.log({error:err});
      res.send({error:err});
    }
})

module.exports = router;