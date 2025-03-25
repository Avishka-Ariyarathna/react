import { pool } from "../config/db.js";

const getAllProduction = async () => {
  const query = "SELECT * FROM production ORDER BY date DESC";
  const [rows] = await pool.execute(query);
  return rows;
};

const addProduction = async (data) => {
  const query = `
    INSERT INTO production (
      date, Ceb, Leco, Ceb_Covers, Leco_Covers, Base, 
      Shutters, Pc_kg, Cover_Beading, Shutter_Beading, 
      Springs, Corrugated_Boxes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    data.date,
    data.Ceb,
    data.Leco,
    data.Ceb_Covers,
    data.Leco_Covers,
    data.Base,
    data.Shutters,
    data.Pc_kg,
    data.Cover_Beading,
    data.Shutter_Beading,
    data.Springs,
    data.Corrugated_Boxes,
  ];
  const [result] = await pool.execute(query, values);
  return result;
};

const deleteProduction = async (id) => {
  const query = "DELETE FROM production WHERE id = ?";
  const [result] = await pool.execute(query, [id]);
  return result;
};

export default { getAllProduction, addProduction, deleteProduction };
