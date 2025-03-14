<template>
  <main>
    <InterfaceCompenent
      v-bind:machine="machine"
    ></InterfaceCompenent>
    <RegistersCompenent
      v-bind:cpu="machine.cpu"
    ></RegistersCompenent>
    <MemoryCompenent
      v-bind:memory="machine.memory.data"
      v-bind:pc="machine.cpu.pc"
      v-bind:mar="machine.cpu.mar"
    ></MemoryCompenent>
  </main>
</template>

<script>
  import { reactive } from 'vue';

  import InterfaceCompenent from './components/interface.vue';
  import MemoryCompenent from './components/memory.vue';
  import RegistersCompenent from './components/registers.vue';
  import Machine from '@/machine.js';

  export default {
    components: { InterfaceCompenent, MemoryCompenent, RegistersCompenent },
    setup() {
      let machine = reactive(new Machine());
      return { machine };
    }
  };
</script>

<style scoped>
</style>