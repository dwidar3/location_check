import Employee from "../models/employee.js";
import Organization from "../models/organization.js";
import ErrorResponse from "../utils/errorResponse.js";

export const createEmployee = async (req, res, next) => {
  try {
    const { name, organization } = req.body;
    if (!name || !organization) {
      return next(new ErrorResponse("Name and organization are required", 400));
    }
    const employee = await Employee.create({ name, organization });
    const org = await Organization.findById(organization);
    if (!org) return next(new ErrorResponse("Organization not found", 404));
    org.employees.push(employee._id);
    await org.save();
    employee.organization = org._id; // Update the employee's organization reference
    await employee.save(); // Save the employee again to update the reference
    res.status(201).json(employee);
  } catch (error) {
    next(error);
  }
};

export const getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().populate("organization");
    res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
};

export const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id).populate("organization");
    if (!employee) return next(new ErrorResponse("Employee not found", 404));
    res.status(200).json(employee);
  } catch (error) {
    next(error);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const { name, organization } = req.body;
    const updated = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, organization },
      { new: true, runValidators: true }
    );
    if (!updated) return next(new ErrorResponse("Employee not found", 404));
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteEmployee = async (req, res, next) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) return next(new ErrorResponse("Employee not found", 404));
    res.status(200).json({ message: "Employee deleted" });
  } catch (error) {
    next(error);
  }
};
