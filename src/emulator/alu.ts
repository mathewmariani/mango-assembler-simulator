export type ALUResult = {
  sum: number
  is_zero: boolean
  is_carry: boolean
  is_overflow: boolean
  is_negative: boolean
}

export type ALUOperationFunction = (lhs: number, rhs: number) => ALUResult

export class ALU {
  private static is_zero(sum: number): boolean {
    return (sum === 0) ? true : false
  }
  
  private static is_overflow(lhs: number, rhs: number, sum: number): boolean {
    return ((lhs & 0x80) === (rhs & 0x80)) ?
      (((lhs & 0x80) !== (sum & 0x80)) ? true : false) : false
  }
  
  private static is_negative(sum: number): boolean {
    return ((sum & 0x80) === 0x80)
  }

  static not(value: number): ALUResult {
    const sum = ((~value) & 0xFF)
    return {
      sum: sum,
      is_zero: ALU.is_zero(sum),
      is_carry: false,
      is_overflow: false,
      is_negative: ALU.is_negative(sum)
    }
  }

  static and(lhs: number, rhs: number): ALUResult {
    const sum = ((lhs & rhs) & 0xFF)
    return {
      sum: sum,
      is_zero: ALU.is_zero(sum),
      is_carry: false,
      is_overflow: ALU.is_overflow(lhs, rhs, sum),
      is_negative: ALU.is_negative(sum)
    }
  }

  static or(lhs: number, rhs: number): ALUResult {
    const sum = ((lhs | rhs) & 0xFF)
    return {
      sum: sum,
      is_zero: ALU.is_zero(sum),
      is_carry: false,
      is_overflow: ALU.is_overflow(lhs, rhs, sum),
      is_negative: ALU.is_negative(sum)
    }
  }

  static xor(lhs: number, rhs: number): ALUResult {
    const sum = ((lhs ^ rhs) & 0xFF)
    return {
      sum: sum,
      is_zero: ALU.is_zero(sum),
      is_carry: false,
      is_overflow: ALU.is_overflow(lhs, rhs, sum),
      is_negative: ALU.is_negative(sum)
    }
  }

  static shl(lhs: number, rhs: number): ALUResult {
    const sum = ((lhs << rhs) & 0xFF)
    return {
      sum: sum,
      is_zero: ALU.is_zero(sum),
      is_carry: false,
      is_overflow: ALU.is_overflow(lhs, rhs, sum),
      is_negative: ALU.is_negative(sum)
    }
  }

  static shr(lhs: number, rhs: number): ALUResult {
    const sum = ((lhs >>> rhs) & 0xFF)
    return {
      sum: sum,
      is_zero: ALU.is_zero(sum),
      is_carry: false,
      is_overflow: ALU.is_overflow(lhs, rhs, sum),
      is_negative: ALU.is_negative(sum)
    }
  }

  static add(lhs: number, rhs: number): ALUResult {
    const sum = ((lhs + rhs) & 0xFF)
    return {
      sum: sum,
      is_zero: ALU.is_zero(sum),
      is_carry: false,
      is_overflow: ALU.is_overflow(lhs, rhs, sum),
      is_negative: ALU.is_negative(sum),
    }
  }

  static sub(lhs: number, rhs: number): ALUResult {
    const sum = ((lhs - rhs) & 0xFF)
    return {
      sum: sum,
      is_zero: ALU.is_zero(sum),
      is_carry: false,
      is_overflow: ALU.is_overflow(lhs, rhs, sum),
      is_negative: ALU.is_negative(sum),
    }
  }
}