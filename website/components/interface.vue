<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <div class="btn-toolbar" role="toolbar">
        <div class="btn-group mr-2" role="group">
          <button @click="machine.assemble" class="btn btn-primary" :disabled="machine.running">
            assemble
          </button>
          <button @click="machine.reset" class="btn btn-primary" :disabled="!machine.assembled || machine.running">
            reset
          </button>
        </div>
        
        <div class="btn-group mr-2" role="group">
          <button @click="machine.stop" class="btn btn-primary" :disabled="!machine.running">
            stop
          </button>
          <button @click="machine.run" class="btn btn-primary" :disabled="!machine.assembled || machine.halted || machine.interrupted">
            run
          </button>
          <button @click="machine.step" class="btn btn-primary" :disabled="!machine.assembled || machine.halted || machine.interrupted">
            step
          </button>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
  export default {
    props: {
      machine: { type: Object, required: true },
    }
  };
</script>