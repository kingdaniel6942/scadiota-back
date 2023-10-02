/* Daniel De Narváez Ordoñez 2020-07-07 */

module.exports = function(sequelize, DataTypes) {
  var HistoricString = sequelize.define('HistoricString', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    value:{
      type: DataTypes.STRING(400),
      allowNull: true
    },
    time:{
      type: DataTypes.DATE,
      allowNull: true
    }
  });
  HistoricString.associate = models => {
    HistoricString.belongsTo(models.Signal, { as: 'signal', foreignKey: {name: 'signalId', allowNull: false}, onDelete : 'NO ACTION', onUpdate: 'NO ACTION'});
  }
  return HistoricString;
};
