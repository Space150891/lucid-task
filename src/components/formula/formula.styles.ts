import { SxProps } from '@mui/material';

const useFormulaStyles = () => {
   const containerBoxSx: SxProps = {
      position: 'absolute',
      //   top: '50%',
      top: '25%',
      left: '50%',
      //   transform: 'translate(-50%, -50%)',
      transform: 'translate(-50%, -25%)',
   };

   const wrapperBoxSx: SxProps = {
      width: '548px',
      border: '1px solid #edf0f2',
      borderTopLeftRadius: '5px',
      borderTopRightRadius: '5px',
   };

   const headerBoxSx: SxProps = {
      display: 'flex',
      alignItems: 'center',
      paddingBlock: '4px',
      backgroundColor: '#00113319',
      borderTopLeftRadius: '4px',
      borderTopRightRadius: '4px',
   };

   const contentBoxSx: SxProps = {
      padding: '8px 16px',
      backgroundColor: '#f6f8fA',
   };

   const inputBoxSx: SxProps = {
      display: 'flex',
      flexDirection: 'column',
      padding: '8px 16px',
      backgroundColor: '#ffffff',
   };

   const iconButtonSx: SxProps = {
      marginRight: '8px',
   };

   const formulaNameTypographySx: SxProps = {
      cursor: 'pointer',
   };

   const calcButtonSx: SxProps = {
      marginTop: '16px',
   };

   return {
      containerBoxSx,
      wrapperBoxSx,
      headerBoxSx,
      contentBoxSx,
      inputBoxSx,
      iconButtonSx,
      formulaNameTypographySx,
      calcButtonSx,
   };
};

export default useFormulaStyles;
