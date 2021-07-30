const  nodemailer = require('nodemailer');

const  transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'emailadresshere',
    pass: 'passhere'
  }
});

const sendGreeting = (email,name,token)=>{
  const url = `http://localhost:5000/confirmation/${token}`
   const mailOptions = {
    from: 'emiladresshere',
    to:  email,
    subject: 'Thank you for logging in',
    html: `<a href="${url}">${url}</a> `     

  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}
module.exports = sendGreeting


