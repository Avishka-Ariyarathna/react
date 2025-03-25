import ProductionModel from "../models/productionModel.js";

export const getAllProduction = async (req, res) => {
  try {
    const data = await ProductionModel.getAllProduction();
    res.json(data);
  } catch (error) {
    console.error("Error fetching production data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addProduction = async (req, res) => {
  try {
    const {
      date,
      Ceb,
      Leco,
      Ceb_Covers,
      Leco_Covers,
      Base,
      Shutters,
      Pc_kg,
      Cover_Beading,
      Shutter_Beading,
      Springs,
      Corrugated_Boxes,
    } = req.body;

    if (!date || !Ceb || !Leco) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    const result = await ProductionModel.addProduction(req.body);

    if (result.affectedRows > 0) {
      res.status(201).json({
        message: "Production data added successfully",
        id: result.insertId,
      });
    } else {
      res.status(400).json({ message: "Failed to add production data" });
    }
  } catch (error) {
    console.error("Error adding production data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// New delete function
export const deleteProduction = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ProductionModel.deleteProduction(id);

    if (result.affectedRows > 0) {
      res.json({ message: "Production data deleted successfully" });
    } else {
      res.status(404).json({ message: "Record not found" });
    }
  } catch (error) {
    console.error("Error deleting production data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
