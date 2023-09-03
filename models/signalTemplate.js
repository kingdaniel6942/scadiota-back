/* Daniel De Narváez Ordoñez 2020-07-07 */

module.exports = function(sequelize, DataTypes) {
    var SignalTemplate = sequelize.define('SignalTemplate', {
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
      state: {
          type:DataTypes.ENUM({
            values: ['ENABLED', 'DISABLED']
          }),
          allowNull: true
      },
      signalType: {
        type:DataTypes.ENUM({
          values: ['ANALOG', 'DIGITAL', 'STRING']
        }),
        allowNull: true
      }
    });
    SignalTemplate.associate = models => {
      SignalTemplate.hasMany(models.Signal, { as: 'signals', foreignKey: {name: 'signalTemplateId', allowNull: false}, onDelete : 'NO ACTION', onUpdate: 'NO ACTION'});
    }
    return SignalTemplate;
};
  