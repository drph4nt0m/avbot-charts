const mongoose = require('mongoose');

const logger = require('./logger');

try {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  logger.debug(`MongoDB Connected`);
} catch (error) {
  logger.error(`MongoDB Connection Error`);
}

const ChartSchema = new mongoose.Schema(
  {
    icao: { type: String, required: true, unique: true },
    link: { type: String, required: true }
  },
  { timestamps: true }
)

const model = mongoose.model('chart', ChartSchema)

module.exports = async (airport) => {
  await model.updateOne({ icao: airport.icao }, airport, { upsert: true });
}