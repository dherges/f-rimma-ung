import { Dependency } from './dependency';

export interface Repository<K, V> {
  exists(key: K): boolean;
  findOne(key: K): Promise<V>;
}

export interface ReleaseRepository extends Repository<string, Dependency> {
}
