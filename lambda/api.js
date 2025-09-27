// Lambda function for server-side Google Sheets operations (if needed)
const { google } = require('googleapis');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    const path = event.path;
    const method = event.httpMethod;

    if (path === '/api/test' && method === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'API is working',
          timestamp: new Date().toISOString(),
        }),
      };
    }

    // Add more API endpoints as needed for server-side operations
    // For example, if you need to handle authentication or complex operations

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Endpoint not found' }),
    };
  } catch (error) {
    console.error('Lambda error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};