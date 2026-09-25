const propertyService = require(
  "../services/property.service"
);

const {
  successResponse,
  errorResponse
} = require("../utils/response");


/*
GET /api/properties
*/
const getProperties = async (
  req,
  res,
  next
) => {
  try {
    const {
      search = "",
      status = "All",
      area = "All"
    } = req.query;

    const properties =
      await propertyService.getProperties({
        ownerId: req.user.id,
        search,
        status,
        area
      });

    return successResponse(
      res,
      200,
      "Properties fetched successfully",
      properties
    );
  } catch (error) {
    next(error);
  }
};


/*
GET /api/properties/:id
*/
const getPropertyById = async (
  req,
  res,
  next
) => {
  try {
    const property =
      await propertyService.getPropertyById(
        req.params.id,
        req.user.id
      );

    if (!property) {
      return errorResponse(
        res,
        404,
        "Property not found"
      );
    }

    return successResponse(
      res,
      200,
      "Property fetched successfully",
      property
    );
  } catch (error) {
    next(error);
  }
};


/*
POST /api/properties
*/
const createProperty = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      area,
      rent,
      deposit,
      type,
      amenities,
      description,
      image,
      sharingOptions,
      totalBeds,
      availableBeds,
      status
    } = req.body;

    if (
      !name ||
      !area ||
      rent === undefined ||
      deposit === undefined ||
      !type
    ) {
      return errorResponse(
        res,
        400,
        "Required property fields are missing"
      );
    }

    const property =
      await propertyService.createProperty({
        ownerId: req.user.id,
        name,
        area,
        rent,
        deposit,
        type,
        amenities: amenities || [],
        description: description || "",
        image: image || "",
        sharingOptions: Array.isArray(sharingOptions) && sharingOptions.length ? sharingOptions : ["double"],
        totalBeds: Number(totalBeds) || 1,
        availableBeds: Number(availableBeds ?? totalBeds) || 1,
        status: status || "Active"
      });

    return successResponse(
      res,
      201,
      "Property created successfully",
      property
    );
  } catch (error) {
    next(error);
  }
};


/*
PUT /api/properties/:id
*/
const updateProperty = async (
  req,
  res,
  next
) => {
  try {
    const property =
      await propertyService.updateProperty(
        req.params.id,
        req.user.id,
        req.body
      );

    if (!property) {
      return errorResponse(
        res,
        404,
        "Property not found"
      );
    }

    return successResponse(
      res,
      200,
      "Property updated successfully",
      property
    );
  } catch (error) {
    next(error);
  }
};


/*
DELETE /api/properties/:id
*/
const deleteProperty = async (
  req,
  res,
  next
) => {
  try {
    const property =
      await propertyService.deleteProperty(
        req.params.id,
        req.user.id
      );

    if (!property) {
      return errorResponse(
        res,
        404,
        "Property not found"
      );
    }

    return successResponse(
      res,
      200,
      "Property deleted successfully"
    );
  } catch (error) {
    next(error);
  }
};


/*
PATCH /api/properties/:id/status
*/
const updatePropertyStatus = async (
  req,
  res,
  next
) => {
  try {
    const { status } = req.body;

    if (
      !["Active", "Inactive"].includes(status)
    ) {
      return errorResponse(
        res,
        400,
        "Status must be Active or Inactive"
      );
    }

    const property =
      await propertyService.updatePropertyStatus(
        req.params.id,
        req.user.id,
        status
      );

    if (!property) {
      return errorResponse(
        res,
        404,
        "Property not found"
      );
    }

    return successResponse(
      res,
      200,
      "Property status updated successfully",
      property
    );
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  updatePropertyStatus
};