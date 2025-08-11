const { Databases, UserRoles, sequelize } = require('../db');
const { Op } = require('sequelize');

exports.connectDb = async (req, res) => {
    const { name, dbUrl } = req.body;
    const userId = req.user.id;

    try {
        const [db, created] = await Databases.findOrCreate({
            where: { db_url: dbUrl }, // In a real app, you'd want a more secure way to uniquely identify a DB
            defaults: { name, created_by_user_id: userId }
        });

        const adminRoleId = await sequelize.query("SELECT role_id FROM Roles WHERE name = 'admin'", { type: sequelize.QueryTypes.SELECT }).then(r => r[0].role_id);
        
        // Make the user an admin of the newly connected database
        await UserRoles.findOrCreate({
            where: { userId: userId, dbId: db.db_id, roleId: adminRoleId }
        });

        res.status(200).json({ message: created ? "Database connected successfully." : "Database already connected.", db_id: db.db_id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};