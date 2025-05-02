import Attendance from "../models/attend.js";
import Employee from "../models/employee.js";
import Organization from "../models/organization.js";

import ErrorResponse from "../utils/errorResponse.js";
function calculateDistance(coord1, coord2) {
  const [lng1, lat1] = coord1;
  const [lng2, lat2] = coord2;
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371e3;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lng2 - lng1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return d;
}

export const checkin = async (req, res) => {
  try {
    const { employeeId, lat, lng } = req.body;

    const employee = await Employee.findById(employeeId).populate("organization");
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const orgLocation = employee.organization.location.coordinates;
    const userLocation = [parseFloat(lng), parseFloat(lat)];
    const distance = calculateDistance(userLocation, orgLocation);



// later inside your check-in logic:
const withinRange = isWithinRange(location, organization.location);
if (!withinRange) {
  return next(new ErrorResponse("You are not within range to check-in", 400));
}


    if (distance > 100) {
      return res.status(403).json({ message: "Not within range for check-in" });
    }

    const attendance = new Attendance({
      employee: employee._id,
      checkIn: new Date(),
      checkInLocation: {
        type: "Point",
        coordinates: userLocation,
      },
    });

    await attendance.save();
    res.status(201).json({ message: "Check-in successful", attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkout = async (req, res) => {
  try {
    const { employeeId, lat, lng } = req.body;

    const attendance = await Attendance.findOne({
      employee: employeeId,
      checkOut: { $exists: false },
    });

    if (!attendance) return res.status(404).json({ message: "No active check-in found" });

    const now = new Date();
    const duration = Math.round((now - attendance.checkIn) / 60000); // in minutes

    attendance.checkOut = now;
    attendance.duration = duration;
    attendance.checkOutLocation = {
      type: "Point",
      coordinates: [parseFloat(lng), parseFloat(lat)],
    };

    await attendance.save();
    res.status(200).json({ message: "Check-out successful", attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmployeeAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const records = await Attendance.find({ employee: id });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTodayAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const records = await Attendance.find({
      employee: id,
      checkIn: { $gte: start, $lte: end },
    });

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const isWithinRange = async (req, res, next) => {
    const { lat, lng, employeeId } = req.query;  // Get coordinates and employee ID from query
  
    if (!lat || !lng || !employeeId) {
      return next(new ErrorResponse("Missing required parameters", 400));
    }
  
    try {
      // Get the employee's assigned organization
      const organization = await Organization.findOne({ "employees": employeeId });
  
      if (!organization) {
        return next(new ErrorResponse("Organization not found for employee", 404));
      }
  
      // Organization location (GeoJSON format)
      const organizationLocation = organization.location;
  
      // Create a point for the employee's location
      const employeeLocation = {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],  // [longitude, latitude]
      };
  
      // Use MongoDB's $geoWithin and $centerSphere operator to check if the employee's location is within the 100 meters range
      const distance = await Organization.aggregate([
        {
          $geoNear: {
            near: employeeLocation,
            distanceField: "distance",
            spherical: true,
            maxDistance: 100,  // 100 meters in MongoDB's default geo query unit (meters)
            query: { _id: organization._id },  // Filter to the specific organization
          },
        },
      ]);
  
      if (distance.length === 0) {
        return next(new ErrorResponse("Employee is not within the valid range of the organization", 400));
      }
  
      // If we reach here, the employee is within the range
      res.status(200).json({
        success: true,
        message: "Employee is within the valid range for check-in.",
      });
  
    } catch (error) {
      next(error);
    }
  };
