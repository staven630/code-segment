type InternalZipList<T> = {
  prev: T[];
  curr: T;
  next: T[];
}

function portionListByIndex<T>(list: T[], index: number) {
  return list.reduce(
    (acc: any[], curr: T, idx: number) => {
      const [before, after] = acc

      if (idx < index) {
        return [[...before, curr], after]
      } else if (idx > index) {
        return [before, [...after, curr]]
      } else {
        return acc;
      }
    },
    [[], []]
  );
}


class ZipList<T> {
  private readonly zipList: InternalZipList<T>;
  private constructor(zipList: InternalZipList<T>) {
    this.zipList = zipList;
  }

  static fromArray<T>(arr: T[]) {
    const [curr, ...rest] = arr;
    return new ZipList({
      prev: [],
      curr,
      next: rest
    })
  }

  active(): T {
    return this.zipList.curr;
  }

  isActive(item: T): Boolean {
    return this.zipList.curr === item;
  }

  setActive(item: T): ZipList<T> {
    if (this.zipList.prev.includes(item)) {
      const [prevBefore, prevAfter] = portionListByIndex(
        this.zipList.prev,
        this.zipList.prev.findIndex(i => i === item)
      );

      return new ZipList({
        prev: [...prevBefore],
        curr: item,
        next: [
          ...prevAfter,
          this.zipList.curr,
          ...this.zipList.next
        ]
      });
    } else if (this.zipList.next.includes(item)) {
      const [nextBefore, nextAfter] = portionListByIndex(
        this.zipList.next,
        this.zipList.next.findIndex(i => i === item)
      );

      return new ZipList({
        prev: [
          ...this.zipList.prev,
          this.zipList.curr,
          ...nextBefore
        ],
        curr: item,
        next: [...nextAfter]
      })
    } else {
      return this;
    }
  }

  asArray(): T[] {
    return [
      ...this.zipList.prev,
      this.zipList.curr,
      ...this.zipList.next
    ]
  }

}

export default ZipList