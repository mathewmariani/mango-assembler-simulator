<template>
    <div class="tab-pane active" id="memory" role="tabpanel">
        <div class="table-responsive">
                <table class="table table-sm table-bordered table-striped">
                <tbody class="text-center">
                    <tr>
                        <th></th>
                        <th v-for="(_, index) in [].constructor(16)" v-bind:key="index">
                            +{{ toHex(index, 2) }}
                        </th>
                    </tr>
                    <!-- Iterate over memory in chunks of 16 -->
                    <tr v-for="(row, rowIndex) in chunkedMemory" :key="rowIndex">
                        <th>{{ toHex(rowIndex * 16, 2) }}</th>
                        <td
                            v-for="(value, colIndex) in row"
                            :key="colIndex"
                            :class="{
                            'table-warning': (rowIndex * 16 + colIndex) === mar,
                            'table-success': (rowIndex * 16 + colIndex) === pc
                            }"
                        >
                            {{ toHex(value, 2) }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
  
<script>
  export default {
    props: {
      memory: { type: Array, required: true },
      pc: { type: Number, required: true },
      mar: { type: Number, required: true },
    },
    computed: {
      // Chunk the memory array into rows of 16 elements
      chunkedMemory() {
        let chunked = [];
        for (let i = 0; i < this.memory.length; i += 16) {
          chunked.push(this.memory.slice(i, i + 16));
        }
        return chunked;
      }
    },
    methods: {
      toHex(value, fixed) {
        let val = Number(value).toString(16).toUpperCase();
        while (val.length < fixed) {
          val = '0' + val;
        }
        return val;
      }
    }
  };
</script>