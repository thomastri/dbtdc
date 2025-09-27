// Google Sheets API service
export class GoogleSheetsService {
  constructor() {
    this.spreadsheetId = '185ewLSrOTusHWTkOV9bU_yNdca5LFE3axER8At4bhbU';
    this.apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
    this.baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
  }

  // Find the row for a specific date
  async findDateRow(date) {
    try {
      // Get the date column (column B) to find the matching date
      const response = await fetch(
        `${this.baseUrl}/${this.spreadsheetId}/values/Sheet1!B:B?key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const values = data.values || [];
      
      // Find the row index for the given date
      for (let i = 0; i < values.length; i++) {
        if (values[i][0] === date) {
          return i + 1; // Sheets API uses 1-based indexing
        }
      }
      
      // If date not found, we might need to add it
      // For now, we'll use row 2 as default (assuming headers in row 1)
      return 2;
    } catch (error) {
      console.error('Error finding date row:', error);
      return 2; // Default to row 2
    }
  }

  // Update the spreadsheet with ratings and notes
  async updateSpreadsheet({ date, emotions, skills, notes }) {
    try {
      const row = await this.findDateRow(date);
      
      // Prepare the update requests
      const updates = [];
      
      // Update date in column B if needed
      updates.push({
        range: `Sheet1!B${row}`,
        values: [[date]]
      });

      // Update emotions (assuming they start from column C)
      // This is a simplified mapping - you'll need to adjust based on your actual sheet structure
      const emotionColumns = ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
      const emotionNames = Object.keys(emotions);
      
      emotionNames.forEach((emotion, index) => {
        if (index < emotionColumns.length) {
          updates.push({
            range: `Sheet1!${emotionColumns[index]}${row}`,
            values: [[emotions[emotion]]]
          });
        }
      });

      // Update skills (assuming they start after emotions, around column M)
      const skillColumns = ['M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
      const skillNames = Object.keys(skills);
      
      skillNames.forEach((skill, index) => {
        if (index < skillColumns.length) {
          updates.push({
            range: `Sheet1!${skillColumns[index]}${row}`,
            values: [[skills[skill]]]
          });
        }
      });

      // Update notes in cells B34-B40 (as requested)
      if (notes && notes.trim()) {
        // Split notes into chunks that fit in cells B34-B40
        const noteChunks = this.splitNotesIntoChunks(notes, 7); // 7 cells available (B34-B40)
        
        noteChunks.forEach((chunk, index) => {
          const noteRow = 34 + index;
          updates.push({
            range: `Sheet1!B${noteRow}`,
            values: [[chunk]]
          });
        });
      }

      // Batch update all the changes
      const batchUpdateResponse = await fetch(
        `${this.baseUrl}/${this.spreadsheetId}/values:batchUpdate?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            valueInputOption: 'RAW',
            data: updates
          })
        }
      );

      if (!batchUpdateResponse.ok) {
        throw new Error(`HTTP error! status: ${batchUpdateResponse.status}`);
      }

      const result = await batchUpdateResponse.json();
      console.log('Spreadsheet updated successfully:', result);
      return result;

    } catch (error) {
      console.error('Error updating spreadsheet:', error);
      throw error;
    }
  }

  // Helper method to split notes into chunks for multiple cells
  splitNotesIntoChunks(notes, maxChunks) {
    const maxCharsPerCell = 500; // Reasonable limit per cell
    const chunks = [];
    
    if (notes.length <= maxCharsPerCell) {
      return [notes];
    }
    
    // Split by sentences or at reasonable breakpoints
    const sentences = notes.split(/[.!?]+/).filter(s => s.trim());
    let currentChunk = '';
    
    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (!trimmedSentence) continue;
      
      if (currentChunk.length + trimmedSentence.length + 1 <= maxCharsPerCell) {
        currentChunk += (currentChunk ? '. ' : '') + trimmedSentence;
      } else {
        if (currentChunk) {
          chunks.push(currentChunk + '.');
          currentChunk = trimmedSentence;
        } else {
          // If a single sentence is too long, split it
          chunks.push(trimmedSentence.substring(0, maxCharsPerCell));
          currentChunk = trimmedSentence.substring(maxCharsPerCell);
        }
      }
      
      if (chunks.length >= maxChunks - 1) {
        break; // Save space for the last chunk
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk + (currentChunk.endsWith('.') ? '' : '.'));
    }
    
    return chunks.slice(0, maxChunks); // Ensure we don't exceed maxChunks
  }

  // Test connection to the Google Sheets API
  async testConnection() {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.spreadsheetId}?key=${this.apiKey}&fields=properties.title`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Connected to spreadsheet:', data.properties.title);
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}