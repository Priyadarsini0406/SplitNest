const Property = require(
  "../models/property.model"
);

/**
 * Get all owner properties
 * Supports:
 * search
 * status
 * area
 */
const getProperties = async ({
  ownerId,
  search,
  status,
  area
}) => {
  const filter = {
    ownerId
  };

  if (status && status !== "All") {
    filter.status = status;
  }

  if (area && area !== "All") {
    filter.area = area;
  }

  if (search) {
    filter.$or = [
      {
        name: {
          $regex: search,
          $options: "i"
        }
      },
      {
        area: {
          $regex: search,
          $options: "i"
        }
      },
      {
        type: {
          $regex: search,
          $options: "i"
        }
      }
    ];
  }

  return Property.find(filter).sort({
    createdAt: -1
  });
};

const getPropertyById = async (
  propertyId,
  ownerId
) => {
  return Property.findOne({
    _id: propertyId,
    ownerId
  });
};

const createProperty = async (
  propertyData
) => {
  return Property.create(propertyData);
};

const updateProperty = async (
  propertyId,
  ownerId,
  updateData
) => {
  return Property.findOneAndUpdate(
    {
      _id: propertyId,
      ownerId
    },
    updateData,
    {
      new: true,
      runValidators: true
    }
  );
};

const deleteProperty = async (
  propertyId,
  ownerId
) => {
  return Property.findOneAndDelete({
    _id: propertyId,
    ownerId
  });
};

const updatePropertyStatus = async (
  propertyId,
  ownerId,
  status
) => {
  return Property.findOneAndUpdate(
    {
      _id: propertyId,
      ownerId
    },
    {
      status
    },
    {
      new: true,
      runValidators: true
    }
  );
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  updatePropertyStatus
};