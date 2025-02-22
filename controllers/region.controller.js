import Region from "../models/region.model.js";
import { RegionValidation, RegionPatchValidation } from "../validations/region.validation.js";
import { Op } from "sequelize";

async function findAll(req, res) {
  try {
    let allRegions = await Region.findAll();
    if (!allRegions.length) {
      return res.status(404).json({ error: "Regions Not Found!" });
    }
    res.status(200).send({ data: allRegions });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
}
async function findOne(req, res) {
  try {
    let id = Number(req.params.id);

    let region = await Region.findOne({ where: { id } });
    if (!region) {
      return res.status(404).json({ error: "Region Not Found" });
    }

    res.status(200).send({ data: region });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
}

async function create(req, res) {
  try {
    const { error, value } = RegionValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    let check = await Region.findOne({ where: { name: value.name } });
    if (check) return res.status(409).json({ error: "Region with this name already exists" });

    let newRegion = await Region.create(value);

    if (!newRegion) {
      return res.status(400).json({ error: "Region Not Created.Please try again" });
    }
    res.status(201).send({ message: "Region Created Successfully", data: newRegion });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
}

async function update(req, res) {
  try {
    let id = Number(req.params.id);

    let region = await Region.findOne({ where: { id } });
    if (!region) {
      return res.status(404).json({ error: "Region Not Found" });
    }

    const { error, value } = RegionPatchValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    await Region.update(value, { where: { id } });
    res.send({ message: "Region Updated Successfully" });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
}

async function remove(req, res) {
  try {
    let id = Number(req.params.id);

    let region = await Region.findOne({ where: { id } });
    if (!region) {
      return res.status(404).json({ error: "Region Not Found" });
    }

    await Region.destroy({ where: { id } });

    res.status(200).send({ message: "Region Deleted Successfully", data: region });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
}

async function Search(req, res) {
  try {
    let { page, take } = req.query;

    if (page || take) {
      page = parseInt(page, 10) || 1;
      take = parseInt(take, 10) || 10;

      let offset = (page - 1) * take;
      let regions = await Region.findAndCountAll({
        limit: take,
        offset: offset,
        include: {all: true}});

      if (regions.rows.length == 0) {
        return res.status(404).json({ error: "Regions Pages Not Found" });
      }

      return res.status(200).json({
        totalItems: regions.count,
        totalPages: Math.ceil(regions.count / take),
        currentPage: page,
        data: regions.rows,
      });
    }

    let query = req.query;
    let conditions = {};
    let order = [];

    Object.keys(query).forEach((key) => {
      if (key !== "sortField" && key !== "sortOrder") {
        conditions[key] = {
          [Op.like]: `%${query[key]}%`,
        };
      }
    });

    if (query.sortField && query.sortOrder) {
      const sortField = query.sortField;
      const sortOrder =
        query.sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";
      order.push([sortField, sortOrder]);
    }

    let results = await Region.findAll({
      where: conditions,
      order: order.length > 0 ? order : [["id", "ASC"]],
      include: {all: true},
    });
    
    if (results.length > 0) {
      return res.status(200).json({ data: results });
    }

    return res.status(404).json({ error: "Region Not Found" });

  } catch (e) {
    res.status(500).send({ error: e.message });
  }
}

export { findAll, Search, findOne, create, update, remove };

