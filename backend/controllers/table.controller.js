import Table from "../models/table.model.js";
import { nanoid } from "nanoid";

// ! Warning here are some bugs that is edit and get means u can edit even in development once u save then it cant edit only in Ui means in postMan ya so
//  ! Some of the chages are also needed to be done
export const handleCreatedNewTable = async (req, res) => {
  try {
    // const tableId = nanoid(10);
    const { year, branch, data, tableId } = req.body;
    const existingTable = await Table.findOne({ tableId });
    if (existingTable) {
      return res.status(400).json({ message: "This table exist", flag: false });
    }
    const createNewTable = await Table.create({
      tableId,
      year,
      branch,
      data,
    });
    return res
      .status(200)
      .json({
        message: "data form has been created",
        flag: true,
        createNewTable,
      });
  } catch (error) {
    console.log("Error in createdNewBranch", error);
    return res.status(500).json("Internal server error ");
  }
};
export const getTable = async (req, res) => {
  try {
    const { tableId } = req.body;

    // If tableId is provided, fetch specific table
    if (tableId) {
      const table = await Table.findOne({ tableId })

      if (!table) {
        return res.status(404).json({
          message: "Table not found",
          flag: false,
        });
      }

      return res.status(200).json({
        message: "Table data fetched successfully",
        data: table,
        flag: true,
      });
    }

    // If no tableId provided, fetch all tables (for admin overview)
    const tableShownToAdmin = await Table.find().select(
      "tableId year branch isPending data.rollNo data.firstName data.lastName data.email data.techerAssignedEmail",
    );

    return res.status(200).json({
      message: "All tables fetched successfully",
      data: tableShownToAdmin,
      flag: true,
    });
  } catch (error) {
    console.log("Error in getTable ", error);
    return res.status(500).json({
      message: "Internal server error",
      flag: false,
    });
  }
};

export const editTable = async (req, res) => {
  try {
    const { tableId, ...updatedFields } = req.body;

    const existingTable = await Table.findOne({ tableId });
    if (!existingTable) {
      return res.status(404).json({
        message: " not found such table ",
        flag: false,
      });
    }

    let isChanged = false;

    for (let key in updatedFields) {
      if (
        updatedFields[key] !== undefined &&
        existingTable[key] != updatedFields[key]
      ) {
        existingTable[key] = updatedFields[key];
        isChanged = true;
      }
    }

    if (!isChanged) {
      return res.status(200).json({
        message: "No changes detected",
        flag: false,
      });
    }

    await existingTable.save();

    return res.status(200).json({
      message: "Table updated successfully",
      flag: true,
      data: existingTable,
    });
  } catch (error) {
    console.error("Error in editExistingStudent controller:", error.message);
    return res.status(500).json({
      message: "Internal server error",
      flag: false,
    });
  }
};

export const deleteExistingTable = async (req, res) => {
  try {
    const { tableId } = req.body;

    if (!tableId) {
      return res.status(400).json({
        message: "TableId is required",
        flag: false,
      });
    }
    const deletedTable = await Table.findOneAndDelete({ tableId });

    return res.status(200).json({
      message: "Table deleted successfully",
      flag: true,
      data: deletedStudent,
    });
  } catch (error) {
    console.error("Error in deleteExistingStudent controller:", error);
    return res.status(500).json({
      message: "Internal server error",
      flag: false,
    });
  }
};
