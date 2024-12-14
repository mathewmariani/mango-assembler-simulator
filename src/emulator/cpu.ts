import { ALU, ALUOperationFunction } from './alu'
import Memory from './memory'
import { Opcodes } from './opcodes'

export default class CPU {
  public pc: number
  public sp: number
  public mar: number
  public mbr: number
  public ir: number

  public gpr: Uint8Array

  public status: number
  public zero: boolean
  public carry: boolean
  public overflow: boolean
  public negative: boolean
  public halt: boolean

  public memory: Memory

  // constants
  public readonly maxSP: number = 231;

  constructor(ram: Memory) {
    // reference to memory
    this.memory = ram

    // general-purpose registers
    // can store both data and addresses.
    this.gpr = new Uint8Array(4)

    // special-purpose registers used to hold program state.
    this.pc = 0
    this.sp = this.maxSP

    // registers related to fetching information from memory.

    // memory address register
    // contains the next memory address to be read or written.
    this.mar = 0

    // memory buffer register
    // when reading from memory, data addressed by MAR is fed into the MBR
    this.mbr = 0

    // instruction register
    // holding the instruction currently being executed.
    this.ir = 0

    // status registers hold truth values.
    // often used to determine whether some instruction should or should not be executed.

    // FIXME: status registers should be represented using a single 4-bit register
    this.status = 0x00

    this.carry = false

    // indicates that the result of an arithmetic or logical operation was zero.
    this.zero = false

    // overflow happens when there is a carry into the sign bit but no carry out of the sign bit.
    // in signed arithmetic, watch the overflow flag to detect errors.
    this.overflow = false

    // indicates that the result of a mathematical operation is negative.
    this.negative = false

    // indicates that the cpu has halted.
    this.halt = false
  }

  settle() {
    console.log("[STUBBED] cpu::settle()")
  }

  reset() {
    // general purpose registers
    this.gpr[0] = 0x00
    this.gpr[1] = 0x00
    this.gpr[2] = 0x00
    this.gpr[3] = 0x00

    // special purpose registers
    this.pc = 0x0
    this.sp = this.maxSP

    // memory registers
    this.mar = 0x00
    this.mbr = 0x00
    this.ir = 0x00

    // status registers
    this.status = 0x00
    this.zero = false
    this.carry = false
    this.overflow = false
    this.negative = false
    this.halt = false
  }

  // NOTE: these are the steps the cpu could take are as follows:
  // fetch address operand1
  // fetch address operand2
  // fetch memory operand1
  // fetch memory operand2
  // memory should always be read using the `MAR` and `MBR` registers

  // Register Transfer Language (RTL)
  // A register transfer is indicated using the '←' symbol.
  // eg. R1 ← R2
  // 
  // A conditional statement is represented using a colon ':'
  // eg. Z: R1 ← R2
  // which is effectively the same as saying `if Z then R1 = R2 end`
  //
  // A complex conditional statement is represendted using a comma ','
  // eg. Z: R1 ← R2, R1 ← R3
  // which is effectively the same as saying `if Z then R1 = R2 else R1 = R3 end`


  private fetch_addr_operand() {
    // register transfer language
    // PC ← PC + 1
    // MAR ← PC
    // MBR ← M[MAR]

    this.mar = ++this.pc
    this.mbr = this.memory.read(this.mar)
  }

  private fetch_memory() {
    // register transfer language
    // MAR ← MBR
    // MBR ← M[MAR]

    this.mar = this.mbr
    this.mbr = this.memory.read(this.mar)
  }

  private fetch_memory_from() {
    // register transfer language
    // MAR ← GPR[MBR]
    // MBR ← M[MAR]

    this.mar = this.gpr[this.mbr]
    this.mbr = this.memory.read(this.mar)
  }

  private push_to_stack() {
    // register transfer language
    // MAR ← SP
    // SP ← SP - 1
    // PC ← PC + 1
    // MBR ← PC
    // M[MAR] ← MBR
      
    this.mar = this.sp--
    this.mbr = ++this.pc
    this.memory.write(this.mar, this.mbr)
  }

  private pop_from_stack() {
    // FIXME: 
  }

