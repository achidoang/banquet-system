const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // atau bisa gunakan SMTP host lainnya
  auth: {
    user: "it.department.rai@gmail.com", // email pengirim
    pass: "itrai1963", // password atau app-specific password jika pakai Gmail
  },
});

const sendResetPasswordEmail = async (toEmail, resetLink) => {
  try {
    await transporter.sendMail({
      from: "it.department.rai@gmail.com", // Email pengirim
      to: toEmail, // Email tujuan (yang akan direset passwordnya)
      subject: "Reset Your Password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
    });
    console.log("Reset password email sent");
  } catch (error) {
    console.error("Error sending email:", error.response); // Log detail error dari Nodemailer
    throw new Error("Failed to send email");
  }
};
