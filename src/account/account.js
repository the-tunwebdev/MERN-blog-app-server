const  nodemailer = require('nodemailer');

const  transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '',
    pass: ''
  }
});

const sendGreeting = (email,name,token)=>{
  const url = `http://localhost:3000/confirmation/${token}`
   const mailOptions = {
    from: 'ouerfelliyassine19@gmail.com',
    to: email,
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
const sendResetPassword =  (email,name,id) =>{
  const url = `http://localhost:3000/resetpass/${id}`
   const mailOptions = {
    from: 'ouerfelliyassine19@gmail.com',
    to: email,
    subject: `Go reset your password now ${name}`,
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
module.exports = {
  sendGreeting :sendGreeting , 
  sendResetPassword :sendResetPassword
}


