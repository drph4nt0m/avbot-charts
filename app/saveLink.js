const mongoose = require('mongoose');

const logger = require('./logger');

try {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  logger.debug(`MongoDB Connected`);
} catch (error) {
  logger.error(`MongoDB Connection Error`);
}

const ChartSchema = new mongoose.Schema(
  {
    icao: { type: String, required: true, unique: true },
    link: { type: String, required: true },
    source: { type: String, required: true },
    country: { type: String, required: true }
  },
  { timestamps: true }
);

const model = mongoose.model('chart', ChartSchema);

module.exports = async (airport) => {
  try {
    await model.updateOne({ icao: airport.icao }, airport, { upsert: true });
    logger.info(`(${airport.icao}) Updated chart`, { type: 'database' });
  } catch (error) {
    logger.error(`(${airport.icao}) unable to update chart`, { type: 'database' });
    logger.error(error);
  }
};
