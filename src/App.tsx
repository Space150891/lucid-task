import { QueryClient, QueryClientProvider } from 'react-query';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import Formula from './components/formula';

const queryClient = new QueryClient();

const theme = createTheme({});

function App() {
   return (
      <QueryClientProvider client={queryClient}>
         <ThemeProvider theme={theme}>
            <Formula />
            <CssBaseline />
         </ThemeProvider>
      </QueryClientProvider>
   );
}

export default App;
