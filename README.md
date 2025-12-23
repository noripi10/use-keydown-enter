# use-keydown-enter

A React hook library that allows you to perform focus movement, usually achieved by the Tab key, using the Enter key. This is especially useful for forms or input sequences where you'd like to use Enter to move to the next input.

## Features

- Moves focus to the next input when pressing Enter.
- Shift+Enter moves focus to the previous input.
- Supports controlled/uncontrolled components.
- Easy integration with custom input components.
- Written in TypeScript.

## Installation

```bash
npm install use-keydown-enter
# or
pnpm add use-keydown-enter
# or
yarn add use-keydown-enter
```

## Basic Usage

```tsx
import { useKeydownEnter } from 'use-keydown-enter';

const ARRAY = Array.from({ length: 5 });

function App() {
  const { getKeydownProps } = useKeydownEnter({ isEnable: true });
  const refs = useMemo(() => ARRAY.map(() => createRef<HTMLInputElement>()), []);

  return (
    <main>
      {ARRAY.map((_, index) => (
        <input
          {...getKeydownProps({ index, ref: refs[index] })}
          key={index}
          type="text"
          placeholder={`Text ${index + 1}`}
        />
      ))}
    </main>
  );
}
```

## API

### `useKeydownEnter({ isEnable })`

- `isEnable` (`boolean`): Enables or disables the Enter key focus movement.

**Returns:**

- `getKeydownProps`: A function to spread onto your input components. It requires:
    - `index`: The tab/focus index of the input.
    - `ref` (optional): The ref for the input.

### Example with Custom Input

```tsx
const Input = (props) => {
  const [value, setValue] = useState('');
  return <input {...props} value={value} onChange={e => setValue(e.target.value)} />;
};

function App() {
  const { getKeydownProps } = useKeydownEnter({ isEnable: true });
  const refs = useMemo(() => ARRAY.map(() => createRef<HTMLInputElement>()), []);

  return (
    <>
      {ARRAY.map((_, index) => (
        <Input
          {...getKeydownProps({ index, ref: refs[index] })}
          key={index}
          placeholder={`Text ${index + 1}`}
        />
      ))}
    </>
  );
}
```

## Demo

Check out the [example](./example/src/App.tsx) in this repository.

## License

MIT © [noripi10](https://noripi10.dev)
