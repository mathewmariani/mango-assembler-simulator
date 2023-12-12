export enum Opcodes {
  NONE = 0x00,

  // mov opcodes
  MOV_REG_TO_REG = 0x01,
  MOV_REG_TO_ADDR = 0x02,
  MOV_REG_TO_REGADDR = 0x03,
  MOV_ADDR_TO_REG = 0x04,
  MOV_REGADDR_TO_REG = 0x05,
  MOV_NUM_TO_REG = 0x06,
  MOV_NUM_TO_ADDR = 0x07,
  MOV_NUM_TO_REGADDR = 0x08,

  // arithmatic opcodes
  // add
  ADD_REG_TO_REG = 0x09,
  ADD_ADDR_TO_REG = 0x0A,
  ADD_REGADDR_TO_REG = 0x0B,
  ADD_NUM_TO_REG = 0x0C,
  // subtract
  SUBT_REG_FROM_REG = 0x0D,
  SUBT_ADDR_FROM_REG = 0x0E,
  SUBT_REGADDR_FROM_REG = 0x0F,
  SUBT_NUM_FROM_REG = 0x10,
  // increment
  INC_REG = 0x11,
  // decrement
  DEC_REG = 0x12,

  // comparison instructions
  CMP_REG_TO_REG = 0x13,
  CMP_ADDR_TO_REG = 0x14,
  CMP_REGADDR_TO_REG = 0x15,
  CMP_NUM_TO_REG = 0x16,

  // jump instructions
  // jump
  JMP_ADDR = 0x17,
  JMP_REGADDR = 0x18,
  // jump carry (c = true)
  JC_ADDR = 0x19,
  JC_REGADDR = 0x1A,
  // jump not carry (c = false)
  JNC_ADDR = 0x1B,
  JNC_REGADDR = 0x1C,
  // jump zero (z = true)
  JZ_ADDR = 0x1D,
  JZ_REGADDR = 0x1E,
  // jump not zero (z = false)
  JNZ_ADDR = 0x1F,
  JNZ_REGADDR = 0x20,
  // jump zero (c = false, z = false)
  JA_ADDR = 0x21,
  JA_REGADDR = 0x22,
  // jump not zero (c = true, z = true)
  JNA_ADDR = 0x23,
  JNA_REGADDR = 0x24,

  // subroutine instructions
  CALL_ADDR = 0x2F,
  CALL_REGADDR = 0x30,
  RET = 0x31,

  // stack operations
  // push
  PUSH_REG = 0x32,
  PUSH_ADDR = 0x33,
  PUSH_REGADDR = 0x34,
  PUSH_NUM = 0x35,
  // pop
  POP_REG = 0x36,

  // binary operations
  // and
  AND_REG_TO_REG = 0x37,
  AND_ADDR_TO_REG = 0x38,
  AND_REGADDR_TO_REG = 0x39,
  AND_NUM_TO_REG = 0x3A,
  // or
  OR_REG_TO_REG = 0x3B,
  OR_ADDR_TO_REG = 0x3C,
  OR_REGADDR_TO_REG = 0x3D,
  OR_NUM_TO_REG = 0x3E,
  // xor
  XOR_REG_TO_REG = 0x3F,
  XOR_ADDR_TO_REG = 0x40,
  XOR_REGADDR_TO_REG = 0x41,
  XOR_NUM_TO_REG = 0x42,
  // shl
  SHL_REG_TO_REG = 0x43,
  SHL_ADDR_TO_REG = 0x44,
  SHL_REGADDR_TO_REG = 0x45,
  SHL_NUM_TO_REG = 0x46,
  // shr
  SHR_REG_TO_REG = 0x47,
  SHR_ADDR_TO_REG = 0x48,
  SHR_REGADDR_TO_REG = 0x49,
  SHR_NUM_TO_REG = 0x4A,
  // not
  NOT_REG = 0x4B,
}