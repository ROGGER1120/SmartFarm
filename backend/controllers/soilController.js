import SoilReport from '../models/SoilReport.js';

export const getSoilReport = async (req, res) => {
  try {
    const { farmId } = req.query;
    let report = null;
    if (farmId) {
      report = await SoilReport.findOne({ farmId }).sort({ createdAt: -1 });
    } else {
      report = await SoilReport.findOne().sort({ createdAt: -1 });
    }

    if (!report && farmId) {
      // Create initial report matching the screenshot
      report = new SoilReport({
        farmId,
        fieldName: 'Field 1 - North Section',
        presentCrop: 'Sunflower',
        cropCategory: 'Oilseed Crops',
        soilPh: 6.5,
        soilPhBenchmark: '0 to 14',
        soilEcLevel: 0.5,
        soilEcBenchmark: '< 1 ds/m',
        organicCarbon: 0.8,
        organicCarbonBenchmark: '(0.5 to 0.75%)',
        nitrogen: 240,
        nitrogenBenchmark: '(280 to 560 kg/ha)',
        nitrogenStatus: 'Low',
        phosphorous: 12,
        phosphorousBenchmark: '(22.5 to 56 kg/ha)',
        phosphorousStatus: 'Low',
        potassium: 200,
        potassiumBenchmark: '(120 to 280 kg/ha)',
        potassiumStatus: 'Optimal',
        recommendations: [
          {
            nutrient: 'Nitrogen (N)',
            deficiencyLevel: 'Deficit by 40 kg/ha',
            suggestedFertilizer: 'Top dress with Neem-Coated Urea in 2 split applications during vegetative growth.',
            priority: 'High'
          },
          {
            nutrient: 'Phosphorous (P)',
            deficiencyLevel: 'Deficit by 10.5 kg/ha',
            suggestedFertilizer: 'Apply Single Super Phosphate (SSP) or DAP prior to flowering for root and bud strength.',
            priority: 'High'
          },
          {
            nutrient: 'Organic Carbon',
            deficiencyLevel: 'Slightly elevated (0.8%)',
            suggestedFertilizer: 'Maintain regular vermicompost or farmyard manure application; soil health is robust.',
            priority: 'Low'
          }
        ]
      });
      await report.save();
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSoilReport = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await SoilReport.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const generateSummary = async (req, res) => {
  try {
    const { farmId } = req.body;
    const report = await SoilReport.findOne({ farmId }).sort({ createdAt: -1 });
    if (!report) return res.status(404).json({ message: 'No report found' });

    const summaryText = `Soil test on ${new Date(report.testDate).toLocaleDateString()} indicates pH is ideal (${report.soilPh}) with low electrical conductivity (${report.soilEcLevel} ds/m). However, both Nitrogen (${report.nitrogen} kg/ha) and Phosphorous (${report.phosphorous} kg/ha) are below recommended thresholds for ${report.presentCrop}. Immediate supplement of Urea (40 kg/ha) and SSP is advised before the flowering phase to prevent yield reduction.`;

    res.json({
      summary: summaryText,
      generatedAt: new Date(),
      status: 'Ready'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
