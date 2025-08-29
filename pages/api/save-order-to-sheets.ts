import { google } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';

// Google Sheets configuration - Using the provided spreadsheet ID
const SPREADSHEET_ID = '14GNYhv6bzTumQClhg3LY3i8wW0V9dFAG-nvv6-a-t7A-t7A'; // Provided spreadsheet ID
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');

// Order interface - Simplified for the required columns
interface OrderData {
  customerInfo: {
    name: string;
    email: string;
  };
  items: Array<{
    title: string;
    quantity: number;
    price: string;
  }>;
  total: string;
  timestamp?: string;
}

/**
 * Initialize Google Sheets API client using service account authentication
 * This function creates an authenticated client that can read/write to Google Sheets
 */
async function getGoogleSheetsClient() {
  // Step 1: Validate environment variables
  if (!SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
    throw new Error('Missing Google Sheets service account credentials. Please check GOOGLE_SHEETS_CLIENT_EMAIL and GOOGLE_SHEETS_PRIVATE_KEY environment variables.');
  }

  // Step 2: Create authentication using service account credentials
  // The service account JSON key contains client_email and private_key
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: SERVICE_ACCOUNT_EMAIL,
      private_key: PRIVATE_KEY,
    },
    // Step 3: Specify the required scope for Google Sheets API
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  // Step 4: Return authenticated Google Sheets client
  return google.sheets({ version: 'v4', auth });
}

/**
 * Ensure the Google Sheet has the correct headers
 * This function checks if headers exist and creates them if they don't
 */
async function ensureHeadersExist(sheets: any) {
  try {
    // Step 1: Check if headers already exist by reading the first row
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A1:E1', // Check first 5 columns (A to E)
    });

    const existingHeaders = response.data.values?.[0] || [];

    // Step 2: Define the required headers for our order tracking
    const requiredHeaders = [
      'Order Timestamp',    // Column A: When the order was placed
      'Customer Name',      // Column B: Customer's full name
      'Customer Email',     // Column C: Customer's email address
      'Order Items',        // Column D: Items as JSON string
      'Total Amount'        // Column E: Total order amount
    ];

    // Step 3: If headers don't exist or are incorrect, create them
    if (existingHeaders.length === 0 || existingHeaders.length !== requiredHeaders.length) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Sheet1!A1:E1', // Write headers to first row
        valueInputOption: 'RAW',
        requestBody: {
          values: [requiredHeaders],
        },
      });
      console.log('✅ Headers created in Google Sheet');
    }
  } catch (error) {
    console.error('❌ Error ensuring headers exist:', error);
    throw error;
  }
}

/**
 * Save order data to Google Sheets
 * This function takes order data and appends it as a new row in the spreadsheet
 */
async function saveOrderToSheets(orderData: OrderData): Promise<string> {
  try {
    // Step 1: Get authenticated Google Sheets client
    const sheets = await getGoogleSheetsClient();

    // Step 2: Ensure headers exist in the spreadsheet
    await ensureHeadersExist(sheets);

    // Step 3: Generate timestamp if not provided
    const timestamp = orderData.timestamp || new Date().toISOString();

    // Step 4: Convert items array to JSON string for storage
    const itemsJson = JSON.stringify(orderData.items);

    // Step 5: Prepare the row data in the correct order
    const rowData = [
      timestamp,                    // Order Timestamp
      orderData.customerInfo.name,  // Customer Name
      orderData.customerInfo.email, // Customer Email
      itemsJson,                    // Order Items (JSON string)
      `$${orderData.total}`         // Total Amount (with $ prefix)
    ];

    // Step 6: Append the row to the Google Sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A:E', // Append to columns A through E
      valueInputOption: 'RAW', // Use raw values (no formatting)
      insertDataOption: 'INSERT_ROWS', // Insert new rows
      requestBody: {
        values: [rowData],
      },
    });

    console.log('✅ Order saved to Google Sheets successfully');
    return timestamp; // Return timestamp as confirmation

  } catch (error) {
    console.error('❌ Error saving to Google Sheets:', error);
    throw new Error('Failed to save order to Google Sheets. Please check your service account credentials and spreadsheet permissions.');
  }
}

/**
 * Main API handler function
 * This is the serverless function that handles POST requests from the client
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Step 1: Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST to submit orders.'
    });
  }

  try {
    // Step 2: Extract order data from request body
    const orderData: OrderData = req.body;

    // Step 3: Validate required fields
    if (!orderData.customerInfo?.name || !orderData.customerInfo?.email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required customer information (name and email are required)'
      });
    }

    if (!orderData.items || orderData.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    if (!orderData.total) {
      return res.status(400).json({
        success: false,
        message: 'Order total is required'
      });
    }

    // Step 4: Save order to Google Sheets
    const timestamp = await saveOrderToSheets(orderData);

    // Step 5: Return success response
    res.status(200).json({
      success: true,
      message: 'Order saved successfully to Google Sheets',
      timestamp: timestamp,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`
    });

  } catch (error) {
    // Step 6: Handle and return errors
    console.error('❌ API Error:', error);

    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Internal server error occurred',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}
