import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Farm from '../models/Farm.js';
import Crop from '../models/Crop.js';
import WaterLog from '../models/WaterLog.js';
import IrrigationSchedule from '../models/IrrigationSchedule.js';
import Fertilizer from '../models/Fertilizer.js';
import FertilizerLog from '../models/FertilizerLog.js';
import Labour from '../models/Labour.js';
import LabourAttendance from '../models/LabourAttendance.js';
import Machinery from '../models/Machinery.js';
import MachineryLog from '../models/MachineryLog.js';
import Budget from '../models/Budget.js';
import SoilReport from '../models/SoilReport.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log('Seeding SmartFarm initial data...');

    // Clear existing collections
    await Farm.deleteMany({});
    await Crop.deleteMany({});
    await WaterLog.deleteMany({});
    await IrrigationSchedule.deleteMany({});
    await Fertilizer.deleteMany({});
    await FertilizerLog.deleteMany({});
    await Labour.deleteMany({});
    await LabourAttendance.deleteMany({});
    await Machinery.deleteMany({});
    await MachineryLog.deleteMany({});
    await Budget.deleteMany({});
    await SoilReport.deleteMany({});

    // 1. Create Farms
    const farm1 = await Farm.create({
      name: 'Farm 1 - Krishivedika Green Valley',
      code: 'FARM-01',
      location: 'Pollachi Taluk, Coimbatore, Tamil Nadu',
      totalArea: 12.5,
      areaUnit: 'Acres',
      soilType: 'Red Loamy Fertile Soil',
      farmerName: 'Arini Farmer',
      contact: '+91 98421 54321',
      climateZone: 'Tropical Semi-Arid',
      isPrimary: true,
      fields: [
        {
          name: 'Field 1 - North Section',
          area: 3.5,
          soilType: 'Red Loam',
          status: 'Active Cultivation',
          currentCrop: 'Sunflower',
          cropCategory: 'Oilseed Crops',
          coordinates: { lat: 10.6609, lng: 77.0048 }
        },
        {
          name: 'Field 2 - East Section',
          area: 4.0,
          soilType: 'Clay Loam',
          status: 'Active Cultivation',
          currentCrop: 'Paddy (Ponni Rice)',
          cropCategory: 'Cereals & Grains',
          coordinates: { lat: 10.6620, lng: 77.0062 }
        },
        {
          name: 'Field 3 - South Section',
          area: 2.5,
          soilType: 'Sandy Loam',
          status: 'Active Cultivation',
          currentCrop: 'Tomato (Hybrid Shivam)',
          cropCategory: 'Vegetables',
          coordinates: { lat: 10.6595, lng: 77.0035 }
        },
        {
          name: 'Field 4 - West Section',
          area: 2.5,
          soilType: 'Loamy Soil',
          status: 'Ploughing',
          currentCrop: 'Fallow / Pre-sowing',
          cropCategory: 'Commercial Crops',
          coordinates: { lat: 10.6615, lng: 77.0020 }
        }
      ]
    });

    const farm2 = await Farm.create({
      name: 'Farm 2 - Cauvery Delta Fields',
      code: 'FARM-02',
      location: 'Kumbakonam, Thanjavur, Tamil Nadu',
      totalArea: 8.0,
      areaUnit: 'Acres',
      soilType: 'Alluvial River Delta Soil',
      farmerName: 'Arini Farmer',
      contact: '+91 98421 54321',
      climateZone: 'Delta Coastal Tropical',
      isPrimary: false,
      fields: [
        {
          name: 'Block A - Canal Front',
          area: 5.0,
          soilType: 'Alluvial Clay',
          status: 'Active Cultivation',
          currentCrop: 'Paddy (IR-20)',
          cropCategory: 'Cereals & Grains',
          coordinates: { lat: 10.9602, lng: 79.3845 }
        },
        {
          name: 'Block B - Pulse Ridge',
          area: 3.0,
          soilType: 'Silty Alluvium',
          status: 'Active Cultivation',
          currentCrop: 'Black Gram (Urad)',
          cropCategory: 'Pulses',
          coordinates: { lat: 10.9615, lng: 79.3860 }
        }
      ]
    });

    // 2. Create Crops for Farm 1
    const crop1 = await Crop.create({
      farmId: farm1._id,
      name: 'Sunflower',
      variety: 'KBSH-53 Hybrid Gold',
      category: 'Oilseed Crops',
      season: 'Kharif',
      fieldName: 'Field 1 - North Section',
      sowingDate: new Date('2026-08-10'),
      expectedHarvestDate: new Date('2026-11-25'),
      stage: 'Vegetative Growth',
      stageProgress: 55,
      areaCultivated: 3.5,
      estimatedYield: 28,
      yieldUnit: 'Quintals',
      marketPricePerUnit: 5850,
      status: 'Active',
      healthStatus: 'Good',
      notes: 'Optimal vegetative vegetative growth. Requires split dose of Nitrogen and Phosphorous.'
    });

    const crop2 = await Crop.create({
      farmId: farm1._id,
      name: 'Paddy (Ponni Rice)',
      variety: 'BPT 5204 (Samba Mahsuri)',
      category: 'Cereals & Grains',
      season: 'Kharif',
      fieldName: 'Field 2 - East Section',
      sowingDate: new Date('2026-07-20'),
      expectedHarvestDate: new Date('2026-11-10'),
      stage: 'Grain / Pod Formation',
      stageProgress: 75,
      areaCultivated: 4.0,
      estimatedYield: 65,
      yieldUnit: 'Quintals',
      marketPricePerUnit: 2450,
      status: 'Active',
      healthStatus: 'Excellent',
      notes: 'Water level maintained at 3-5 cm. Standing crop in prime grain filling stage.'
    });

    const crop3 = await Crop.create({
      farmId: farm1._id,
      name: 'Tomato (Hybrid Shivam)',
      variety: 'Shivam Semi-Determinate',
      category: 'Vegetables',
      season: 'Kharif',
      fieldName: 'Field 3 - South Section',
      sowingDate: new Date('2026-08-25'),
      expectedHarvestDate: new Date('2026-11-05'),
      stage: 'Flowering & Budding',
      stageProgress: 60,
      areaCultivated: 2.5,
      estimatedYield: 220,
      yieldUnit: 'Bags (50kg)',
      marketPricePerUnit: 700,
      status: 'Active',
      healthStatus: 'Attention Needed',
      notes: 'Staking completed. Mild whitefly activity observed, biological neem spray applied.'
    });

    // 3. Water Logs (with exact illustrative values: Total Water Expense = ₹2,500 vs ₹2,000 planned!)
    await WaterLog.create([
      {
        farmId: farm1._id,
        cropId: crop1._id,
        cropName: 'Sunflower',
        fieldName: 'Field 1 - North Section',
        date: new Date('2026-09-28'),
        source: 'Drip System',
        durationHours: 3.5,
        quantityLiters: 14000,
        plannedLiters: 12000,
        cost: 650,
        abnormalFlag: false,
        notes: 'Routine drip irrigation schedule with fertigation unit.'
      },
      {
        farmId: farm1._id,
        cropId: crop1._id,
        cropName: 'Sunflower',
        fieldName: 'Field 1 - North Section',
        date: new Date('2026-10-04'),
        source: 'Borewell',
        durationHours: 6.0,
        quantityLiters: 32000,
        plannedLiters: 20000, // Exceeded by 60%!
        cost: 1100,
        abnormalFlag: true,
        abnormalReason: 'Sub-lateral drip line valve was accidentally left open during night cycle.',
        notes: 'Valve serviced and auto-shutoff sensor recalibrated.'
      },
      {
        farmId: farm1._id,
        cropId: crop2._id,
        cropName: 'Paddy (Ponni Rice)',
        fieldName: 'Field 2 - East Section',
        date: new Date('2026-10-08'),
        source: 'Canal Irrigation',
        durationHours: 4.0,
        quantityLiters: 22000,
        plannedLiters: 22000,
        cost: 750,
        abnormalFlag: false,
        notes: 'Canal turn water release for field inundation.'
      }
    ]);

    // 4. Irrigation Schedules
    await IrrigationSchedule.create([
      {
        farmId: farm1._id,
        cropId: crop1._id,
        cropName: 'Sunflower',
        fieldName: 'Field 1 - North Section',
        frequency: 'Alternate Days',
        irrigationTime: '06:30 AM',
        durationMinutes: 90,
        plannedLiters: 12000,
        method: 'Drip Line',
        valveZone: 'Zone A - Solar Drip Unit',
        status: 'Active'
      },
      {
        farmId: farm1._id,
        cropId: crop2._id,
        cropName: 'Paddy (Ponni Rice)',
        fieldName: 'Field 2 - East Section',
        frequency: 'Daily',
        irrigationTime: '05:00 AM',
        durationMinutes: 120,
        plannedLiters: 20000,
        method: 'Furrow Flood',
        valveZone: 'Zone B - Sluice Gate 2',
        status: 'Active'
      },
      {
        farmId: farm1._id,
        cropId: crop3._id,
        cropName: 'Tomato (Hybrid Shivam)',
        fieldName: 'Field 3 - South Section',
        frequency: 'Daily',
        irrigationTime: '07:00 AM',
        durationMinutes: 60,
        plannedLiters: 8000,
        method: 'Micro-Sprinkler',
        valveZone: 'Zone C - Pressure Pump',
        status: 'Active'
      }
    ]);

    // 5. Fertilizer Inventory (NPK stock low to trigger alert)
    const fertUrea = await Fertilizer.create({
      farmId: farm1._id,
      name: 'Neem-Coated Urea (46% N)',
      category: 'Nitrogenous (N)',
      currentStock: 12,
      unit: 'Bags (50kg)',
      minThresholdStock: 4,
      pricePerUnit: 270,
      npkRatio: '46:0:0',
      supplier: 'IFFCO Farmers Cooperative'
    });

    const fertNPK = await Fertilizer.create({
      farmId: farm1._id,
      name: 'NPK 19:19:19 Complex',
      category: 'NPK Complex',
      currentStock: 2, // Low stock! Below 5 threshold
      unit: 'Bags (50kg)',
      minThresholdStock: 5,
      pricePerUnit: 1450,
      npkRatio: '19:19:19',
      supplier: 'Coromandel Gromor Agro'
    });

    const fertDAP = await Fertilizer.create({
      farmId: farm1._id,
      name: 'DAP (Di-Ammonium Phosphate)',
      category: 'Phosphatic (P)',
      currentStock: 7,
      unit: 'Bags (50kg)',
      minThresholdStock: 3,
      pricePerUnit: 1350,
      npkRatio: '18:46:0',
      supplier: 'SPIC Agro Services'
    });

    const fertCompost = await Fertilizer.create({
      farmId: farm1._id,
      name: 'Organic Vermicompost',
      category: 'Organic Compost',
      currentStock: 25,
      unit: 'Bags (50kg)',
      minThresholdStock: 8,
      pricePerUnit: 350,
      npkRatio: '2:1:1 + Microbes',
      supplier: 'EcoBio Farms Pollachi'
    });

    // Fertilizer Application Logs (Total: ₹4,500 vs ₹5,000 planned!)
    await FertilizerLog.create([
      {
        farmId: farm1._id,
        fertilizerId: fertNPK._id,
        fertilizerName: 'NPK 19:19:19 Complex',
        cropId: crop1._id,
        cropName: 'Sunflower',
        fieldName: 'Field 1 - North Section',
        date: new Date('2026-09-22'),
        quantityUsed: 2,
        unit: 'Bags (50kg)',
        costPerUnit: 1450,
        totalCost: 2900,
        applicationMethod: 'Basal Dressing',
        growthStageApplied: 'Vegetative Growth'
      },
      {
        farmId: farm1._id,
        fertilizerId: fertUrea._id,
        fertilizerName: 'Neem-Coated Urea (46% N)',
        cropId: crop2._id,
        cropName: 'Paddy (Ponni Rice)',
        fieldName: 'Field 2 - East Section',
        date: new Date('2026-10-02'),
        quantityUsed: 3,
        unit: 'Bags (50kg)',
        costPerUnit: 270,
        totalCost: 810,
        applicationMethod: 'Top Dressing',
        growthStageApplied: 'Tillering Stage'
      },
      {
        farmId: farm1._id,
        fertilizerId: fertCompost._id,
        fertilizerName: 'Organic Vermicompost',
        cropId: crop3._id,
        cropName: 'Tomato (Hybrid Shivam)',
        fieldName: 'Field 3 - South Section',
        date: new Date('2026-10-06'),
        quantityUsed: 2.25,
        unit: 'Bags (50kg)',
        costPerUnit: 350,
        totalCost: 790,
        applicationMethod: 'Basal Dressing',
        growthStageApplied: 'Vegetative'
      }
    ]); // 2900 + 810 + 790 = 4500

    // 6. Labour Workers & Attendance (Total: ₹7,500 vs ₹8,000 planned!)
    const labSelvam = await Labour.create({
      farmId: farm1._id,
      name: 'Selvam R.',
      role: 'Spraying Specialist',
      dailyWage: 600,
      phone: '+91 94431 87654',
      status: 'Active',
      assignedField: 'Field 1'
    });

    const labMurugan = await Labour.create({
      farmId: farm1._id,
      name: 'Murugan P.',
      role: 'Tractor Operator',
      dailyWage: 700,
      phone: '+91 98425 11223',
      status: 'Active',
      assignedField: 'Field 2'
    });

    const labLakshmi = await Labour.create({
      farmId: farm1._id,
      name: 'Lakshmi K.',
      role: 'Weeding & De-trashing',
      dailyWage: 450,
      phone: '+91 97890 33445',
      status: 'Active',
      assignedField: 'Field 1'
    });

    const labKannan = await Labour.create({
      farmId: farm1._id,
      name: 'Kannan M.',
      role: 'Irrigation Handler',
      dailyWage: 500,
      phone: '+91 99432 55667',
      status: 'Active',
      assignedField: 'Field 3'
    });

    const labMeena = await Labour.create({
      farmId: farm1._id,
      name: 'Meena S.',
      role: 'General Farm Hand',
      dailyWage: 450,
      phone: '+91 96554 77889',
      status: 'Active',
      assignedField: 'Field 2'
    });

    // Attendance records totaling ₹7,500
    await LabourAttendance.create([
      {
        farmId: farm1._id,
        labourId: labMurugan._id,
        labourName: 'Murugan P.',
        role: 'Tractor Operator',
        cropName: 'Sunflower',
        fieldName: 'Field 1',
        date: new Date('2026-09-20'),
        status: 'Present',
        hoursWorked: 8,
        taskDescription: 'Secondary tilling and bed preparation',
        wagePaid: 1400 // 2 days equiv
      },
      {
        farmId: farm1._id,
        labourId: labSelvam._id,
        labourName: 'Selvam R.',
        role: 'Spraying Specialist',
        cropName: 'Sunflower',
        fieldName: 'Field 1',
        date: new Date('2026-09-25'),
        status: 'Present',
        hoursWorked: 8,
        taskDescription: 'Micronutrient foliar spray application',
        wagePaid: 1800 // 3 days equiv
      },
      {
        farmId: farm1._id,
        labourId: labLakshmi._id,
        labourName: 'Lakshmi K.',
        role: 'Weeding & De-trashing',
        cropName: 'Sunflower',
        fieldName: 'Field 1',
        date: new Date('2026-10-01'),
        status: 'Present',
        hoursWorked: 8,
        taskDescription: 'Manual row weeding and mulching',
        wagePaid: 1800 // 4 days
      },
      {
        farmId: farm1._id,
        labourId: labKannan._id,
        labourName: 'Kannan M.',
        role: 'Irrigation Handler',
        cropName: 'Sunflower',
        fieldName: 'Field 1',
        date: new Date('2026-10-04'),
        status: 'Present',
        hoursWorked: 8,
        taskDescription: 'Drip line checking and emitter unclogging',
        wagePaid: 1500 // 3 days
      },
      {
        farmId: farm1._id,
        labourId: labMeena._id,
        labourName: 'Meena S.',
        role: 'General Farm Hand',
        cropName: 'Paddy',
        fieldName: 'Field 2',
        date: new Date('2026-10-07'),
        status: 'Present',
        hoursWorked: 8,
        taskDescription: 'Nursery boundary cleaning',
        wagePaid: 1000 // 2+ days
      }
    ]); // 1400 + 1800 + 1800 + 1500 + 1000 = 7500

    // 7. Machinery Fleet & Logs (Total Machinery Expense: ₹3,500 vs ₹3,000 planned! EXCEEDED!)
    const machTractor = await Machinery.create({
      farmId: farm1._id,
      name: 'Mahindra 575 DI Tractor',
      model: '45 HP Diesel Direct Injection',
      type: 'Tractor',
      registrationNumber: 'TN-38-AF-9821',
      hourlyRate: 650,
      totalOperatingHours: 144, // Service interval 150 -> DUE SOON!
      fuelType: 'Diesel',
      lastServiceDate: new Date('2026-07-15'),
      nextServiceDate: new Date('2026-10-15'), // Due in 3 days!
      serviceIntervalHours: 150,
      maintenanceStatus: 'Service Due',
      notes: 'Scheduled for 150-hr engine oil and fuel filter replacement.'
    });

    const machDrone = await Machinery.create({
      farmId: farm1._id,
      name: 'DJI Agras T40 Drone Sprayer',
      model: '40L Precision Agras T40',
      type: 'Drone Sprayer',
      registrationNumber: 'UIN-AGRI-8834',
      hourlyRate: 1200,
      totalOperatingHours: 42,
      fuelType: 'Battery Pack',
      lastServiceDate: new Date('2026-09-01'),
      nextServiceDate: new Date('2026-12-01'),
      serviceIntervalHours: 100,
      maintenanceStatus: 'Operational',
      notes: 'Calibrated centrifugal nozzles. Ready for foliar applications.'
    });

    const machRotavator = await Machinery.create({
      farmId: farm1._id,
      name: 'Shaktiman Semi-Champion Rotavator',
      model: '6 Feet 42-Blades',
      type: 'Rotavator',
      registrationNumber: 'ROT-TN-4412',
      hourlyRate: 500,
      totalOperatingHours: 78,
      fuelType: 'Diesel',
      lastServiceDate: new Date('2026-08-10'),
      nextServiceDate: new Date('2026-11-10'),
      maintenanceStatus: 'Operational'
    });

    // Machinery Logs totaling ₹3,500
    await MachineryLog.create([
      {
        farmId: farm1._id,
        machineryId: machTractor._id,
        machineryName: 'Mahindra 575 DI Tractor',
        cropId: crop1._id,
        cropName: 'Sunflower',
        fieldName: 'Field 1',
        date: new Date('2026-09-18'),
        hoursRun: 3.5,
        fuelConsumedLiters: 14,
        fuelExpense: 1400,
        maintenanceExpense: 400, // Hydraulic oil top-up
        totalExpense: 1800,
        operatorName: 'Murugan P.',
        activityType: 'Ploughing / Deep Tilling',
        notes: 'Pre-sowing deep ploughing completed.'
      },
      {
        farmId: farm1._id,
        machineryId: machRotavator._id,
        machineryName: 'Shaktiman Semi-Champion Rotavator',
        cropId: crop1._id,
        cropName: 'Sunflower',
        fieldName: 'Field 1',
        date: new Date('2026-09-21'),
        hoursRun: 2.5,
        fuelConsumedLiters: 10,
        fuelExpense: 1000,
        maintenanceExpense: 200,
        totalExpense: 1200,
        operatorName: 'Murugan P.',
        activityType: 'Harrowing / Rotavation',
        notes: 'Soil pulverized and leveled.'
      },
      {
        farmId: farm1._id,
        machineryId: machDrone._id,
        machineryName: 'DJI Agras T40 Drone Sprayer',
        cropId: crop1._id,
        cropName: 'Sunflower',
        fieldName: 'Field 1',
        date: new Date('2026-10-03'),
        hoursRun: 1.0,
        fuelConsumedLiters: 0,
        fuelExpense: 200, // Battery recharge power cost
        maintenanceExpense: 300,
        totalExpense: 500,
        operatorName: 'Certified Drone Pilot',
        activityType: 'Spraying',
        notes: 'Uniform foliar coverage over 3.5 acres in 22 minutes.'
      }
    ]); // 1800 + 1200 + 500 = 3500

    // 8. Create the exact Budget from user requirement:
    // Category    Planned    Actual
    // Water       ₹2,000     ₹2,500 (Exceeded! Highlight)
    // Fertilizer  ₹5,000     ₹4,500
    // Labour      ₹8,000     ₹7,500
    // Machinery   ₹3,000     ₹3,500 (Exceeded! Highlight)
    // Total       ₹18,000    ₹18,000
    await Budget.create({
      farmId: farm1._id,
      season: 'Kharif 2026',
      year: 2026,
      cropName: 'Sunflower (Field 1 - North Section)',
      categories: [
        {
          category: 'Water',
          planned: 2000,
          actual: 2500,
          notes: 'Excess borewell pumping due to valve leakage in Week 4.'
        },
        {
          category: 'Fertilizer',
          planned: 5000,
          actual: 4500,
          notes: 'Basal NPK and Urea applied efficiently within target.'
        },
        {
          category: 'Labour',
          planned: 8000,
          actual: 7500,
          notes: 'Weeding, spraying and irrigation attendance wages.'
        },
        {
          category: 'Machinery',
          planned: 3000,
          actual: 3500,
          notes: 'Extra rotavator pass required due to heavy soil compaction.'
        }
      ],
      totalPlanned: 18000,
      totalActual: 18000,
      status: 'Active',
      notes: 'Cultivation budget for Kharif season 2026. Water and Machinery exceeded planned allocation and are highlighted on the dashboard.'
    });

    // 9. Soil and Nutrients Management report matching the user's mockup image!
    // Sunflower | Oilseed Crops
    // Soil Ph: 6.5 (0 to 14)
    // Soil EC Level: 0.5 ds/m (<1 ds/m)
    // Organic Carbon: 0.8 (0.5 to 0.75%)
    // Nitrogen (N): 240 (280 to 560 kg/ha)
    // Phosphorous (P): 12 (22.5 to 56 kg/ha)
    // Potassium (K): 200 (120 to 280 kg/ha)
    await SoilReport.create({
      farmId: farm1._id,
      fieldName: 'Field 1 - North Section',
      presentCrop: 'Sunflower',
      cropCategory: 'Oilseed Crops',
      testDate: new Date('2026-09-15'),
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
          suggestedFertilizer: 'Apply Neem-Coated Urea (85 kg/ha) in split doses during vegetative growth.',
          priority: 'High'
        },
        {
          nutrient: 'Phosphorous (P)',
          deficiencyLevel: 'Deficit by 10.5 kg/ha',
          suggestedFertilizer: 'Apply Single Super Phosphate (SSP) or DAP prior to flowering for strong head development.',
          priority: 'High'
        },
        {
          nutrient: 'Potassium (K)',
          deficiencyLevel: 'Within Optimal Range (200 kg/ha)',
          suggestedFertilizer: 'Continue standard maintenance dose with Muriate of Potash (MOP) during seed filling.',
          priority: 'Low'
        }
      ]
    });

    console.log('SmartFarm database successfully seeded with realistic farm data and Budget vs Actual analysis figures!');
    return { success: true, message: 'Database seeded successfully' };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};
