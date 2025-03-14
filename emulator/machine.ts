import Assembler from './assembler'
import CPU from './cpu';
import Memory from './memory';

export default class Machine {
  // flags
  public assembled: boolean = false
  public halted: boolean = false
  public interrupted: boolean = false
  public loaded: boolean = false
  public running: boolean = false

  // components
  public assembler: Assembler
  public memory: Memory
  public cpu: CPU

  constructor() {
    this.reset()

    this.assembler = new Assembler();
    this.memory = new Memory();
    this.cpu = new CPU(this.memory);
  }

  reset() {
    this.assembled = false
    this.halted = false
    this.interrupted = false
    this.loaded = false
    this.running = false

    // FIXME: why arent these functions defined ?
    // this.assembler.reset();
    // this.memory.reset();
    // this.cpu.reset();
  }

  assemble(src: string) {
    console.log("assemble")
  }

  stop() {
    console.log("stop")
  }

  run() {
    console.log("run")
  }

  step() {
    console.log("step")
  }
}