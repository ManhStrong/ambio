import db from "../../models";
import moment from "moment";
class BaseModel {
  constructor(model) {
    this.model = model;
  }
  async findByConditions(
    conditions,
    attributes = null,
    { transaction = null } = {}
  ) {
    try {
      const result = await db[this.model].findOne({
        where: conditions,
        attributes: attributes,
        transaction,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findOrCreate(conditions, defaults = {}, { transaction = null } = {}) {
    try {
      const [result, created] = await db[this.model].findOrCreate({
        where: conditions,
        defaults,
        transaction,
      });

      return { result, created };
    } catch (error) {
      throw error;
    }
  }

  async createRecord(data, { transaction = null } = {}) {
    try {
      const result = await db[this.model].create(data, { transaction });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateRecord(data, conditions, { transaction = null } = {}) {
    try {
      const result = await db[this.model].update(data, {
        where: conditions,
        transaction,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async destroyRecord(conditions, { transaction = null } = {}) {
    try {
      const result = await db[this.model].destroy({
        where: conditions,
        transaction,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findAll(conditions, attributes = null) {
    try {
      const result = await db[this.model].findAll({
        where: conditions,
        attributes: attributes,
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
}
export default BaseModel;
