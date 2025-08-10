// backend/src/controllers/queryController.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getDbSchema, sequelize, Query, User } = require('../db');
const config = require('../config');
const { protect } = require('../middleware/auth');
console.log('Gemini API Key:', config.geminiapiKey); // Debugging line to check if the key is loaded
console.log('Gemini API Key:', config.databaseUrl); // Debugging line to check if the key is loaded


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

// Main controller function to execute a query
// Main controller function to execute a query
exports.executeQuery = [protect, async (req, res) => {
  const { question } = req.body;
  const userId = req.user.id;

  if (!question) {
    return res.status(400).json({ error: 'No question provided.' });
  }

  try {
    // 1. Generate prompt and get SQL from LLM using the Gemini API
    const prompt = getLLMPrompt(question);
    const result = await model.generateContent(prompt);
    const response = result.response;
    const textResponse = response.text().trim();

    // Use a regular expression to extract the SQL from the markdown code block
    const sqlMatch = textResponse.match(/```sql\n([\s\S]*?)```/);
    let sqlQuery;
    if (sqlMatch && sqlMatch[1]) {
      sqlQuery = sqlMatch[1].trim();
    } else {
      // Fallback if the LLM doesn't use a code block
      sqlQuery = textResponse;
    }

    // Basic SQL Injection prevention
    const restrictedCommands = ['DROP', 'TRUNCATE', 'DELETE', 'ALTER', 'CREATE', 'UPDATE', 'INSERT'];
    if (restrictedCommands.some(cmd => sqlQuery.toUpperCase().includes(cmd))) {
      return res.status(403).json({ error: 'Unsupported SQL command detected.' });
    }

    // 2. Execute the query
    const [queryResults, metadata] = await sequelize.query(sqlQuery, {
      type: sequelize.QueryTypes.SELECT
    });

    // Extract columns and data for the frontend
    const formattedResult = {
      columns: Object.keys(queryResults[0] || {}),
      data: queryResults.map(row => Object.values(row))
    };

    // 3. Save query to history
    await Query.create({
      userId,
      naturalLanguageQuery: question,
      sqlQuery,
      result: formattedResult
    });

    // 4. Return results
    res.status(200).json(formattedResult);

  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: 'An error occurred while processing the query.', details: error.message });
  }
}];

// Controller function to get the user's query history
exports.getHistory = [protect, async (req, res) => {
  const userId = req.user.id;
  try {
    const history = await Query.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']] 
    });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch query history.' });
  }
}];