const mongoose = require("mongoose");
const { Schema } = mongoose;

const reportSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, "Please Enter UseriD"],
    ref: "user",
  },
  companyName: String,
  companyOwner: String,
  companyDescription: String,
  companyWebsite: String,
  sector: String,
  reportingYear: String,
  consolidation: String,
  numPlants: Number,
  plantAddresses: [String],
  numProductsPerPlant: [Number],
  productFuelUsage: [[[]]],
  productEmissionFactors: [
    [
      {
        CO2: Number,
        CH4: Number,
        N2O: Number,
      },
    ],
  ],
  productNames: [[String]],
  officeEmissionFactors: [[{}]],
  numOfficesPerPlant: [Number],
  NumOutwardsPerPlant: [Number],
  NumOutwardsPerPlantExport: [Number],
  officeNames: [[String]],
  managerNames: [[String]],
  officeElectricityUsage: [[[]]],
  officeElectricityBill: [[[]]],
  officeElectricityFactor: [[[]]],
  domesticOutwardData: [[{}]],
  exportOutwardData: [[{}]],
  headOfficerNames: [String],
  otherSector: String,
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
