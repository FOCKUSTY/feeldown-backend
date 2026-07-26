/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Prettify } from "@/types";

type BaseEnumeration = Record<string, string>;

type ValueType<Enumeration extends Readonly<BaseEnumeration>> = Prettify<
  Enumeration[keyof Enumeration]
>;
type KeyType<Enumeration extends Readonly<BaseEnumeration>> = Prettify<
  keyof Enumeration
>;
type EntriesType<Enumeration extends BaseEnumeration> = Prettify<
  {
    [Key in keyof Enumeration]: [Key, Enumeration[Key]];
  }[keyof Enumeration][]
>;

type GetKeyByValue<
  Enumeration extends BaseEnumeration,
  Value extends ValueType<Enumeration>,
> = {
  [Key in keyof Enumeration]: Enumeration[Key] extends Value ? Key : never;
}[keyof Enumeration];

type Revert<Enumeration extends BaseEnumeration> = Prettify<{
  [Key in keyof Enumeration as Enumeration[Key]]: Key;
}>;

export class Enumeration<const T extends Readonly<BaseEnumeration>> {
  private readonly _lazy: string[];
  //@ts-expect-error
  private _reverted?: Enumeration<Revert<T>>;

  public readonly keys: readonly KeyType<T>[];
  public readonly values: readonly ValueType<T>[];
  public readonly entries: EntriesType<T>;
  public readonly type: ValueType<T>;

  public constructor(public readonly enumeration: T) {
    this.keys = Object.keys(this.enumeration) as readonly KeyType<T>[];
    this._lazy = Object.values(this.enumeration);
    //@ts-expect-error
    this.entries = Object.entries(this.enumeration);
    //@ts-expect-error
    this.values = this._lazy as readonly ValueType<T>[];
    this.type = this.values[0];
  }

  public isValidValue<Value extends string>(
    value: Value,
  ): Value extends ValueType<T> ? true : false {
    return this._lazy.includes(value) as Value extends ValueType<T>
      ? true
      : false;
  }

  public isValidKey<Key extends string>(
    key: Key,
  ): Key extends KeyType<T> ? true : false {
    return (key in this.enumeration) as Key extends KeyType<T> ? true : false;
  }

  public getKey<P extends ValueType<T>>(value: P) {
    //@ts-expect-error
    const entry = this.entries.find(([, v]) => v === value);
    return entry![0] as GetKeyByValue<T, P>;
  }

  public revert() {
    this.validateValuesUnique();

    if (this._reverted) {
      return this._reverted;
    }

    const entries = this.keys.map(
      (key) => [this.enumeration[key], key] as const,
    );
    const record = Object.fromEntries(entries) as Revert<T>;
    //@ts-expect-error
    const enumeration = new Enumeration<Revert<T>>(record);
    this._reverted = enumeration;
    return enumeration;
  }

  private validateValuesUnique(): void {
    const unique = new Set(this._lazy);
    if (unique.size === this._lazy.length) {
      return;
    }

    const duplicates = this._lazy.filter(
      (value, index, array) => array.indexOf(value) !== index,
    );
    throw new Error(
      `Enum values must be unique. Duplicates: ${[...new Set(duplicates)].join(", ")}`,
    );
  }
}
