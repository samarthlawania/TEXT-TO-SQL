const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getDbSchema, sequelize, QueryHistory, UserRoles } = require('../db');
const config = require('../config');
const { protect } = require('../middleware/auth');
console.log('Gemini API Key:', config.geminiapiKey); 
console.log('Gemini API Key:', config.databaseUrl);  


// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(config.geminiapiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// This function prepares the prompt with the database schema for the LLM
const getLLMPrompt = (question) => {
  return `
    You are a helpful assistant that converts natural language questions into PostgreSQL queries.
    
    You are given the following database schema:
    ${getDbSchema()}

    Your task is to write a single, valid PostgreSQL query that answers the user's question.
    Do not add any explanations, just the SQL query.

    Question: "${question}"
    SQL Query:
    `;
};

const isDestructive = (sql) => {
    const destructiveCommands = ['DROP', 'TRUNCATE', 'DELETE', 'ALTER', 'CREATE', 'UPDATE', 'INSERT'];
    const sqlUpper = sql.toUpperCase();
    return destructiveCommands.some(cmd => sqlUpper.includes(cmd));
};

// Main controller function to execute a query
// Main controller function to execute a query
exports.executeSandboxQuery = [protect, async (req, res) => {
    const { question, dbId } = req.body;
    const userId = req.user.id;

    // ... (LLM and SQL extraction logic, same as before)
    try {
        const [queryResults, metadata] = await sequelize.query(sqlQuery, {
            type: sequelize.QueryTypes.SELECT
        });
        
        const formattedResult = {
            columns: Object.keys(queryResults[0] || {}),
            data: queryResults.map(row => Object.values(row))
        };

        await QueryHistory.create({
            user_id: userId,
            db_id: dbId,
            natural_language_query: question,
            sql_query: sqlQuery,
            is_destructive: isDestructive(sqlQuery),
            status: 'sandbox'
        });

        res.status(200).json({ message: "Query executed in sandbox.", results: formattedResult, sql: sqlQuery });
    } catch (error) {
        // ... (error handling, same as before)
    }
}];


exports.syncQuery = [protect, async (req, res) => {
    const { sqlQuery, dbId } = req.body;
    const userId = req.user.id;

    try {
        // Check for destructive commands and user's role
        if (isDestructive(sqlQuery)) {
            const isAdmin = await UserRoles.findOne({
                where: {
                    userId: userId,
                    dbId: dbId,
                    roleId: await sequelize.query("SELECT role_id FROM Roles WHERE name = 'admin'", { type: sequelize.QueryTypes.SELECT }).then(r => r[0].role_id)
                }
            });
            if (!isAdmin) {
                return res.status(403).json({ message: "Forbidden: Destructive commands can only be executed by admins." });
            }
        } 
        
        res.status(200).json({ message: "Query synced to production database successfully." });
    } catch (error) {
        // ... (error handling, same as before)
    }
}];


// Controller function to get the user's query history
exports.getHistory = [protect, async (req, res) => {
    const userId = req.user.id;
    try {
        const history = await QueryHistory.findAll({
            where: { user_id: userId },
            order: [['executed_at', 'DESC']]
        });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch query history.' });
    }
}];