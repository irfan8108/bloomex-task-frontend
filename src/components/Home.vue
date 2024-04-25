<template>
  <div class="container" style="max-width: 600px">
    <!-- Heading -->
    <h2 class="text-center mt-5"><b>Bloomex</b> Todo App</h2>

    <!-- Input -->
    <div class="d-flex mt-5">
      <input
        type="text"
        v-model="task"
        placeholder="Enter task"
        class="w-100 form-control"
      />
      <button class="btn btn-warning rounded-0" @click="submitTask">
        SUBMIT
      </button>
    </div>

    <!-- Task table -->
    <table class="table table-hover table-bordered mt-2">
      <thead class="table-dark">
        <tr>
          <th scope="col">Task</th>
          <th scope="col" style="width: 120px">Status</th>
          <th scope="col" class="text-center">#</th>
          <th scope="col" class="text-center">#</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(task, index) in tasks" :key="index">
          <td>
            <span :class="{ 'line-through': task.status === 'finished' }">
              {{ capitalizeFirstChar(task.title) }}
            </span>
          </td>
          <td>
            <span
              class="pointer noselect"
              @click="changeStatus(index, task.id)"
              :class="{
                'text-danger': task.status === 'to-do',
                'text-success': task.status === 'finished',
                'text-warning': task.status === 'in-progress',
                'text-secondary': task.status === 'pending',
                'text-info': task.status === 'in-review',
              }"
            >
              {{ capitalizeFirstChar(task.status) }}
            </span>
          </td>
          <td class="text-center">
            <div @click="deleteTask(index, task.id)">
              <span class="fa fa-trash pointer"></span>
            </div>
          </td>
          <td class="text-center">
            <div @click="editTask(index, task.id)">
              <p class="fa fa-pen pointer"></p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="!tasks.length" class="spinner-grow text-dark" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },

  data() {
    return {
      task: "",
      editedTask: null,
      editedTaskId: null,
      statuses: ["to-do", "in-progress", "pending", "in-review", "finished"],
      /* Status could be: 'to-do' / 'in-progress' / 'finished' */
      tasks: [],
    };
  },

  methods: {
    /**
     * Capitalize first character
     */
    capitalizeFirstChar(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * Change status of task by index
     */
    changeStatus(index, id) {
      let newIndex = this.statuses.indexOf(this.tasks[index].status);
      if (++newIndex > 4) newIndex = 0;
      this.tasks[index].status = this.statuses[newIndex];

      axios.patch('tasks/' + id, {
        status: this.tasks[index].status,
        title: this.tasks[index].title
      }).then((response) => {
        console.log(response.data.message)
      });
    },

    /**
     * Deletes task by index
     */
    deleteTask(index, id) {
      if (!confirm("Are you sure?")) {
        return;
      }

      this.tasks.splice(index, 1);

      axios.delete('tasks/' + id)
        .then(
          () => console.log('task deleted')
        ).catch(error => {
          console.error('Error deleting task:', error);
        });

    },

    /**
     * Edit task
     */
    editTask(index, id) {
      this.task = this.tasks[index].title;
      this.editedTask = index;
      this.editedTaskId = id;
    },

    /**
     * Add / Update task
     */
    submitTask() {
      if (this.task.length === 0) return;

      /* We need to update the task */
      if (this.editedTask != null) {
        this.tasks[this.editedTask].title = this.task;
        
        axios.patch('tasks/' + this.editedTaskId, {
          title: this.task,
          status: this.tasks[this.editedTask].status
        }).then(() => {
          this.task = "";
          this.editedTask = null;
        });

      } else {
        /* We need to add new task */
        this.tasks.unshift({
          title: this.task,
          status: "to-do",
        });

        axios.post('tasks', {
          title: this.task
        }).then(() => {
          this.task = "";
          this.getTodos();
        });
      }
    },

    getTodos() {
      console.log('loading all tasks..');
      axios.get('tasks')
        .then(response => {
          this.tasks = response.data.data;
        });
    },

  },

  beforeMount() {
    this.getTodos();
  },

};
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}
.line-through {
  text-decoration: line-through;
}
</style>