import bcryptjs from "bcryptjs";
function addPasswordhashingHook(schema) {
  schema.pre("save", async function (next) {
    // Skip if password is not modified
    if (!this.isModified("password")) return next();

    try {
      const salt = await bcryptjs.genSalt(10);
      this.password = await bcryptjs.hash(this.password, salt); 
      console.log("Password hashed");
      next();
    } catch (error) {
      next(error);
    }
  });
}

function addPasswordVerificationMethod(schema) {
  schema.methods.isPasswordCorrect = async function (password) {
    return await bcryptjs.compare(password, this.password);
  };
}

export { addPasswordhashingHook, addPasswordVerificationMethod };
