const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(config.databaseUrl, {
  dialect: 'postgres',
  logging: false, // Set to true to see SQL queries
});

const Query = sequelize.define('Query', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  naturalLanguageQuery: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  sqlQuery: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  result: {
    type: DataTypes.JSONB
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
});

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Define a simple database schema for the LLM to query
const schemaDefinition = `
  -- Table: Customers
  -- Columns: customer_id (INT, PK), name (VARCHAR), email (VARCHAR), country (VARCHAR), signup_date (DATE)
  -- Example:
  -- customer_id | name            | email                 | country | signup_date
  -- 1           | Alice Johnson   | alice@example.com     | USA     | 2023-01-15
  -- 2           | Bob Smith       | bob@example.com       | Canada  | 2023-02-20

  -- Table: Orders
  -- Columns: order_id (INT, PK), customer_id (INT, FK), order_date (DATE), total_amount (DECIMAL)
  -- Example:
  -- order_id | customer_id | order_date | total_amount
  -- 101      | 1           | 2023-03-05 | 150.75
  -- 102      | 2           | 2023-03-10 | 25.50
`;

const getDbSchema = () => schemaDefinition;

const connectAndSync = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        await sequelize.sync({ alter: true });
        console.log('Database synchronized.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = { sequelize, User, Query, getDbSchema, connectAndSync };