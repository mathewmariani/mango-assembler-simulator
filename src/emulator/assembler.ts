import { Opcodes } from './opcodes.ts'
import Interpreter from './interpreter.ts'
import Instructions from './instructions.ts'

export default class Assembler {
  public code: number[]
  public mapping: { [id: number] : number; }
  public labels: { [id: string] : number; }
  public errors: string[]

  constructor() {
    this.code = []
    this.mapping = {}
    this.labels = {}
    this.errors = []
  }

  reset() {
    this.code = []
    this.mapping = {}
    this.labels = {}
    this.errors = []
  }

  addLabel(label: string) {
    if (label in this.labels) {
      throw new Error("Duplicate label: " + label)
    }

    const ulabel = label.toUpperCase()
    if (ulabel === "A" || ulabel === "B" || ulabel === "C" || ulabel === "D") {
      throw new Error("Label contains keyword: " + ulabel)
    }

    this.labels[label] = this.code.length
  }

  assemble(src: string) {
    this.reset()
    // const GROUP_LABEL = 1
    // const GROUP_INSTRUCTION = 2
    // const GROUP_OPERAND1 = 3
    // const GROUP_OPERAND2 = 4
    // const GROUP_COMMENT = 5

    // split source into lines
    const lines = src.split('\n')

    // first pass
    for (let i = 0, l = lines.length; i < l; ++i) {
      // interpret the current line
      let match = Interpreter.interpretLine(lines[i])

      // FIXME: check for a null match

      // check for other instructions
      const label = match[1]
      const instruction = match[2]
      const operand1 = match[3]
      const operand2 = match[4]
      const comment = match[5]

      if (label) {
        this.addLabel(label)
      }

      if (instruction) {
        // FIXME: clean this up
        let opcode = undefined
        const keyword = instruction.toUpperCase()
        const [p1, p2] = Interpreter.getArguments(Instructions[keyword], operand1, operand2)

        // create mapping for breakpoints
        // if (instruction !== 'DB') {
          this.mapping[this.code.length] = i;
        // }

        switch (keyword) {
        // pseudo-instructions
        // used to declare initialized data in the output file.
        case 'DB':
          // FIXME: this might cause some issues
          // "number", "char", "string"
          if (p1.type === "number") {
            this.code.push(p1.value)
          } else if (p1.type === "char") {
            this.code.push(p1.value)
          } else if (p1.type === "string") {
            for (let j = 0, k = p1.value.length; j < k; ++j) {
              this.code.push(p1.value[j])
            }
          } else {
            // FIXME: throw proper error
            throw "Lorem Ipsum!"
          }

          break
        // halt instructions
        // FIXME: i dont like that halt is a non-opcode
        case 'HLT':
          opcode = Opcodes.NONE
          this.code.push(opcode)
          
          break
        // move instructions
        case 'MOV':
          if (p1.type === "register" && p2.type === "register") {
            opcode = Opcodes.MOV_REG_TO_REG
          } else if (p1.type === "register" && p2.type === "address") {
            opcode = Opcodes.MOV_ADDR_TO_REG
          } else if (p1.type === "register" && p2.type === "regaddress") {
            opcode = Opcodes.MOV_REGADDR_TO_REG
          } else if (p1.type === "address" && p2.type === "register") {
            opcode = Opcodes.MOV_REG_TO_ADDR
          } else if (p1.type === "regaddress" && p2.type === "register") {
            opcode = Opcodes.MOV_REG_TO_REGADDR
          } else if (p1.type === "register" && p2.type === "number") {
            opcode = Opcodes.MOV_NUM_TO_REG
          } else if (p1.type === "address" && p2.type === "number") {
            opcode = Opcodes.MOV_NUM_TO_ADDR
          } else if (p1.type === "regaddress" && p2.type === "number") {
            opcode = Opcodes.MOV_NUM_TO_REGADDR
          } else {
            throw new Error("MOV does not support this operands")
          }

          this.code.push(opcode, p1.value, p2.value)
          break
        // arithmatic instructions
        // MULT
        // DIV
        case 'ADD':
          if (p1.type === "register" && p2.type === "register") {
            opcode = Opcodes.ADD_REG_TO_REG
          } else if (p1.type === "register" && p2.type === "address") {
            opcode = Opcodes.ADD_ADDR_TO_REG
          } else if (p1.type === "register" && p2.type === "regaddress") {
            opcode = Opcodes.ADD_REGADDR_TO_REG
          } else if (p1.type === "register" && p2.type === "number") {
            opcode = Opcodes.ADD_NUM_TO_REG
          } else {
            throw new Error("ADD does not support this operands")
          }

          this.code.push(opcode, p1.value, p2.value)
          break
        case 'SUBT':
          if (p1.type === "register" && p2.type === "register") {
            opcode = Opcodes.SUBT_REG_FROM_REG
          } else if (p1.type === "register" && p2.type === "address") {
            opcode = Opcodes.SUBT_ADDR_FROM_REG
          } else if (p1.type === "register" && p2.type === "regaddress") {
            opcode = Opcodes.SUBT_REGADDR_FROM_REG
          } else if (p1.type === "register" && p2.type === "number") {
            opcode = Opcodes.SUBT_NUM_FROM_REG
          } else {
            throw new Error("SUBT does not support this operands")
          }

          this.code.push(opcode, p1.value, p2.value)
          break
        case 'INC':
          if (p1.type === "register") {
            opcode = Opcodes.INC_REG
          } else {
            throw "INC does not support this operand"
          }

          this.code.push(opcode, p1.value)
          break
        case 'DEC':
          if (p1.type === "register") {
            opcode = Opcodes.DEC_REG
          } else {
            throw "DEC does not support this operand"
          }

          this.code.push(opcode, p1.value)
          break
        // comparison instructions
        case 'CMP':
          if (p1.type === "register" && p2.type === "register") {
            opcode = Opcodes.CMP_REG_TO_REG
          } else if (p1.type === "register" && p2.type === "address") {
            opcode = Opcodes.CMP_ADDR_TO_REG
          } else if (p1.type === "register" && p2.type === "regaddress") {
            opcode = Opcodes.CMP_REGADDR_TO_REG
          } else if (p1.type === "register" && p2.type === "number") {
            opcode = Opcodes.CMP_NUM_TO_REG
          } else {
            throw new Error("CMP does not support this operands")
          }

          this.code.push(opcode, p1.value, p2.value)
          break
        // jump instruction
        case 'JMP':
          if (p1.type === "number") {
            opcode = Opcodes.JMP_ADDR
          } else if (p1.type === "regaddress") {
            opcode = Opcodes.JMP_REGADDR
          } else {
            throw new Error("JMP does not support this operand")
          }

          this.code.push(opcode, p1.value)
          break
        case 'JC':
          if (p1.type === "number") {
            opcode = Opcodes.JC_ADDR
          } else if (p1.type === "regaddress") {
            opcode = Opcodes.JC_REGADDR
          } else {
            throw new Error("JC does not support this operand")
          }

          this.code.push(opcode, p1.value)
          break
        case 'JNC':
          if (p1.type === "number") {
            opcode = Opcodes.JNC_ADDR
          } else if (p1.type === "regaddress") {
            opcode = Opcodes.JNC_REGADDR
          } else {
            throw new Error("JNC does not support this operand")
          }

          this.code.push(opcode, p1.value)
          break
        case 'JZ':
          if (p1.type === "number") {
            opcode = Opcodes.JZ_ADDR
          } else if (p1.type === "regaddress") {
            opcode = Opcodes.JZ_REGADDR
          } else {
            throw new Error("JZ does not support this operand")
          }

          this.code.push(opcode, p1.value)
          break
        case 'JNZ':
          if (p1.type === "number") {
            opcode = Opcodes.JNZ_ADDR
          } else if (p1.type === "regaddress") {
            opcode = Opcodes.JNZ_REGADDR
          } else {
            throw new Error("JNZ does not support this operand")
          }

          this.code.push(opcode, p1.value)
          break
        case 'JA':
          if (p1.type === "number") {
            opcode = Opcodes.JA_ADDR
          } else if (p1.type === "regaddress") {
            opcode = Opcodes.JA_REGADDR
          } else {
            throw new Error("JA does not support this operand")
          }

          this.code.push(opcode, p1.value)
          break
        case 'JNA':
          if (p1.type === "number") {
            opcode = Opcodes.JNA_ADDR
          } else if (p1.type === "regaddress") {
            opcode = Opcodes.JNA_REGADDR
          } else {
            throw new Error("JNA does not support this operand")
          }

          this.code.push(opcode, p1.value)
          break
        // stack instructions
        case 'PUSH':
          if (p1.type === "register") {
            opcode = Opcodes.PUSH_REG
          } else if (p1.type === "address") {
            opcode = Opcodes.PUSH_ADDR
          } else if (p1.type === "regaddress") {
            opcode = Opcodes.PUSH_REGADDR
          } else if (p1.type === "number") {
            opcode = Opcodes.PUSH_NUM
          } else {
            throw new Error("PUSH does not support this operands")
          }

          this.code.push(opcode, p1.value)
          break
        case 'POP':
          if (p1.type === "register") {
            opcode = Opcodes.POP_REG
          } else {
            throw new Error("POP does not support this operands")
          }

          this.code.push(opcode, p1.value)          
          break
        // subroutine instructions
        case 'CALL':
          if (p1.type === "number") {
            opcode = Opcodes.CALL_ADDR
          } else if (p1.type === "regaddress") {
            opcode = Opcodes.CALL_REGADDR
          } else {
            throw new Error("CALL does not support this operands")
          }

          this.code.push(opcode, p1.value)
          break
        case 'RET':
          opcode = Opcodes.RET
          this.code.push(opcode)
          break
        // binary instructions
        case 'AND':
          if (p1.type === "register" && p2.type === "register") {
            opcode = Opcodes.AND_REG_TO_REG
          } else if (p1.type === "register" && p2.type === "address") {
            opcode = Opcodes.AND_ADDR_TO_REG
          } else if (p1.type === "register" && p2.type === "regaddress") {
            opcode = Opcodes.AND_REGADDR_TO_REG
          } else if (p1.type === "register" && p2.type === "number") {
            opcode = Opcodes.AND_NUM_TO_REG
          } else {
            throw new Error("AND does not support this operands")
          }

          this.code.push(opcode, p1.value, p2.value)
          break
        case 'OR':
          if (p1.type === "register" && p2.type === "register") {
            opcode = Opcodes.OR_REG_TO_REG
          } else if (p1.type === "register" && p2.type === "address") {
            opcode = Opcodes.OR_ADDR_TO_REG
          } else if (p1.type === "register" && p2.type === "regaddress") {
            opcode = Opcodes.OR_REGADDR_TO_REG
          } else if (p1.type === "register" && p2.type === "number") {
            opcode = Opcodes.OR_NUM_TO_REG
          } else {
            throw new Error("OR does not support this operands")
          }

          this.code.push(opcode, p1.value, p2.value)
          break
        case 'XOR':
          if (p1.type === "register" && p2.type === "register") {
            opcode = Opcodes.XOR_REG_TO_REG
          } else if (p1.type === "register" && p2.type === "address") {
            opcode = Opcodes.XOR_ADDR_TO_REG
          } else if (p1.type === "register" && p2.type === "regaddress") {
            opcode = Opcodes.XOR_REGADDR_TO_REG
          } else if (p1.type === "register" && p2.type === "number") {
            opcode = Opcodes.XOR_NUM_TO_REG
          } else {
            throw new Error("XOR does not support this operands")
          }

          this.code.push(opcode, p1.value, p2.value)
          break
        case 'SHL':
          if (p1.type === "register" && p2.type === "register") {
            opcode = Opcodes.SHL_REG_TO_REG
          } else if (p1.type === "register" && p2.type === "address") {
            opcode = Opcodes.SHL_ADDR_TO_REG
          } else if (p1.type === "register" && p2.type === "regaddress") {
            opcode = Opcodes.SHL_REGADDR_TO_REG
          } else if (p1.type === "register" && p2.type === "number") {
            opcode = Opcodes.SHL_NUM_TO_REG
          } else {
            throw new Error("SHL does not support this operands")
          }

          this.code.push(opcode, p1.value, p2.value)
          break
        case 'SHR':
          if (p1.type === "register" && p2.type === "register") {
            opcode = Opcodes.SHR_REG_TO_REG
          } else if (p1.type === "register" && p2.type === "address") {
            opcode = Opcodes.SHR_ADDR_TO_REG
          } else if (p1.type === "register" && p2.type === "regaddress") {
            opcode = Opcodes.SHR_REGADDR_TO_REG
          } else if (p1.type === "register" && p2.type === "number") {
            opcode = Opcodes.SHR_NUM_TO_REG
          } else {
            throw new Error("SHR does not support this operands")
          }

          this.code.push(opcode, p1.value, p2.value)
          break
        case 'NOT':
          if (p1.type === "register") {
            opcode = Opcodes.NOT_REG
          } else {
            throw new Error("NOT does not support this operands")
          }

          this.code.push(opcode, p1.value)
          break
        default:
          throw new Error("Invalid instruction: " + instruction)
        }
      }
    }

    // second pass
    for (let i = 0, l = this.code.length; i < l; ++i) {
      let byte = this.code[i]
      if (!Number.isInteger(byte)) {
        if (byte in this.labels) {
          this.code[i] = this.labels[byte]
        } else {
          throw new Error("Undefined label: " + byte)
        }
      }
    }

    return {
      // the assembled hexadecimal code
      code: this.code,

      // the mapping between code and line numbers
      // used for debugging and breakpoints
      mapping: this.mapping,

      // labels used for the watch panel
      labels: this.labels,

      // NOTE: currently isn't being used
      // error used for multiple assembly errors
      errors: this.errors,
    }
  }
}