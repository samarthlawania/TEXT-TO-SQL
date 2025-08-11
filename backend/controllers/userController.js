const { User, UserRoles, Databases, sequelize } = require('../db');
const { Op } = require('sequelize');

exports.inviteUser = async (req, res) => {
    const { email, role, dbId } = req.body;
    const adminId = req.user.id;

    try {
        const isAdmin = await UserRoles.findOne({
            where: {
                userId: adminId,
                dbId: dbId,
                roleId: await sequelize.query("SELECT role_id FROM Roles WHERE name = 'admin'", { type: sequelize.QueryTypes.SELECT }).then(r => r[0].role_id)
            }
        });

        if (!isAdmin) {
            return res.status(403).json({ message: "Forbidden: You must be an admin to invite users to this database." });
        }

        // For a full app, you'd send an email invitation here. For this demo, we'll just create a placeholder user.
        const [user, created] = await User.findOrCreate({
            where: { email },
            defaults: { password_hash: null } // Password will be set upon first login
        });

        const roleId = await sequelize.query("SELECT role_id FROM Roles WHERE name = ?", { replacements: [role], type: sequelize.QueryTypes.SELECT }).then(r => r[0].role_id);
        
        await UserRoles.findOrCreate({
            where: { userId: user.user_id, dbId: dbId, roleId: roleId }
        });

        res.status(200).json({ message: `User with email ${email} was invited and assigned the role of ${role}.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.setRole = async (req, res) => {
    const { userId, role, dbId } = req.body;
    const adminId = req.user.id;

    try {
        const isAdmin = await UserRoles.findOne({
            where: {
                userId: adminId,
                dbId: dbId,
                roleId: await sequelize.query("SELECT role_id FROM Roles WHERE name = 'admin'", { type: sequelize.QueryTypes.SELECT }).then(r => r[0].role_id)
            }
        });

        if (!isAdmin) {
            return res.status(403).json({ message: "Forbidden: You must be an admin to change user roles." });
        }

        const newRoleId = await sequelize.query("SELECT role_id FROM Roles WHERE name = ?", { replacements: [role], type: sequelize.QueryTypes.SELECT }).then(r => r[0].role_id);
        
        const [updated, rows] = await UserRoles.update(
            { roleId: newRoleId },
            { where: { userId: userId, dbId: dbId } }
        );

        if (updated) {
            res.status(200).json({ message: "User role updated successfully." });
        } else {
            res.status(404).json({ message: "User role not found." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
};