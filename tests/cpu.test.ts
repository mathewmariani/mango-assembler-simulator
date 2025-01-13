import { test, expect, describe, beforeEach } from "@jest/globals"
import CPU from "../src/emulator/cpu"
import Memory from "../src/emulator/memory"
import { Opcodes } from "../src/emulator/opcodes"

//
// These tests validate that the `CPU` can fetch and execute instructions from `Memory`.
//

describe('CPU', () => {
  let memory = new Memory()
  let cpu = new CPU(memory)

  describe('#reset()', () => {
    test('should interpret line with all four fields.', () => {
    })
  })
  describe('#settle()', () => {
    test('should interpret line with all four fields.', () => {
    })
  })
  describe('#fetch()', () => {
    beforeEach(function() {
      memory.reset()
      cpu.reset()
    })
    test('should fetch the current instruction.', () => {
      memory.write(0x00, 0x01)
      memory.write(0x01, 0x02)
      memory.write(0x02, 0x03)

      cpu.fetch()

      expect(cpu.pc).toBe(0)
      expect(cpu.ir).toBe(0x1)

      cpu.pc = cpu.pc + 1
      cpu.fetch()
      
      expect(cpu.pc).toBe(1)
      expect(cpu.ir).toBe(0x2)

      cpu.pc = cpu.pc + 1
      cpu.fetch()
      
      expect(cpu.pc).toBe(2)
      expect(cpu.ir).toBe(0x3)
    })
  })
  describe('#excute()', () => {
    beforeEach(function() {
      memory.reset()
      cpu.reset()
    })
    // test('should excute two instructions.', () => {
    //   // MOV B, 1
    //   // MOV A, B
    //   memory.write(0x00, 0x06)
    //   memory.write(0x01, 0x01)
    //   memory.write(0x02, 0x01)
    //   memory.write(0x03, 0x01)
    //   memory.write(0x04, 0x00)
    //   memory.write(0x05, 0x01)

    //   // MOV B, 1
    //   cpu.execute()
    //   expect(cpu.pc).toBe(3)
    //   expect(cpu.gpr[0x1]).toBe(0x1)

    //   // MOV A, B
    //   cpu.execute()
    //   expect(cpu.pc).toBe(6)
    //   expect(cpu.gpr[0x0]).toBe(0x1)
    // })
    // test('should interpret line with all four fields.', () => {
    //   memory.write(0x00, 0x01)
    //   memory.write(0x01, 0x00)
    //   memory.write(0x02, 0x01)
    //   cpu.gpr[0x1] = 0x1
      
    //   cpu.execute()

    //   expect(cpu.pc).toBe(3)
    //   expect(cpu.gpr[0x0]).toBe(0x1)
    // })
    describe('MOV', () => {
      test('should execute MOV_REG_TO_REG.', () => {
        memory.write(0x00, Opcodes.MOV_REG_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x01)
        cpu.gpr[0x1] = 0x2

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(0x3)
        expect(cpu.gpr[0x0]).toBe(0x2)
      })
      test('should execute MOV_REG_TO_ADDR.', () => {
        memory.write(0x00, Opcodes.MOV_REG_TO_ADDR)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x01)

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(0x3)
        expect(cpu.memory.read(0x0)).toBe(0x0)
      })
      test('should execute MOV_REG_TO_REGADDR.', () => {
        memory.write(0x00, Opcodes.MOV_REG_TO_REGADDR)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x00)

        cpu.fetch()
        cpu.execute()

        // expect(cpu.pc).toBe(0x3)
        expect(cpu.memory.read(0x0)).toBe(0x0)
      })
      test('should execute MOV_ADDR_TO_REG.', () => {
        memory.write(0x00, Opcodes.MOV_ADDR_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x00)

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(0x3)
        expect(cpu.gpr[0x0]).toBe(0x4)
      })
      test('should execute MOV_REGADDR_TO_REG.', () => {
        memory.write(0x00, Opcodes.MOV_REGADDR_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x01)
        cpu.gpr[0x1] = 0x0

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(0x3)
        expect(cpu.gpr[0x0]).toBe(0x5)
      })
      test('should execute MOV_NUM_TO_REG.', () => {
        memory.write(0x00, Opcodes.MOV_NUM_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x01)

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(0x3)
        expect(cpu.gpr[0x0]).toBe(0x1)      
      })
      test('should execute MOV_NUM_TO_ADDR.', () => {
        memory.write(0x00, Opcodes.MOV_NUM_TO_ADDR)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x01)

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(0x3)
        expect(cpu.memory.read(0x0)).toBe(0x1)    
      })
      test('should execute MOV_NUM_TO_REGADDR.', () => {
        memory.write(0x00, Opcodes.MOV_NUM_TO_REGADDR)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x01)

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(0x3)
        expect(cpu.memory.read(0x0)).toBe(0x1)    
      })
    })

    describe('ADD', () => {
      test('should execute ADD_REG_TO_REG.', () => {
        memory.write(0x00, Opcodes.ADD_REG_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x01)
        cpu.gpr[0x0] = 0x1
        cpu.gpr[0x1] = 0x1

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.gpr[0x0]).toBe(0x2)
      })
      test('should execute ADD_ADDR_TO_REG.', () => {
        memory.write(0x00, Opcodes.ADD_ADDR_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x02)

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.gpr[0x0]).toBe(0x2)
      })
      test('should execute ADD_REGADDR_TO_REG.', () => {
        memory.write(0x00, Opcodes.ADD_REGADDR_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x01)
        cpu.gpr[0x1] = 0x0

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.gpr[0x0]).toBe(0xB)
      })
      test('should execute ADD_NUM_TO_REG.', () => {
        memory.write(0x00, Opcodes.ADD_NUM_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x02)

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.gpr[0x0]).toBe(0x2)
      })
    })

    describe('SUBT', () => {
      test('should execute SUBT_REG_FROM_REG.', () => {
        memory.write(0x00, Opcodes.SUBT_REG_FROM_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x01)
        cpu.gpr[0x0] = 0x1
        cpu.gpr[0x1] = 0x1

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.gpr[0x0]).toBe(0x0)
      })
      test('should execute SUBT_ADDR_FROM_REG.', () => {
        memory.write(0x00, Opcodes.SUBT_ADDR_FROM_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x02)

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.gpr[0x0]).toBe(0xFE)
      })
      test('should execute SUBT_REGADDR_FROM_REG.', () => {
        memory.write(0x00, Opcodes.SUBT_REGADDR_FROM_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x01)
        cpu.gpr[0x1] = 0x0

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.gpr[0x0]).toBe(0xF1)
      })
      test('should execute SUBT_NUM_FROM_REG.', () => {
        memory.write(0x00, Opcodes.SUBT_NUM_FROM_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x02)
        
        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.gpr[0x0]).toBe(0xFE)
      })
    })

    describe('INC', () => {
      test('should execute INC_REG.', () => {
        memory.write(0x00, Opcodes.INC_REG)
        memory.write(0x01, 0x00)

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(2)
        expect(cpu.gpr[0x0]).toBe(0x1)
      })
    })

    describe('DEC', () => {
      test('should execute DEC_REG.', () => {
        memory.write(0x00, Opcodes.DEC_REG)
        memory.write(0x01, 0x00)
        cpu.gpr[0x0] = 0x2

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(2)
        expect(cpu.gpr[0x0]).toBe(0x1)
        expect(cpu.zero).toBe(false)

        cpu.reset()

        cpu.gpr[0x0] = 0x1

        cpu.fetch()        
        cpu.execute()

        expect(cpu.pc).toBe(2)
        expect(cpu.gpr[0x0]).toBe(0x0)
        expect(cpu.zero).toBe(true)

      })
    })

    describe('CMP', () => {
      test('should execute CMP_REG_TO_REG.', () => {
        memory.write(0x00, Opcodes.CMP_REG_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x01)
        cpu.gpr[0x0] = 0x1
        cpu.gpr[0x1] = 0x1

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.zero).toBe(true)

        cpu.reset()

        cpu.gpr[0x0] = 0x0
        cpu.gpr[0x1] = 0x1

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.zero).toBe(false)
      })
      test('should execute CMP_ADDR_TO_REG.', () => {
        memory.write(0x00, Opcodes.CMP_ADDR_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x01)
        cpu.gpr[0x0] = 0x0

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.zero).toBe(true)

        cpu.reset()

        memory.write(0x00, Opcodes.CMP_ADDR_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x00)
        cpu.gpr[0x0] = 0x0

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.zero).toBe(false)
      })
      test('should execute CMP_REGADDR_TO_REG.', () => {
        memory.write(0x00, Opcodes.CMP_REGADDR_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x01)
        cpu.gpr[0x0] = 0x0
        cpu.gpr[0x1] = 0x1

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.zero).toBe(true)

        cpu.reset()

        cpu.gpr[0x0] = 0x0
        cpu.gpr[0x1] = 0x0

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.zero).toBe(false)
      })
      test('should execute CMP_NUM_TO_REG.', () => {
        memory.write(0x00, Opcodes.CMP_NUM_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x02)
        cpu.gpr[0x0] = 0x2

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.zero).toBe(true)

        cpu.reset()

        memory.write(0x00, Opcodes.CMP_NUM_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x02)
        cpu.gpr[0x0] = 0x1

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.zero).toBe(false)
      })
    })

    describe('JMP', () => {
      test('should execute JMP_ADDR.', () => {
        memory.write(0x00, Opcodes.JMP_ADDR)
        memory.write(0x01, 0x05)

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(5)
      })
      test('should execute JMP_REGADDR.', () => {
        memory.write(0x00, Opcodes.JMP_REGADDR)
        memory.write(0x01, 0x00)
        memory.write(0x05, 0x05)
        cpu.gpr[0x0] = 0x5

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(5)
      })
    })

    describe('JC', () => {
      test('should execute JC_ADDR (z=false).', () => {
        memory.write(0x00, Opcodes.JC_ADDR)
        memory.write(0x01, 0x05)

        cpu.carry = false
        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(0x2)
        expect(cpu.pc).not.toBe(0x5)
      })
      test('should execute JC_ADDR (z=true).', () => {
        memory.write(0x00, Opcodes.JC_ADDR)
        memory.write(0x01, 0x05)

        cpu.carry = true
        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(5)
        expect(cpu.pc).not.toBe(1)
      })
      test('should execute JC_REGADDR (c=false).', () => {
        memory.write(0x00, Opcodes.JC_REGADDR)
        memory.write(0x01, 0x00)
        memory.write(0x05, 0x05)
        cpu.gpr[0x0] = 0x5

        cpu.carry = false
        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(0x2)
        expect(cpu.pc).not.toBe(0x5)
      })
      test('should execute JC_REGADDR (c=true).', () => {
        memory.write(0x00, Opcodes.JC_REGADDR)
        memory.write(0x01, 0x00)
        memory.write(0x05, 0x05)
        cpu.gpr[0x0] = 0x5

        cpu.carry = true
        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(5)
        expect(cpu.pc).not.toBe(1)
      })
    })

    describe('JNC', () => {
      test('should execute JNC_ADDR (z=false).', () => {
        memory.write(0x00, Opcodes.JNC_ADDR)
        memory.write(0x01, 0x05)

        cpu.carry = false
        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(5)
        expect(cpu.pc).not.toBe(1)
      })
      test('should execute JNC_ADDR (z=true).', () => {
        memory.write(0x00, Opcodes.JNC_ADDR)
        memory.write(0x01, 0x05)

        cpu.carry = true
        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(0x2)
        expect(cpu.pc).not.toBe(0x5)
      })
      test('should execute JNC_REGADDR (c=false).', () => {
        memory.write(0x00, Opcodes.JNC_REGADDR)
        memory.write(0x01, 0x00)
        memory.write(0x05, 0x05)
        cpu.gpr[0x0] = 0x5

        cpu.carry = false
        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(5)
        expect(cpu.pc).not.toBe(1)
      })
      test('should execute JNC_REGADDR (c=true).', () => {
        memory.write(0x00, Opcodes.JNC_REGADDR)
        memory.write(0x01, 0x00)
        memory.write(0x05, 0x05)
        cpu.gpr[0x0] = 0x5

        cpu.carry = true
        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(0x2)
        expect(cpu.pc).not.toBe(0x5)
      })
    })

    describe('JZ', () => {
      test('should execute JZ_ADDR (z=false).', () => {
        memory.write(0x00, Opcodes.JZ_ADDR)
        memory.write(0x01, 0x05)

        cpu.zero = false
        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(0x2)
        expect(cpu.pc).not.toBe(0x5)
      })
      test('should execute JZ_ADDR (z=true).', () => {
        memory.write(0x00, Opcodes.JZ_ADDR)
        memory.write(0x01, 0x05)

        cpu.zero = true
        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(5)
        expect(cpu.pc).not.toBe(1)
      })
      test('should execute JZ_REGADDR (z=false).', () => {
        memory.write(0x00, Opcodes.JZ_REGADDR)
        memory.write(0x01, 0x00)
        memory.write(0x05, 0x05)
        cpu.gpr[0x0] = 0x5

        cpu.zero = false
        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(0x2)
        expect(cpu.pc).not.toBe(0x5)
      })
      test('should execute JZ_REGADDR (z=true).', () => {
        memory.write(0x00, Opcodes.JZ_REGADDR)
        memory.write(0x01, 0x00)
        memory.write(0x05, 0x05)
        cpu.gpr[0x0] = 0x5

        cpu.zero = true
        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(5)
        expect(cpu.pc).not.toBe(1)
      })
    })

    describe('JNZ', () => {
      test('should execute JNZ_ADDR (z=false).', () => {
        memory.write(0x00, Opcodes.JNZ_ADDR)
        memory.write(0x01, 0x05)

        cpu.zero = false
        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(5)
        expect(cpu.pc).not.toBe(1)
      })
      test('should execute JNZ_ADDR (z=true).', () => {
        memory.write(0x00, Opcodes.JNZ_ADDR)
        memory.write(0x01, 0x05)

        cpu.zero = true
        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(0x2)
        expect(cpu.pc).not.toBe(0x5)
      })
      test('should execute JNZ_REGADDR (z=false).', () => {
        memory.write(0x00, Opcodes.JNZ_REGADDR)
        memory.write(0x01, 0x00)
        memory.write(0x05, 0x05)
        cpu.gpr[0x0] = 0x5

        cpu.zero = false
        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(5)
        expect(cpu.pc).not.toBe(1)
      })
      test('should execute JNZ_REGADDR (z=true).', () => {
        memory.write(0x00, Opcodes.JNZ_REGADDR)
        memory.write(0x01, 0x00)
        memory.write(0x05, 0x05)
        cpu.gpr[0x0] = 0x5

        cpu.zero = true
        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(0x2)
        expect(cpu.pc).not.toBe(0x5)
      })
    })

    describe('JA', () => {
      test('should execute JA_ADDR (c=false, z=false).', () => {
        memory.write(0x00, Opcodes.JA_ADDR)
        memory.write(0x01, 0x05)

        cpu.carry = false
        cpu.zero = false
        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(5)
        expect(cpu.pc).not.toBe(1)
      })
      test('should execute JA_ADDR (c=true, z=true).', () => {
        memory.write(0x00, Opcodes.JA_ADDR)
        memory.write(0x01, 0x05)

        cpu.carry = true
        cpu.zero = true
        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(0x2)
        expect(cpu.pc).not.toBe(0x5)
      })
      test('should execute JA_REGADDR (c=false, z=false).', () => {
        memory.write(0x00, Opcodes.JA_REGADDR)
        memory.write(0x01, 0x00)
        memory.write(0x05, 0x05)
        cpu.gpr[0x0] = 0x5

        cpu.carry = false
        cpu.zero = false
        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(5)
        expect(cpu.pc).not.toBe(1)
      })
      test('should execute JA_REGADDR (c=true, z=true).', () => {
        memory.write(0x00, Opcodes.JA_REGADDR)
        memory.write(0x01, 0x00)
        memory.write(0x05, 0x05)
        cpu.gpr[0x0] = 0x5

        cpu.carry = true
        cpu.zero = true
        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(0x2)
        expect(cpu.pc).not.toBe(0x5)
      })
    })

    describe('JNA', () => {
      test('should execute JNA_ADDR (c=false, z=false).', () => {
        memory.write(0x00, Opcodes.JNA_ADDR)
        memory.write(0x01, 0x05)

        cpu.carry = false
        cpu.zero = false
        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(0x2)
        expect(cpu.pc).not.toBe(0x5)
      })
      test('should execute JNA_ADDR (c=true, z=true).', () => {
        memory.write(0x00, Opcodes.JNA_ADDR)
        memory.write(0x01, 0x05)

        cpu.carry = true
        cpu.zero = true
        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(5)
        expect(cpu.pc).not.toBe(1)
      })
      test('should execute JNA_REGADDR.', () => {
        memory.write(0x00, Opcodes.JNA_REGADDR)
        memory.write(0x01, 0x00)
        memory.write(0x05, 0x05)
        cpu.gpr[0x0] = 0x5

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(0x2)
        expect(cpu.pc).not.toBe(0x5)
      })
    })

    describe('CALL', () => {
      test('should execute CALL_ADDR.', () => {
        memory.write(0x00, Opcodes.CALL_ADDR)
        memory.write(0x01, 0x05)

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(0x5)
        expect(cpu.sp).toBe(0xE6)
        expect(cpu.memory.read(++cpu.sp)).toBe(0x2)
      })
      test('should execute CALL_REGADDR.', () => {
        memory.write(0x00, Opcodes.CALL_REGADDR)
        memory.write(0x01, 0x00)
        memory.write(0x05, 0x05)
        cpu.gpr[0x0] = 0x5

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(0x5)
        expect(cpu.sp).toBe(0xE6)
        expect(cpu.memory.read(++cpu.sp)).toBe(0x2)
      })
    })

    describe('PUSH', () => {
      test('should execute PUSH_REG.', () => {
        memory.write(0x00, Opcodes.PUSH_REG)
        memory.write(0x01, 0x00)
        cpu.gpr[0x0] = 0x5

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(0x2)
        expect(cpu.sp).toBe(0xE6)

        expect(cpu.memory.read(0xE7)).toBe(0x5)
      })
      test('should execute PUSH_REG multiple times', () => {
        memory.write(0x00, Opcodes.PUSH_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, Opcodes.PUSH_REG)
        memory.write(0x03, 0x00)
        cpu.gpr[0x0] = 0x5

        cpu.fetch()
        cpu.execute()

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(0x4)
        expect(cpu.sp).toBe(0xE5)

        expect(cpu.memory.read(0xE7)).toBe(0x5)
        expect(cpu.memory.read(0xE6)).toBe(0x5)
      })
      test('should execute PUSH_ADDR.', () => {
        memory.write(0x00, Opcodes.PUSH_ADDR)
        memory.write(0x01, 0x02)
        memory.write(0x02, 0x05)

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(0x2)
        expect(cpu.memory.read(++cpu.sp)).toBe(0x5)
      })
      test('should execute PUSH_REGADDR.', () => {
        memory.write(0x00, Opcodes.PUSH_REGADDR)
        memory.write(0x01, 0x00)
        cpu.gpr[0x0] = 0x5

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(0x2)
        expect(cpu.gpr[0x0]).toBe(0x5)
      })
      test('should execute PUSH_NUM.', () => {
        memory.write(0x00, Opcodes.PUSH_NUM)
        memory.write(0x01, 0x05)

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(0x2)
        expect(cpu.memory.read(++cpu.sp)).toBe(0x5)
      })
    })

    describe('POP', () => {
      test('should execute POP_REG.', () => {
        memory.write(0x00, Opcodes.POP_REG)
        memory.write(0x01, 0x00)
        cpu.memory.write(cpu.sp--, 0x5)

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(0x2)
        expect(cpu.memory.read(cpu.sp++)).toBe(0x5)
        expect(cpu.gpr[0x0]).toBe(0x5)
      })
    })

    describe('AND', () => {
      test('should execute AND_REG_TO_REG.', () => {
        memory.write(0x00, Opcodes.AND_REG_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x01)
        cpu.gpr[0x0] = 0xF
        cpu.gpr[0x1] = 0x6

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.gpr[0x0]).toBe(0x6)
        expect(cpu.gpr[0x1]).toBe(0x6)
        expect(cpu.zero).toBe(false)
      })
      test('should execute AND_ADDR_TO_REG.', () => {
        memory.write(0x00, Opcodes.AND_ADDR_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x04)
        memory.write(0x04, 0xFF)
        cpu.gpr[0x0] = 0x0F

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.gpr[0x0]).toBe(0x0F)
        expect(cpu.zero).toBe(false)
      })
      test('should execute AND_REGADDR_TO_REG.', () => {
        memory.write(0x00, Opcodes.AND_REGADDR_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x01)
        memory.write(0x03, 0x06)
        cpu.gpr[0x0] = 0xF
        cpu.gpr[0x1] = 0x3

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.gpr[0x0]).toBe(0x6)
        expect(cpu.gpr[0x1]).toBe(0x3)
        expect(cpu.zero).toBe(false)
      })
      test('should execute AND_NUM_TO_REG.', () => {
        memory.write(0x00, Opcodes.AND_NUM_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x06)
        cpu.gpr[0x0] = 0xF

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.gpr[0x0]).toBe(0x6)
        expect(cpu.zero).toBe(false)
      })
    })

    describe('OR', () => {
      test('should execute OR_REG_TO_REG.', () => {
        memory.write(0x00, Opcodes.OR_REG_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x01)
        cpu.gpr[0x0] = 0x9
        cpu.gpr[0x1] = 0x6

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.gpr[0x0]).toBe(0xF)
        expect(cpu.gpr[0x1]).toBe(0x6)
        expect(cpu.zero).toBe(false)
      })
      test('should execute OR_ADDR_TO_REG.', () => {
        memory.write(0x00, Opcodes.OR_ADDR_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x04)
        memory.write(0x04, 0x03)
        cpu.gpr[0x0] = 0x0C

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.gpr[0x0]).toBe(0xF)
        expect(cpu.zero).toBe(false)
      })
      test('should execute OR_REGADDR_TO_REG.', () => {
        memory.write(0x00, Opcodes.OR_REGADDR_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x01)
        memory.write(0x03, 0x06)
        cpu.gpr[0x0] = 0x9
        cpu.gpr[0x1] = 0x3

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.gpr[0x0]).toBe(0xF)
        expect(cpu.gpr[0x1]).toBe(0x3)
        expect(cpu.zero).toBe(false)
      })
      test('should execute OR_NUM_TO_REG.', () => {
        memory.write(0x00, Opcodes.OR_NUM_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x06)
        cpu.gpr[0x0] = 0x9

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.gpr[0x0]).toBe(0xF)
        expect(cpu.zero).toBe(false)
      })
    })

    describe('XOR', () => {
      test('should execute XOR_REG_TO_REG.', () => {
        memory.write(0x00, Opcodes.XOR_REG_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x01)
        cpu.gpr[0x0] = 0x9
        cpu.gpr[0x1] = 0x6

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.gpr[0x0]).toBe(0xF)
        expect(cpu.gpr[0x1]).toBe(0x6)
        expect(cpu.zero).toBe(false)
      })
      test('should execute XOR_ADDR_TO_REG.', () => {
        memory.write(0x00, Opcodes.XOR_ADDR_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x04)
        memory.write(0x04, 0x03)
        cpu.gpr[0x0] = 0x0C

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.gpr[0x0]).toBe(0xF)
        expect(cpu.zero).toBe(false)
      })
      test('should execute XOR_REGADDR_TO_REG.', () => {
        memory.write(0x00, Opcodes.XOR_REGADDR_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x01)
        memory.write(0x03, 0x06)
        cpu.gpr[0x0] = 0x9
        cpu.gpr[0x1] = 0x3

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.gpr[0x0]).toBe(0xF)
        expect(cpu.gpr[0x1]).toBe(0x3)
        expect(cpu.zero).toBe(false)
      })
      test('should execute XOR_NUM_TO_REG.', () => {
        memory.write(0x00, Opcodes.XOR_NUM_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x06)
        cpu.gpr[0x0] = 0x9

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.gpr[0x0]).toBe(0xF)
        expect(cpu.zero).toBe(false)
      })
    })

    describe('SHL', () => {
      test('should execute SHL_REG_TO_REG.', () => {
        memory.write(0x00, Opcodes.SHL_REG_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x01)
        cpu.gpr[0x0] = 0xF
        cpu.gpr[0x1] = 0x4

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.gpr[0x0]).toBe(0xF0)
        expect(cpu.gpr[0x1]).toBe(0x4)
        expect(cpu.zero).toBe(false)
      })
      test('should execute SHL_ADDR_TO_REG.', () => {
        memory.write(0x00, Opcodes.SHL_ADDR_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x04)
        memory.write(0x04, 0x04)
        cpu.gpr[0x0] = 0x0F

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.gpr[0x0]).toBe(0xF0)
        expect(cpu.zero).toBe(false)
      })
      test('should execute SHL_REGADDR_TO_REG.', () => {
        memory.write(0x00, Opcodes.SHL_REGADDR_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x01)
        memory.write(0x03, 0x04)
        cpu.gpr[0x0] = 0xF
        cpu.gpr[0x1] = 0x3

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.gpr[0x0]).toBe(0xF0)
        expect(cpu.gpr[0x1]).toBe(0x3)
        expect(cpu.zero).toBe(false)
      })
      test('should execute SHL_NUM_TO_REG.', () => {
        memory.write(0x00, Opcodes.SHL_NUM_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x04)
        cpu.gpr[0x0] = 0xF

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.gpr[0x0]).toBe(0xF0)
        expect(cpu.zero).toBe(false)
      })
    })

    describe('SHR', () => {
      test('should execute SHR_REG_TO_REG.', () => {
        memory.write(0x00, Opcodes.SHR_REG_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x01)
        cpu.gpr[0x0] = 0xF
        cpu.gpr[0x1] = 0x2

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.gpr[0x0]).toBe(0x3)
        expect(cpu.gpr[0x1]).toBe(0x2)
        expect(cpu.zero).toBe(false)
      })
      test('should execute SHR_ADDR_TO_REG.', () => {
        memory.write(0x00, Opcodes.SHR_ADDR_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x04)
        memory.write(0x04, 0x04)
        cpu.gpr[0x0] = 0xF0

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.gpr[0x0]).toBe(0xF)
        expect(cpu.zero).toBe(false)
      })
      test('should execute SHR_REGADDR_TO_REG.', () => {
        memory.write(0x00, Opcodes.SHR_REGADDR_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x01)
        memory.write(0x03, 0x04)
        cpu.gpr[0x0] = 0xF0
        cpu.gpr[0x1] = 0x3

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.gpr[0x0]).toBe(0xF)
        expect(cpu.gpr[0x1]).toBe(0x3)
        expect(cpu.zero).toBe(false)
      })
      test('should execute SHR_NUM_TO_REG.', () => {
        memory.write(0x00, Opcodes.SHR_NUM_TO_REG)
        memory.write(0x01, 0x00)
        memory.write(0x02, 0x04)
        cpu.gpr[0x0] = 0xF0

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(3)
        expect(cpu.gpr[0x0]).toBe(0xF)
        expect(cpu.zero).toBe(false)
      })
    })

    describe('NOT', () => {
      test('should execute NOT_REG.', () => {
        // NOT 11111111  (hex 0xFF)
        //   = 00000000  (hex 0x00)

        memory.write(0x00, Opcodes.NOT_REG)
        memory.write(0x01, 0x00)
        cpu.gpr[0x0] = 0xFF

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(2)
        expect(cpu.gpr[0x0]).toBe(0x00)
        expect(cpu.zero).toBe(true)
        expect(cpu.overflow).toBe(false)
        expect(cpu.negative).toBe(false)
      })
      test('should execute NOT_REG.', () => {
        // NOT 10101011  (hex 0xAB)
        //   = 01010100  (hex 0x54)

        memory.write(0x00, Opcodes.NOT_REG)
        memory.write(0x01, 0x00)
        cpu.gpr[0x0] = 0xAB

        cpu.fetch()
        cpu.execute()

        expect(cpu.pc).toBe(2)
        expect(cpu.gpr[0x0]).toBe(0x54)
        expect(cpu.zero).toBe(false)
        expect(cpu.overflow).toBe(false)
        expect(cpu.negative).toBe(false)
      })
    })
  })
})

