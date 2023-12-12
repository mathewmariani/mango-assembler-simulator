import { InstructionType } from "./instructions";

export enum InterpreterGroupings {
  Label = 1,
  Instruction = 2,
  Operand1 = 3,
  Operand2 = 4,
  Comment = 5,
};

export enum InterpreterType {
  Number = 1,
  Char = 2,
  String = 3,
  Address = 4,
  Register = 5,
  RegAddress = 6,
};

export type InterpreterValue = { type: InterpreterType, value: number | number[] | string } | undefined;

export class Interpreter {
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


  static interpretLine(line: string) {
    return this.regex.exec(line)
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

  static getValue(input: string): InterpreterValue {
    switch (input.slice(0, 1)) {
    case '[': // [regaddress], [address]
      // register address or an address
      let addr = input.slice(1, input.length - 1)
      let regaddress = this.parseRegister(addr)
      if (regaddress !== undefined) {
        return { type: InterpreterType.RegAddress, value: regaddress }
      } else {
        let label = this.parseLabel(addr)
        if (label !== undefined) {
          return { type: InterpreterType.Address, value: label }
        } else {
          let number = this.parseNumber(addr) 
          return { type: InterpreterType.Address, value: number }
        }
      }
    case '"': // "string"
      let str = input.slice(1, input.length - 1)
      let chars = []
      for (let i = 0, l = str.length; i < l; ++i) {
        chars.push(str.charCodeAt(i))
      }
      return { type: InterpreterType.String, value: chars }
    case '\'': // 'c'
      let char = input.slice(1, input.length - 1)
      if (char.length > 1) {
        throw new Error("Character constant too long.")
      }
      return { type: InterpreterType.Char, value: char.charCodeAt(0) }
    default:
      // register, number, label
      let register = this.parseRegister(input)
      if (register !== undefined) {
        return { type: InterpreterType.Register, value: register }
      } else {
        let label = this.parseLabel(input)
      if (label !== undefined) {
        return { type: InterpreterType.Number, value: label }
      } else {
        let number = this.parseNumber(input) 
        return { type: InterpreterType.Number, value: number }
        }
      }
    }
  }
  
  static getArguments(instruction: InstructionType, operand1: string | undefined, operand2: string | undefined): [InterpreterValue, InterpreterValue] {
    let p1: InterpreterValue;
    let p2: InterpreterValue;
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
}