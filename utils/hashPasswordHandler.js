const bcrypt  = require('bcryptjs');
const salt  = bcrypt.genSaltSync(10);


 function hashPassword(password){
    const hash = bcrypt.hashSync(password,salt);
    return hash;
}
function comparisonPassword (plainPassword,hashedPassword){
  return bcrypt.compareSync(plainPassword,hashedPassword)
}
module.exports = {hashPassword,comparisonPassword}