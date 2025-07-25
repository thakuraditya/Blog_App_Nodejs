// model/commentModel.js
export default (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  // Associate function (optional - will only work if models are passed)
  Comment.associate = (models) => {
    if (models?.Post) {
      Comment.belongsTo(models.Post, {
        foreignKey: "post_id",
        onDelete: "CASCADE",
      });
    }

    Comment.belongsTo(Comment, {
      foreignKey: "parent_id",
      as: "parent",
    });

    Comment.hasMany(Comment, {
      foreignKey: "parent_id",
      as: "replies",
      onDelete: "CASCADE",
    });
  };

  return Comment;
};
