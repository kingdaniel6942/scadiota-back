/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    var Device = sequelize.define('Device', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name:{
        type: DataTypes.STRING(50),
        allowNull: true
      },
      description:{
        type: DataTypes.TEXT,
        allowNull: true
      },
      image:{
        type: DataTypes.STRING(100),
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
      deviceType: {
          type:DataTypes.ENUM({
            values: ['SCADA', 'MAINTENANCE','IOT','OTHER']
          }),
          allowNull: true
      }
    });
    Device.associate = models => {
      Device.hasMany(models.Signal, { as: 'signals', foreignKey: {name: 'deviceId', allowNull: true}, onDelete : 'NO ACTION', onUpdate: 'NO ACTION'});
      Device.hasMany(models.Device, { as: 'devices', foreignKey: {name: 'deviceId', allowNull: true}, onDelete : 'NO ACTION', onUpdate: 'NO ACTION'});
      Device.belongsTo(models.Device, { as: 'device', foreignKey: {name: 'deviceId', allowNull: true}, onDelete : 'NO ACTION', onUpdate: 'NO ACTION'});
    }
    return Device;
};
  