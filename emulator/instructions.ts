export type InstructionType = { unary: boolean, binary: boolean }

export const InstructionSet: Record<string, InstructionType> = {
  // pseudo-instructions
  "DB": { unary: true, binary: false },
  
  // halt instruction
  "HLT": { unary: false, binary: false },

  // move instruction
  "MOV": { unary: false, binary: true },

  // arithmatic instructions
  "ADD": { unary: false, binary: true },
  "SUBT": { unary: false, binary: true },
  "MUL": { unary: true, binary: false },
  "DIV": { unary: true, binary: false },
  "INC": { unary: true, binary: false },
  "DEC": { unary: true, binary: false },

  // comparison instructions
  "CMP": { unary: false, binary: true },

  // jump instructions
  "JMP": { unary: true, binary: false },
  "JC": { unary: true, binary: false },
  "JNC": { unary: true, binary: false },
  "JZ": { unary: true, binary: false },
  "JNZ": { unary: true, binary: false },
  "JA": { unary: true, binary: false },
  "JNA": { unary: true, binary: false },
  
  // stack instructions
  "PUSH": { unary: true, binary: false },
  "POP": { unary: true, binary: false },

  // subroutine instructions
  "CALL": { unary: true, binary: false },
  "RET": { unary: false, binary: false },

  // binary instructions
  "AND": { unary: false, binary: true },
  "OR": { unary: false, binary: true },
  "XOR": { unary: false, binary: true },
  "SHL": { unary: false, binary: true },
  "SHR": { unary: false, binary: true },
  "NOT": { unary: true, binary: false },
}