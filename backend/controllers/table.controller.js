import Table from "../models/table.model.js";
import User from "../models/user.models.js";
import nanoId from "nanoid"

 

export const handleCreatedNewTable   = async (req, res) => {
  try {
    const tableId = nanoId(10);
    const { year , branch , totalStudents , data } = req.body 
    const createNewTable = new Table.create({
      tableId ,
      totalStudents ,
      year , 
      branch ,
      data 
    })
    return res.status(200).json({message : "data form has been created" , flag : true })
  } catch (error) {
    console.log("Error in createdNewBranch" , error)
    return res.status(500).json("Internal server error ")
  }
}

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
        message: "rollNo is required",
        flag: false,
      });
    }

    const deletedTable = await Table.findOneAndDelete({ tableId });

    if (!deletedTable) {
      return res.status(404).json({
        message: "Table not found",
        flag: false,
      });
    }

    return res.status(200).json({
      message: "Student deleted successfully",
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

 
