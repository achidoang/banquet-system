// src/models/Jobdesks.js
module.exports = (sequelize, DataTypes) => {
  const Jobdesk = sequelize.define(
    "Jobdesk",
    {
      event_id: { type: DataTypes.INTEGER, allowNull: false },
      department_name: { type: DataTypes.STRING, allowNull: false },
      description: DataTypes.TEXT,
      notes: DataTypes.TEXT,
      people_in_charge: DataTypes.STRING,
      image_urls: DataTypes.STRING,
    },
    {}
  );

  Jobdesk.associate = function (models) {
    Jobdesk.belongsTo(models.Event, { foreignKey: "event_id", as: "event" });
  };

  return Jobdesk;
};
