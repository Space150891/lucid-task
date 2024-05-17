import { create } from 'zustand';
import { useQuery } from 'react-query';
import { FilterOptionsState } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

type Store = {
   formulaName: string;
   formulaNameInputOpen: boolean;
   openFormulaNameInput: () => void;
   closeFormulaNameInput: () => void;
   setFormulaName: (formulaName: string) => void;
   inputOpen: boolean;
   toggleInput: () => void;
   autocompleteInputValue: string;
   setAutocompleteInputValue: (autocompleteInputValue: string) => void;
   autocompleteValue: Array<FormulaArg>;
   setAutocompleteValue: (autocompleteValue: FormulaArg[]) => void;
   argFormatValInputOpen: boolean;
   setArgFormatValInputOpen: (argFormatValInputOpen: boolean) => void;
   argFormatInputVal: string;
   setArgFormatInputVal: (val: string) => void;
   argFormatInputValId: string;
   setArgFormatInputValId: (valId: string) => void;
};

export type FormulaArg = {
   id: string;
   name: string;
   category: string;
   value: number | string;
   inputs?: string;
};

export const useStore = create<Store>()((set) => ({
   formulaName: 'New Formula',
   formulaNameInputOpen: false,
   openFormulaNameInput: () => set(() => ({ formulaNameInputOpen: true })),
   closeFormulaNameInput: () => set(() => ({ formulaNameInputOpen: false })),
   setFormulaName: (formulaName) => set(() => ({ formulaName })),
   inputOpen: false,
   toggleInput: () => set((state) => ({ inputOpen: !state.inputOpen })),
   autocompleteInputValue: '',
   setAutocompleteInputValue: (autocompleteInputValue: string) => set(() => ({ autocompleteInputValue })),
   autocompleteValue: [],
   setAutocompleteValue: (autocompleteValue: FormulaArg[]) => set(() => ({ autocompleteValue })),
   argFormatValInputOpen: false,
   setArgFormatValInputOpen: (argFormatValInputOpen: boolean) =>
      set(() => ({ argFormatValInputOpen: argFormatValInputOpen })),
   argFormatInputVal: '',
   argFormatInputValId: '',
   setArgFormatInputVal: (val: string) => set(() => ({ argFormatInputVal: val })),
   setArgFormatInputValId: (valId: string) => set(() => ({ argFormatInputValId: valId })),
}));

const useFormulaLogic = () => {
   const formulaName = useStore((state) => state.formulaName);
   const formulaNameInputOpen = useStore((state) => state.formulaNameInputOpen);
   const openFormulaNameInput = useStore((state) => state.openFormulaNameInput);
   const closeFormulaNameInput = useStore((state) => state.closeFormulaNameInput);
   const setFormulaName = useStore((state) => state.setFormulaName);
   const inputOpen = useStore((state) => state.inputOpen);
   const toggleInput = useStore((state) => state.toggleInput);
   const autocompleteInputValue = useStore((state) => state.autocompleteInputValue);
   const setAutocompleteInputValue = useStore((state) => state.setAutocompleteInputValue);
   const autocompleteValue = useStore((state) => state.autocompleteValue);
   const setAutocompleteValue = useStore((state) => state.setAutocompleteValue);
   const argFormatValInputOpen = useStore((state) => state.argFormatValInputOpen);
   const setArgFormatValInputOpen = useStore((state) => state.setArgFormatValInputOpen);
   const argFormatInputVal = useStore((state) => state.argFormatInputVal);
   const setArgFormatInputVal = useStore((state) => state.setArgFormatInputVal);
   const argFormatInputValId = useStore((state) => state.argFormatInputValId);
   const setArgFormatInputValId = useStore((state) => state.setArgFormatInputValId);

   const handleFormulaNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormulaName(event.target.value);
   };

   const handleFormulaNameInputBlur = () => {
      if (!formulaName.trim().length) setFormulaName('New Formula');
      closeFormulaNameInput();
   };

   const { data: formulaArgs = [] } = useQuery<Array<FormulaArg>>('formulaArgs', async () => {
      const response = await fetch('https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete');

      if (!response.ok) {
         throw new Error('Failed to fetch!');
      }

      return await response.json();
   });

   // api returns duplicates with ids 31 and 34
   const formulaArgsUniqueById = [
      ...new Map(formulaArgs.map((formulaArg) => [formulaArg['id'], formulaArg])).values(),
   ];

   const operandsRegExp = /[+*-/()^]+/gm;
   const charsExceptOperandsRegExp = /[^+*-/()^]+/gm;

   const handleFilterOptions = (
      options: Array<FormulaArg>,
      { inputValue }: FilterOptionsState<FormulaArg>,
   ) => {
      const charWithoutOperand = inputValue.match(charsExceptOperandsRegExp);
      const filterValue = charWithoutOperand ? charWithoutOperand[0].trim() : inputValue;
      return options.filter((option) => option.name.includes(filterValue));
   };

   const makeOperandFormulaArg = (operand: string): FormulaArg => ({
      id: uuidv4(),
      category: 'OPERAND',
      name: operand,
      value: operand,
   });

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const handleAutocompleteChange = (_: React.SyntheticEvent, newValue: any[]) => {
      const operands = autocompleteInputValue.match(operandsRegExp);
      if (!operands) {
         return setAutocompleteValue(newValue);
      }

      const operandsAsFormulaArg = operands.map((operand) => makeOperandFormulaArg(operand));

      const prevValues = newValue.slice(0, newValue?.length - 1);
      const updatedLastVal = newValue[newValue?.length - 1];

      setAutocompleteValue([...prevValues, ...operandsAsFormulaArg, updatedLastVal]);
   };

   return {
      data: {
         inputOpen,
         formulaName,
         formulaNameInputOpen,
         formulaArgs: formulaArgsUniqueById,
         autocompleteInputValue,
         autocompleteValue,
         argFormatValInputOpen,
         argFormatInputVal,
         argFormatInputValId,
      },
      handlers: {
         toggleInput,
         openFormulaNameInput,
         closeFormulaNameInput,
         handleFormulaNameInputChange,
         handleFormulaNameInputBlur,
         handleFilterOptions,
         setAutocompleteInputValue,
         handleAutocompleteChange,
         setAutocompleteValue,
         setArgFormatValInputOpen,
         setArgFormatInputVal,
         setArgFormatInputValId,
      },
   };
};

export default useFormulaLogic;
