import { test, expect, describe, beforeEach } from "@jest/globals"
import Assembler from "../src/emulator/assembler"
import { Opcodes } from "../src/emulator/opcodes"

//
// These tests validate that the `Assembler` can assemble instructions into bytecode.
//

describe('Instructions', () => {
  let assembler = new Assembler()
  
  describe('psuedo instructions', () => {
    describe('DB', () => {
      beforeEach(function() {
        assembler.reset()
      })
      test('should assemble number.', () => {
        // binary number
        assembler.assemble("DB 01100100b")
        expect(assembler.code).toHaveLength(1)
        expect(assembler.code).toEqual([0x64])

        // octal number
        assembler.assemble("DB 144o")
        expect(assembler.code).toHaveLength(1)
        expect(assembler.code).toEqual([0x64])

        // decimal number
        assembler.assemble("DB 100")
        expect(assembler.code).toHaveLength(1)
        expect(assembler.code).toEqual([0x64])

        assembler.assemble("DB 100d")
        expect(assembler.code).toHaveLength(1)
        expect(assembler.code).toEqual([0x64])

        // hexadecimal number
        assembler.assemble("DB 0x64")
        expect(assembler.code).toHaveLength(1)
        expect(assembler.code).toEqual([0x64])

        assembler.assemble("DB $64")
        expect(assembler.code).toHaveLength(1)
        expect(assembler.code).toEqual([0x64])
      })
      test('should assemble character.', () => {
        assembler.assemble("DB 'c'")
        expect(assembler.code).toHaveLength(1)
        expect(assembler.code).toEqual([0x63])
      })
      test('should assemble string.', () => {
        assembler.assemble("DB \"string\"")
        expect(assembler.code).toHaveLength(6)
        expect(assembler.code).toEqual([0x73, 0x74, 0x72, 0x69, 0x6e, 0x67])
      })
    })
  })

  describe('halt instructions', () => {
    describe('HLT', () => {
      beforeEach(function() {
        assembler.reset()
      })
      test('should assemble HLT.', () => {
        assembler.assemble("HLT")
        expect(assembler.code).toHaveLength(1)
        expect(assembler.code).toEqual([0x0])
      })
    })
  })

  describe('move instructions', () => {
    describe('MOV', () => {
      beforeEach(function() {
        assembler.reset()
      })
      test('should assemble REG_TO_REG.', () => {
        assembler.assemble("MOV A, B")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.MOV_REG_TO_REG, 0x0, 0x1])
      })
      test('should assemble REG_TO_REGADDR.', () => {
        assembler.assemble("MOV [A], B")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.MOV_REG_TO_REGADDR, 0x0, 0x1])
      })
      test('should assemble ADDR_TO_REG.', () => {
        assembler.assemble("MOV A, [2]")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.MOV_ADDR_TO_REG, 0x0, 0x2])
      })
      test('should assemble REGADDR_TO_REG.', () => {
        assembler.assemble("MOV A, [B]")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.MOV_REGADDR_TO_REG, 0x0, 0x1])
      })
      test('should assemble REGADDR_TO_ADDR.', () => {
        assembler.assemble("MOV [0], A")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.MOV_REG_TO_ADDR, 0x0, 0x0])
      })
      test('should assemble NUM_TO_REG.', () => {
        assembler.assemble("MOV A, 10")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.MOV_NUM_TO_REG, 0x0, 0xA])
      })
      test('should assemble NUM_TO_ADDR.', () => {
        assembler.assemble("MOV [0], 10")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.MOV_NUM_TO_ADDR, 0x0, 0xA])
      })
      test('should assemble NUM_TO_REGADDR.', () => {
        assembler.assemble("MOV [A], 10")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.MOV_NUM_TO_REGADDR, 0x0, 0xA])
      })
      test('should not assemble unsupported operands.', () => {
        // UNARY
        expect(assembler.assemble.bind(assembler, "MOV A")).toThrow()

        // REG_TO_NUM
        expect(assembler.assemble.bind(assembler, "MOV 0, A")).toThrow()

        // ADDR_TO_ADDR
        // ADDR_TO_REGADDR
        // ADDR_TO_NUM
        expect(assembler.assemble.bind(assembler, "MOV [0], [0]")).toThrow()
        expect(assembler.assemble.bind(assembler, "MOV [A], [0]")).toThrow()
        expect(assembler.assemble.bind(assembler, "MOV 100, [0]")).toThrow()

        // REGADDR_TO_ADDR
        // REGADDR_TO_REGADDR
        // REGADDR_TO_NUM
        expect(assembler.assemble.bind(assembler, "MOV [0], [A]")).toThrow()
        expect(assembler.assemble.bind(assembler, "MOV [A], [A]")).toThrow()
        expect(assembler.assemble.bind(assembler, "MOV 100, [A]")).toThrow()

        // NUM_TO_NUM
        expect(assembler.assemble.bind(assembler, "MOV 0, 0")).toThrow()
      })
    })
  })

  describe('arithmatic instructions', () => {
    describe('ADD', () => {
      beforeEach(function() {
        assembler.reset()
      })
      test('should assemble REG_TO_REG.', () => {
        assembler.assemble("ADD A, B")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.ADD_REG_TO_REG, 0x0, 0x1])
      })
      test('should assemble ADDR_TO_REG.', () => {
        assembler.assemble("ADD A, [2]")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.ADD_ADDR_TO_REG, 0x0, 0x2])
      })
      test('should assemble REGADDR_TO_REG.', () => {
        assembler.assemble("ADD A, [B]")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.ADD_REGADDR_TO_REG, 0x0, 0x1])
      })
      test('should assemble NUM_TO_REG.', () => {
        assembler.assemble("ADD A, 100")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.ADD_NUM_TO_REG, 0x0, 0x64])
      })
      test('should not assemble unsupported operands.', () => {
        // UNARY
        expect(assembler.assemble.bind(assembler, "ADD A")).toThrow()

        // REG_TO_ADDR
        // REG_TO_REGADDR
        // REG_TO_NUM
        expect(assembler.assemble.bind(assembler, "ADD [1], A")).toThrow()
        expect(assembler.assemble.bind(assembler, "ADD [A], A")).toThrow()
        expect(assembler.assemble.bind(assembler, "ADD 100, A")).toThrow()

        // ADDR_TO_ADDR
        // ADDR_TO_REGADDR
        // ADDR_TO_NUM
        expect(assembler.assemble.bind(assembler, "ADD [0], [0]")).toThrow()
        expect(assembler.assemble.bind(assembler, "ADD [A], [0]")).toThrow()
        expect(assembler.assemble.bind(assembler, "ADD 100, [0]")).toThrow()

        // REGADDR_TO_ADDR
        // REGADDR_TO_REGADDR
        // REGADDR_TO_NUM
        expect(assembler.assemble.bind(assembler, "ADD [0], [A]")).toThrow()
        expect(assembler.assemble.bind(assembler, "ADD [A], [A]")).toThrow()
        expect(assembler.assemble.bind(assembler, "ADD 100, [A]")).toThrow()

        // NUM_TO_ADDR
        // NUM_TO_REGADDR
        // NUM_TO_NUM
        expect(assembler.assemble.bind(assembler, "ADD [0], 0")).toThrow()
        expect(assembler.assemble.bind(assembler, "ADD [A], 0")).toThrow()
        expect(assembler.assemble.bind(assembler, "ADD 100, 0")).toThrow()
      })
    })

    describe('SUBT', () => {
      beforeEach(function() {
        assembler.reset()
      })
      test('should assemble REG_TO_REG.', () => {
        assembler.assemble("SUBT A, B")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.SUBT_REG_FROM_REG, 0x0, 0x1])
      })
      test('should assemble ADDR_TO_REG.', () => {
        assembler.assemble("SUBT A, [2]")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.SUBT_ADDR_FROM_REG, 0x0, 0x2])
      })
      test('should assemble REGADDR_TO_REG.', () => {
        assembler.assemble("SUBT A, [B]")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.SUBT_REGADDR_FROM_REG, 0x0, 0x1])
      })
      test('should assemble NUM_TO_REG.', () => {
        assembler.assemble("SUBT A, 100")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.SUBT_NUM_FROM_REG, 0x0, 0x64])
      })
      test('should not assemble unsupported operands.', () => {
        // UNARY
        expect(assembler.assemble.bind(assembler, "SUBT A")).toThrow()

        // REG_TO_ADDR
        // REG_TO_REGADDR
        // REG_TO_NUM
        expect(assembler.assemble.bind(assembler, "SUBT [1], A")).toThrow()
        expect(assembler.assemble.bind(assembler, "SUBT [A], A")).toThrow()
        expect(assembler.assemble.bind(assembler, "SUBT 100, A")).toThrow()

        // ADDR_TO_ADDR
        // ADDR_TO_REGADDR
        // ADDR_TO_NUM
        expect(assembler.assemble.bind(assembler, "SUBT [0], [0]")).toThrow()
        expect(assembler.assemble.bind(assembler, "SUBT [A], [0]")).toThrow()
        expect(assembler.assemble.bind(assembler, "SUBT 100, [0]")).toThrow()

        // REGADDR_TO_ADDR
        // REGADDR_TO_REGADDR
        // REGADDR_TO_NUM
        expect(assembler.assemble.bind(assembler, "SUBT [0], [A]")).toThrow()
        expect(assembler.assemble.bind(assembler, "SUBT [A], [A]")).toThrow()
        expect(assembler.assemble.bind(assembler, "SUBT 100, [A]")).toThrow()

        // NUM_TO_ADDR
        // NUM_TO_REGADDR
        // NUM_TO_NUM
        expect(assembler.assemble.bind(assembler, "SUBT [0], 0")).toThrow()
        expect(assembler.assemble.bind(assembler, "SUBT [A], 0")).toThrow()
        expect(assembler.assemble.bind(assembler, "SUBT 100, 0")).toThrow()
      })
    })

    describe('INC', () => {
      beforeEach(function() {
        assembler.reset()
      })
      test('should assemble REG.', () => {
        assembler.assemble("INC A")
        expect(assembler.code).toHaveLength(2)
        expect(assembler.code).toEqual([Opcodes.INC_REG, 0x0])
      })
      test('should not assemble unsupported operands.', () => {
        // BINARY
        expect(assembler.assemble.bind(assembler, "INC A, B")).toThrow()

        // ADDR
        expect(assembler.assemble.bind(assembler, "INC [0]")).toThrow()

        // REGADDR
        expect(assembler.assemble.bind(assembler, "INC [A]")).toThrow()

        // NUM
        expect(assembler.assemble.bind(assembler, "INC 100")).toThrow()
      })
    })

    describe('DEC', () => {
      beforeEach(function() {
        assembler.reset()
      })
      test('should assemble REG.', () => {
        assembler.assemble("DEC A")
        expect(assembler.code).toHaveLength(2)
        expect(assembler.code).toEqual([Opcodes.DEC_REG, 0x0])
      })
      test('should not assemble unsupported operands.', () => {
        // BINARY
        expect(assembler.assemble.bind(assembler, "DEC A, B")).toThrow()

        // INC_ADDR
        expect(assembler.assemble.bind(assembler, "DEC [0]")).toThrow()

        // INC_REGADDR
        expect(assembler.assemble.bind(assembler, "DEC [A]")).toThrow()

        // INC_NUM
        expect(assembler.assemble.bind(assembler, "DEC 100")).toThrow()
      })
    })
  })

  describe('comparison instructions', () => {
    describe('CMP', () => {
      beforeEach(function() {
        assembler.reset()
      })
      test('should assemble REG_TO_REG.', () => {
        assembler.assemble("CMP A, B")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.CMP_REG_TO_REG, 0x0, 0x1])
      })
      test('should assemble ADDR_TO_REG.', () => {
        assembler.assemble("CMP A, [2]")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.CMP_ADDR_TO_REG, 0x0, 0x2])
      })
      test('should assemble REGADDR_TO_REG.', () => {
        assembler.assemble("CMP A, [B]")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.CMP_REGADDR_TO_REG, 0x0, 0x1])
      })
      test('should assemble NUM_TO_REG.', () => {
        assembler.assemble("CMP A, 100")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.CMP_NUM_TO_REG, 0x0, 0x64])
      })
      test('should not assemble unsupported operands.', () => {
        // UNARY
        expect(assembler.assemble.bind(assembler, "CMP A")).toThrow()

        // REG_TO_ADDR
        // REG_TO_REGADDR
        // REG_TO_NUM
        expect(assembler.assemble.bind(assembler, "CMP [1], A")).toThrow()
        expect(assembler.assemble.bind(assembler, "CMP [A], A")).toThrow()
        expect(assembler.assemble.bind(assembler, "CMP 100, A")).toThrow()

        // ADDR_TO_ADDR
        // ADDR_TO_REGADDR
        // ADDR_TO_NUM
        expect(assembler.assemble.bind(assembler, "CMP [0], [0]")).toThrow()
        expect(assembler.assemble.bind(assembler, "CMP [A], [0]")).toThrow()
        expect(assembler.assemble.bind(assembler, "CMP 100, [0]")).toThrow()

        // REGADDR_TO_ADDR
        // REGADDR_TO_REGADDR
        // REGADDR_TO_NUM
        expect(assembler.assemble.bind(assembler, "CMP [0], [A]")).toThrow()
        expect(assembler.assemble.bind(assembler, "CMP [A], [A]")).toThrow()
        expect(assembler.assemble.bind(assembler, "CMP 100, [A]")).toThrow()

        // NUM_TO_ADDR
        // NUM_TO_REGADDR
        // NUM_TO_NUM
        expect(assembler.assemble.bind(assembler, "CMP [0], 0")).toThrow()
        expect(assembler.assemble.bind(assembler, "CMP [A], 0")).toThrow()
        expect(assembler.assemble.bind(assembler, "CMP 100, 0")).toThrow()
      })
    })
  })

  describe('subroutine instructions', () => {
    describe('CALL', () => {
      beforeEach(function() {
        assembler.reset()
      })
      test('should assemble ADDR.', () => {
        assembler.assemble("CALL 0x0")
        expect(assembler.code).toHaveLength(2)
        expect(assembler.code).toEqual([Opcodes.CALL_ADDR, 0x0])
      })
      test('should assemble REGADDR.', () => {
        assembler.assemble("CALL [A]")
        expect(assembler.code).toHaveLength(2)
        expect(assembler.code).toEqual([Opcodes.CALL_REGADDR, 0x0])
      })
      test('should not assemble unsupported operands.', () => {
        // BINARY
        expect(assembler.assemble.bind(assembler, "CALL A, B")).toThrow()

        // REG
        expect(assembler.assemble.bind(assembler, "CALL A")).toThrow()

        // ADDR
        expect(assembler.assemble.bind(assembler, "CALL [0x5]")).toThrow()
      })
    })

    describe('RET', () => {
      beforeEach(function() {
        assembler.reset()
      })
      test('should assemble.', () => {
        assembler.assemble("RET")
        expect(assembler.code).toHaveLength(1)
        expect(assembler.code).toEqual([Opcodes.RET])
      })
      test('should not assemble unsupported operands.', () => {
        // BINARY
        expect(assembler.assemble.bind(assembler, "RET A")).toThrow()

        // UNARY
        expect(assembler.assemble.bind(assembler, "RET A, B")).toThrow()
      })
    })
  })

  describe('jump instructions', () => {
    describe('JMP', () => {
      beforeEach(function() {
        assembler.reset()
      })
      test('should assemble ADDR.', () => {
        assembler.assemble("JMP 0x0")
        expect(assembler.code).toHaveLength(2)
        expect(assembler.code).toEqual([Opcodes.JMP_ADDR, 0x0])
      })
      test('should assemble REGADDR.', () => {
        assembler.assemble("JMP [A]")
        expect(assembler.code).toHaveLength(2)
        expect(assembler.code).toEqual([Opcodes.JMP_REGADDR, 0x0])
      })
      test('should not assemble unsupported operands.', () => {
        // BINARY
        expect(assembler.assemble.bind(assembler, "JMP A, B")).toThrow()

        // REG
        expect(assembler.assemble.bind(assembler, "JMP A")).toThrow()

        // NUM
        expect(assembler.assemble.bind(assembler, "JMP [0]")).toThrow()
      })
    })
    describe('JC', () => {
      beforeEach(function() {
        assembler.reset()
      })
      test('should assemble ADDR.', () => {
        assembler.assemble("JC 0x0")
        expect(assembler.code).toHaveLength(2)
        expect(assembler.code).toEqual([Opcodes.JC_ADDR, 0x0])
      })
      test('should assemble REGADDR.', () => {
        assembler.assemble("JC [A]")
        expect(assembler.code).toHaveLength(2)
        expect(assembler.code).toEqual([Opcodes.JC_REGADDR, 0x0])
      })
      test('should not assemble unsupported operands.', () => {
        // BINARY
        expect(assembler.assemble.bind(assembler, "JC A, B")).toThrow()

        // REG
        expect(assembler.assemble.bind(assembler, "JC A")).toThrow()

        // NUM
        expect(assembler.assemble.bind(assembler, "JC [0]")).toThrow()
      })
    })
    describe('JNC', () => {
      beforeEach(function() {
        assembler.reset()
      })
      test('should assemble ADDR.', () => {
        assembler.assemble("JNC 0x0")
        expect(assembler.code).toHaveLength(2)
        expect(assembler.code).toEqual([Opcodes.JNC_ADDR, 0x0])
      })
      test('should assemble REGADDR.', () => {
        assembler.assemble("JNC [A]")
        expect(assembler.code).toHaveLength(2)
        expect(assembler.code).toEqual([Opcodes.JNC_REGADDR, 0x0])
      })
      test('should not assemble unsupported operands.', () => {
        // BINARY
        expect(assembler.assemble.bind(assembler, "JNC A, B")).toThrow()

        // REG
        expect(assembler.assemble.bind(assembler, "JNC A")).toThrow()

        // NUM
        expect(assembler.assemble.bind(assembler, "JNC [0]")).toThrow()
      })
    })
    describe('JZ', () => {
      beforeEach(function() {
        assembler.reset()
      })
      test('should assemble ADDR.', () => {
        assembler.assemble("JZ 0x0")
        expect(assembler.code).toHaveLength(2)
        expect(assembler.code).toEqual([Opcodes.JZ_ADDR, 0x0])
      })
      test('should assemble REGADDR.', () => {
        assembler.assemble("JZ [A]")
        expect(assembler.code).toHaveLength(2)
        expect(assembler.code).toEqual([Opcodes.JZ_REGADDR, 0x0])
      })
      test('should not assemble unsupported operands.', () => {
        // BINARY
        expect(assembler.assemble.bind(assembler, "JZ A, B")).toThrow()

        // REG
        expect(assembler.assemble.bind(assembler, "JZ A")).toThrow()

        // NUM
        expect(assembler.assemble.bind(assembler, "JZ [0]")).toThrow()
      })
    })
    describe('JNZ', () => {
      beforeEach(function() {
        assembler.reset()
      })
      test('should assemble ADDR.', () => {
        assembler.assemble("JNZ 0x0")
        expect(assembler.code).toHaveLength(2)
        expect(assembler.code).toEqual([Opcodes.JNZ_ADDR, 0x0])
      })
      test('should assemble REGADDR.', () => {
        assembler.assemble("JNZ [A]")
        expect(assembler.code).toHaveLength(2)
        expect(assembler.code).toEqual([Opcodes.JNZ_REGADDR, 0x0])
      })
      test('should not assemble unsupported operands.', () => {
        // BINARY
        expect(assembler.assemble.bind(assembler, "JNZ A, B")).toThrow()

        // REG
        expect(assembler.assemble.bind(assembler, "JNZ A")).toThrow()

        // NUM
        expect(assembler.assemble.bind(assembler, "JNZ [0]")).toThrow()
      })
    })
    describe('JA', () => {
      beforeEach(function() {
        assembler.reset()
      })
      test('should assemble ADDR.', () => {
        assembler.assemble("JA 0x0")
        expect(assembler.code).toHaveLength(2)
        expect(assembler.code).toEqual([Opcodes.JA_ADDR, 0x0])
      })
      test('should assemble REGADDR.', () => {
        assembler.assemble("JA [A]")
        expect(assembler.code).toHaveLength(2)
        expect(assembler.code).toEqual([Opcodes.JA_REGADDR, 0x0])
      })
      test('should not assemble unsupported operands.', () => {
        // BINARY
        expect(assembler.assemble.bind(assembler, "JA A, B")).toThrow()

        // REG
        expect(assembler.assemble.bind(assembler, "JA A")).toThrow()

        // NUM
        expect(assembler.assemble.bind(assembler, "JA [0]")).toThrow()
      })
    })
    describe('JNA', () => {
      beforeEach(function() {
        assembler.reset()
      })
      test('should assemble ADDR.', () => {
        assembler.assemble("JNA 0x0")
        expect(assembler.code).toHaveLength(2)
        expect(assembler.code).toEqual([Opcodes.JNA_ADDR, 0x0])
      })
      test('should assemble REGADDR.', () => {
        assembler.assemble("JNA [A]")
        expect(assembler.code).toHaveLength(2)
        expect(assembler.code).toEqual([Opcodes.JNA_REGADDR, 0x0])
      })
      test('should not assemble unsupported operands.', () => {
        // BINARY
        expect(assembler.assemble.bind(assembler, "JNA A, B")).toThrow()

        // REG
        expect(assembler.assemble.bind(assembler, "JNA A")).toThrow()

        // NUM
        expect(assembler.assemble.bind(assembler, "JNA [0]")).toThrow()
      })
    })
  })

  describe('stack instructions', () => {
    describe('PUSH', () => {
      beforeEach(function() {
        assembler.reset()
      })
      test('should assemble REG.', () => {
        assembler.assemble("PUSH A")
        expect(assembler.code).toHaveLength(2)
        expect(assembler.code).toEqual([Opcodes.PUSH_REG, 0x0])
      })
      test('should assemble ADDR.', () => {
        assembler.assemble("PUSH [6]")
        expect(assembler.code).toHaveLength(2)
        expect(assembler.code).toEqual([Opcodes.PUSH_ADDR, 0x6])
      })
      test('should assemble REGADDR.', () => {
        assembler.assemble("PUSH [A]")
        expect(assembler.code).toHaveLength(2)
        expect(assembler.code).toEqual([Opcodes.PUSH_REGADDR, 0x0])
      })
      test('should assemble NUM.', () => {
        assembler.assemble("PUSH 100")
        expect(assembler.code).toHaveLength(2)
        expect(assembler.code).toEqual([Opcodes.PUSH_NUM, 0x64])
      })
      test('should not assemble unsupported operands.', () => {
        // BINARY
        expect(assembler.assemble.bind(assembler, "POP A, B")).toThrow()

        // ADDR
        expect(assembler.assemble.bind(assembler, "POP [0]")).toThrow()

        // REGADDR
        expect(assembler.assemble.bind(assembler, "POP [A]")).toThrow()

        // NUM
        expect(assembler.assemble.bind(assembler, "POP 100")).toThrow()
      })
    })

    describe('POP', () => {
      beforeEach(function() {
        assembler.reset()
      })
      test('should assemble REG.', () => {
        assembler.assemble("POP A")
        expect(assembler.code).toHaveLength(2)
        expect(assembler.code).toEqual([Opcodes.POP_REG, 0x0])
      })
      test('should not assemble unsupported operands.', () => {
        // BINARY
        expect(assembler.assemble.bind(assembler, "POP A, B")).toThrow()

        // ADDR
        expect(assembler.assemble.bind(assembler, "POP [0]")).toThrow()

        // REGADDR
        expect(assembler.assemble.bind(assembler, "POP [A]")).toThrow()

        // NUM
        expect(assembler.assemble.bind(assembler, "POP 100")).toThrow()
      })
    })
  })

  describe('binary instructions', () => {
    describe('AND', () => {
      beforeEach(function() {
        assembler.reset()
      })
      test('should assemble REG_TO_REG.', () => {
        assembler.assemble("AND A, B")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.AND_REG_TO_REG, 0x0, 0x1])
      })
      test('should assemble ADDR_TO_REG.', () => {
        assembler.assemble("AND A, [2]")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.AND_ADDR_TO_REG, 0x0, 0x2])
      })
      test('should assemble REGADDR_TO_REG.', () => {
        assembler.assemble("AND A, [B]")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.AND_REGADDR_TO_REG, 0x0, 0x1])
      })
      test('should assemble NUM_TO_REG.', () => {
        assembler.assemble("AND A, 100")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.AND_NUM_TO_REG, 0x0, 0x64])
      })
      test('should not assemble unsupported operands.', () => {
        // UNARY
        expect(assembler.assemble.bind(assembler, "AND A")).toThrow()

        // REG_TO_ADDR
        // REG_TO_REGADDR
        // REG_TO_NUM
        expect(assembler.assemble.bind(assembler, "AND [1], A")).toThrow()
        expect(assembler.assemble.bind(assembler, "AND [A], A")).toThrow()
        expect(assembler.assemble.bind(assembler, "AND 100, A")).toThrow()

        // ADDR_TO_ADDR
        // ADDR_TO_REGADDR
        // ADDR_TO_NUM
        expect(assembler.assemble.bind(assembler, "AND [0], [0]")).toThrow()
        expect(assembler.assemble.bind(assembler, "AND [A], [0]")).toThrow()
        expect(assembler.assemble.bind(assembler, "AND 100, [0]")).toThrow()

        // REGADDR_TO_ADDR
        // REGADDR_TO_REGADDR
        // REGADDR_TO_NUM
        expect(assembler.assemble.bind(assembler, "AND [0], [A]")).toThrow()
        expect(assembler.assemble.bind(assembler, "AND [A], [A]")).toThrow()
        expect(assembler.assemble.bind(assembler, "AND 100, [A]")).toThrow()

        // NUM_TO_ADDR
        // NUM_TO_REGADDR
        // NUM_TO_NUM
        expect(assembler.assemble.bind(assembler, "AND [0], 0")).toThrow()
        expect(assembler.assemble.bind(assembler, "AND [A], 0")).toThrow()
        expect(assembler.assemble.bind(assembler, "AND 100, 0")).toThrow()
      })
    })
    
    describe('OR', () => {
      beforeEach(function() {
        assembler.reset()
      })
      test('should assemble REG_TO_REG.', () => {
        assembler.assemble("OR A, B")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.OR_REG_TO_REG, 0x0, 0x1])
      })
      test('should assemble ADDR_TO_REG.', () => {
        assembler.assemble("OR A, [2]")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.OR_ADDR_TO_REG, 0x0, 0x2])
      })
      test('should assemble REGADDR_TO_REG.', () => {
        assembler.assemble("OR A, [B]")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.OR_REGADDR_TO_REG, 0x0, 0x1])
      })
      test('should assemble NUM_TO_REG.', () => {
        assembler.assemble("OR A, 100")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.OR_NUM_TO_REG, 0x0, 0x64])
      })
      test('should not assemble unsupported operands.', () => {
        // UNARY
        expect(assembler.assemble.bind(assembler, "OR A")).toThrow()

        // REG_TO_ADDR
        // REG_TO_REGADDR
        // REG_TO_NUM
        expect(assembler.assemble.bind(assembler, "OR [1], A")).toThrow()
        expect(assembler.assemble.bind(assembler, "OR [A], A")).toThrow()
        expect(assembler.assemble.bind(assembler, "OR 100, A")).toThrow()

        // ADDR_TO_ADDR
        // ADDR_TO_REGADDR
        // ADDR_TO_NUM
        expect(assembler.assemble.bind(assembler, "OR [0], [0]")).toThrow()
        expect(assembler.assemble.bind(assembler, "OR [A], [0]")).toThrow()
        expect(assembler.assemble.bind(assembler, "OR 100, [0]")).toThrow()

        // REGADDR_TO_ADDR
        // REGADDR_TO_REGADDR
        // REGADDR_TO_NUM
        expect(assembler.assemble.bind(assembler, "OR [0], [A]")).toThrow()
        expect(assembler.assemble.bind(assembler, "OR [A], [A]")).toThrow()
        expect(assembler.assemble.bind(assembler, "OR 100, [A]")).toThrow()

        // NUM_TO_ADDR
        // NUM_TO_REGADDR
        // NUM_TO_NUM
        expect(assembler.assemble.bind(assembler, "OR [0], 0")).toThrow()
        expect(assembler.assemble.bind(assembler, "OR [A], 0")).toThrow()
        expect(assembler.assemble.bind(assembler, "OR 100, 0")).toThrow()
      })
    })
    
    describe('XOR', () => {
      beforeEach(function() {
        assembler.reset()
      })
      test('should assemble REG_TO_REG.', () => {
        assembler.assemble("XOR A, B")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.XOR_REG_TO_REG, 0x0, 0x1])
      })
      test('should assemble ADDR_TO_REG.', () => {
        assembler.assemble("XOR A, [2]")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.XOR_ADDR_TO_REG, 0x0, 0x2])
      })
      test('should assemble REGADDR_TO_REG.', () => {
        assembler.assemble("XOR A, [B]")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.XOR_REGADDR_TO_REG, 0x0, 0x1])
      })
      test('should assemble NUM_TO_REG.', () => {
        assembler.assemble("XOR A, 100")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.XOR_NUM_TO_REG, 0x0, 0x64])
      })
      test('should not assemble unsupported operands.', () => {
        // UNARY
        expect(assembler.assemble.bind(assembler, "XOR A")).toThrow()

        // REG_TO_ADDR
        // REG_TO_REGADDR
        // REG_TO_NUM
        expect(assembler.assemble.bind(assembler, "XOR [1], A")).toThrow()
        expect(assembler.assemble.bind(assembler, "XOR [A], A")).toThrow()
        expect(assembler.assemble.bind(assembler, "XOR 100, A")).toThrow()

        // ADDR_TO_ADDR
        // ADDR_TO_REGADDR
        // ADDR_TO_NUM
        expect(assembler.assemble.bind(assembler, "XOR [0], [0]")).toThrow()
        expect(assembler.assemble.bind(assembler, "XOR [A], [0]")).toThrow()
        expect(assembler.assemble.bind(assembler, "XOR 100, [0]")).toThrow()

        // REGADDR_TO_ADDR
        // REGADDR_TO_REGADDR
        // REGADDR_TO_NUM
        expect(assembler.assemble.bind(assembler, "XOR [0], [A]")).toThrow()
        expect(assembler.assemble.bind(assembler, "XOR [A], [A]")).toThrow()
        expect(assembler.assemble.bind(assembler, "XOR 100, [A]")).toThrow()

        // NUM_TO_ADDR
        // NUM_TO_REGADDR
        // NUM_TO_NUM
        expect(assembler.assemble.bind(assembler, "XOR [0], 0")).toThrow()
        expect(assembler.assemble.bind(assembler, "XOR [A], 0")).toThrow()
        expect(assembler.assemble.bind(assembler, "XOR 100, 0")).toThrow()
      })
    })
    
    describe('SHL', () => {
      beforeEach(function() {
        assembler.reset()
      })
      test('should assemble REG_TO_REG.', () => {
        assembler.assemble("SHL A, B")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.SHL_REG_TO_REG, 0x0, 0x1])
      })
      test('should assemble ADDR_TO_REG.', () => {
        assembler.assemble("SHL A, [2]")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.SHL_ADDR_TO_REG, 0x0, 0x2])
      })
      test('should assemble REGADDR_TO_REG.', () => {
        assembler.assemble("SHL A, [B]")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.SHL_REGADDR_TO_REG, 0x0, 0x1])
      })
      test('should assemble NUM_TO_REG.', () => {
        assembler.assemble("SHL A, 100")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.SHL_NUM_TO_REG, 0x0, 0x64])
      })
      test('should not assemble unsupported operands.', () => {
        // UNARY
        expect(assembler.assemble.bind(assembler, "SHL A")).toThrow()

        // REG_TO_ADDR
        // REG_TO_REGADDR
        // REG_TO_NUM
        expect(assembler.assemble.bind(assembler, "SHL [1], A")).toThrow()
        expect(assembler.assemble.bind(assembler, "SHL [A], A")).toThrow()
        expect(assembler.assemble.bind(assembler, "SHL 100, A")).toThrow()

        // ADDR_TO_ADDR
        // ADDR_TO_REGADDR
        // ADDR_TO_NUM
        expect(assembler.assemble.bind(assembler, "SHL [0], [0]")).toThrow()
        expect(assembler.assemble.bind(assembler, "SHL [A], [0]")).toThrow()
        expect(assembler.assemble.bind(assembler, "SHL 100, [0]")).toThrow()

        // REGADDR_TO_ADDR
        // REGADDR_TO_REGADDR
        // REGADDR_TO_NUM
        expect(assembler.assemble.bind(assembler, "SHL [0], [A]")).toThrow()
        expect(assembler.assemble.bind(assembler, "SHL [A], [A]")).toThrow()
        expect(assembler.assemble.bind(assembler, "SHL 100, [A]")).toThrow()

        // NUM_TO_ADDR
        // NUM_TO_REGADDR
        // NUM_TO_NUM
        expect(assembler.assemble.bind(assembler, "SHL [0], 0")).toThrow()
        expect(assembler.assemble.bind(assembler, "SHL [A], 0")).toThrow()
        expect(assembler.assemble.bind(assembler, "SHL 100, 0")).toThrow()
      })
    })

    describe('SHR', () => {
      beforeEach(function() {
        assembler.reset()
      })
      test('should assemble REG_TO_REG.', () => {
        assembler.assemble("SHR A, B")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.SHR_REG_TO_REG, 0x0, 0x1])
      })
      test('should assemble ADDR_TO_REG.', () => {
        assembler.assemble("SHR A, [2]")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.SHR_ADDR_TO_REG, 0x0, 0x2])
      })
      test('should assemble REGADDR_TO_REG.', () => {
        assembler.assemble("SHR A, [B]")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.SHR_REGADDR_TO_REG, 0x0, 0x1])
      })
      test('should assemble NUM_TO_REG.', () => {
        assembler.assemble("SHR A, 100")
        expect(assembler.code).toHaveLength(3)
        expect(assembler.code).toEqual([Opcodes.SHR_NUM_TO_REG, 0x0, 0x64])
      })
      test('should not assemble unsupported operands.', () => {
        // UNARY
        expect(assembler.assemble.bind(assembler, "SHR A")).toThrow()

        // REG_TO_ADDR
        // REG_TO_REGADDR
        // REG_TO_NUM
        expect(assembler.assemble.bind(assembler, "SHR [1], A")).toThrow()
        expect(assembler.assemble.bind(assembler, "SHR [A], A")).toThrow()
        expect(assembler.assemble.bind(assembler, "SHR 100, A")).toThrow()

        // ADDR_TO_ADDR
        // ADDR_TO_REGADDR
        // ADDR_TO_NUM
        expect(assembler.assemble.bind(assembler, "SHR [0], [0]")).toThrow()
        expect(assembler.assemble.bind(assembler, "SHR [A], [0]")).toThrow()
        expect(assembler.assemble.bind(assembler, "SHR 100, [0]")).toThrow()

        // REGADDR_TO_ADDR
        // REGADDR_TO_REGADDR
        // REGADDR_TO_NUM
        expect(assembler.assemble.bind(assembler, "SHR [0], [A]")).toThrow()
        expect(assembler.assemble.bind(assembler, "SHR [A], [A]")).toThrow()
        expect(assembler.assemble.bind(assembler, "SHR 100, [A]")).toThrow()

        // NUM_TO_ADDR
        // NUM_TO_REGADDR
        // NUM_TO_NUM
        expect(assembler.assemble.bind(assembler, "SHR [0], 0")).toThrow()
        expect(assembler.assemble.bind(assembler, "SHR [A], 0")).toThrow()
        expect(assembler.assemble.bind(assembler, "SHR 100, 0")).toThrow()
      })
    })

    describe('NOT', () => {
      beforeEach(function() {
        assembler.reset()
      })
      test('should assemble REG.', () => {
        assembler.assemble("NOT A")
        expect(assembler.code).toHaveLength(2)
        expect(assembler.code).toEqual([Opcodes.NOT_REG, 0x0])
      })
      test('should not assemble unsupported operands.', () => {
        // BINARY
        expect(assembler.assemble.bind(assembler, "NOT A, B")).toThrow()

        // ADDR
        expect(assembler.assemble.bind(assembler, "NOT [0]")).toThrow()

        // REGADDR
        expect(assembler.assemble.bind(assembler, "NOT [A]")).toThrow()

        // NUM
        expect(assembler.assemble.bind(assembler, "NOT 100")).toThrow()
      })
    })
  })
})