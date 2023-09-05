/* eslint-disable no-unused-vars */
const AddThread = require("../../Domains/threads/entities/AddThread");

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(payload, owner) {
    const thread = new AddThread(payload);

    return this._threadRepository.addThread(thread, owner);
  }
}

module.exports = AddThreadUseCase;
