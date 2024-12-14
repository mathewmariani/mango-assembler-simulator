import { test, expect, describe, beforeEach } from "@jest/globals"
import Memory from "../src/emulator/memory"

//
// These tests validate that the `Memory` can be read from, and written to.
//

describe('Memory', () => {
  let memory = new Memory()
  describe('#read()', () => {
    beforeEach(function() {
      memory.reset()
    })
    test('should throw error when address is out of range.', () => {
      expect(memory.read.bind(memory, -1)).toThrow()
      expect(memory.read.bind(memory, 0x100)).toThrow()
    })
    test('should not throw error when address is in range.', () => {
      expect(memory.read.bind(memory, 0x0)).not.toThrow()
      expect(memory.read.bind(memory, 0xFF)).not.toThrow()
    })
  })
  describe('#write()', () => {
    beforeEach(function() {
      memory.reset()
    })
    test('should throw error when address is out of range.', () => {
      expect(memory.write.bind(memory, -1, 0x0)).toThrow()
      expect(memory.write.bind(memory, 0x100, 0x0)).toThrow()
    })
    test('should not throw error when address is in range.', () => {
      expect(memory.write.bind(memory, 0x0, 0x0)).not.toThrow()
      expect(memory.write.bind(memory, 0xFF, 0x0)).not.toThrow()
    })
  })
  describe('#data', () => {
    beforeEach(function() {
      memory.reset()
    })
    test('should wrap when value is outside range.', () => {
      memory.write(0x0, 0x10000)
      expect(memory.read(0x0)).toBe(0x0)
    })
    test('should not wrap when value is within range.', () => {
      memory.write(0x0, 0x0)
      expect(memory.read(0x0)).toBe(0x0)

      memory.write(0x0, 0x12)
      expect(memory.read(0x0)).toBe(0x12)

      memory.write(0x0, 0xFF)
      expect(memory.read(0x0)).toBe(0xFF)
    })
  })
})

