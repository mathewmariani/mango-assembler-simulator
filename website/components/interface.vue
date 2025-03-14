<template>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">
      <div class="btn-toolbar" role="toolbar">
        <div class="btn-group mr-2" role="group">
          <button @click="assemble" class="btn btn-primary" :disabled="machine.running">
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
  <div id="editor" class="border"></div>
</template>

<script>
  export default {
    props: {
      machine: { type: Object, required: true },
    },
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
        const str = this.editor ? this.editor.getValue() : '';
        this.machine.assemble(str);
        this.$forceUpdate();
      }

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