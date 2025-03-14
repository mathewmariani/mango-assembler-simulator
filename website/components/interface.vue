<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <div class="btn-toolbar" role="toolbar">
        <div class="btn-group mr-2" role="group">
          <button @click="assemble" class="btn btn-primary btn-sm" :disabled="machine.running">
            assemble
          </button>
          <button @click="reset" class="btn btn-primary btn-sm" :disabled="!machine.assembled || machine.running">
            reset
          </button>
        </div>
        
        <div class="btn-group mr-2" role="group">
          <button @click="stop" class="btn btn-primary btn-sm" :disabled="!machine.running">
            stop
          </button>
          <button @click="run" class="btn btn-primary btn-sm" :disabled="!machine.assembled || machine.halted || machine.interrupted">
            run
          </button>
          <button @click="step" class="btn btn-primary btn-sm" :disabled="!machine.assembled || machine.halted || machine.interrupted">
            step
          </button>
        </div>
      </div>
    </li>
  </ul>
  <div id="editor" class="border"></div>
</template>

<script>
  export default {
    props: {
      machine: { type: Object, required: true },
    },
    emits: ['assemble', 'stop', 'run', 'step'],
    data: () => ({
      editor: null,
    }),
    mounted() {
      const str = `
        # count to 10
        MOV A, 0xA
        CALL loop
        HLT
        loop:
        DEC A
        CMP A, 0x0
        JNZ loop
        RET`

      this.editor = window.ace.edit("editor");
      this.editor.setOption("firstLineNumber", 1);
      this.editor.setHighlightActiveLine(true);
      this.editor.setValue(str, 1);
      this.editor.setTheme("ace/theme/tomorrow_night");
    },
    methods: {
      assemble() {
        const src = this.editor ? this.editor.getValue() : '';
        this.$emit('assemble', src);
      },
      reset() { this.$emit('reset'); },
      stop() { this.$emit('stop'); },
      run() { this.$emit('run'); },
      step() { this.$emit('step'); }
    }    
  };
</script>

<style scoped>
  #editor {
    display: block;
    height: 260px;
    width: 100%;
    margin-bottom: 1rem;
  }
</style>