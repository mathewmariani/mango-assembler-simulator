
<template>
    <table class="table table-sm table-bordered table-striped">
        <thead class="text-center">
            <tr>
                <th>GPR[0]</th>
                <th>GPR[1]</th>
                <th>GPR[2]</th>
                <th>GPR[3]</th>
                <th class="table-pc">PC</th>
                <th class="table-sp">SP</th>
                <th class="table-mar">MAR</th>
                <th>MBR</th>
                <th>IR</th>
            </tr>
        </thead>
        <tbody class="text-center">
            <tr>
                <td>{{ cpu.gpr[0] }}</td>
                <td>{{ cpu.gpr[1] }}</td>
                <td>{{ cpu.gpr[2] }}</td>
                <td>{{ cpu.gpr[3] }}</td>
                <td>{{ cpu.pc }}</td>
                <td>{{ cpu.sp }}</td>
                <td>{{ cpu.mar }}</td>
                <td>{{ cpu.mbr }}</td>
                <td>{{ cpu.ir }}</td>
            </tr>
        </tbody>
    </table>
    <table class="table table-sm table-bordered table-striped">
        <thead class="text-center">
            <tr>
                <th>Status</th>
                <th>Carry</th>
                <th>Zero</th>
                <th>Overflow</th>
                <th>Negative</th>
                <th>Halt</th>
            </tr>
        </thead>
        <tbody class="text-center">
            <tr>
                <td>{{ cpu.status.toString(2).padStart(8, '0') }}</td>
                <td>{{ cpu.carry ? 'True' : 'False' }}</td>
                <td>{{ cpu.zero ? 'True' : 'False' }}</td>
                <td>{{ cpu.overflow ? 'True' : 'False' }}</td>
                <td>{{ cpu.negative ? 'True' : 'False' }}</td>
                <td>{{ cpu.halt ? 'True' : 'False' }}</td>
            </tr>
        </tbody>
    </table>
</template>
    
<script>
    export default {
        props: {
            cpu: { type: Object, required: true },
        }
    }
</script>