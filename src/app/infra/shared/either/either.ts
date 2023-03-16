export type Either<L, R> = Left<L, R> | Rigth<L, R>;

export class Left<L, R> {
  constructor(readonly value: L) {}

  isLeft(): this is Left<L, R> {
    return true;
  }
  isRigth(): this is Rigth<L, R> {
    return false;
  }
}

export class Rigth<L, R> {
  constructor(readonly value: R) {}

  isLeft(): this is Left<L, R> {
    return false;
  }
  isRigth(): this is Rigth<L, R> {
    return true;
  }
}

export const left = <L, R>(l: L): Either<L, R> => {
  return new Left<L, R>(l);
};

export const rigth = <L, R>(r: R): Either<L, R> => {
  return new Rigth<L, R>(r);
};

export class EitherCombine<L, R> {
  private constructor(public readonly combines: Either<L, R>[]) {
    Object.freeze(this);
  }

  public static validate<L, R>(eithers: Either<L, R>[]): Either<any, any> {
    for (const either of eithers) {
      if (either.isLeft()) {
        return either;
      }
    }
    return rigth(new EitherCombine(eithers));
  }
}
