export function merge<T1, T2, T3>(obj1: T1, obj2: T2, obj3?: T3): T1 & T2 & T3 {
  return { ...obj1, ...obj2, ...obj3 } as T1 & T2 & T3;
}
