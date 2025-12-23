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

export type UseKeydownEnter<T extends HTMLElement> = {
  getKeydownProps: (
    userProps: React.HTMLAttributes<T> & { index: number; ref?: React.Ref<T> }
  ) => React.HTMLAttributes<T> & {
    ref: React.RefCallback<T>;
    onKeyDown: (e: React.KeyboardEvent<T>) => void;
  };
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

          if (isEnable && !e.nativeEvent.isComposing) {
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
