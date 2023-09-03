/* Daniel De Narváez Ordoñez 2020-07-07 */

module.exports = function(sequelize, DataTypes) {
  var HistoricDigital = sequelize.define('HistoricDigital', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    value:{
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    time:{
      type: DataTypes.DATE,
      allowNull: true
    }
  });
  HistoricDigital.associate = models => {
    HistoricDigital.belongsTo(models.Signal, { as: 'signal', foreignKey: {name: 'signalId', allowNull: false}, onDelete : 'NO ACTION', onUpdate: 'NO ACTION'});
  }
  return HistoricDigital;
};
