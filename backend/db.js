// db.js
import { Sequelize, DataTypes } from 'sequelize';

// =======================
// Database Connection (Supabase)
// =======================
const sequelize = new Sequelize(
  'postgres',                // Database name
  'postgres',                // Database username
  'Vnfj.8Qx.!2485+',         // Database password (replace this)
  {
    host: 'db.gqsnhlixyawsonabtbck.supabase.co',
    port: 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Required for Supabase SSL
      }
    },
    logging: false, // Set to true if you want SQL logs
  }
);

// =======================
// Models
// =======================
const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  // These are the missing fields
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Users',
  timestamps: true,
});

const Roles = sequelize.define('Roles', {
  role_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  role_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  assigned_to_user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'user_id',
    },
    onDelete: 'CASCADE',
  }
}, {
  tableName: 'Roles',
  timestamps: true,
});

const Databases = sequelize.define('Databases', {
  database_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  database_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  db_url: {
      type: DataTypes.STRING,
      allowNull: false, 
  },
  created_by_user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'user_id',
    },
    onDelete: 'CASCADE',
  }
}, {
  tableName: 'Databases',
  timestamps: true,
});

// =======================
// Associations
// =======================
User.hasMany(Roles, { foreignKey: 'assigned_to_user_id' });
Roles.belongsTo(User, { foreignKey: 'assigned_to_user_id' });

User.hasMany(Databases, { foreignKey: 'created_by_user_id' });
Databases.belongsTo(User, { foreignKey: 'created_by_user_id' });

// =======================
// Sync Function
// =======================
async function connectAndSync() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to Supabase Postgres');

    // Sync in order
//  await sequelize.sync({ force: true }); // Drops all tables and recreates


    console.log('✅ All models synced');
  } catch (error) {
    console.error('❌ Error syncing database:', error);
  }
}

// Export
export { sequelize, User, Roles, Databases, connectAndSync };
