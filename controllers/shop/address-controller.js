const addressModel = require("../../models/addressModel");

//Add Address
const addAddress = async (req, res) => {
  try {
    const { userId, address, city, pincode, phone, notes } = req.body;

    if ((!userId, !address, !city, !pincode, !phone, !notes)) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }
    const newAddress = new addressModel({
      userId,
      address,
      city,
      pincode,
      notes,
      phone,
    });

    await newAddress.save();
    if (newAddress) {
      res.status(201).json({
        success: true,
        message: "Address created successfully",
        data: newAddress,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

//Fetch Address
const fetchAddress = async (req, res) => {
  try {
    // Log the incoming userId

    const { userId } = req.params;

    // Check if userId is missing
    if (!userId) {
      console.log("userId is missing or incorrect");
      return res.status(400).json({
        success: false,
        message: "userId not found or incorrect!",
      });
    }

    // Query the database
    const addressList = await addressModel.find({ userId });

    // Log the database result
    console.log("Fetched address list:", addressList);

    // Send the response
    return res.status(200).json({
      success: true,
      message: "Address fetched successfully",
      data: addressList,
    });
  } catch (err) {
    // Log any errors
    console.error("Error fetching address:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching addresses.",
    });
  }
};

//Edit Address
const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const formData = req.body;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User and address id is required",
      });
    }

    const address = await addressModel.findByIdAndUpdate(
      {
        _id: addressId,
        userId,
      },
      formData,
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "successfully Edited",
      data: address,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

//Delete Address
const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    if (!userId || !addressId) {
      res.status(400).json({
        success: false,
        message: "Invalid userID or address",
      });
    }

    const deleteAddress = await addressModel.findOneAndDelete({
      _id: addressId,
      userId,
    });
    if (!deleteAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found or already deleted",
      });
    }

    res.status(200).json({
      success: true,
      data: deleteAddress,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = { addAddress, fetchAddress, editAddress, deleteAddress };
