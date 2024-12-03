
const crypto = require('crypto');


/**
 A function that capitalizes each word in a string.
 * @param {string} str - The String to be capitalized.
 * @returns {Object} Returns the capitalized string.
 */
module.exports.capitalizeEachWord = function capitalizeEachWord(str) {
    return str.replace(/\b\w/g, match => match.toUpperCase());
  }

/**
 *  A function that generates a session token.
 * @param {string} userId - The user ID.
 * @returns {Object} Returns the session token.
*/

 module.exports.generateSessionToken = function generateSessionToken(userId) {
    const randomBytes = crypto.randomBytes(32).toString('hex');
    const timestamp = Date.now().toString();
    const data = `${userId}-${randomBytes}-${timestamp}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  const groupDataBy = (data, groupBy) => {
    // Handle invalid inputs
    if (!Array.isArray(data) || !groupBy) {
      throw new Error('Invalid input: data must be an array and groupBy must be specified');
    }
  
    // Group the data
    const grouped = data.reduce((groups, item) => {
      const key = item[groupBy];
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
  
    // Convert to array format
    return Object.entries(grouped).map(([key, items]) => ({
      [groupBy]: key,
      items
    }));
  };

  const  calculateAge = (dateOfBirth) =>{
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    
    return age;
}

  module.exports = { groupDataBy, calculateAge}