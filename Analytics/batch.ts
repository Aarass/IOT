export class BatchBuffer<T> {
  private buffer: T[];
  private index: number = 0;

  constructor(
    private size: number,
    private onFull: (batch: T[]) => void,
  ) {
    if (size === 0) throw "Size can't be 0";
    this.buffer = new Array<T>(size);
  }

  public add(item: T): void {
    this.buffer[this.index++] = item;

    // console.log(`[${this.index}/${this.size}]`);

    if (this.index === this.size) {
      this.flush();
    }
  }

  private flush(): void {
    // if (this.index === 0) return;

    const filled = this.buffer.slice(0, this.index);
    this.onFull(filled);

    this.index = 0;
  }
}
