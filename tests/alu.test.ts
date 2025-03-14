import { test, expect, describe } from "@jest/globals"
import { ALU } from "../emulator/alu"

//
// These tests validate that the `ALU` can do arithmatic.
//

describe('ALU', () => {

  // addition
  describe('ADD', () => {
    test('should ADD two numbers.', () => {
      const result = ALU.add(0x01, 0x01)
      expect(result.sum).toBe(0x02)
      expect(result.is_zero).toBe(false)
      expect(result.is_overflow).toBe(false)
      expect(result.is_negative).toBe(false)
    })
    test('should ADD two numbers.', () => {
      const result = ALU.add(0xFF, 0x01)
      expect(result.sum).toBe(0x00)
      expect(result.is_zero).toBe(true)
      expect(result.is_overflow).toBe(false)
      expect(result.is_negative).toBe(false)
    })
    test('should ADD two numbers.', () => {
      const result = ALU.add(0x7F, 0x01)
      expect(result.sum).toBe(0x80)
      expect(result.is_zero).toBe(false)
      expect(result.is_overflow).toBe(true)
      expect(result.is_negative).toBe(true)
    })
    test('should ADD two numbers.', () => {
      const result = ALU.add(0x80, 0xFF)
      expect(result.sum).toBe(0x7F)
      expect(result.is_zero).toBe(false)
      expect(result.is_overflow).toBe(true)
      expect(result.is_negative).toBe(false)
    })
  })

  // subtraction
  describe('SUBT', () => {
    test('should SUBT two numbers.', () => {
      // 1 - 2 = -1
      const result = ALU.sub(0x01, 0x02)
      expect(result.sum).toBe(0xFF)
      expect(result.is_zero).toBe(false)
      expect(result.is_overflow).toBe(true)
      expect(result.is_negative).toBe(true)
    })
    test('should SUBT two numbers.', () => {
      // 1 - 2 = -1
      const result = ALU.sub(0x00, 0x05)
      expect(result.sum).toBe(0xFB)
      expect(result.is_zero).toBe(false)
      expect(result.is_overflow).toBe(true)
      expect(result.is_negative).toBe(true)
    })
    test('should SUBT two numbers.', () => {
      // (-1) - (-2) = 1
      const result = ALU.sub(0xFF, 0xFE)
      expect(result.sum).toBe(0x01)
      expect(result.is_zero).toBe(false)
      expect(result.is_overflow).toBe(true)
      expect(result.is_negative).toBe(false)
    })
    test('should SUBT two numbers.', () => {
      // (-128) - 1 = 0 (OVERFLOW)
      const result = ALU.sub(0x80, 0x01)
      expect(result.sum).toBe(0x7F)
      expect(result.is_zero).toBe(false)
      expect(result.is_overflow).toBe(false)
      expect(result.is_negative).toBe(false)
    })
    test('should SUBT two numbers.', () => {
      // 127 - (-1) = (-128) (OVERFLOW)
      const result = ALU.sub(0x7F, 0xFF)
      expect(result.sum).toBe(0x80)
      expect(result.is_zero).toBe(false)
      expect(result.is_overflow).toBe(false)
      expect(result.is_negative).toBe(true)
    })
  })

  // and
  describe('AND', () => {
    test('should AND two numbers.', () => {
      // 0xFF & 0xAA = 0xAA
      // 1010 1010b
      const result = ALU.and(0xFF, 0xAA)
      expect(result.sum).toBe(0xAA)
      expect(result.is_zero).toBe(false)
      expect(result.is_overflow).toBe(false)
      expect(result.is_negative).toBe(true)
    })
    test('should AND two numbers.', () => {
      // 0xFF & 0x00 = 0x00
      // 0000 0000b
      const result = ALU.and(0xFF, 0x00)
      expect(result.sum).toBe(0x00)
      expect(result.is_zero).toBe(true)
      expect(result.is_overflow).toBe(false)
      expect(result.is_negative).toBe(false)
    })
  })

  // or
  describe('OR', () => {
    test('should OR two numbers.', () => {
      //    0101 (decimal 5)
      // OR 0011 (decimal 3)
      //  = 0111 (decimal 7)
      const result = ALU.or(0x5, 0x3)
      expect(result.sum).toBe(0x7)
      expect(result.is_zero).toBe(false)
      expect(result.is_overflow).toBe(false)
      expect(result.is_negative).toBe(false)
    })
    test('should OR two numbers.', () => {
      //    0010 (decimal 2)
      // OR 1000 (decimal 8)
      //  = 1010 (decimal 10)
      const result = ALU.or(0x2, 0x8)
      expect(result.sum).toBe(0xA)
      expect(result.is_zero).toBe(false)
      expect(result.is_overflow).toBe(false)

      // FIXME: should be true
      expect(result.is_negative).toBe(false)
    })
    test('should OR two numbers.', () => {
      //    0000 (decimal 0)
      // OR 0000 (decimal 0)
      //  = 0000 (decimal 0)
      const result = ALU.or(0x0, 0x0)
      expect(result.sum).toBe(0x0)
      expect(result.is_zero).toBe(true)
      expect(result.is_overflow).toBe(false)
      expect(result.is_negative).toBe(false)
    })
  })

  // exclusive or
  describe('XOR', () => {
    test('should XOR two numbers.', () => {
      //     0101 (decimal 5)
      // XOR 0011 (decimal 3)
      //   = 0110 (decimal 6)
      const result = ALU.xor(0x5, 0x3)
      expect(result.sum).toBe(0x6)
      expect(result.is_zero).toBe(false)
      expect(result.is_overflow).toBe(false)
      expect(result.is_negative).toBe(false)
    })
    test('should XOR two numbers.', () => {
      //     0010 (decimal 2)
      // XOR 1010 (decimal 10)
      //   = 1000 (decimal 8)
      const result = ALU.xor(0x2, 0xA)
      expect(result.sum).toBe(0x8)
      expect(result.is_zero).toBe(false)
      expect(result.is_overflow).toBe(false)

      // FIXME: should be true
      expect(result.is_negative).toBe(false)
    })
    test('should zero out a number XORd with itself.', () => {
      //     1010 (decimal 10)
      // XOR 1010 (decimal 10)
      //   = 0000 (decimal 0)
      const result = ALU.xor(0xA, 0xA)
      expect(result.sum).toBe(0x0)
      expect(result.is_zero).toBe(true)
      expect(result.is_overflow).toBe(false)
      expect(result.is_negative).toBe(false)
    })
  })

  // shift left
  describe('SHL', () => {
    test('should SHL a value by a single bit.', () => {
      //    00010111 (hex 0x17) LEFT-SHIFT
      // =  00101110 (hex 0x2E)
      const result = ALU.shl(0x17, 0x1)
      expect(result.sum).toBe(0x2E)
      expect(result.is_zero).toBe(false)
      expect(result.is_overflow).toBe(false)
      expect(result.is_negative).toBe(false)
    })
    test('should SHL a value by a single bit into a negative value.', () => {
      //    01011100 (hex 0x5C) LEFT-SHIFT
      // =  10111000 (hex 0xB8)
      const result = ALU.shl(0x5C, 0x1)
      expect(result.sum).toBe(0xB8)
      expect(result.is_zero).toBe(false)

      // FIXME: why?
      expect(result.is_overflow).toBe(true)
      expect(result.is_negative).toBe(true)
    })
    test('should SHL a value by two bits.', () => {
      //    00010111 (hex 0x17) LEFT-SHIFT
      // =  01011100 (hex 0x5C)
      const result = ALU.shl(0x17, 0x2)
      expect(result.sum).toBe(0x5C)
      expect(result.is_zero).toBe(false)
      expect(result.is_overflow).toBe(false)
      expect(result.is_negative).toBe(false)
    })
  })

  // shift right
  describe('SHR', () => {
    test('should SHR a value by a single bit.', () => {
      //    10010111 (hex 0x97) RIGHT-SHIFT
      // =  01001011 (hex 0x4B)
      const result = ALU.shr(0x97, 0x1)
      expect(result.sum).toBe(0x4B)
      expect(result.is_zero).toBe(false)
      expect(result.is_overflow).toBe(false)
      expect(result.is_negative).toBe(false)
    })
    test('should SHR a value by two bits.', () => {
      //    10010111 (hex 0x97) RIGHT-SHIFT
      // =  00100101 (hex 0x25)
      const result = ALU.shr(0x97, 0x2)
      expect(result.sum).toBe(0x25)
      expect(result.is_zero).toBe(false)
      expect(result.is_overflow).toBe(false)
      expect(result.is_negative).toBe(false)
    })
  })

  // not
  describe('NOT', () => {
    test('should NOT a value.', () => {
      // NOT 00000111  (hex 0x07)
      //   = 11111000  (hex 0xF8)
      const result = ALU.not(0x07)
      expect(result.sum).toBe(0xF8)
      expect(result.is_zero).toBe(false)
      expect(result.is_overflow).toBe(false)
      expect(result.is_negative).toBe(true)
    })
    test('should NOT a value.', () => {
      // NOT 10101011  (hex 0xAB)
      //   = 01010100  (hex 0x54)
      const result = ALU.not(0xAB)
      expect(result.sum).toBe(0x54)
      expect(result.is_zero).toBe(false)
      expect(result.is_overflow).toBe(false)
      expect(result.is_negative).toBe(false)
    })
    test('should NOT a value.', () => {
      // NOT 11111111  (hex 0xFF)
      //   = 00000000  (hex 0x00)
      const result = ALU.not(0xFF)
      expect(result.sum).toBe(0x00)
      expect(result.is_zero).toBe(true)
      expect(result.is_overflow).toBe(false)
      expect(result.is_negative).toBe(false)
    })
    test('should NOT a value.', () => {
      // NOT 00000000  (hex 0x00)
      //   = 11111111  (hex 0xFF)
      const result = ALU.not(0x00)
      expect(result.sum).toBe(0xFF)
      expect(result.is_zero).toBe(false)
      expect(result.is_overflow).toBe(false)
      expect(result.is_negative).toBe(true)
    })
  })
})