import mongoose from 'mongoose'

const problemSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  code: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  points: { type: Number, default: 100 },
  timeLimit: { type: Number, default: 300 }, // Time limit in seconds
  tags: [String],
  description: String,
  inputFormat: String,
  outputFormat: String,
  constraints: String,
  testCases: [{
    input: String,
    expected: String,
    explanation: String,
    hidden: { type: Boolean, default: false }
  }],
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Problem', problemSchema)