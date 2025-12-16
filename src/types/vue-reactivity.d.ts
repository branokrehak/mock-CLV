declare module "@vue/reactivity" {
  // Augmenting the return type. The original type uses `UnwrapNestedRefs` which doesn't work nicely with classes.
  // We can avoid type-casting this way.
  export declare function reactive<T extends object>(target: T): T;
}

export {};
