function formatResponse(success, data = null, message = null) {
    return {
      success,
      data,
      message
    };
  }
  
  module.exports = { formatResponse };