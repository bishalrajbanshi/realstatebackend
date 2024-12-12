import nodemailer from "nodemailer"

 const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: "bishalrajbanshi.mail@gmail.com",
      pass: "dgek trwz esdm kyzb",
    },
  });

  export { transporter };
  

  

