import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize(
  'postgres',                
  'postgres',                
  'Vnfj.8Qx.!2485+',        
  {
    host: 'db.gqsnhlixyawsonabtbck.supabase.co',
    port: 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, 
      }
    },
    logging: false, 
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
  }
}, {
  tableName: 'Users',
  timestamps: true,
});

const Roles = sequelize.define('Roles', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  role_name: {
    type: DataTypes.ENUM('admin', 'editor', 'viewer'),
    allowNull: false
  }
}, {
  tableName: 'roles',
  timestamps: false
});

const UserDatabaseRoles = sequelize.define('UserDatabaseRoles', {
  role: {
    type: DataTypes.ENUM('admin', 'editor', 'viewer'),
    allowNull: false,
  }
}, {
  tableName: 'UserDatabaseRoles',
  timestamps: true
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

const DatabaseInvites = sequelize.define(
  'DatabaseInvites',
  {
    invite_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'editor', 'viewer'), allowNull: false },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'declined'),
      defaultValue: 'pending',
    },
  },
  { tableName: 'DatabaseInvites', timestamps: true }
);

const Queries = sequelize.define(
  'Queries',
  {
    query_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    sql_text: { type: DataTypes.TEXT, allowNull: false },
    execution_mode: {
      type: DataTypes.ENUM('sandbox', 'production'),
      allowNull: false,
    },
    status: { type: DataTypes.ENUM('success', 'failed'), allowNull: false },
  },
  { tableName: 'Queries', timestamps: true }
);


const SandboxMappings = sequelize.define(
  'SandboxMappings',
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    sandbox_url: { type: DataTypes.STRING, allowNull: false },
  },
  { tableName: 'SandboxMappings', timestamps: true }
);


// =======================
// Associations
// =======================
User.hasMany(Roles, { foreignKey: 'assigned_to_user_id' });
Roles.belongsTo(User, { foreignKey: 'assigned_to_user_id' });

User.hasMany(Databases, { foreignKey: 'created_by_user_id' });
Databases.belongsTo(User, { foreignKey: 'created_by_user_id' });


// Define the many-to-many relationship using the new join table
User.belongsToMany(Databases, { through: UserDatabaseRoles, foreignKey: 'userId' });
Databases.belongsToMany(User, { through: UserDatabaseRoles, foreignKey: 'databaseId' });

// Database → Invites
Databases.hasMany(DatabaseInvites, { foreignKey: 'database_id' });
DatabaseInvites.belongsTo(Databases, { foreignKey: 'database_id' });

// Database → Query History
Databases.hasMany(Queries, { foreignKey: 'database_id' });
Queries.belongsTo(Databases, { foreignKey: 'database_id' });

// User → Query History
User.hasMany(Queries, { foreignKey: 'executed_by' });
Queries.belongsTo(User, { foreignKey: 'executed_by' });

// Database → Sandbox Mapping
Databases.hasOne(SandboxMappings, { foreignKey: 'database_id' });
SandboxMappings.belongsTo(Databases, { foreignKey: 'database_id' });

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
export { sequelize, User, Roles, Databases,DatabaseInvites,UserDatabaseRoles, Queries, SandboxMappings, connectAndSync };
