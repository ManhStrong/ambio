const ErrorCode = {
   //require param
  REQUIRED_PARAM: "AMBIO001",
  //invalid param
  INVALID_PARAM: "AMBIO002",
  //not found
  NOT_FOUND: "AMBIO004",
  //un authorrized
  UNAUTHORIZED: "AMBIO007",
  // duplicateValue
  DUPLICATE_VALUE: "AMBIO003",
  //error server
  UNEXPECTED: "AMBIO008",

  //NEED_REGISTER_PHONENUMBER
  NEED_REGISTER_PHONENUMBER: 'AMBIO005',

  //NEED_VERIFY_PHONENUMBER
  NEED_VERIFY_PHONENUMBER: 'AMBIO006'
};
module.exports = ErrorCode;
