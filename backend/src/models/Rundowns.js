module.exports = (sequelize, DataTypes) => {
  const Rundown = sequelize.define(
    "Rundown",
    {
      event_id: { type: DataTypes.INTEGER, allowNull: false },
      rundown_date: { type: DataTypes.DATE, allowNull: false },
      time_start: { type: DataTypes.TIME, allowNull: false },
      time_end: { type: DataTypes.TIME, allowNull: false },
      event_activity: DataTypes.STRING,
    },
    {}
  );

  Rundown.associate = function (models) {
    Rundown.belongsTo(models.Event, { foreignKey: "event_id", as: "event" });
  };

  return Rundown;
};
