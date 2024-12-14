import { InstructionType } from "./instructions";
import { Opcodes } from './opcodes'

enum Groupings {
  Label = 1,
  Instruction = 2,
  Operand1 = 3,
  Operand2 = 4,
  Comment = 5,
};

export enum Token {
  Opcode = 1,
  Number = 2,
  Char = 3,
  String = 4,
  Address = 5,
  Register = 6,
  RegAddress = 7,
};

export type TokenizerValue = { type: Token, value: number | number[] | string } | undefined;

export class Tokenizer {
  // regexes
  static readonly regexLabel: RegExp = /(?:([A-Za-z]\w*)[:])/
  static readonly regexinstruction: RegExp = /(?:(\w*))/
  static readonly regexOperand: RegExp = /(?:(\[(\w+((\+|-)\d+)?)\]|\".+?\"|\'.+?\'|[$A-Za-z0-9]\w*))/
  static readonly regexNum: RegExp = /^[-+]?[0-9]+$/
  static readonly regexDec: RegExp = /^[-+]?[0-9]+/

  // FIXME: we should be using this
  // regex = new RegExp(
  //   "^" +
  //   "\s*" + regexLabel.source + "?\s*" +
  //   "\s*" + regexinstruction.source // + "?\s*"
  //   // "\s*" + regexOperand.source + "?\s*" +
  //   // "\s*" + regexOperand.source
  // )

  // FIXME: I dont like this giant regex
  static readonly regex: RegExp = /^\s*(?:([A-Za-z]\w*)[:])?\s*(?:(\w*))?\s*(?:(\[(?:\w+(?:[\+|-]\d+)?)\]|\".+?\"|\'.+?\'|[$A-Za-z0-9]\w*))?\s*(?:[,]\s*(\[(\w+((\+|-)\d+)?)\]|\".+?\"|\'.+?\'|[$A-Za-z0-9]\w*))?/

  static isOpcode(token: TokenizerValue): boolean {
    return token?.type == Token.Number
  }

  static isNumber(token: TokenizerValue): boolean {
    return token?.type == Token.Number
  }

  static isChar(token: TokenizerValue): boolean {
    return token?.type == Token.Char
  }

  static isString(token: TokenizerValue): boolean {
    return token?.type == Token.String
  }

  static isAddress(token: TokenizerValue): boolean {
    return token?.type == Token.Address
  }

  static isRegister(token: TokenizerValue): boolean {
    return token?.type == Token.Register
  }

  static isRegAddress(token: TokenizerValue): boolean {
    return token?.type == Token.RegAddress
  }

  static parseInstruction(keyword: string, p1: any, p2: any) {
    switch (keyword) {
      // pseudo-instructions
      // used to declare initialized data in the output file.
      case 'DB':
        // FIXME: this might cause some issues
        // Token.Number, Token.Char, Token.String
        // if (Tokenizer.isNumber(p1) || Tokenizer.isChar(p1)) {
        //   return { type: Token.RegAddress, value: regaddress }
        // } else if (Tokenizer.isString(p1)) {
        //   for (let j = 0, k = (String)(p1.value).length; j < k; ++j) {
        //     this.code.push(p1.value[j])
        //   }
        // } else {
        //   // FIXME: throw proper error
        //   throw "Lorem Ipsum!"
        // }

        // break
      // halt instructions
      // FIXME: i dont like that halt is a non-opcode
      case 'HLT':
        return { type: Token.Opcode, value: Opcodes.NONE }
      
      // move instructions
      case 'MOV':
        if (Tokenizer.isRegister(p1) && Tokenizer.isRegister(p2)) {
          return { type: Token.Opcode, value: Opcodes.MOV_REG_TO_REG }
        } else if (Tokenizer.isRegister(p1) && Tokenizer.isAddress(p2)) {
          return { type: Token.Opcode, value: Opcodes.MOV_ADDR_TO_REG }
        } else if (Tokenizer.isRegister(p1) && Tokenizer.isRegAddress(p2)) {
          return { type: Token.Opcode, value: Opcodes.MOV_REGADDR_TO_REG }
        } else if (Tokenizer.isAddress(p1) && Tokenizer.isRegister(p2)) {
          return { type: Token.Opcode, value: Opcodes.MOV_REG_TO_ADDR }
        } else if (Tokenizer.isRegAddress(p1) && Tokenizer.isRegister(p2)) {
          return { type: Token.Opcode, value: Opcodes.MOV_REG_TO_REGADDR }
        } else if (Tokenizer.isRegister(p1) && Tokenizer.isNumber(p2)) {
          return { type: Token.Opcode, value: Opcodes.MOV_NUM_TO_REG }
        } else if (Tokenizer.isAddress(p1) && Tokenizer.isNumber(p2)) {
          return { type: Token.Opcode, value: Opcodes.MOV_NUM_TO_ADDR }
        } else if (Tokenizer.isRegAddress(p1) && Tokenizer.isNumber(p2)) {
          return { type: Token.Opcode, value: Opcodes.MOV_NUM_TO_REGADDR }
        } else {
          throw new Error("MOV does not support this operands")
        }

      // arithmatic instructions
      // MULT
      // DIV
      case 'ADD':
        if (Tokenizer.isRegister(p1) && Tokenizer.isRegister(p2)) {
          return { type: Token.Opcode, value: Opcodes.ADD_REG_TO_REG }
        } else if (Tokenizer.isRegister(p1) && Tokenizer.isAddress(p2)) {
          return { type: Token.Opcode, value: Opcodes.ADD_ADDR_TO_REG }
        } else if (Tokenizer.isRegister(p1) && Tokenizer.isRegAddress(p2)) {
          return { type: Token.Opcode, value: Opcodes.ADD_REGADDR_TO_REG }
        } else if (Tokenizer.isRegister(p1) && Tokenizer.isNumber(p2)) {
          return { type: Token.Opcode, value: Opcodes.ADD_NUM_TO_REG }
        } else {
          throw new Error("ADD does not support this operands")
        }

      case 'SUBT':
        if (Tokenizer.isRegister(p1) && Tokenizer.isRegister(p2)) {
          return { type: Token.Opcode, value: Opcodes.SUBT_NUM_FROM_REG }
        } else if (Tokenizer.isRegister(p1) && Tokenizer.isAddress(p2)) {
          return { type: Token.Opcode, value: Opcodes.SUBT_NUM_FROM_REG }
        } else if (Tokenizer.isRegister(p1) && Tokenizer.isRegAddress(p2)) {
          return { type: Token.Opcode, value: Opcodes.SUBT_NUM_FROM_REG }
        } else if (Tokenizer.isRegister(p1) && Tokenizer.isNumber(p2)) {
          return { type: Token.Opcode, value: Opcodes.SUBT_NUM_FROM_REG }
        } else {
          throw new Error("SUBT does not support this operands")
        }

      case 'INC':
        if (Tokenizer.isRegister(p1)) {
          return { type: Token.Opcode, value: Opcodes.INC_REG }
        } else {
          throw "INC does not support this operand"
        }

      case 'DEC':
        if (Tokenizer.isRegister(p1)) {
          return { type: Token.Opcode, value: Opcodes.DEC_REG }
        } else {
          throw "DEC does not support this operand"
        }

      // comparison instructions
      case 'CMP':
        if (Tokenizer.isRegister(p1) && Tokenizer.isRegister(p2)) {
          return { type: Token.Opcode, value: Opcodes.CMP_REG_TO_REG }
        } else if (Tokenizer.isRegister(p1) && Tokenizer.isAddress(p2)) {
          return { type: Token.Opcode, value: Opcodes.CMP_ADDR_TO_REG }
        } else if (Tokenizer.isRegister(p1) && Tokenizer.isRegAddress(p2)) {
          return { type: Token.Opcode, value: Opcodes.CMP_REGADDR_TO_REG }
        } else if (Tokenizer.isRegister(p1) && Tokenizer.isNumber(p2)) {
          return { type: Token.Opcode, value: Opcodes.CMP_NUM_TO_REG }
        } else {
          throw new Error("CMP does not support this operands")
        }

      // jump instruction
      case 'JMP':
        if (Tokenizer.isNumber(p1)) {
          return { type: Token.Opcode, value: Opcodes.JMP_ADDR }
        } else if (Tokenizer.isRegAddress(p1)) {
          return { type: Token.Opcode, value: Opcodes.JMP_REGADDR }
        } else {
          throw new Error("JMP does not support this operand")
        }

      case 'JC':
        if (Tokenizer.isNumber(p1)) {
          return { type: Token.Opcode, value: Opcodes.JC_ADDR }
        } else if (Tokenizer.isRegAddress(p1)) {
          return { type: Token.Opcode, value: Opcodes.JC_REGADDR }
        } else {
          throw new Error("JC does not support this operand")
        }

      case 'JNC':
        if (Tokenizer.isNumber(p1)) {
          return { type: Token.Opcode, value: Opcodes.JNC_ADDR }
        } else if (Tokenizer.isRegAddress(p1)) {
          return { type: Token.Opcode, value: Opcodes.JNC_REGADDR }
        } else {
          throw new Error("JNC does not support this operand")
        }

      case 'JZ':
        if (Tokenizer.isNumber(p1)) {
          return { type: Token.Opcode, value: Opcodes.JZ_ADDR }
        } else if (Tokenizer.isRegAddress(p1)) {
          return { type: Token.Opcode, value: Opcodes.JZ_REGADDR }
        } else {
          throw new Error("JZ does not support this operand")
        }

      case 'JNZ':
        if (Tokenizer.isNumber(p1)) {
          return { type: Token.Opcode, value: Opcodes.JNZ_ADDR }
        } else if (Tokenizer.isRegAddress(p1)) {
          return { type: Token.Opcode, value: Opcodes.JNZ_REGADDR }
        } else {
          throw new Error("JNZ does not support this operand")
        }

      case 'JA':
        if (Tokenizer.isNumber(p1)) {
          return { type: Token.Opcode, value: Opcodes.JA_ADDR }
        } else if (Tokenizer.isRegAddress(p1)) {
          return { type: Token.Opcode, value: Opcodes.JA_REGADDR }
        } else {
          throw new Error("JA does not support this operand")
        }

      case 'JNA':
        if (Tokenizer.isNumber(p1)) {
          return { type: Token.Opcode, value: Opcodes.JNA_ADDR }
        } else if (Tokenizer.isRegAddress(p1)) {
          return { type: Token.Opcode, value: Opcodes.JNA_REGADDR }
        } else {
          throw new Error("JNA does not support this operand")
        }

      // stack instructions
      case 'PUSH':
        if (Tokenizer.isRegister(p1)) {
          return { type: Token.Opcode, value: Opcodes.PUSH_REG }
        } else if (Tokenizer.isAddress(p1)) {
          return { type: Token.Opcode, value: Opcodes.PUSH_ADDR }
        } else if (Tokenizer.isRegAddress(p1)) {
          return { type: Token.Opcode, value: Opcodes.PUSH_REGADDR }
        } else if (Tokenizer.isNumber(p1)) {
          return { type: Token.Opcode, value: Opcodes.PUSH_NUM }
        } else {
          throw new Error("PUSH does not support this operands")
        }

      case 'POP':
        if (Tokenizer.isRegister(p1)) {
          return { type: Token.Opcode, value: Opcodes.POP_REG }
        } else {
          throw new Error("POP does not support this operands")
        }

      // subroutine instructions
      case 'CALL':
        if (Tokenizer.isNumber(p1)) {
          return { type: Token.Opcode, value: Opcodes.CALL_ADDR }
        } else if (Tokenizer.isRegAddress(p1)) {
          return { type: Token.Opcode, value: Opcodes.CALL_REGADDR }
        } else {
          throw new Error("CALL does not support this operands")
        }

      case 'RET':
        return { type: Token.Opcode, value: Opcodes.RET }

      // binary instructions
      case 'AND':
        if (Tokenizer.isRegister(p1) && Tokenizer.isRegister(p2)) {
          return { type: Token.Opcode, value: Opcodes.AND_REG_TO_REG }
        } else if (Tokenizer.isRegister(p1) && Tokenizer.isAddress(p2)) {
          return { type: Token.Opcode, value: Opcodes.AND_ADDR_TO_REG }
        } else if (Tokenizer.isRegister(p1) && Tokenizer.isRegAddress(p2)) {
          return { type: Token.Opcode, value: Opcodes.AND_REGADDR_TO_REG }
        } else if (Tokenizer.isRegister(p1) && Tokenizer.isNumber(p2)) {
          return { type: Token.Opcode, value: Opcodes.AND_NUM_TO_REG }
        } else {
          throw new Error("AND does not support this operands")
        }
    
      case 'OR':
        if (Tokenizer.isRegister(p1) && Tokenizer.isRegister(p2)) {
          return { type: Token.Opcode, value: Opcodes.OR_REG_TO_REG }
        } else if (Tokenizer.isRegister(p1) && Tokenizer.isAddress(p2)) {
          return { type: Token.Opcode, value: Opcodes.OR_ADDR_TO_REG }
        } else if (Tokenizer.isRegister(p1) && Tokenizer.isRegAddress(p2)) {
          return { type: Token.Opcode, value: Opcodes.OR_REGADDR_TO_REG }
        } else if (Tokenizer.isRegister(p1) && Tokenizer.isNumber(p2)) {
          return { type: Token.Opcode, value: Opcodes.OR_NUM_TO_REG }
        } else {
          throw new Error("OR does not support this operands")
        }

      case 'XOR':
        if (Tokenizer.isRegister(p1) && Tokenizer.isRegister(p2)) {
          return { type: Token.Opcode, value: Opcodes.XOR_REG_TO_REG }
        } else if (Tokenizer.isRegister(p1) && Tokenizer.isAddress(p2)) {
          return { type: Token.Opcode, value: Opcodes.XOR_ADDR_TO_REG }
        } else if (Tokenizer.isRegister(p1) && Tokenizer.isRegAddress(p2)) {
          return { type: Token.Opcode, value: Opcodes.XOR_REGADDR_TO_REG }
        } else if (Tokenizer.isRegister(p1) && Tokenizer.isNumber(p2)) {
          return { type: Token.Opcode, value: Opcodes.XOR_NUM_TO_REG }
        } else {
          throw new Error("XOR does not support this operands")
        }

      case 'SHL':
        if (Tokenizer.isRegister(p1) && Tokenizer.isRegister(p2)) {
          return { type: Token.Opcode, value: Opcodes.SHL_REG_TO_REG }
        } else if (Tokenizer.isRegister(p1) && Tokenizer.isAddress(p2)) {
          return { type: Token.Opcode, value: Opcodes.SHL_ADDR_TO_REG }
        } else if (Tokenizer.isRegister(p1) && Tokenizer.isRegAddress(p2)) {
          return { type: Token.Opcode, value: Opcodes.SHL_REGADDR_TO_REG }
        } else if (Tokenizer.isRegister(p1) && Tokenizer.isNumber(p2)) {
          return { type: Token.Opcode, value: Opcodes.SHL_NUM_TO_REG }
        } else {
          throw new Error("SHL does not support this operands")
        }

      case 'SHR':
        if (Tokenizer.isRegister(p1) && Tokenizer.isRegister(p2)) {
          return { type: Token.Opcode, value: Opcodes.SHR_REG_TO_REG }
        } else if (Tokenizer.isRegister(p1) && Tokenizer.isAddress(p2)) {
          return { type: Token.Opcode, value: Opcodes.SHR_ADDR_TO_REG }
        } else if (Tokenizer.isRegister(p1) && Tokenizer.isRegAddress(p2)) {
          return { type: Token.Opcode, value: Opcodes.SHR_REGADDR_TO_REG }
        } else if (Tokenizer.isRegister(p1) && Tokenizer.isNumber(p2)) {
          return { type: Token.Opcode, value: Opcodes.SHR_NUM_TO_REG }
        } else {
          throw new Error("SHR does not support this operands")
        }

      case 'NOT':
        if (Tokenizer.isRegister(p1)) {
          return { type: Token.Opcode, value: Opcodes.NOT_REG }
        } else {
          throw new Error("NOT does not support this operands")
        }

      default:
        throw new Error("Invalid instruction: " + keyword)
    }
  }

  static interpretLine(line: string) {
    let match = this.regex.exec(line)
    return {
      label: match![Groupings.Label],
      instruction: match![Groupings.Instruction],
      operand1: match![Groupings.Operand1],
      operand2: match![Groupings.Operand2],
      comment: match![Groupings.Comment],
    }
  }

  static parseNumber(input: string) {
    // allowed formats:
    // decimal: 200, 200d
    // octal: 100o
    // hexadecimal: 0xA4, $F4
    // binary: 101b

    let value: number = 0

    // hexadecimal
    if (input.slice(0, 2) === "0x") {
      value = parseInt(input.slice(2), 16)
    } else if (input.slice(0, 1) === "$") {
      value = parseInt(input.slice(1), 16)
    // binary
    } else if (input.slice(input.length - 1) === "b") {
      value = parseInt(input.slice(0, input.length - 1), 2)
    // octal
    } else if (input.slice(input.length - 1) === "o") {
       value = parseInt(input.slice(0, input.length - 1), 8)
    // decimal
    } else if (input.slice(input.length - 1) === "d") {
      value = parseInt(input.slice(0, input.length - 1), 10)
    } else if (this.regexNum.exec(input)) {
      value = parseInt(input, 10)
    } else {
      // FIXME: throw proper error
      throw "Invalid number format " + input
    }

    // NOTE: two's compliment will mess this up
    // MIN_INT: -128
    // MAX_INT:  127
    if (value < 0 || value > 255) {
      throw "This number is too damn high!"
    }

    return value
  }

  static parseRegister(input: string) {
    input = input.toUpperCase()
    switch (input) {
    case 'A':
      return 0x0
    case 'B':
      return 0x1
    case 'C':
      return 0x2
    case 'D':
      return 0x3
    case 'SP':
      return 0x4
    default:
      return undefined
    }
  }

  static parseLabel(input: string) {
    const r = /^[A-Za-z]\w*$/
    return r.test(input) ? input : undefined
  }

  static getValue(input: string): TokenizerValue {
    switch (input.slice(0, 1)) {
    case '[': // [regaddress], [address]
      // register address or an address
      let addr = input.slice(1, input.length - 1)
      let regaddress = this.parseRegister(addr)
      if (regaddress !== undefined) {
        return { type: Token.RegAddress, value: regaddress }
      } else {
        let label = this.parseLabel(addr)
        if (label !== undefined) {
          return { type: Token.Address, value: label }
        } else {
          let number = this.parseNumber(addr) 
          return { type: Token.Address, value: number }
        }
      }
    case '"': // "string"
      let str = input.slice(1, input.length - 1)
      let chars = []
      for (let i = 0, l = str.length; i < l; ++i) {
        chars.push(str.charCodeAt(i))
      }
      return { type: Token.String, value: chars }
    case '\'': // 'c'
      let char = input.slice(1, input.length - 1)
      if (char.length > 1) {
        throw new Error("Character constant too long.")
      }
      return { type: Token.Char, value: char.charCodeAt(0) }
    default:
      // register, number, label
      let register = this.parseRegister(input)
      if (register !== undefined) {
        return { type: Token.Register, value: register }
      } else {
        let label = this.parseLabel(input)
        if (label !== undefined) {
          return { type: Token.Number, value: label }
        } else {
          let number = this.parseNumber(input) 
          return { type: Token.Number, value: number }
        }
      }
    }
  }
  
  static getArguments(instruction: InstructionType, operand1: string | undefined, operand2: string | undefined): [TokenizerValue, TokenizerValue] {
    let p1: TokenizerValue;
    let p2: TokenizerValue;
    if (instruction !== undefined) {
      if (instruction.unary && !instruction.binary) {
        if (operand1 !== undefined && operand2 === undefined) {
          p1 = this.getValue(operand1)
        } else {
          // this is a unary instruction and expects one argument
          throw new Error("Too many instructions. This is a unary instruction, and expects one argument.")
        }
      } else if (!instruction.unary && instruction.binary) {
        if (operand1 !== undefined && operand2 !== undefined) {
          p1 = this.getValue(operand1)
          p2 = this.getValue(operand2)
        } else {
          // this is a binary instruction and expects two arguments
          throw new Error("Too few instructions. This is a binary instruction, and expects two arguments.")
        }
      } else if (!instruction.unary && !instruction.binary) {
        if (operand1 !== undefined || operand2 !== undefined) {
          // this instruction expects no arguments
          throw new Error("Too many instructions. This instruction expects no arguments")
        }
      }
    }
    return [p1, p2]
  }

  static tokenize(line: string) {
    let match = this.regex.exec(line)
    return {
      label: match![Groupings.Label],
      instruction: match![Groupings.Instruction],
      operand1: match![Groupings.Operand1],
      operand2: match![Groupings.Operand2],
      comment: match![Groupings.Comment],
    }
  }
}