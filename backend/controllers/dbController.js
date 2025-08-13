const { Databases, UserDatabaseRoles, User, sequelize } = require('../db');
const { Op } = require('sequelize');

exports.connectDb = async (req, res) => {
    const { name, dbUrl } = req.body;
    const userId = req.user?.id;
 
    // 1. Add a check to ensure the user is authenticated.
    if (!userId) {
        return res.status(401).json({ message: "Authentication required." });
    }

    try {
        const [db, created] = await Databases.findOrCreate({
            where: { db_url: dbUrl }, 
            defaults: { database_name: name, created_by_user_id: userId }
        });

        // 2. Assign the 'admin' role to the authenticated user for this database.
        await UserDatabaseRoles.findOrCreate({
            where: {
                userId: userId,
                databaseId: db.database_id,
            },
            defaults: {
                role: 'admin'
            }
        });

        res.status(200).json({ 
            message: created ? "Database connected successfully." : "Database already connected.", 
            db_id: db.database_id 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};


/**
 * Retrieves a list of databases for a specific user, including their role.
 */
exports.getDbList = async (req, res) => {
    const userId = req.user?.id;

    try {
        // Eager load the Databases model through the junction table UserDatabaseRoles
        const userWithDBs = await User.findByPk(userId, {
            include: {
                model: Databases,
                through: { attributes: ['role'] } // Fetch the 'role' column from the junction table
            }
        });

        if (!userWithDBs) {
            console.log('❌ User not found');
            return res.status(404).json({ message: "User not found." });
        }

        console.log(`✅ Databases for ${userWithDBs.username}:`);
        console.log(userWithDBs.Databases.map(db => ({
            ...db.toJSON(),
            role: db.UserDatabaseRoles.role // Access the role directly from the junction table
        })));

        res.status(200).json(userWithDBs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch database list." });
    }
};