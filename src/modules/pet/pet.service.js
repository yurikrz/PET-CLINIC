import Pet from './pet.model.js';

export class PetService {
  static async create(data) {
    return await Pet.create(data);
  }

  static async findOne(id) {
    return await Pet.findOne({
      where: {
        id,
        status: true,
      },
    });
  }

  static async findAll() {
    return await Pet.findAll({
      where: {
        status: true,
      },
    });
  }

  static async update(pet, data) {
    return await pet.update(data);
  }

  static async delete(pet) {
    return await pet.update({ status: false });
  }
}
