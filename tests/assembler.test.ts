import { test, expect, describe, beforeEach } from "@jest/globals"
import Assembler from "../src/emulator/assembler"

//
// These tests validate that the `Assembler` can parse input into code.
//

describe('Assembler', () => {
  let assembler = new Assembler()

  describe('#addLabel()', () => {
    beforeEach(function() {
      assembler.reset()
    })
    test('should add a valid label', () => {
      assembler.addLabel("label")
      expect(assembler.labels).toEqual({ label: 0 })
    })
    test('should throw for duplicate labels', () => {
      assembler.addLabel("label")
      expect(assembler.addLabel.bind(assembler, "label")).toThrow()
    })
    test('should throw for labels that are keywords', () => {
      expect(assembler.addLabel.bind(assembler, "a")).toThrow()
      expect(assembler.addLabel.bind(assembler, "b")).toThrow()
      expect(assembler.addLabel.bind(assembler, "c")).toThrow()
      expect(assembler.addLabel.bind(assembler, "d")).toThrow()
    })
  })

  describe('#assemble()', () => {
    beforeEach(function() {
      assembler.reset()
    })
    test('should throw for duplicate labels', () => {
      const str = "x: DB 0x5\nx: DB 0x5"
      expect(assembler.assemble.bind(assembler, str)).toThrow()
    })
    test('should assemble halting program', () => {
      const str = "MOV A, B\nHLT"
      expect(assembler.assemble.bind(assembler, str)).not.toThrow()
    })
    test('should assemble labeled strings', () => {
      assembler.assemble("x: DB \"mango\"\nMOV C, x")
      expect(assembler.code).toEqual([109, 97, 110, 103, 111, 6, 2, 0])
    })
    test('should assemble labeled numbers', () => {
      assembler.assemble("x: DB 0x5\nMOV C, x")
      expect(assembler.code).toEqual([5, 6, 2, 0])

      assembler.assemble("x: DB 0x5\nMOV C, [x]")
      expect(assembler.code).toEqual([5, 4, 2, 0])
    })
    test('should assemble multiple new line', () => {
      const str = "MOV A, B\n\n\nHLT"
      expect(assembler.assemble.bind(assembler, str)).not.toThrow()
    })
  })
})