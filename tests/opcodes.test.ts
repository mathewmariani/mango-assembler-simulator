import { test, expect, describe } from "@jest/globals"
import { Opcodes } from "../src/emulator/opcodes"

//
// These tests assure that the `Opcodes` haven't been changed.
//

describe('Opcode', () => {
  describe('movement instructions', () => {
    test('MOV', () => {
      expect(Opcodes.MOV_REG_TO_REG).toBe(0x01)
      expect(Opcodes.MOV_REG_TO_ADDR).toBe(0x02)
      expect(Opcodes.MOV_REG_TO_REGADDR).toBe(0x03)
      expect(Opcodes.MOV_ADDR_TO_REG).toBe(0x04)
      expect(Opcodes.MOV_REGADDR_TO_REG).toBe(0x05)
      expect(Opcodes.MOV_NUM_TO_REG).toBe(0x06)
      expect(Opcodes.MOV_NUM_TO_ADDR).toBe(0x07)
      expect(Opcodes.MOV_NUM_TO_REGADDR).toBe(0x08)
    })
  })

  describe('arithmatic instructions', () => {
    test('ADD', () => {
      expect(Opcodes.ADD_REG_TO_REG).toBe(0x09)
      expect(Opcodes.ADD_ADDR_TO_REG).toBe(0x0A)
      expect(Opcodes.ADD_REGADDR_TO_REG).toBe(0x0B)
      expect(Opcodes.ADD_NUM_TO_REG).toBe(0x0C)
    })
    test('SUBT', () => {
      expect(Opcodes.SUBT_REG_FROM_REG).toBe(0x0D)
      expect(Opcodes.SUBT_ADDR_FROM_REG).toBe(0x0E)
      expect(Opcodes.SUBT_REGADDR_FROM_REG).toBe(0x0F)
      expect(Opcodes.SUBT_NUM_FROM_REG).toBe(0x10)
    })
    test('INC', () => {
      expect(Opcodes.INC_REG).toBe(0x11)
    })
    test('DEC', () => {
      expect(Opcodes.DEC_REG).toBe(0x12)
    })
  })

  describe('comparison instructions', () => {
    test('CMP', () => {
      expect(Opcodes.CMP_REG_TO_REG).toBe(0x13)
      expect(Opcodes.CMP_ADDR_TO_REG).toBe(0x14)
      expect(Opcodes.CMP_REGADDR_TO_REG).toBe(0x15)
      expect(Opcodes.CMP_NUM_TO_REG).toBe(0x16)
    })
  })

  describe('jump instructions', () => {
    test('JMP', () => {
      expect(Opcodes.JMP_ADDR).toBe(0x17)
      expect(Opcodes.JMP_REGADDR).toBe(0x18)
    })
    test('JC', () => {
      expect(Opcodes.JC_ADDR).toBe(0x19)
      expect(Opcodes.JC_REGADDR).toBe(0x1A)
    })
    test('JNC', () => {
      expect(Opcodes.JNC_ADDR).toBe(0x1B)
      expect(Opcodes.JNC_REGADDR).toBe(0x1C)
    })
    test('JZ', () => {
      expect(Opcodes.JZ_ADDR).toBe(0x1D)
      expect(Opcodes.JZ_REGADDR).toBe(0x1E)
    })
    test('JNZ', () => {
      expect(Opcodes.JNZ_ADDR).toBe(0x1F)
      expect(Opcodes.JNZ_REGADDR).toBe(0x20)
    })
    test('JA', () => {
      expect(Opcodes.JA_ADDR).toBe(0x21)
      expect(Opcodes.JA_REGADDR).toBe(0x22)
    })
    test('JNA', () => {
      expect(Opcodes.JNA_ADDR).toBe(0x23)
      expect(Opcodes.JNA_REGADDR).toBe(0x24)
    })
  })

  describe('subroutine instructions', () => {
    test('CALL', () => {
      expect(Opcodes.CALL_ADDR).toBe(0x2F)
      expect(Opcodes.CALL_REGADDR).toBe(0x30)
    })
    test('RET', () => {
      expect(Opcodes.RET).toBe(0x31)
    })
  })

  describe('stack instructions', () => {
    test('PUSH', () => {
      expect(Opcodes.PUSH_REG).toBe(0x32)
      expect(Opcodes.PUSH_ADDR).toBe(0x33)
      expect(Opcodes.PUSH_REGADDR).toBe(0x34)
      expect(Opcodes.PUSH_NUM).toBe(0x35)
    })
    test('POP', () => {
      expect(Opcodes.POP_REG).toBe(0x36)
    })
  })

  describe('binary instructions', () => {
    test('AND', () => {
      expect(Opcodes.AND_REG_TO_REG).toBe(0x37)
      expect(Opcodes.AND_ADDR_TO_REG).toBe(0x38)
      expect(Opcodes.AND_REGADDR_TO_REG).toBe(0x39)
      expect(Opcodes.AND_NUM_TO_REG).toBe(0x3A)
    })
    test('OR', () => {
      expect(Opcodes.OR_REG_TO_REG).toBe(0x3B)
      expect(Opcodes.OR_ADDR_TO_REG).toBe(0x3C)
      expect(Opcodes.OR_REGADDR_TO_REG).toBe(0x3D)
      expect(Opcodes.OR_NUM_TO_REG).toBe(0x3E)
    })
    test('XOR', () => {
      expect(Opcodes.XOR_REG_TO_REG).toBe(0x3F)
      expect(Opcodes.XOR_ADDR_TO_REG).toBe(0x40)
      expect(Opcodes.XOR_REGADDR_TO_REG).toBe(0x41)
      expect(Opcodes.XOR_NUM_TO_REG).toBe(0x42)
    })
    test('SHL', () => {
      expect(Opcodes.SHL_REG_TO_REG).toBe(0x43)
      expect(Opcodes.SHL_ADDR_TO_REG).toBe(0x44)
      expect(Opcodes.SHL_REGADDR_TO_REG).toBe(0x45)
      expect(Opcodes.SHL_NUM_TO_REG).toBe(0x46)
    })
    test('SHR', () => {
      expect(Opcodes.SHR_REG_TO_REG).toBe(0x47)
      expect(Opcodes.SHR_ADDR_TO_REG).toBe(0x48)
      expect(Opcodes.SHR_REGADDR_TO_REG).toBe(0x49)
      expect(Opcodes.SHR_NUM_TO_REG).toBe(0x4A)
    })
    test('NOT', () => {
      expect(Opcodes.NOT_REG).toBe(0x4B)
    })
  })
})