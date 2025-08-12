const { Databases, UserRoles, Roles, sequelize } = require('../db');
const { Op } = require('sequelize');

exports.connectDb = async (req, res) => {
    const { name, dbUrl } = req.body;
    console.log(req.body)
    const userId = req.user?.id; 
 
    try {
        const [db, created] = await Databases.findOrCreate({
            where: { db_url: dbUrl }, 
            defaults: { database_name:name, created_by_user_id: userId }
        });

const [adminRole] = await Roles.findOrCreate({
  where: { role_name: 'admin' },
  defaults: {
    assigned_to_user_id: userId
  },
  attributes: ['role_id']
});
console.log("Admin role",adminRole)
const adminRoleId = adminRole?.role_id;        
        // Make the user an admin of the newly connected database
        await UserRoles?.findOrCreate({
            where: { userId: userId, dbId: db.db_id, roleId: adminRoleId }
        });
 
        res.status(200).json({ message: created ? "Database connected successfully." : "Database already connected.", db_id: db.db_id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};