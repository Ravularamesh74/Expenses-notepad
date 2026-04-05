import mongoose from "mongoose";

// 🔹 Expense Schema
const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true, // 🔥 fast queries
    },

    amount: {
      type: Number,
      required: true,
      min: [0, "Amount must be positive"],
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Food",
        "Transport",
        "Shopping",
        "Bills",
        "Health",
        "Entertainment",
        "Other",
      ],
      index: true,
    },

    note: {
      type: String,
      trim: true,
      maxlength: [200, "Note too long"],
      default: "",
    },

    date: {
      type: Date,
      default: Date.now,
      index: true,
    },

    // 🔥 Metadata (advanced)
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// ==========================================
// ⚡ INDEXES (PERFORMANCE BOOST)
// ==========================================

// Compound index for fast filtering
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1 });

// ==========================================
// 🧠 VIRTUALS (COMPUTED FIELDS)
// ==========================================

// Format date
expenseSchema.virtual("formattedDate").get(function () {
  return this.date.toISOString().split("T")[0];
});

// ==========================================
// 🔄 TRANSFORM OUTPUT (CLEAN API RESPONSE)
// ==========================================

expenseSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// ==========================================
// 🔥 MODEL EXPORT
// ==========================================

export default mongoose.model("Expense", expenseSchema);