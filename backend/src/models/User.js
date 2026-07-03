import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phone : {
      type: String
    },

    password: {
      type: String,
      required: true,
      select: false // Don't include password in queries by default
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student"
    },

    university: {
      type: String,
      required: true,
      trim: true
    },

    address: {
      addressLine: {
        type: String,
        required: true
      },
      zone: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Zone"
      }
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    isActive: {
      type: Boolean,
      default: true
    },

    profileImage: {
      type: String,
      default: ""
    },

    profileImagePublicId: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

// Hash password
userSchema.pre("save", async function () {

  // prevent rehashing when updating
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);

});

// compare passwords 
userSchema.methods.matchPassword = async function (enteredPassword) {

  return await bcrypt.compare(
    enteredPassword,
    this.password
  );
};

const User = mongoose.model("User", userSchema);

export default User;