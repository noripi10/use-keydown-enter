import { createRef, type InputHTMLAttributes, type Ref, useMemo, useState } from 'react';
import { type FieldValues, type UseControllerProps, useController, useFieldArray, useForm } from 'react-hook-form';
import { useKeydownEnter } from 'use-keydown-enter';
import reactLogo from './assets/react.svg';

type FormValues = { inputs: { name: string }[] };

function App() {
  const [ARRAY] = useState(Array.from({ length: 5 }));

  const refs = useMemo(() => {
    return ARRAY.map(() => createRef<HTMLInputElement>());
  }, [ARRAY]);

  const { getKeydownProps } = useKeydownEnter({ isEnable: true });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { inputs: [...ARRAY.map(() => ({ name: '' }))] },
    shouldFocusError: false, // auto-focus on error
  });
  const { fields } = useFieldArray({ control, name: 'inputs' });
  if (errors.inputs) {
    const index = errors.inputs.findIndex?.((e) => Boolean(e)) ?? -1;
    refs[index].current?.focus();
  }

  const onSubmit = (values: FormValues) => {
    console.log('onSubmit', { values });
  };

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-2'>
          {fields.map((f, index) => (
            <Input
              {...getKeydownProps({ index, ref: refs[index] })}
              key={f.id}
              type='text'
              placeholder={`text ${index + 1}`}
              className='border rounded px-2 py-1'
              control={control}
              name={`inputs.${index}.name`}
              rules={{ required: '必須入力' }}
            />
          ))}

          <div className='flex gap-2'>
            <button
              type='button'
              className='bg-gray-600 text-white px-4 py-2 rounded-xl'
              onClick={() => {
                const targetIndex = Math.floor(Math.random() * ARRAY.length);
                refs[targetIndex].current?.focus();
              }}
            >
              Focus Change
            </button>

            <button type='submit' className='bg-black text-white px-4 py-2 rounded-xl'>
              Submit
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

type InputProps<T extends FieldValues> = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'name' | 'defaultValue' | 'disabled'
> & {
  ref?: Ref<HTMLInputElement>; // getKeydownProps
} & Omit<UseControllerProps<T>, 'defaultValue'>; // 初期値は useForm の defaultValues で指定する

const Input = <T extends FieldValues>(props: InputProps<T>) => {
  const { name, control, rules, shouldUnregister, disabled, ref, ...rest } = props;

  const { field, fieldState } = useController({
    name,
    control,
    rules,
    shouldUnregister,
    disabled,
  });

  return (
    <>
      <input
        {...field}
        {...rest}
        ref={(el) => {
          // react-hook-form
          field.ref(el);

          // use-keydown-enter
          if (typeof ref === 'function') {
            ref(el);
          } else if (ref) {
            ref.current = el;
          }
        }}
      />
      {fieldState.error && <span className='text-red-500'>{fieldState.error.message}</span>}
    </>
  );
};

export default App;
