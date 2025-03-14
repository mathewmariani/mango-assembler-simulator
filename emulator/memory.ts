export default class Memory {
  private data: Uint8Array;

  private check_range(addr: number, len: number) { 
    if (addr < 0 || addr >= len) {
      throw new RangeError("Memory access violation. Address: " + addr)
    }
  }

  constructor() {
    this.data = new Uint8Array(256)
    this.data.fill(0x00)
  }

  reset() {
    this.data.forEach((e, i, a) => a[i] = 0x00)
  }

  read(addr: number) {
    this.check_range(addr, this.data.length)
    return this.data[addr]
  }

  write(addr: number, value: number) {
    this.check_range(addr, this.data.length)
    this.data[addr] = (value & 0xFF)
  }
}