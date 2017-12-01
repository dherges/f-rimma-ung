export interface Repository<K, V> {
  exists(key: K): boolean;
  findOne(key: K): Promise<V>;
}

