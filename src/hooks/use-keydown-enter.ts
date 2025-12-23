import React, { createRef, useRef } from 'react';

const composeRefs = <T>(...refs: Array<React.Ref<T> | undefined>): React.RefCallback<T> => {
  return (node) => {
    const cleanups: Array<() => void> = [];

    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') {
        const cleanup = ref(node);
        if (typeof cleanup === 'function') {
          cleanups.push(cleanup);
        }
      } else {
        ref.current = node;
      }
    }

    if (cleanups.length) {
      return () => {
        for (const cleanup of cleanups) cleanup?.();
      };
    }

    return;
  };
};

export type UseKeydownEnterProps = {
  isEnable: boolean;
};

export type GetKyedownProps<T extends HTMLElement> = (
  userProps: React.HTMLAttributes<T> & {
    index: number;
    ref?: React.Ref<T> | undefined;
  }
) => React.HTMLAttributes<T> & {
  ref: (
    instance: T | null
  ) =>
    | void
    | (() => void | undefined)
    | React.DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES[keyof React.DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES];
  onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
};

export type UseKeydownEnter<T extends HTMLElement> = {
  getKeydownProps: GetKyedownProps<T>;
};

export const useKeydownEnter = <T extends HTMLElement>({ isEnable }: UseKeydownEnterProps): UseKeydownEnter<T> => {
  const elements: React.RefObject<Map<number, React.RefObject<T | null>>> = useRef(new Map());

  const getKeydownProps = React.useCallback(
    (userProps: React.HTMLAttributes<HTMLElement> & { index: number; ref?: React.Ref<HTMLElement> }) => {
      const { index, ref: userRef, onKeyDown: userOnKeyDown, ...rest } = userProps ?? {};

      if (!elements.current.has(index)) {
        elements.current.set(index, createRef<T>());
      }
      const internalRef = elements.current.get(index);

      return {
        ...rest,
        ref: composeRefs(userRef, internalRef),
        onKeyDown: <T extends HTMLElement>(e: React.KeyboardEvent<T>) => {
          if (e.isDefaultPrevented()) {
            return;
          }
          if (e.nativeEvent.isComposing) {
            return;
          }

          if (e.nativeEvent.key === 'Enter' && isEnable) {
            e.preventDefault();

            const { key, shiftKey } = e;

            if (key.toLowerCase() === 'enter' && elements.current.size !== 0) {
              const sortedElements = [...elements.current.keys()].sort();

              let nextIndex = -1;
              if (shiftKey) {
                nextIndex = Math.max(...sortedElements.filter((e) => e < index));
              } else {
                nextIndex = sortedElements.findIndex((e) => e > index);
              }

              if (nextIndex !== -1) {
                const nextElement = elements.current.get(nextIndex);
                nextElement?.current?.focus();
              }
            }
          }

          // User event
          userOnKeyDown?.(e);
        },
      };
    },
    [isEnable]
  );

  return { getKeydownProps };
};
