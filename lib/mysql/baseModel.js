import db from "../../models";
import moment from "moment";
export const findByConditions = async (
  model,
  conditions,
  attributes = null,
  { transaction = null } = {}
) => {
  try {
    const result = await db[model].findOne({
      where: conditions,
      attributes: attributes,
      transaction,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const findOrCreate = async (
  model,
  conditions,
  defaults = {},
  { transaction = null } = {}
) => {
  try {
    const [result, created] = await db[model].findOrCreate({
      where: conditions,
      defaults,
      transaction,
    });

    return { result, created };
  } catch (error) {
    throw error;
  }
};

export const createRecord = async (
  model,
  data,
  { transaction = null } = {}
) => {
  try {
    const result = await db[model].create(data, { transaction });
    return result;
  } catch (error) {
    throw error;
  }
};

export const updateRecord = async (
  model,
  data,
  conditions,
  { transaction = null } = {}
) => {
  try {
    const result = await db[model].update(data, {
      where: conditions,
      transaction,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const destroyRecord = async (
  model,
  conditions,
  { transaction = null } = {}
) => {
  try {
    const result = await db[model].destroy({
      where: conditions,
      transaction,
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const findAll = async (model, conditions, attributes = null) => {
  try {
    const result = await db[model].findAll({
      where: conditions,
      attributes: attributes,
    });
    return result;
  } catch (error) {
    throw error;
  }
};
