import { test, expect, describe } from "bun:test"
import { Interpreter, InterpreterGroupings, InterpreterType } from "../src/emulator/interpreter.ts"

//
// These tests validate that the `Interpreter` can interpret string inputs into instructions.
//

describe('Interpreter', () => {
//   describe('regexes', () => {
//     test('should match label', () => {
//       let match = undefined

//       match = assembler.regexLabel.exec("label:")
//       expect(match[0]).toBe("label:")
//       expect(match[1]).toBe("label")

//       match = assembler.regexLabel.exec("label")
//       expect(match).toBe(null)

//       match = assembler.regexLabel.exec("0label")
//       expect(match).toBe(null)
//     })
//     test('should match instruction', () => {
//       let match = undefined

//       match = assembler.regexInstruction.exec("mov")
//       expect(match[1]).toBe("mov")
//     })
//     test('should match operand', () => {
//       let match = undefined

//       // binary numbers
//       match = assembler.regexOperand.exec("1b")
//       expect(match[1]).toBe("1b")

//       // octal numbers
//       // FIXME: add octal support
//       // match = assembler.regexOperand.exec("1o")
//       // expect(match[1]).toBe("1o")

//       // decimal numbers
//       match = assembler.regexOperand.exec("1")
//       expect(match[1]).toBe("1")

//       match = assembler.regexOperand.exec("1d")
//       expect(match[1]).toBe("1d")

//       // hexadecimal numbers
//       match = assembler.regexOperand.exec("0x1")
//       expect(match[1]).toBe("0x1")

//       match = assembler.regexOperand.exec("$1")
//       expect(match[1]).toBe("$1")

//       // characters
//       match = assembler.regexOperand.exec("'c'")
//       expect(match[1]).toBe("'c'")

//       // strings
//       match = assembler.regexOperand.exec("\"string\"")
//       expect(match[1]).toBe("\"string\"")

//       // regaddress
//       match = assembler.regexOperand.exec("[A]")
//       expect(match[1]).toBe("[A]")
//     })
//   })

  describe('#interpretLine()', () => {
    test('should interpret line with all four fields.', () => {
      let groups = Interpreter.interpretLine("label: push a, b ;comment")
      expect(groups).not.toBeNull()
      if (groups) {
        expect(groups[InterpreterGroupings.Label]).toBe("label")
        expect(groups[InterpreterGroupings.Instruction]).toBe("push")
        expect(groups[InterpreterGroupings.Operand1]).toBe("a")
        expect(groups[InterpreterGroupings.Operand2]).toBe("b")
        // TODO: handle comments
        // expect(groups[InterpreterGroupings.Comment]).toBe("comment")
      }
    })
    test('should interpret line without a label.', () => {
      let groups = Interpreter.interpretLine("push a, b")
      expect(groups).not.toBeNull()
      if (groups) {
        expect(groups[InterpreterGroupings.Label]).toBe(undefined)
        expect(groups[InterpreterGroupings.Instruction]).toBe("push")
        expect(groups[InterpreterGroupings.Operand1]).toBe("a")
        expect(groups[InterpreterGroupings.Operand2]).toBe("b")
        expect(groups[InterpreterGroupings.Comment]).toBe(undefined)
      }
    })
    test('should interpret line with a unary operation', () => {
      let groups = Interpreter.interpretLine("push a")
      expect(groups).not.toBeNull()
      if (groups) {
        expect(groups[InterpreterGroupings.Label]).toBe(undefined)
        expect(groups[InterpreterGroupings.Instruction]).toBe("push")
        expect(groups[InterpreterGroupings.Operand1]).toBe("a")
        expect(groups[InterpreterGroupings.Operand2]).toBe(undefined)
        expect(groups[InterpreterGroupings.Comment]).toBe(undefined)
      }
    })
    test('should interpret line with an indirect unary operation', () => {
      let groups = Interpreter.interpretLine("push [a]")
      expect(groups).not.toBeNull()
      if (groups) {
        expect(groups[InterpreterGroupings.Label]).toBe(undefined)
        expect(groups[InterpreterGroupings.Instruction]).toBe("push")
        expect(groups[InterpreterGroupings.Operand1]).toBe("[a]")
        expect(groups[InterpreterGroupings.Operand2]).toBe(undefined)
        expect(groups[InterpreterGroupings.Comment]).toBe(undefined)
      }
    })
    test('should interpret line with a binary operation', () => {
      let groups = Interpreter.interpretLine("push a, b")
      expect(groups).not.toBeNull()
      if (groups) {
        expect(groups[InterpreterGroupings.Label]).toBe(undefined)
        expect(groups[InterpreterGroupings.Instruction]).toBe("push")
        expect(groups[InterpreterGroupings.Operand1]).toBe("a")
        expect(groups[InterpreterGroupings.Operand2]).toBe("b")
        expect(groups[InterpreterGroupings.Comment]).toBe(undefined)
      }
    })
    test('should interpret line with an indirect binary operation', () => {
      let groups = Interpreter.interpretLine("push [a], b")
      expect(groups).not.toBeNull()
      if (groups) {
        expect(groups[InterpreterGroupings.Label]).toBe(undefined)
        expect(groups[InterpreterGroupings.Instruction]).toBe("push")
        expect(groups[InterpreterGroupings.Operand1]).toBe("[a]")
        expect(groups[InterpreterGroupings.Operand2]).toBe("b")
        expect(groups[InterpreterGroupings.Comment]).toBe(undefined)
      }
    })
    test('should interpret psuedo instructions', () => {
      let groups = undefined

      groups = Interpreter.interpretLine("DB \"string\"")
      expect(groups).not.toBeNull()
      if (groups) {
        expect(groups[InterpreterGroupings.Label]).toBe(undefined)
        expect(groups[InterpreterGroupings.Instruction]).toBe("DB")
        expect(groups[InterpreterGroupings.Operand1]).toBe("\"string\"")
        expect(groups[InterpreterGroupings.Operand2]).toBe(undefined)
        expect(groups[InterpreterGroupings.Comment]).toBe(undefined)
      }

      groups = Interpreter.interpretLine("DB 'c'")
      expect(groups).not.toBeNull()
      if (groups) {
        expect(groups[InterpreterGroupings.Label]).toBe(undefined)
        expect(groups[InterpreterGroupings.Instruction]).toBe("DB")
        expect(groups[InterpreterGroupings.Operand1]).toBe("'c'")
        expect(groups[InterpreterGroupings.Operand2]).toBe(undefined)
        expect(groups[InterpreterGroupings.Comment]).toBe(undefined)
      }

      groups = Interpreter.interpretLine("DB 6")
      expect(groups).not.toBeNull()
      if (groups) {
        expect(groups[InterpreterGroupings.Label]).toBe(undefined)
        expect(groups[InterpreterGroupings.Instruction]).toBe("DB")
        expect(groups[InterpreterGroupings.Operand1]).toBe("6")
        expect(groups[InterpreterGroupings.Operand2]).toBe(undefined)
        expect(groups[InterpreterGroupings.Comment]).toBe(undefined)
      }
    })
    test('should interpret psuedo instructions', () => {
      let groups = undefined

      groups = Interpreter.interpretLine("DB \"string\"")
      expect(groups).not.toBeNull()
      if (groups) {
        expect(groups[InterpreterGroupings.Label]).toBe(undefined)
        expect(groups[InterpreterGroupings.Instruction]).toBe("DB")
        expect(groups[InterpreterGroupings.Operand1]).toBe("\"string\"")
        expect(groups[InterpreterGroupings.Operand2]).toBe(undefined)
        expect(groups[InterpreterGroupings.Comment]).toBe(undefined)
      }

      groups = Interpreter.interpretLine("DB 'c'")
      expect(groups).not.toBeNull()
      if (groups) {
        expect(groups[InterpreterGroupings.Label]).toBe(undefined)
        expect(groups[InterpreterGroupings.Instruction]).toBe("DB")
        expect(groups[InterpreterGroupings.Operand1]).toBe("'c'")
        expect(groups[InterpreterGroupings.Operand2]).toBe(undefined)
        expect(groups[InterpreterGroupings.Comment]).toBe(undefined)
      }

      groups = Interpreter.interpretLine("DB 6")
      expect(groups).not.toBeNull()
      if (groups) {
        expect(groups[InterpreterGroupings.Label]).toBe(undefined)
        expect(groups[InterpreterGroupings.Instruction]).toBe("DB")
        expect(groups[InterpreterGroupings.Operand1]).toBe("6")
        expect(groups[InterpreterGroupings.Operand2]).toBe(undefined)
        expect(groups[InterpreterGroupings.Comment]).toBe(undefined)
      }
    })
  })

  describe('#parseNumber()', () => {
    test('should parse allowed number formats.', () => {
      // binary 
      expect(Interpreter.parseNumber("101b")).toBe(5)

      // octal
      expect(Interpreter.parseNumber("100o")).toBe(64)

      // decimal
      expect(Interpreter.parseNumber("200")).toBe(200)
      expect(Interpreter.parseNumber("+200")).toBe(200)
      
      expect(Interpreter.parseNumber("200d")).toBe(200)
      expect(Interpreter.parseNumber("+200d")).toBe(200)
      
      // hex
      expect(Interpreter.parseNumber("0xA4")).toBe(164)
      expect(Interpreter.parseNumber("$A4")).toBe(164)
    })
    test('should throw on numbers outside range [0, 255].', () => {
      // binary
      expect(Interpreter.parseNumber.bind(Interpreter, "100000000b")).toThrow()

      // octal
      expect(Interpreter.parseNumber.bind(Interpreter, "400o")).toThrow()

      // decimal
      expect(Interpreter.parseNumber.bind(Interpreter, "-200")).toThrow()
      expect(Interpreter.parseNumber.bind(Interpreter, "-200d")).toThrow()

      // hex
      expect(Interpreter.parseNumber.bind(Interpreter, "0xFFF")).toThrow()
      expect(Interpreter.parseNumber.bind(Interpreter, "$FFF")).toThrow()
    })
  })

  describe('#parseRegister()', () => {
    test('should return proper register index.', () => {
      let value = undefined

      value = Interpreter.parseRegister('a')
      expect(value).toBe(0)

      value = Interpreter.parseRegister('b')
      expect(value).toBe(1)

      value = Interpreter.parseRegister('c')
      expect(value).toBe(2)

      value = Interpreter.parseRegister('d')
      expect(value).toBe(3)

      value = Interpreter.parseRegister('sp')
      expect(value).toBe(4)
    })
    test('should return undefined for unknown register index.', () => {
      let value = Interpreter.parseRegister('f')
      expect(value).toBe(undefined)
    })
  })

  describe('#getValue()', () => {
    test('should return proper <type, value> pair.', () => {
      let value = undefined

      value = Interpreter.getValue("[a]")
      expect(value!.type).toBe(InterpreterType.RegAddress)
      expect(value!.value).toBe(0x0)

      value = Interpreter.getValue("[0x64]")
      expect(value!.type).toBe(InterpreterType.Address)
      expect(value!.value).toBe(0x64)

      value = Interpreter.getValue("\"a\"")
      expect(value!.type).toBe(InterpreterType.String)
      expect(value!.value).toHaveLength(1)
      expect(value!.value).toEqual([0x61])

      value = Interpreter.getValue("\"ab\"")
      expect(value!.type).toBe(InterpreterType.String)
      expect(value!.value).toHaveLength(2)
      expect(value!.value).toEqual([0x61, 0x62])

      value = Interpreter.getValue("'a'")
      expect(value!.type).toBe(InterpreterType.Char)
      expect(value!.value).toBe(0x61)

      value = Interpreter.getValue("a")
      expect(value!.type).toBe(InterpreterType.Register)
      expect(value!.value).toBe(0x0)

      value = Interpreter.getValue("0x64")
      expect(value!.type).toBe(InterpreterType.Number)
      expect(value!.value).toBe(0x64)
    })
    test('should throw when using multiple characters', () => {
      expect(Interpreter.getValue.bind(Interpreter, "'ab'")).toThrow()
    })
  })

  describe('#getArguments()', () => {
    test('were just playing around right now too many arguments.', () => {
      const instruction = { unary: false, binary: false }
      const op1 = undefined
      const op2 = undefined

      // FIXME: this will throw an errror, we dont want this error.
      const [p1, p2] = Interpreter.getArguments(instruction, op1, op2)

      expect(p1).toEqual(undefined)
      expect(p2).toEqual(undefined)
    })
    test('were just playing around right now too many arguments.', () => {
      const instruction = { unary: false, binary: false }
      const op1 = "A"
      const op2 = "B"

      expect(Interpreter.getArguments.bind(Interpreter, instruction, op1, op2)).toThrow()
    })
    test('should get all arguments for unary instruction.', () => {
      const instruction = { unary: true, binary: false }
      const op1 = "A"
      const op2 = undefined

      const [p1, p2] = Interpreter.getArguments(instruction, op1, op2)

      expect(p1).toEqual({ type: InterpreterType.Register, value: 0x0 })
      expect(p2).toEqual(undefined)
    })
    test('should throw for unary instruction with extra arguments.', () => {
      const instruction = { unary: true, binary: false }
      const op1 = "A"
      const op2 = "B"

      expect(Interpreter.getArguments.bind(Interpreter, instruction, op1, op2)).toThrow()
    })
    test('should throw for unary instruction with too few arguments.', () => {
      const instruction = { unary: true, binary: false }
      const op1 = undefined
      const op2 = undefined

      expect(Interpreter.getArguments.bind(Interpreter, instruction, op1, op2)).toThrow()
    })
    test('should get all arguments for binary instruction.', () => {
      const instruction = { unary: false, binary: true }
      const op1 = "A"
      const op2 = "B"

      const [p1, p2] = Interpreter.getArguments(instruction, op1, op2)

      expect(p1).toEqual({ type: InterpreterType.Register, value: 0x0 })
      expect(p2).toEqual({ type: InterpreterType.Register, value: 0x1 })
    })
    test('should throw for binary instruction with too few arguments.', () => {
      const instruction = { unary: false, binary: true }
      const op1 = "A"
      const op2 = undefined

      expect(Interpreter.getArguments.bind(Interpreter, instruction, op1, op2)).toThrow()
    })
  })
})