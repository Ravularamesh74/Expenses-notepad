import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// 🔹 User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name too long"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please use a valid email address",
      ],
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // 🔐 never return password by default
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // 🔥 Optional advanced fields
    avatar: {
      type: String,
      default: "",
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// 🔐 HASH PASSWORD BEFORE SAVE
// ==========================================
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ==========================================
// 🔑 PASSWORD MATCH METHOD
// ==========================================
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ==========================================
// 🔄 CLEAN OUTPUT (REMOVE SENSITIVE DATA)
// ==========================================
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

// ==========================================
// 🔥 MODEL EXPORT
// ==========================================
export default mongoose.model("User", userSchema);