  private perform_operation(fn: ALUOperationFunction, lhs: number, rhs: number): number {
    // execute
    const result = fn(lhs, rhs)
    this.zero = result.is_zero
    this.overflow = result.is_overflow
    this.negative = result.is_negative
    return result.sum
  }

  fetch() {
    this.mar = this.pc
    this.mbr = this.memory.read(this.mar)
    this.ir = this.mbr
  }

  execute() {
    let temp1 = undefined
    let status = undefined
    switch (this.ir) {
    // empty
    case Opcodes.NONE:
      this.halt = true
      return false
    // mov opcodes
    case Opcodes.MOV_REG_TO_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // GPR[TEMP] ← GPR[MBR]
      // PC ← PC + 1

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.gpr[temp1] = this.gpr[this.mbr]
      ++this.pc
      break
    case Opcodes.MOV_REG_TO_ADDR:
      // FIXME: RTL implementation is wrong
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // M[TEMP] ← GPR[MBR]
      // PC ← PC + 1

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.memory.write(temp1, this.gpr[this.mbr])
      ++this.pc
      break
    case Opcodes.MOV_REG_TO_REGADDR:
      // FIXME: RTL implementation is wrong
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // MAR ← MBR
      // MBR ← GPR[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // M[TEMP] ← GPR[MBR]
      // PC ← PC + 1

      this.fetch_addr_operand()
      this.mar = this.mbr
      this.mbr = this.gpr[this.mar]
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.memory.write(temp1, this.gpr[this.mbr])
      ++this.pc
      break
    case Opcodes.MOV_ADDR_TO_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // MAR ← MBR
      // MBR ← M[MAR]
      // GPR[TEMP] ← MBR
      // PC ← PC + 1

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.fetch_memory()
      this.gpr[temp1] = this.mbr
      ++this.pc
      break
    case Opcodes.MOV_REGADDR_TO_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // MAR ← GPR[MBR]
      // MBR ← M[MAR]
      // GPR[TEMP] ← MBR
      // PC ← PC + 1

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.fetch_memory_from()
      this.gpr[temp1] = this.mbr
      ++this.pc
      break

    case Opcodes.MOV_NUM_TO_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // GPR[TEMP] ← MBR
      // PC ← PC + 1

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.gpr[temp1] = this.mbr
      ++this.pc
      break
    case Opcodes.MOV_NUM_TO_ADDR:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // MAR ← TEMP
      // M[MAR] ← MBR
      // PC ← PC + 1

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.mar = temp1
      this.memory.write(this.mar, this.mbr)
      ++this.pc
      break
    case Opcodes.MOV_NUM_TO_REGADDR:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // MAR] ← GPR[TEMP]
      // M[MAR] ← MBR
      // PC ← PC + 1

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.mar = this.gpr[temp1]
      this.memory.write(this.mar, this.mbr)
      ++this.pc
      break

    // arithmatic opcodes
    // add
    case Opcodes.ADD_REG_TO_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // GPR[TEMP] ← GPR[TEMP] + GPR[MBR]

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.gpr[temp1] = this.perform_operation(ALU.add, this.gpr[temp1], this.gpr[this.mbr])
      ++this.pc
      break
    case Opcodes.ADD_ADDR_TO_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // MAR ← MBR
      // MBR ← M[MAR]
      // GPR[TEMP] ← GPR[TEMP] + MBR

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.fetch_memory()
      this.gpr[temp1] = this.perform_operation(ALU.add, this.gpr[temp1], this.mbr)
      ++this.pc
      break
    case Opcodes.ADD_REGADDR_TO_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // MAR ← GPR[MBR]
      // MBR ← M[MAR]
      // GPR[TEMP] ← GPR[TEMP] + MBR

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.fetch_memory_from()
      this.gpr[temp1] = this.perform_operation(ALU.add, this.gpr[temp1], this.mbr)
      ++this.pc
      break
    case Opcodes.ADD_NUM_TO_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // GPR[TEMP] ← GPR[TEMP] + MBR

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.gpr[temp1] = this.perform_operation(ALU.add, this.gpr[temp1], this.mbr)
      ++this.pc
      break

    // subtract
    case Opcodes.SUBT_REG_FROM_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // GPR[TEMP] ← GPR[TEMP] - GPR[MBR]

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.gpr[temp1] = this.perform_operation(ALU.sub, this.gpr[temp1], this.gpr[this.mbr])
      ++this.pc
      break
    case Opcodes.SUBT_ADDR_FROM_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // MAR ← MBR
      // MBR ← M[MAR]
      // GPR[TEMP] ← GPR[TEMP] - MBR

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.fetch_memory()
      this.gpr[temp1] = this.perform_operation(ALU.sub, this.gpr[temp1], this.mbr)
      ++this.pc
      break
    case Opcodes.SUBT_REGADDR_FROM_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // MAR ← GPR[MBR]
      // MBR ← M[MAR]
      // GPR[TEMP] ← GPR[TEMP] - MBR

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.fetch_memory_from()
      this.gpr[temp1] = this.perform_operation(ALU.sub, this.gpr[temp1], this.mbr)
      ++this.pc
      break
    case Opcodes.SUBT_NUM_FROM_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // GPR[TEMP] ← GPR[TEMP] - MBR

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.gpr[temp1] = this.perform_operation(ALU.sub, this.gpr[temp1], this.mbr)
      ++this.pc
      break

    // increment
    case Opcodes.INC_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // GPR[MBR] ← GPR[MBR] + 1

      this.fetch_addr_operand()
      this.gpr[this.mbr] = this.perform_operation(ALU.add, this.gpr[this.mbr], 1)
      ++this.pc
      break

    // decrement
    case Opcodes.DEC_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // GPR[MBR] ← GPR[MBR] - 1

      this.fetch_addr_operand()
      this.gpr[this.mbr] = this.perform_operation(ALU.sub, this.gpr[this.mbr], 1)
      ++this.pc
      break

    // comparison instructions
    case Opcodes.CMP_REG_TO_REG:
      // FIXME: how do we RTL this?
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.perform_operation(ALU.sub, this.gpr[temp1], this.gpr[this.mbr])
      ++this.pc
      break
    case Opcodes.CMP_ADDR_TO_REG:
      // FIXME: how do we RTL this?
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // MAR ← MBR
      // MBR ← M[MAR]

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.fetch_memory()
      this.perform_operation(ALU.sub, this.gpr[temp1], this.mbr)
      ++this.pc
      break
    case Opcodes.CMP_REGADDR_TO_REG:
      // FIXME: how do we RTL this?
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // MAR ← GPR[MBR]
      // MBR ← M[MAR]

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.fetch_memory_from()
      this.perform_operation(ALU.sub, this.gpr[temp1], this.mbr)
      ++this.pc
      break
    case Opcodes.CMP_NUM_TO_REG:
      // FIXME: how do we RTL this?
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.perform_operation(ALU.sub, this.gpr[temp1], this.mbr)
      ++this.pc
      break

    // jump instructions
    case Opcodes.JMP_ADDR:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // PC ← MBR

      // fetch address of operand1
      this.fetch_addr_operand()
      
      // execute
      this.pc = this.mbr

      break
    case Opcodes.JMP_REGADDR:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // MAR ← GPR[MBR]
      // MBR ← M[MAR]
      // PC ← MBR

      this.fetch_addr_operand()
      this.fetch_memory_from()
      this.pc = this.mbr
      break
    case Opcodes.JC_ADDR:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // Z: PC ← PC + 1, PC ← MBR

      this.fetch_addr_operand()
      this.pc = (this.carry)
        ? this.mbr  
        : this.pc++
      break
    case Opcodes.JC_REGADDR:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // MAR ← GPR[MBR]
      // MBR ← M[MAR]
      // Z: PC ← PC + 1, PC ← MBR

      this.fetch_addr_operand()
      this.fetch_memory_from()
      this.pc = (this.carry)
        ? this.mbr  
        : this.pc++
      break
    case Opcodes.JNC_ADDR:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // Z: PC ← PC + 1, PC ← MBR

      this.fetch_addr_operand()
      this.pc = (!this.carry)
        ? this.mbr  
        : this.pc++
      break
    case Opcodes.JNC_REGADDR:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // MAR ← GPR[MBR]
      // MBR ← M[MAR]
      // Z: PC ← PC + 1, PC ← MBR

      this.fetch_addr_operand()
      this.fetch_memory_from()
      this.pc = (!this.carry)
        ? this.mbr  
        : this.pc++
      break
    case Opcodes.JZ_ADDR:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // Z: PC ← MBR, PC ← PC + 1

      this.fetch_addr_operand()
      this.pc = (this.zero)
        ? this.mbr  
        : this.pc++
      break
    case Opcodes.JZ_REGADDR:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // MAR ← GPR[MBR]
      // MBR ← M[MAR]
      // Z: PC ← MBR, PC ← PC + 1

      this.fetch_addr_operand()
      this.fetch_memory_from()
      this.pc = (this.zero)
        ? this.mbr  
        : this.pc++
      break
    case Opcodes.JNZ_ADDR:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // Z: PC ← MBR, PC ← PC + 1

      this.fetch_addr_operand()
      this.pc = (!this.zero)
        ? this.mbr  
        : this.pc++
      break
    case Opcodes.JNZ_REGADDR:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // MAR ← GPR[MBR]
      // MBR ← M[MAR]
      // Z: PC ← MBR, PC ← PC + 1

      this.fetch_addr_operand()
      this.fetch_memory_from()
      this.pc = (!this.zero)
        ? this.mbr  
        : this.pc++
      break
    case Opcodes.JA_ADDR:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // Z: PC ← MBR, PC ← PC + 1

      this.fetch_addr_operand()
      this.pc = (!this.carry && !this.zero)
        ? this.mbr  
        : this.pc++
      break
    case Opcodes.JA_REGADDR:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // MAR ← GPR[MBR]
      // MBR ← M[MAR]
      // Z: PC ← MBR, PC ← PC + 1

      this.fetch_addr_operand()
      this.fetch_memory_from()
      this.pc = (!this.carry && !this.zero)
        ? this.mbr  
        : this.pc++
      break
    case Opcodes.JNA_ADDR:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // Z: PC ← MBR, PC ← PC + 1

      this.fetch_addr_operand()
      this.pc = (this.carry && this.zero)
        ? this.mbr  
        : this.pc++
      break
    case Opcodes.JNA_REGADDR:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // MAR ← GPR[MBR]
      // MBR ← M[MAR]
      // Z: PC ← MBR, PC ← PC + 1

      this.fetch_addr_operand()
      this.fetch_memory_from()
      this.pc = (this.carry && this.zero)
        ? this.mbr  
        : this.pc++
      break

    // subroutine instructions
    case Opcodes.CALL_ADDR:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // MAR ← SP
      // SP ← SP - 1
      // PC ← PC + 1
      // MBR ← PC
      // M[MAR] ← MBR
      // PC ← TEMP

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.push_to_stack()
      this.pc = temp1
      break
    case Opcodes.CALL_REGADDR:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // MAR ← GPR[MBR]
      // MBR ← M[MAR]
      // TEMP1 ← MBR
      // MAR ← SP
      // SP ← SP - 1
      // PC ← PC + 1
      // MBR ← PC
      // M[MAR] ← MBR
      // PC ← TEMP

      this.fetch_addr_operand()
      this.fetch_memory_from()
      temp1 = this.mbr
      this.push_to_stack()
      this.pc = temp1
      break
    case Opcodes.RET:
      // register transfer language
      // SP ← SP + 1
      // MAR ← SP
      // MBR ← M[MAR]
      // PC ← MBR

      this.mar = ++this.sp
      this.mbr = this.memory.read(this.mar)
      this.pc = this.mbr
      break

    // stack operations
    // push
    case Opcodes.PUSH_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // MAR ← SP
      // SP ← SP - 1
      // M[MAR] ← GPR[MAR]
      // PC ← PC + 1

      this.fetch_addr_operand()
      this.mar = this.sp--
      this.memory.write(this.mar, this.gpr[this.mbr])
      ++this.pc
      break
    case Opcodes.PUSH_ADDR:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // MAR ← MBR
      // MBR ← M[MAR]
      // MAR ← SP
      // SP ← SP - 1
      // M[MAR] ← MBR
      // PC ← PC + 1

      this.fetch_addr_operand()
      this.fetch_memory()
      this.mar = this.sp--
      this.memory.write(this.mar, this.mbr)
      ++this.pc
      break
    case Opcodes.PUSH_REGADDR:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // MAR ← GPR[MBR]
      // MBR ← M[MAR]
      // MAR ← SP
      // SP ← SP - 1
      // M[MAR] ← MBR
      // PC ← PC + 1

      this.fetch_addr_operand()
      this.fetch_memory_from()
      this.mar = this.sp--
      this.memory.write(this.mar, this.mbr)
      ++this.pc
      break
    case Opcodes.PUSH_NUM:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // MAR ← SP
      // SP ← SP - 1
      // M[MAR] ← MBR
      // PC ← PC + 1

      this.fetch_addr_operand()
      this.mar = this.sp--
      this.memory.write(this.mar, this.mbr)
      ++this.pc
      break

    // pop
    case Opcodes.POP_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // SP ← SP + 1
      // MAR ← SP
      // MBR ← M[MAR]
      // GPR[TEMP] ← MBR

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.mar = ++this.sp
      this.mbr = this.memory.read(this.mar)
      this.gpr[temp1] = this.mbr
      ++this.pc
      break

    // binary operations
    // and
    case Opcodes.AND_REG_TO_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // GPR[TEMP1] ← GPR[TEMP1] & GPR[MBR]

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.gpr[temp1] = this.perform_operation(ALU.and, this.gpr[temp1], this.gpr[this.mbr])
      ++this.pc
      break
    case Opcodes.AND_ADDR_TO_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // GPR[TEMP1] ← GPR[TEMP1] & MBR

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.fetch_memory()
      this.gpr[temp1] = this.perform_operation(ALU.and, this.gpr[temp1], this.mbr)
      ++this.pc
      break
    case Opcodes.AND_REGADDR_TO_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // MAR ← GPR[MBR]
      // MBR ← M[MAR]
      // GPR[TEMP1] ← GPR[TEMP1] & MBR

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.fetch_memory_from()
      this.gpr[temp1] = this.perform_operation(ALU.and, this.gpr[temp1], this.mbr)
      ++this.pc
      break
    case Opcodes.AND_NUM_TO_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // GPR[TEMP1] ← GPR[TEMP1] & MBR

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.gpr[temp1] = this.perform_operation(ALU.and, this.gpr[temp1], this.mbr)
      ++this.pc
      break

    // or
    case Opcodes.OR_REG_TO_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // GPR[TEMP1] ← GPR[TEMP1] | GPR[MBR]

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.gpr[temp1] = this.perform_operation(ALU.or, this.gpr[temp1], this.gpr[this.mbr])
      ++this.pc
      break
    case Opcodes.OR_ADDR_TO_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // MAR ← MBR
      // MBR ← M[MAR]
      // GPR[TEMP] ← GPR[TEMP] + MBR

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.fetch_memory()
      this.gpr[temp1] = this.perform_operation(ALU.or, this.gpr[temp1], this.mbr)
      ++this.pc
      break
    case Opcodes.OR_REGADDR_TO_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // MAR ← GPR[MBR]
      // MBR ← M[MAR]
      // GPR[TEMP1] ← GPR[TEMP1] | MBR

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.fetch_memory_from()
      this.gpr[temp1] = this.perform_operation(ALU.or, this.gpr[temp1], this.mbr)
      ++this.pc
      break

    case Opcodes.OR_NUM_TO_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // GPR[TEMP1] ← GPR[TEMP1] | MBR

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.gpr[temp1] = this.perform_operation(ALU.or, this.gpr[temp1], this.mbr)
      ++this.pc
      break

    // xor
    case Opcodes.XOR_REG_TO_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // GPR[TEMP1] ← GPR[TEMP1] ^ GPR[MBR]

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.gpr[temp1] = this.perform_operation(ALU.xor, this.gpr[temp1], this.gpr[this.mbr])
      ++this.pc
      break
    case Opcodes.XOR_ADDR_TO_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // GPR[TEMP1] ← GPR[TEMP1] ^ MBR

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.fetch_memory()
      this.gpr[temp1] = this.perform_operation(ALU.xor, this.gpr[temp1], this.mbr)
      ++this.pc
      break
    case Opcodes.XOR_REGADDR_TO_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // MAR ← GPR[MBR]
      // MBR ← M[MAR]
      // GPR[TEMP1] ← GPR[TEMP1] ^ MBR

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.fetch_memory_from()
      this.gpr[temp1] = this.perform_operation(ALU.xor, this.gpr[temp1], this.mbr)
      ++this.pc
      break

    case Opcodes.XOR_NUM_TO_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // GPR[TEMP1] ← GPR[TEMP1] ^ MBR

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.gpr[temp1] = this.perform_operation(ALU.xor, this.gpr[temp1], this.mbr)
      ++this.pc
      break

    // shl
    case Opcodes.SHL_REG_TO_REG:
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // GPR[TEMP1] ← GPR[TEMP1] << GPR[MBR]

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.gpr[temp1] = this.perform_operation(ALU.shl, this.gpr[temp1], this.gpr[this.mbr])
      ++this.pc
      break
    case Opcodes.SHL_ADDR_TO_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // GPR[TEMP1] ← GPR[TEMP1] << MBR

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.fetch_memory()
      this.gpr[temp1] = this.perform_operation(ALU.shl, this.gpr[temp1], this.mbr)
      ++this.pc
      break
    case Opcodes.SHL_REGADDR_TO_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // MAR ← GPR[MBR]
      // MBR ← M[MAR]
      // GPR[TEMP1] ← GPR[TEMP1] << MBR

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.fetch_memory_from()
      this.gpr[temp1] = this.perform_operation(ALU.shl, this.gpr[temp1], this.mbr)
      ++this.pc
      break
    case Opcodes.SHL_NUM_TO_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // GPR[TEMP1] ← GPR[TEMP1] << MBR

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.gpr[temp1] = this.perform_operation(ALU.shl, this.gpr[temp1], this.mbr)
      ++this.pc
      break

    // shr
    case Opcodes.SHR_REG_TO_REG:
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // GPR[TEMP1] ← GPR[TEMP1] >> GPR[MBR]

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.gpr[temp1] = this.perform_operation(ALU.shr, this.gpr[temp1], this.gpr[this.mbr])      
      ++this.pc
      break
    case Opcodes.SHR_ADDR_TO_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // GPR[TEMP1] ← GPR[TEMP1] >> MBR

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.fetch_memory()
      this.gpr[temp1] = this.perform_operation(ALU.shr, this.gpr[temp1], this.mbr)
      ++this.pc
      break
    case Opcodes.SHR_REGADDR_TO_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // MAR ← GPR[MBR]
      // MBR ← M[MAR]
      // GPR[TEMP1] ← GPR[TEMP1] >> MBR

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.fetch_memory_from()
      this.gpr[temp1] = this.perform_operation(ALU.shr, this.gpr[temp1], this.mbr)
      ++this.pc
      break
    case Opcodes.SHR_NUM_TO_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // TEMP ← MBR
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // GPR[TEMP1] ← GPR[TEMP1] >> MBR

      this.fetch_addr_operand()
      temp1 = this.mbr
      this.fetch_addr_operand()
      this.gpr[temp1] = this.perform_operation(ALU.shr, this.gpr[temp1], this.mbr)
      ++this.pc
      break

    // not
    case Opcodes.NOT_REG:
      // register transfer language
      // PC ← PC + 1
      // MAR ← PC
      // MBR ← M[MAR]
      // GPR[MBR] ← ~GPR[MBR]

      this.fetch_addr_operand()
      this.gpr[this.mbr] = this.perform_operation(ALU.not, this.gpr[this.mbr], 0)
      ++this.pc
      break

    // default
    default:
      throw "Invalid op code " + this.ir
    }

    return true
  }
}