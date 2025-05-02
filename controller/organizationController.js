import Organization from "../models/organization.js";
import ErrorResponse from "../utils/errorResponse.js";

export const createOrganization = async (req, res, next) => {
  try {
    const { name, location } = req.body;
    const org = new Organization({ name, location });
    await org.save();
    res.status(201).json(org);
  } catch (err) {
    next(err);
  }
};

export const getOrganizations = async (req, res, next) => {
  try {
    const orgs = await Organization.find();
    res.json(orgs);
  } catch (err) {
    next(err);
  }
};

export const getOrganizationById = async (req, res, next) => {
  try {
    const org = await Organization.findById(req.params.id);
    if (!org) return next(new ErrorResponse("Not found", 404));
    res.json(org);
  } catch (err) {
    next(err);
  }
};

export const updateOrganization = async (req, res, next) => {
  try {
    const updated = await Organization.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteOrganization = async (req, res, next) => {
  try {
    await Organization.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
