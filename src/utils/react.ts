import { effect, ReactiveEffectRunner, stop } from "@vue/reactivity";
import { FunctionComponent, useEffect, useRef, useState } from "react";

export function reacter<T extends FunctionComponent>(cmp: T): T {
  return ((props: Parameters<T>[0]) => {
    const runner = useRef<ReactiveEffectRunner>(undefined);
    const [, setCounter] = useState(0);

    // Cleans up on unmount
    useEffect(
      () => () => {
        if (runner.current) {
          stop(runner.current);
        }
      },
      [],
    );

    // Stop previous effect if there was one. We need to start a new one.
    if (runner.current) {
      stop(runner.current);
    }

    let res: ReturnType<T> | undefined;

    // Effect notices what has been read and re-runs when something changes. On effect's first re-run
    // a React re-render is triggered.
    runner.current = effect(() => {
      if (res === undefined) {
        res = cmp(props) as ReturnType<T>;
      } else {
        setCounter((c) => c + 1);
      }
    });

    return res;
  }) as T;
}
