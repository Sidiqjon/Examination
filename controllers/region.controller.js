import Region from "../models/region.model.js";
import { updateRegionValidation } from "../validations/region.validation.js";

async function findAll(req, res) {
  try {
    let allRegions = await Region.findAll();
    if (!allRegions.length) {
      return res.status(404).json({ error: "No regions found" });
    }
    res.send({ data: allRegions });
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
}
async function findOne(req, res) {
  try {
    let id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID format" });

    let region = await Region.findOne({ where: { id } });
    if (!region) {
      return res.status(404).json({ error: "Region Not Found" });
    }

    res.send({ data: region });
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
}

async function create(req, res) {
  try {
    const { error, value } = updateRegionValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    let check = await Region.findOne({ where: { name: value.name } });
    if (check) return res.status(400).json({ error: "Region already exists" });

    await Region.create(value);
    res.status(201).send({ message: "Region Created Successfully" });
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
}

async function update(req, res) {
  try {
    let id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID format" });

    let region = await Region.findOne({ where: { id } });
    if (!region) {
      return res.status(404).json({ error: "Region Not Found" });
    }

    const { error, value } = updateRegionValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    await Region.update(value, { where: { id } });
    res.send({ message: "Region Updated Successfully" });
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
}

async function remove(req, res) {
  try {
    let id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID format" });

    let region = await Region.findOne({ where: { id } });
    if (!region) {
      return res.status(404).json({ error: "Region Not Found" });
    }

    await Region.destroy({ where: { id } });
    res.send({ message: "Region Deleted Successfully" });
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
}

async function Search(req, res) {
  try {
    let { filter, sort, page = 1, limit = 10 } = req.query;
    let queryOptions = {};
    const offset = (page - 1) * limit;
    queryOptions.limit = parseInt(limit);
    queryOptions.offset = offset;

    if (filter) {
      try {
        queryOptions.where = JSON.parse(filter);
      } catch (e) {
        return res.status(400).json({ error: "Invalid filter format" });
      }
    }

    if (sort) {
      try {
        queryOptions.order = [JSON.parse(sort)];
      } catch (e) {
        return res.status(400).json({ error: "Invalid sort format" });
      }
    }

    let { rows: allRegions, count: totalCount } = await Region.findAndCountAll(queryOptions);
    const totalPages = Math.ceil(totalCount / limit);

    res.send({
      data: allRegions,
      pagination: {
        totalCount,
        totalPages,
        currentPage: parseInt(page),
        pageSize: parseInt(limit),
      },
    });
  } catch (e) {
    res.status(500).send({ error: "Internal Server Error" });
  }
}

export { findAll, Search, findOne, create, update, remove };
