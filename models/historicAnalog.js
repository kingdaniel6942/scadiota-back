/* Daniel De Narváez Ordoñez 2020-07-07 */

module.exports = function(sequelize, DataTypes) {
  var HistoricAnalog = sequelize.define('HistoricAnalog', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    value:{
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    time:{
      type: DataTypes.DATE,
      allowNull: true
    }
  });
  HistoricAnalog.associate = models => {
    HistoricAnalog.belongsTo(models.Signal, { as: 'signal', foreignKey: {name: 'signalId', allowNull: false}, onDelete : 'NO ACTION', onUpdate: 'NO ACTION'});
  }
  return HistoricAnalog;
};
  