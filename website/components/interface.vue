<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <div class="btn-toolbar" role="toolbar">
        <div class="btn-group mr-2" role="group">
          <button @click="emit('assemble')" class="btn btn-primary" :disabled="machine.running">
            assemble
          </button>
          <button @click="emit('reset')" class="btn btn-primary" :disabled="!machine.assembled || machine.running">
            reset
          </button>
        </div>
        
        <div class="btn-group mr-2" role="group">
          <button @click="emit('stop')" class="btn btn-primary" :disabled="!machine.running">
            stop
          </button>
          <button @click="emit('run')" class="btn btn-primary" :disabled="!machine.assembled || machine.halted || machine.interrupted">
            run
          </button>
          <button @click="emit('step')" class="btn btn-primary" :disabled="!machine.assembled || machine.halted || machine.interrupted">
            step
          </button>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup>
  import { ref, defineProps, defineEmits } from 'vue';

  const props = defineProps({
    machine: Object,
  });

  const emit = defineEmits([
    'assemble', 'reset', 'stop', 'run', 'delay', 'filter', 'trash', 'settle', 'step'
  ]);
</script>