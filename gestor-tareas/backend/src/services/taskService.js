function createTaskService(taskRepository) {
  return {
    list() {
      return taskRepository.list();
    },

    create(payload) {
      return taskRepository.create(payload);
    },

    update(id, payload) {
      return taskRepository.update(id, payload);
    },

    remove(id) {
      return taskRepository.remove(id);
    },
  };
}

module.exports = { createTaskService };

