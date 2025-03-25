import ProjectSummaryModel from "../models/projectSummaryModel.js";

// Controller to get all project summaries
export const getAllProjectSummaries = async (req, res) => {
  try {
    const data = await ProjectSummaryModel.getAllProjectSummaries();
   
    res.json(data);
  } catch (error) {
    console.error("Error fetching project summaries:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller to update project summary by name
export const updateProjectSummaryByName = async (req, res) => {
  try {
    const { name, status, completionPercentage, lastUpdated } = req.body;
   

    if (!name || !status || !completionPercentage || !lastUpdated) {
      return res.status(400).json({
        message:
          "Name, status, completion percentage, and last updated date are required",
      });
    }

    const result = await ProjectSummaryModel.updateProjectSummaryByName(
      name,
      status,
      completionPercentage,
      lastUpdated
    );
    

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Project summary not found" });
    }

    res.status(200).json({ message: "Project summary updated successfully" });
  } catch (error) {
    console.error("Error updating project summary:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
