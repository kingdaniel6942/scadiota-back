var models  		= require('../models');
var sequelize 		= require('sequelize');
var mqtt            = require('mqtt'); //https://www.npmjs.com/package/mqtt
var Topic           = '#'; //subscribe to all topics
var Broker_URL      = 'mqtt://mqtt';

var options = {
	clientId: 'MyMQTT',
	port: 1883,
	username: 'admin',
	password: '94561wecwecuheiew64654h46ew',	
	keepalive : 60
};

var client  = mqtt.connect(Broker_URL, options);
client.on('connect', mqtt_connect);
client.on('reconnect', mqtt_reconnect);
client.on('error', mqtt_error);
client.on('message', mqtt_messsageReceived);
client.on('close', mqtt_close);

function mqtt_connect() {
    console.log("Connecting MQTT");
    client.subscribe(Topic, mqtt_subscribe);
};

function mqtt_subscribe(err, granted) {
    console.log("Subscribed to " + Topic);
    if (err) {console.log(err);}
};

function mqtt_reconnect(err) {
    console.log("Reconnect MQTT");
    //if (err) {console.log(err);}
	//client  = mqtt.connect(Broker_URL, options);
};

function mqtt_error(err) {
	if (err) {console.log({error: err});}
};

function after_publish() {
	//do nothing
};

//receive a message from MQTT broker
function mqtt_messsageReceived(uuid, message, packet) {
	var message_str = message.toString(); //convert byte array to string
	message_str = message_str.replace(/\n$/, ''); //remove new line
    console.log("Mensaje recibido!");
    //console.log(uuid, message_str, packet);
    var resp = insertData(uuid,message_str);
    //console.log(resp);
};

function mqtt_close() {
	console.log("Close MQTT");
};

async function insertData(uuid, data){
    var time = data.split('@')[1];
    var value = data.split('@')[0];
    var uuidSignal = uuid.split('/')[1];

    console.log(time)
    console.log(value)
    console.log(uuidSignal)

    var dataInsert;
    
    try{

        if(!uuidSignal){

            throw "Error, uuid not found";
        }
    
        if(!time){
    
            time = new Date();
        }

        var signal = await models.Signal.findOne({
            where:{
                uuid: uuidSignal
            },
            include:[
                {
                    model: models.SignalTemplate,
                    as: 'signalTemplate'
                }
            ],
        })
    
        if(!signal){

            throw {error_mqtt: "Signal uuid does not exist"};
        }else{

            if(signal.signalTemplate.signalType == 'ANALOG'){
                dataInsert = parseFloat(value);
                await models.HistoricAnalog.create({
                    signalId: signal.id,
                    value: dataInsert,
                    time: time
                })
            }else if(signal.signalTemplate.signalType == 'DIGITAL'){
                dataInsert = parseInt(value) > 0 ? true: false;
                await models.HistoricDigital.create({
                    signalId: signal.id,
                    value: dataInsert,
                    time: time
                })
            }else if(signal.signalTemplate.signalType == 'STRING'){
                dataInsert = value;
                await models.HistoricString.create({
                    signalId: signal.id,
                    value: dataInsert,
                    time: time
                })
            }

            throw {success_mqtt: "data inserted"}
        }
    }
    catch(error){
        console.log(error.message)
        return {error_mqtt:error}
    }
}
