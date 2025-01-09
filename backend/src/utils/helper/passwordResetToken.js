import crypto from "crypto"
function generateResetToken(schema){
    schema.methods.createResetPasswordToken = function(){
        const resetToken = crypto.randomBytes(32).toString("hex");
        this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        this.passwordResetTokenExpiry = Date.now() + 5 * 60 * 1000;
        return resetToken;
    }
}
export { generateResetToken };