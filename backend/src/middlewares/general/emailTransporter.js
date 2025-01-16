import nodemailer from "nodemailer";

 const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: "bishalrajbanshi.mail@gmail.com",
      pass: "dgek trwz esdm kyzb",
    },
    pool: true, 
    maxConnections: 5, 
    maxMessages: 10, 
  });

  export { transporter };