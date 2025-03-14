<script setup>
import { reactive } from 'vue';

import EditorCompenent from './components/editor.vue';
import InterfaceCompenent from './components/interface.vue';
import MemoryCompenent from './components/memory.vue';
import RegistersCompenent from './components/registers.vue';

import Machine from '@/machine.js';
let machine = reactive(new Machine());
</script>

<template>
  <main>
    <InterfaceCompenent
      v-bind:machine="machine"
    ></InterfaceCompenent>
    <EditorCompenent
    ></EditorCompenent>
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

<style scoped>
</style>