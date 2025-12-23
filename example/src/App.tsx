import { createRef, type InputHTMLAttributes, useMemo, useState } from 'react';
import { useKeydownEnter } from 'use-keydown-enter';
import reactLogo from './assets/react.svg';

const ARRAY = Array.from({ length: 5 });

function App() {
  const { getKeydownProps } = useKeydownEnter({ isEnable: true });

  const refs = useMemo(() => {
    return ARRAY.map(() => createRef<HTMLInputElement>());
  }, []);

  return (
    <main className='min-h-screen flex flex-col justify-center items-center'>
      <div>
        <img
          src={reactLogo}
          className='logo react animate-spin scale-150'
          style={{ animationDuration: '5s' }}
          alt='React logo'
        />
      </div>
      <h1 className='text-xl font-bold py-4'>React Hook - useKeydownEnter</h1>
      <div className='flex flex-col gap-2'>
        {ARRAY.map((_, index) => (
          <Input
            {...getKeydownProps({ index, ref: refs[index] })}
            key={index.toString()}
            type='text'
            placeholder={`text ${index + 1}`}
            className='border rounded px-2 py-1'
          />
        ))}

        <input type='text' defaultValue={''} key='' />
        <button
          type='button'
          className='bg-black text-white px-4 py-2 rounded-xl'
          onClick={() => {
            const targetIndex = Math.floor(Math.random() * ARRAY.length);
            refs[targetIndex].current?.focus();
          }}
        >
          Focus Change
        </button>
      </div>
    </main>
  );
}

const Input = (props: InputHTMLAttributes<HTMLInputElement>) => {
  const [value, setValue] = useState('');
  return <input {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
};

export default App;
