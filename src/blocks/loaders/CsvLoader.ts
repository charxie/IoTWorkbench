/*
 * @author Charles Xie
 */

export class CsvLoader {

  constructor() {
  }

  parse(content: string): any[] {
    let arr = [];
    let quote = false;  // true means we're inside a quoted field
    // iterate over each character, keep track of current row and column (of the returned array)
    for (let row = 0, col = 0, c = 0; c < content.length; c++) {
      let cc = content[c], nc = content[c + 1];        // current character, next character
      arr[row] = arr[row] || [];             // create a new row if necessary
      arr[row][col] = arr[row][col] || '';   // create a new column (start with empty string) if necessary
      // If the current character is a quotation mark, and we're inside a
      // quoted field, and the next character is also a quotation mark,
      // add a quotation mark to the current column and skip the next character
      if (cc == '"' && quote && nc == '"') {
        arr[row][col] += cc;
        ++c;
        continue;
      }
      // If it's just one quotation mark, begin/end quoted field
      if (cc == '"') {
        quote = !quote;
        continue;
      }
      // If it's a comma and we're not in a quoted field, move on to the next column
      if (cc == ',' && !quote) {
        ++col;
        continue;
      }
      // If it's a newline (CRLF) and we're not in a quoted field, skip the next character
      // and move on to the next row and move to column 0 of that new row
      if (cc == '\r' && nc == '\n' && !quote) {
        ++row;
        col = 0;
        ++c;
        continue;
      }
      // If it's a newline (LF or CR) and we're not in a quoted field,
      // move on to the next row and move to column 0 of that new row
      if (cc == '\n' && !quote) {
        ++row;
        col = 0;
        continue;
      }
      if (cc == '\r' && !quote) {
        ++row;
        col = 0;
        continue;
      }
      // Otherwise, append the current character to the current column
      arr[row][col] += cc;
    }
    return arr;
  }

}

