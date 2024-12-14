import { test, expect, describe, beforeEach } from "@jest/globals"
import Assembler from "../src/emulator/assembler"
import CPU from "../src/emulator/cpu"
import Memory from "../src/emulator/memory"

//
// These tests validate that `Mango` can excute simple programs.
//

describe('Programs', () => {
  let assembler = new Assembler()
  let memory = new Memory()
  let cpu = new CPU(memory)

  // assemble code and write to memory
  let assemble = function(str: string) {
    assembler.assemble(str)
    assembler.code.forEach((b, i) => memory.write(i, b))
  }

  // run cpu until a halt
  let execute = function() {
    do {
      cpu.fetch()
      cpu.execute()
    } while (!cpu.halt)
  }

  // clear everything between tests
  beforeEach(function() {
    assembler.reset()
    memory.reset()
    cpu.reset()
  })

  test('should execute HLT', () => {
    const str = `
      HLT
      MOV B, A
      MOV C, A
      MOV D, A`

    assemble(str)
    execute()

    expect(cpu.pc).toBe(0x0)
    expect(cpu.ir).toBe(0x0)
  })
  test('should execute MOV_REG_TO_REG', () => {
    const str = `
      MOV B, A
      MOV C, A
      MOV D, A
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x5

    execute()

    expect(cpu.gpr[0x0]).toBe(0x5)
    expect(cpu.gpr[0x1]).toBe(0x5)
    expect(cpu.gpr[0x2]).toBe(0x5)
    expect(cpu.gpr[0x3]).toBe(0x5)
  })
  test('should execute MOV_REG_TO_ADDR', () => {
    const str = `
      MOV [0x1A], A
      MOV [0x1B], B
      MOV [0x1C], C
      MOV [0x1D], D
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x1A
    cpu.gpr[0x1] = 0x1B
    cpu.gpr[0x2] = 0x1C
    cpu.gpr[0x3] = 0x1D

    execute()

    expect(cpu.gpr[0x0]).toBe(0x1A)
    expect(cpu.gpr[0x1]).toBe(0x1B)
    expect(cpu.gpr[0x2]).toBe(0x1C)
    expect(cpu.gpr[0x3]).toBe(0x1D)

    expect(memory.read(0x1A)).toBe(0x1A)
    expect(memory.read(0x1B)).toBe(0x1B)
    expect(memory.read(0x1C)).toBe(0x1C)
    expect(memory.read(0x1D)).toBe(0x1D)
  })
  test('should execute MOV_REG_TO_REGADDR', () => {
    const str = `
      MOV [A], A
      MOV [B], A
      MOV [C], A
      MOV [D], A
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x1A
    cpu.gpr[0x1] = 0x1B
    cpu.gpr[0x2] = 0x1C
    cpu.gpr[0x3] = 0x1D

    execute()

    expect(cpu.gpr[0x0]).toBe(0x1A)
    expect(cpu.gpr[0x1]).toBe(0x1B)
    expect(cpu.gpr[0x2]).toBe(0x1C)
    expect(cpu.gpr[0x3]).toBe(0x1D)

    expect(memory.read(0x1A)).toBe(0x1A)
    expect(memory.read(0x1B)).toBe(0x1A)
    expect(memory.read(0x1C)).toBe(0x1A)
    expect(memory.read(0x1D)).toBe(0x1A)
  })
  test('should execute MOV_ADDR_TO_REG', () => {
    const str = `
      MOV A, [0x1A]
      MOV B, [0x1A]
      MOV C, [0x1A]
      MOV D, [0x1A]
      HLT`

    assemble(str)

    memory.write(0x1A, 0x05)

    execute()

    expect(cpu.gpr[0x0]).toBe(0x5)
    expect(cpu.gpr[0x1]).toBe(0x5)
    expect(cpu.gpr[0x2]).toBe(0x5)
    expect(cpu.gpr[0x3]).toBe(0x5)
  })
  test('should execute MOV_REGADDR_TO_REG', () => {
    const str = `
      MOV A, [A]
      MOV B, [B]
      MOV C, [C]
      MOV D, [D]
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0xFA
    cpu.gpr[0x1] = 0xFB
    cpu.gpr[0x2] = 0xFC
    cpu.gpr[0x3] = 0xFD

    memory.write(0xFA, 0x0)
    memory.write(0xFB, 0x1)
    memory.write(0xFC, 0x2)
    memory.write(0xFD, 0x3)

    execute()

    expect(cpu.gpr[0x0]).toBe(0x0)
    expect(cpu.gpr[0x1]).toBe(0x1)
    expect(cpu.gpr[0x2]).toBe(0x2)
    expect(cpu.gpr[0x3]).toBe(0x3)
  })
  test('should execute MOV_NUM_TO_REG', () => {
    const str = `
      MOV A, [x]
      MOV B, [x]
      MOV C, [x]
      MOV D, [x]
      HLT
      x: DB 0x5`

    assemble(str)
    execute()

    expect(cpu.gpr[0x0]).toBe(0x5)
    expect(cpu.gpr[0x1]).toBe(0x5)
    expect(cpu.gpr[0x2]).toBe(0x5)
    expect(cpu.gpr[0x3]).toBe(0x5)
  })
  test('should execute MOV_NUM_TO_ADDR', () => {
    const str = `
      MOV [0], 0xA`

    assemble(str)
    execute()

    expect(memory.read(0x0)).toBe(0xA)
  })
  test('should execute MOV_NUM_TO_REGADDR', () => {
    const str = `
      MOV [A], 0xA
      MOV [B], 0xA
      MOV [C], 0xA
      MOV [D], 0xA
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x1A
    cpu.gpr[0x1] = 0x1B
    cpu.gpr[0x2] = 0x1C
    cpu.gpr[0x3] = 0x1D

    execute()

    expect(cpu.gpr[0x0]).toBe(0x1A)
    expect(cpu.gpr[0x1]).toBe(0x1B)
    expect(cpu.gpr[0x2]).toBe(0x1C)
    expect(cpu.gpr[0x3]).toBe(0x1D)

    expect(memory.read(0x1A)).toBe(0xA)
    expect(memory.read(0x1B)).toBe(0xA)
    expect(memory.read(0x1C)).toBe(0xA)
    expect(memory.read(0x1D)).toBe(0xA)
  })
  test('should execute ADD_REG_TO_REG', () => {
    const str = `
      ADD A, A
      ADD A, B
      ADD A, C
      ADD A, D
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x5
    cpu.gpr[0x1] = 0x5
    cpu.gpr[0x2] = 0x5
    cpu.gpr[0x3] = 0x5

    execute()

    expect(cpu.gpr[0x0]).toBe(0x19)
    expect(cpu.gpr[0x1]).toBe(0x5)
    expect(cpu.gpr[0x2]).toBe(0x5)
    expect(cpu.gpr[0x3]).toBe(0x5)
  })
  test('should execute ADD_ADDR_TO_REG', () => {
    const str = `
      ADD A, [0x1A]
      ADD B, [0x1B]
      ADD C, [0x1C]
      ADD D, [0x1D]
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x0
    cpu.gpr[0x1] = 0x0
    cpu.gpr[0x2] = 0x0
    cpu.gpr[0x3] = 0x0
    memory.write(0x1A, 0x5)
    memory.write(0x1B, 0x5)
    memory.write(0x1C, 0x5)
    memory.write(0x1D, 0x5)

    execute()

    expect(cpu.gpr[0x0]).toBe(0x5)
    expect(cpu.gpr[0x1]).toBe(0x5)
    expect(cpu.gpr[0x2]).toBe(0x5)
    expect(cpu.gpr[0x3]).toBe(0x5)
  })
  test('should execute ADD_REGADDR_TO_REG', () => {
    const str = `
      ADD A, [B]
      ADD C, [D]
      HLT`

     assemble(str)

    cpu.gpr[0x0] = 0x00
    cpu.gpr[0x1] = 0xFB
    cpu.gpr[0x2] = 0x00
    cpu.gpr[0x3] = 0xFD

    memory.write(0xFB, 0x5)
    memory.write(0xFD, 0x5)

    execute()

    expect(cpu.gpr[0x0]).toBe(0x5)
    expect(cpu.gpr[0x2]).toBe(0x5)
  })
  test('should execute ADD_NUM_TO_REG', () => {
    const str = `
      ADD A, 0x5
      ADD B, 0x5
      ADD C, 0x5
      ADD D, 0x5
      HLT`

    assemble(str)
    execute()

    expect(cpu.gpr[0x0]).toBe(0x5)
    expect(cpu.gpr[0x1]).toBe(0x5)
    expect(cpu.gpr[0x2]).toBe(0x5)
    expect(cpu.gpr[0x3]).toBe(0x5)
  })
  test('should execute SUBT_REG_FROM_REG', () => {
    const str = `
      SUBT A, B
      SUBT A, C
      SUBT A, D
      SUBT A, A
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x14
    cpu.gpr[0x1] = 0x5
    cpu.gpr[0x2] = 0x5
    cpu.gpr[0x3] = 0x5

    execute()

    expect(cpu.gpr[0x0]).toBe(0x0)
    expect(cpu.gpr[0x1]).toBe(0x5)
    expect(cpu.gpr[0x2]).toBe(0x5)
    expect(cpu.gpr[0x3]).toBe(0x5)
  })
  test('should execute SUBT_ADDR_FROM_REG', () => {
    const str = `
      SUBT A, [0x1A]
      SUBT B, [0x1B]
      SUBT C, [0x1C]
      SUBT D, [0x1D]
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x5
    cpu.gpr[0x1] = 0x5
    cpu.gpr[0x2] = 0x5
    cpu.gpr[0x3] = 0x5
    memory.write(0x1A, 0x5)
    memory.write(0x1B, 0x5)
    memory.write(0x1C, 0x5)
    memory.write(0x1D, 0x5)

    execute()

    expect(cpu.gpr[0x0]).toBe(0x0)
    expect(cpu.gpr[0x1]).toBe(0x0)
    expect(cpu.gpr[0x2]).toBe(0x0)
    expect(cpu.gpr[0x3]).toBe(0x0)
  })
  test('should execute SUBT_REGADDR_FROM_REG', () => {
    const str = `
      SUBT A, [B]
      SUBT C, [D]
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x0A
    cpu.gpr[0x1] = 0xFB
    cpu.gpr[0x2] = 0x0A
    cpu.gpr[0x3] = 0xFD

    memory.write(0xFB, 0x5)
    memory.write(0xFD, 0x5)

    execute()

    expect(cpu.gpr[0x0]).toBe(0x5)
    expect(cpu.gpr[0x2]).toBe(0x5)
  })
  test('should execute SUBT_NUM_FROM_REG', () => {
    const str = `
      SUBT A, 0x5
      SUBT B, 0x5
      SUBT C, 0x5
      SUBT D, 0x5
      HLT`

    assemble(str)
    execute()

    expect(cpu.gpr[0x0]).toBe(0xFB)
    expect(cpu.gpr[0x1]).toBe(0xFB)
    expect(cpu.gpr[0x2]).toBe(0xFB)
    expect(cpu.gpr[0x3]).toBe(0xFB)
  })
  test('should execute INC_REG', () => {
    const str = `
      INC A
      INC B
      INC C
      INC D
      HLT`

    assemble(str)
    execute()

    expect(cpu.gpr[0x0]).toBe(0x1)
    expect(cpu.gpr[0x1]).toBe(0x1)
    expect(cpu.gpr[0x2]).toBe(0x1)
    expect(cpu.gpr[0x3]).toBe(0x1)
  })
  test('should execute DEC_REG', () => {
    const str = `
      DEC A
      DEC B
      DEC C
      DEC D
      HLT`

    assemble(str)
    execute()

    expect(cpu.gpr[0x0]).toBe(0xFF)
    expect(cpu.gpr[0x1]).toBe(0xFF)
    expect(cpu.gpr[0x2]).toBe(0xFF)
    expect(cpu.gpr[0x3]).toBe(0xFF)
  })
  test('should execute CMP_REG_TO_REG (even)', () => {
    const str = `
      CMP A, B
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x0
    cpu.gpr[0x1] = 0x0

    execute()

    expect(cpu.zero).toBe(true)
    expect(cpu.overflow).toBe(false)
    expect(cpu.negative).toBe(false)
  })
  test('should execute CMP_REG_TO_REG (less)', () => {
    const str = `
      CMP A, B
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x0
    cpu.gpr[0x1] = 0x1

    execute()

    expect(cpu.zero).toBe(false)
    expect(cpu.overflow).toBe(true)
    expect(cpu.negative).toBe(true)
  })
  test('should execute CMP_REG_TO_REG (more)', () => {
    const str = `
      CMP A, B
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x1
    cpu.gpr[0x1] = 0x0

    execute()

    expect(cpu.zero).toBe(false)
    expect(cpu.overflow).toBe(false)
    expect(cpu.negative).toBe(false)
  })
  test('should execute CMP_ADDR_TO_REG (even)', () => {
    const str = `
      CMP A, [0xA]
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x0
    memory.write(0xA, 0x0)

    execute()

    expect(cpu.zero).toBe(true)
    expect(cpu.overflow).toBe(false)
    expect(cpu.negative).toBe(false)
  })
  test('should execute CMP_ADDR_TO_REG (less)', () => {
    const str = `
      CMP A, [0xA]
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x0
    memory.write(0xA, 0x1)

    execute()

    expect(cpu.zero).toBe(false)
    expect(cpu.overflow).toBe(true)
    expect(cpu.negative).toBe(true)
  })
  test('should execute CMP_ADDR_TO_REG (more)', () => {
    const str = `
      CMP A, [0xA]
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x1
    memory.write(0xA, 0x0)

    execute()

    expect(cpu.zero).toBe(false)
    expect(cpu.overflow).toBe(false)
    expect(cpu.negative).toBe(false)
  })
  test('should execute CMP_REGADDR_TO_REG (even)', () => {
    const str = `
      CMP A, [B]
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x0
    cpu.gpr[0x1] = 0xA
    memory.write(0xA, 0x0)

    execute()

    expect(cpu.zero).toBe(true)
    expect(cpu.overflow).toBe(false)
    expect(cpu.negative).toBe(false)
  })
  test('should execute CMP_REGADDR_TO_REG (less)', () => {
    const str = `
      CMP A, [B]
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x0
    cpu.gpr[0x1] = 0xA
    memory.write(0xA, 0x1)

    execute()

    expect(cpu.zero).toBe(false)
    expect(cpu.overflow).toBe(true)
    expect(cpu.negative).toBe(true)
  })
  test('should execute CMP_REGADDR_TO_REG (more)', () => {
    const str = `
      CMP A, [B]
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x1
    cpu.gpr[0x1] = 0xA
    memory.write(0xA, 0x0)

    execute()

    expect(cpu.zero).toBe(false)
    expect(cpu.overflow).toBe(false)
    expect(cpu.negative).toBe(false)
  })
  test('should execute CMP_NUM_TO_REG (even)', () => {
    const str = `
      CMP A, 0x0
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x0

    execute()

    expect(cpu.zero).toBe(true)
    expect(cpu.overflow).toBe(false)
    expect(cpu.negative).toBe(false)
  })
  test('should execute CMP_NUM_TO_REG (less)', () => {
    const str = `
      CMP A, 0x1
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x0

    execute()

    expect(cpu.zero).toBe(false)
    expect(cpu.overflow).toBe(true)
    expect(cpu.negative).toBe(true)
  })
  test('should execute CMP_NUM_TO_REG (more)', () => {
    const str = `
      CMP A, 0x0
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x1

    execute()

    expect(cpu.zero).toBe(false)
    expect(cpu.overflow).toBe(false)
    expect(cpu.negative).toBe(false)
  })
  test('should execute JMP_ADDR', () => {
    const str = `
      JMP 0x5
      HLT`

    assemble(str)
    execute()

    expect(cpu.pc).toBe(0x5)
  })
  test('should execute JC_ADDR', () => {
    const str = `
      JC 0x5
      HLT`

    assemble(str)
    cpu.carry = false
    execute()

    expect(cpu.pc).toBe(0x5)
  })
  test('should execute JNC_ADDR', () => {
    const str = `
      JNC 0x5
      HLT`

    assemble(str)
    execute()

    expect(cpu.pc).toBe(0x5)
  })
  test('should execute JZ_ADDR', () => {
    const str = `
      JZ 0x5
      HLT`

    assemble(str)
    execute()

    expect(cpu.pc).toBe(0x5)
  })
  test('should execute JNZ_ADDR', () => {
    const str = `
      JNZ 0x5
      HLT`

    assemble(str)
    execute()

    expect(cpu.pc).toBe(0x5)
  })
  test('should execute CALL_ADDR and RET', () => {
    const str = `
      CALL start
      ADD A, 0x5
      HLT
      start:
      MOV A, 0x5
      RET`

    assemble(str)
    execute()

    expect(cpu.gpr[0x0]).toBe(0xA)
    expect(cpu.sp).toBe(0xE7)
  })
  test('should execute CALL_REGADDR and RET', () => {
    const str = `
      CALL [B]
      ADD A, 0x5
      HLT
      MOV A, 0x5
      RET`

    assemble(str)

    cpu.gpr[0x1] = 0x6

    execute()

    expect(cpu.gpr[0x0]).toBe(0xA)
    // expect(cpu.sp).toBe(0xE7)
  })
  test('should execute PUSH_REG', () => {
    const str = `
      PUSH A
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x5

    execute()

    expect(cpu.sp).toBe(cpu.maxSP-1)
    expect(memory.read(cpu.sp+1)).toBe(0x5)
  })
  test('should execute PUSH_ADDR', () => {
    const str = `
      PUSH [0x5]
      HLT`

    assemble(str)

    memory.write(0x5, 0x5)

    execute()

    expect(cpu.sp).toBe(cpu.maxSP-1)
    expect(memory.read(cpu.sp+1)).toBe(0x5)
  })
  test('should execute PUSH_REGADDR', () => {
    const str = `
      PUSH [A]
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x5
    memory.write(0x5, 0x5)

    execute()

    expect(cpu.sp).toBe(cpu.maxSP-1)
    expect(memory.read(cpu.sp+1)).toBe(0x5)
  })
  test('should execute PUSH_NUM', () => {
    const str = `
      PUSH 0x5
      HLT`

    assemble(str)
    execute()

    expect(cpu.sp).toBe(cpu.maxSP-1)
    expect(memory.read(cpu.sp+1)).toBe(0x5)
  })
  test('should execute POP_REG', () => {
    const str = `
      PUSH 0x1
      PUSH 0x2
      PUSH 0x3
      PUSH 0x4
      POP A
      POP B
      POP C
      POP D
      HLT`

    assemble(str)
    execute()

    expect(cpu.gpr[0x0]).toBe(0x4)
    expect(cpu.gpr[0x1]).toBe(0x3)
    expect(cpu.gpr[0x2]).toBe(0x2)
    expect(cpu.gpr[0x3]).toBe(0x1)

    expect(cpu.sp).toBe(cpu.maxSP)
  })
  test('should execute AND_REG_TO_REG', () => {
    const str = `
      AND A, B
      AND C, D
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0xFF
    cpu.gpr[0x1] = 0x0F
    cpu.gpr[0x2] = 0xFF
    cpu.gpr[0x3] = 0x0F

    execute()

    expect(cpu.gpr[0x0]).toBe(0x0F)
    expect(cpu.gpr[0x1]).toBe(0x0F)
    expect(cpu.gpr[0x2]).toBe(0x0F)
    expect(cpu.gpr[0x3]).toBe(0x0F)
  })
  test('should execute AND_ADDR_TO_REG', () => {
    const str = `
      AND A, [0xFA]
      AND B, [0xFB]
      AND C, [0xFC]
      AND D, [0xFD]
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0xFF
    cpu.gpr[0x1] = 0xFF
    cpu.gpr[0x2] = 0xFF
    cpu.gpr[0x3] = 0xFF
    memory.write(0xFA, 0xF)
    memory.write(0xFB, 0xF)
    memory.write(0xFC, 0xF)
    memory.write(0xFD, 0xF)

    execute()

    expect(cpu.gpr[0x0]).toBe(0xF)
    expect(cpu.gpr[0x1]).toBe(0xF)
    expect(cpu.gpr[0x2]).toBe(0xF)
    expect(cpu.gpr[0x3]).toBe(0xF)
  })
  test('should execute AND_REGADDR_TO_REG', () => {
    const str = `
      AND A, [B]
      AND C, [D]
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0xFF
    cpu.gpr[0x1] = 0xFA
    cpu.gpr[0x2] = 0xFF
    cpu.gpr[0x3] = 0xFB

    memory.write(0xFA, 0x0F)
    memory.write(0xFB, 0x0F)

    execute()

    expect(cpu.gpr[0x0]).toBe(0x0F)
    expect(cpu.gpr[0x2]).toBe(0x0F)
  })
  test('should execute AND_NUM_TO_REG', () => {
    const str = `
      AND A, 0x0F
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0xFF

    execute()

    expect(cpu.gpr[0x0]).toBe(0x0F)
  })
  test('should execute OR_REG_TO_REG', () => {
    const str = `
      OR A, B
      OR C, D
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0xF0
    cpu.gpr[0x1] = 0x0F
    cpu.gpr[0x2] = 0x0F
    cpu.gpr[0x3] = 0xF0

    execute()

    expect(cpu.gpr[0x0]).toBe(0xFF)
    expect(cpu.gpr[0x1]).toBe(0x0F)
    expect(cpu.gpr[0x2]).toBe(0xFF)
    expect(cpu.gpr[0x3]).toBe(0xF0)
  })
  test('should execute OR_ADDR_TO_REG', () => {
    const str = `
      OR A, [0xFA]
      OR B, [0xFB]
      OR C, [0xFC]
      OR D, [0xFD]
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0xF0
    cpu.gpr[0x1] = 0xF0
    cpu.gpr[0x2] = 0xF0
    cpu.gpr[0x3] = 0xF0
    memory.write(0xFA, 0x0F)
    memory.write(0xFB, 0x0F)
    memory.write(0xFC, 0x0F)
    memory.write(0xFD, 0x0F)

    execute()

    expect(cpu.gpr[0x0]).toBe(0xFF)
    expect(cpu.gpr[0x1]).toBe(0xFF)
    expect(cpu.gpr[0x2]).toBe(0xFF)
    expect(cpu.gpr[0x3]).toBe(0xFF)
  })
  test('should execute OR_REGADDR_TO_REG', () => {
    const str = `
      OR A, [B]
      OR C, [D]
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0xF0
    cpu.gpr[0x1] = 0x0B
    cpu.gpr[0x2] = 0x0F
    cpu.gpr[0x3] = 0x0D

    memory.write(0xB, 0x0F)
    memory.write(0xD, 0xF0)

    execute()

    expect(cpu.gpr[0x0]).toBe(0xFF)
    expect(cpu.gpr[0x2]).toBe(0xFF)
  })
  test('should execute OR_NUM_TO_REG', () => {
    const str = `
      OR A, 0x00
      OR B, 0x0F
      OR C, 0xF0
      OR D, 0xFF
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x00
    cpu.gpr[0x1] = 0x00
    cpu.gpr[0x2] = 0x00
    cpu.gpr[0x3] = 0x00

    execute()

    expect(cpu.gpr[0x0]).toBe(0x00)
    expect(cpu.gpr[0x1]).toBe(0x0F)
    expect(cpu.gpr[0x2]).toBe(0xF0)
    expect(cpu.gpr[0x3]).toBe(0xFF)
  })
  test('should execute XOR_REG_TO_REG', () => {
    const str = `
      XOR A, B
      XOR C, D
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x2
    cpu.gpr[0x1] = 0xA
    cpu.gpr[0x2] = 0x2
    cpu.gpr[0x3] = 0xA

    execute()

    expect(cpu.gpr[0x0]).toBe(0x8)
    expect(cpu.gpr[0x1]).toBe(0xA)
    expect(cpu.gpr[0x2]).toBe(0x8)
    expect(cpu.gpr[0x3]).toBe(0xA)
  })
  test('should execute XOR_ADDR_TO_REG', () => {
    const str = `
      XOR A, [0xFA]
      XOR B, [0xFA]
      XOR C, [0xFA]
      XOR D, [0xFA]
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x2
    cpu.gpr[0x1] = 0x2
    cpu.gpr[0x2] = 0x2
    cpu.gpr[0x3] = 0x2
    memory.write(0xFA, 0xA)

    execute()

    expect(cpu.gpr[0x0]).toBe(0x8)
    expect(cpu.gpr[0x1]).toBe(0x8)
    expect(cpu.gpr[0x2]).toBe(0x8)
    expect(cpu.gpr[0x3]).toBe(0x8)
  })
  test('should execute XOR_REGADDR_TO_REG', () => {
    const str = `
      XOR A, [B]
      XOR C, [D]
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x02
    cpu.gpr[0x1] = 0xFB
    cpu.gpr[0x2] = 0x02
    cpu.gpr[0x3] = 0xFD

    memory.write(0xFB, 0xA)
    memory.write(0xFD, 0xA)

    execute()

    expect(cpu.gpr[0x0]).toBe(0x8)
    expect(cpu.gpr[0x2]).toBe(0x8)
  })
  test('should execute XOR_NUM_TO_REG', () => {
    const str = `
      XOR A, 0xA
      XOR B, 0xA
      XOR C, 0xA
      XOR D, 0xA
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x2
    cpu.gpr[0x1] = 0x2
    cpu.gpr[0x2] = 0x2
    cpu.gpr[0x3] = 0x2

    execute()

    expect(cpu.gpr[0x0]).toBe(0x8)
    expect(cpu.gpr[0x1]).toBe(0x8)
    expect(cpu.gpr[0x2]).toBe(0x8)
    expect(cpu.gpr[0x3]).toBe(0x8)
  })
  test('should execute SHL_REG_TO_REG', () => {
    const str = `
      SHL A, B
      SHL C, D
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x17
    cpu.gpr[0x1] = 0x01
    cpu.gpr[0x2] = 0x17
    cpu.gpr[0x3] = 0x01

    execute()

    expect(cpu.gpr[0x0]).toBe(0x2E)
    expect(cpu.gpr[0x1]).toBe(0x01)
    expect(cpu.gpr[0x2]).toBe(0x2E)
    expect(cpu.gpr[0x3]).toBe(0x01)
  })
  test('should execute SHL_ADDR_TO_REG', () => {
    const str = `
      SHL A, [0xFA]
      SHL B, [0xFA]
      SHL C, [0xFA]
      SHL D, [0xFA]
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x17
    cpu.gpr[0x1] = 0x17
    cpu.gpr[0x2] = 0x17
    cpu.gpr[0x3] = 0x17

    memory.write(0xFA, 0x1)

    execute()

    expect(cpu.gpr[0x0]).toBe(0x2E)
    expect(cpu.gpr[0x1]).toBe(0x2E)
    expect(cpu.gpr[0x2]).toBe(0x2E)
    expect(cpu.gpr[0x3]).toBe(0x2E)
  })
  test('should execute SHL_REGADDR_TO_REG', () => {
    const str = `
      SHL A, [B]
      SHL C, [D]
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x17
    cpu.gpr[0x1] = 0xFB
    cpu.gpr[0x2] = 0x17
    cpu.gpr[0x3] = 0xFD

    memory.write(0xFB, 0x1)
    memory.write(0xFD, 0x1)

    execute()

    expect(cpu.gpr[0x0]).toBe(0x2E)
    expect(cpu.gpr[0x1]).toBe(0xFB)
    expect(cpu.gpr[0x2]).toBe(0x2E)
    expect(cpu.gpr[0x3]).toBe(0xFD)
  })
  test('should execute SHL_NUM_TO_REG', () => {
    const str = `
      SHL A, 0x1
      SHL B, 0x1
      SHL C, 0x1
      SHL D, 0x1
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x17
    cpu.gpr[0x1] = 0x17
    cpu.gpr[0x2] = 0x17
    cpu.gpr[0x3] = 0x17

    execute()

    expect(cpu.gpr[0x0]).toBe(0x2E)
    expect(cpu.gpr[0x1]).toBe(0x2E)
    expect(cpu.gpr[0x2]).toBe(0x2E)
    expect(cpu.gpr[0x3]).toBe(0x2E)
  })
  test('should execute SHR_REG_TO_REG', () => {
    const str = `
      SHR A, B
      SHR C, D
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x17
    cpu.gpr[0x1] = 0x01
    cpu.gpr[0x2] = 0x17
    cpu.gpr[0x3] = 0x01

    execute()

    expect(cpu.gpr[0x0]).toBe(0xB)
    expect(cpu.gpr[0x1]).toBe(0x1)
    expect(cpu.gpr[0x2]).toBe(0xB)
    expect(cpu.gpr[0x3]).toBe(0x1)
  })
  test('should execute SHR_ADDR_TO_REG', () => {
    const str = `
      SHR A, [0xFA]
      SHR B, [0xFA]
      SHR C, [0xFA]
      SHR D, [0xFA]
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x17
    cpu.gpr[0x1] = 0x17
    cpu.gpr[0x2] = 0x17
    cpu.gpr[0x3] = 0x17

    memory.write(0xFA, 0x1)

    execute()

    expect(cpu.gpr[0x0]).toBe(0xB)
    expect(cpu.gpr[0x1]).toBe(0xB)
    expect(cpu.gpr[0x2]).toBe(0xB)
    expect(cpu.gpr[0x3]).toBe(0xB)
  })
  test('should execute SHR_REGADDR_TO_REG', () => {
    const str = `
      SHR A, [B]
      SHR C, [D]
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x17
    cpu.gpr[0x1] = 0xFB
    cpu.gpr[0x2] = 0x17
    cpu.gpr[0x3] = 0xFD

    memory.write(0xFB, 0x1)
    memory.write(0xFD, 0x1)

    execute()

    expect(cpu.gpr[0x0]).toBe(0x0B)
    expect(cpu.gpr[0x1]).toBe(0xFB)
    expect(cpu.gpr[0x2]).toBe(0x0B)
    expect(cpu.gpr[0x3]).toBe(0xFD)
  })
  test('should execute SHR_NUM_TO_REG', () => {
    const str = `
      SHR A, 0x1
      SHR B, 0x1
      SHR C, 0x1
      SHR D, 0x1
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x17
    cpu.gpr[0x1] = 0x17
    cpu.gpr[0x2] = 0x17
    cpu.gpr[0x3] = 0x17

    execute()

    expect(cpu.gpr[0x0]).toBe(0xB)
    expect(cpu.gpr[0x1]).toBe(0xB)
    expect(cpu.gpr[0x2]).toBe(0xB)
    expect(cpu.gpr[0x3]).toBe(0xB)
  })
  test('should execute NOT_REG', () => {
    const str = `
      NOT A
      NOT B
      NOT C
      NOT D
      HLT`

    assemble(str)

    cpu.gpr[0x0] = 0x55
    cpu.gpr[0x1] = 0x55
    cpu.gpr[0x2] = 0x55
    cpu.gpr[0x3] = 0x55

    memory.write(0xFA, 0x0F)
    memory.write(0xFB, 0x0F)

    execute()

    expect(cpu.gpr[0x0]).toBe(0xAA)
    expect(cpu.gpr[0x1]).toBe(0xAA)
    expect(cpu.gpr[0x2]).toBe(0xAA)
    expect(cpu.gpr[0x3]).toBe(0xAA)
  })





  test('should overflow memory', () => {
    const str = `
      MOV A, 0xFF
      ADD A, 0x5
      HLT`

    assemble(str)
    execute()

    expect(cpu.gpr[0x0]).toBe(0x04)
  })
  test('should underflow memory', () => {
    const str = `
      MOV A, 0x0
      SUBT A, 0x5
      HLT`

    assemble(str)
    execute()

    expect(cpu.gpr[0x0]).toBe(0xFB)
  })
  test('should underflow memory', () => {
    const str = `
      MOV A, 0x0
      MOV B, 0x5
      SUBT A, B
      HLT`

    assemble(str)
    execute()

    expect(cpu.gpr[0x0]).toBe(0xFB)
  })
  test('should JMP and MOV value into registers [A]', () => {
    const str = `
      JMP start
      x: DB 5
      start:
      MOV A, [x]
      HLT`

    assemble(str)
    execute()

    expect(cpu.gpr[0x0]).toBe(0x5)
    expect(cpu.pc).toBe(0x6)
    expect(cpu.ir).toBe(0x0)
  })
  test('should JMP to address', () => {
    const str = `
      JMP 0x5
      HLT`

    assemble(str)
    execute()

    expect(cpu.pc).toBe(0x5)
  })
  test('should JMP to address from label', () => {
    const str = `
      JMP start
      HLT
      start:`

    assemble(str)
    execute()

    expect(cpu.pc).toBe(0x3)
  })
  test('should write to stack pointer', () => {
    const str = `
      PUSH 0x5
      HLT`

    assemble(str)
    execute()

    expect(memory.read(0xE7)).toBe(0x5)
  })
  test('should write to stack pointer multiple times', () => {
    const str = `
      PUSH 0x5
      PUSH 0x5
      HLT`

    assemble(str)
    execute()

    expect(memory.read(0xE7)).toBe(0x5)
    expect(memory.read(0xE6)).toBe(0x5)
  })
  test('should pop from stack', () => {
    const str = `
      PUSH 0x5
      POP A
      HLT`

    assemble(str)
    execute()

    expect(cpu.gpr[0x0]).toBe(0x5)
  })
  test('should pop from stack multiple times', () => {
    const str = `
      PUSH 0x5
      PUSH 0x5
      PUSH 0x5
      PUSH 0x5
      POP A
      POP B
      POP C
      POP D
      HLT`

    assemble(str)
    execute()

    expect(cpu.gpr[0x0]).toBe(0x5)
    expect(cpu.gpr[0x1]).toBe(0x5)
    expect(cpu.gpr[0x2]).toBe(0x5)
    expect(cpu.gpr[0x3]).toBe(0x5)
  })
  test('should count up to ten', () => {
    const str = `
      CALL loop
      HLT
      loop:
      INC A
      CMP A, 0xA
      JNZ loop
      RET`

    assemble(str)
    execute()

    expect(cpu.gpr[0x0]).toBe(0xA)
  })
    test('should count down from ten', () => {
    const str = `
      MOV A, 0xA
      CALL loop
      HLT
      loop:
      DEC A
      CMP A, 0x0
      JNZ loop
      RET`

    assemble(str)
    execute()

    expect(cpu.gpr[0x0]).toBe(0x0)
  })
  test('should produce fibonacci numbers', () => {
    // body
  })
})

