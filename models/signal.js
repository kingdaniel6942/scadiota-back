/* Daniel De Narváez Ordoñez 2020-07-07 */

module.exports = function(sequelize, DataTypes) {
    var Signal = sequelize.define('Signal', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      description:{
        type: DataTypes.STRING(50),
        allowNull: true
      },
      uuid:{
        type: DataTypes.STRING(50),
        allowNull: true
      },
      state: {
        type:DataTypes.ENUM({
          values: ['ENABLED', 'DISABLED']
        }),
        allowNull: true
      },
      max:{
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      min:{
        type: DataTypes.DOUBLE,
        allowNull: true
      }
    });
    Signal.associate = models => {
      Signal.belongsTo(models.SignalTemplate, { as: 'signalTemplate', foreignKey: {name: 'signalTemplateId', allowNull: false}, onDelete : 'NO ACTION', onUpdate: 'NO ACTION'});
      Signal.belongsTo(models.Device, { as: 'device', foreignKey: {name: 'deviceId', allowNull: true}, onDelete : 'NO ACTION', onUpdate: 'NO ACTION'});
      Signal.hasMany(models.HistoricAnalog, { as: 'historicAnalogs', foreignKey: {name: 'signalId', allowNull: false}, onDelete : 'NO ACTION', onUpdate: 'NO ACTION'});
      Signal.hasMany(models.HistoricDigital, { as: 'historicDigitals', foreignKey: {name: 'signalId', allowNull: false}, onDelete : 'NO ACTION', onUpdate: 'NO ACTION'});
      Signal.hasMany(models.HistoricString, { as: 'historicStrings', foreignKey: {name: 'signalId', allowNull: false}, onDelete : 'NO ACTION', onUpdate: 'NO ACTION'});
    }
    return Signal;
};
  