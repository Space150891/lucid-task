import { Box, IconButton, Typography, Collapse, TextField, Autocomplete, Chip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import { v4 as uuidv4 } from 'uuid';
import useFormulaStyles from './formula.styles';
import useFormulaLogic, { FormulaArg } from './formula.logic';

function Formula() {
   const sx = useFormulaStyles();
   const { data, handlers } = useFormulaLogic();

   return (
      <Box sx={sx.containerBoxSx}>
         <Box sx={sx.wrapperBoxSx}>
            <Box sx={sx.headerBoxSx}>
               <IconButton sx={sx.iconButtonSx} onClick={handlers.toggleInput}>
                  <PlayArrowIcon sx={data.inputOpen ? { transform: 'rotate(90deg)' } : {}} fontSize='small' />
               </IconButton>

               {data.formulaNameInputOpen ? (
                  <TextField
                     variant='standard'
                     value={data.formulaName}
                     onChange={handlers.handleFormulaNameInputChange}
                     onBlur={handlers.handleFormulaNameInputBlur}
                     autoFocus
                  />
               ) : (
                  <Typography
                     sx={sx.formulaNameTypographySx}
                     variant='body2'
                     onClick={handlers.openFormulaNameInput}
                  >
                     {data.formulaName}
                  </Typography>
               )}
            </Box>

            <Box sx={sx.contentBoxSx}>
               <Typography>0</Typography>
            </Box>

            <Collapse in={data.inputOpen} timeout='auto'>
               <Box sx={sx.inputBoxSx}>
                  <Autocomplete
                     multiple
                     freeSolo
                     forcePopupIcon={false}
                     value={data.autocompleteValue}
                     onChange={handlers.handleAutocompleteChange}
                     options={data.formulaArgs}
                     getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
                     filterOptions={handlers.handleFilterOptions}
                     inputValue={data.autocompleteInputValue}
                     onInputChange={(_, value) => {
                        handlers.setAutocompleteInputValue(value);
                     }}
                     renderInput={(params) => <TextField {...params} fullWidth />}
                     renderTags={(value, getTagProps) =>
                        value.map((option: FormulaArg, index: number) => {
                           //    const optionId = uuidv4();
                           return (
                              <Chip
                                 variant={option.category === 'OPERAND' ? 'outlined' : 'filled'}
                                 label={
                                    <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                                       <Typography variant='caption'>{option.name}</Typography>
                                       {option.category !== 'OPERAND' && (
                                          <>
                                             <Typography sx={{ marginInline: '2px' }} variant='caption'>
                                                |
                                             </Typography>
                                             {data.argFormatValInputOpen &&
                                             data.argFormatInputValId === option.id ? (
                                                <input
                                                   style={{ width: '30px', outline: 'none' }}
                                                   autoFocus
                                                   value={data.argFormatInputVal}
                                                   onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                      handlers.setArgFormatInputVal(e.target.value)
                                                   }
                                                   onBlur={() => {
                                                      handlers.setAutocompleteValue(
                                                         data.autocompleteValue.map((autocompleteVal) => {
                                                            if (
                                                               autocompleteVal.id === data.argFormatInputValId
                                                            ) {
                                                               return {
                                                                  ...autocompleteVal,
                                                                  value: data.argFormatInputVal,
                                                               };
                                                            }

                                                            return autocompleteVal;
                                                         }),
                                                      );
                                                      handlers.setArgFormatInputVal('');
                                                      handlers.setArgFormatInputValId('');
                                                      handlers.setArgFormatValInputOpen(false);
                                                   }}
                                                />
                                             ) : (
                                                <Typography
                                                   variant='caption'
                                                   onClick={() => {
                                                      handlers.setArgFormatInputValId(option.id);
                                                      handlers.setArgFormatValInputOpen(true);
                                                   }}
                                                >
                                                   {option.value}
                                                </Typography>
                                             )}
                                          </>
                                       )}
                                    </Box>
                                 }
                                 {...getTagProps({ index })}
                              />
                           );
                        })
                     }
                  />
               </Box>
            </Collapse>
         </Box>
      </Box>
   );
}

export default Formula;
