<template>
  <main>
    <InterfaceCompenent
      v-bind:machine="machine"
      @assemble="assemble"
      @reset="reset"
      @stop="stop"
      @run="run"
      @step="step"
    ></InterfaceCompenent>
    <RegistersCompenent
      v-bind:cpu="cpu"
    ></RegistersCompenent>
    <MemoryCompenent
      v-bind:memory="memory.data"
      v-bind:pc="cpu.pc"
      v-bind:mar="cpu.mar"
      v-bind:sp="cpu.sp"
    ></MemoryCompenent>
  </main>
</template>

<script>
  import { reactive } from 'vue';

  import InterfaceCompenent from './components/interface.vue';
  import MemoryCompenent from './components/memory.vue';
  import RegistersCompenent from './components/registers.vue';
  
  import Assembler from '@/assembler.js';
  import CPU from '@/cpu.js';
  import Memory from '@/memory.js';
  

  export default {
    components: { InterfaceCompenent, MemoryCompenent, RegistersCompenent },
    setup() {
      let memory = reactive(new Memory());
      let cpu = reactive(new CPU(memory));
      let assembler = new Assembler();

      let machine = {
        assembled: false,
        halted: false,
        interrupted: false,
        loaded: false,
        running: false,
      };

      return { assembler, cpu, machine, memory };
    },
    methods: {
      assemble(src) {
        this.assembler.assemble(src);
        this.assembler.code.forEach((b, i) => {
          this.memory.write(i, b);
        });
      },
      reset() {
        this.assembler.reset()
        this.memory.reset()
        this.cpu.reset()
      },
      stop() {
        this.cpu.reset()
      },
      run() {
        console.log("run");
      },
      step() {
        this.cpu.fetch()
        this.cpu.execute()
      }
    }
  };
</script>

<style src="./assets/global.css"></style>