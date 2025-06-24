import Guidance from '../model/guidanceModel.js';

export const createGuidance = async (req, res) => {
  try {
    const {
      guidanceTitle,
      category,
      priorityLevel,
      description,
      targetAnimals,
      detailedContent,
      recommendations,
      precautions
    } = req.body;

    const newGuidance = new Guidance({
      guidanceTitle,
      category,
      priorityLevel,
      description,
      targetAnimals,
      detailedContent,
      recommendations,
      precautions
    });

    const savedGuidance = await newGuidance.save();

    res.status(201).json({
      success: true,
      message: 'Guidance created successfully',
      data: savedGuidance
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create guidance',
      error: error.message
    });
  }
};


export const getAllGuidance = async (req, res) => {
  try {
    const guidanceList = await Guidance.find().sort({ createdAt: -1 }); // most recent first
    res.status(200).json({
      success: true,
      data: guidanceList
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve guidance list',
      error: error.message
    });
  }
};