import { Theme, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { frFR } from '@mui/material/locale';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import '@common/assets/styles/app.scss';
import Layout from '@common/layout/Layout';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import type {} from '@mui/lab/themeAugmentation';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { DataProvider } from '@common/contexts/DataContext';
import palette from '@common/theme/palette';
import typography from '@common/theme/typography';
import shadows from '@common/theme/shadows';
import ProgressBar from '@common/components/lib/feedbacks/ProgressBar';
import LoadingScreen from '@common/components/lib/feedbacks/LoadingScreen';
import customShadows from '@common/theme/customShadows';
import SnackbarProvider from '@common/contexts/SnackbarProvider';
import GlobalStyles from '@common/theme/GlobalStyles';
import ComponentsOverrides from '@common/theme/ComponentsOverrides';
import type {} from '@mui/x-data-grid/themeAugmentation';
import type {} from '@mui/x-data-grid-pro/themeAugmentation';
import type {} from '@mui/x-data-grid-premium/themeAugmentation';
import { RoutingHistoryProvider } from '@common/contexts/RoutingHistoryContext';

// declare module '@mui/material/Button' { // If we add a color, then we need to add the color in each component
//    interface ButtonPropsColorOverrides {
//    }
// }

const App = ({ Component, pageProps }: AppProps) => {
  const { initialized: authInitialized } = useAuth();
  if (!authInitialized) {
    return <LoadingScreen />;
  }
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};
const AppWrapper = (props: AppProps) => {
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null);
  const [theme, setTheme] = useState<Theme | null>(null);
  useEffect(() => {
    setRootElement(() => document.querySelector('#__next'));
  }, []);
  useEffect(() => {
    if (rootElement) {
      setTheme(() =>
        createTheme(
          {
            palette,
            typography,
            shape: { borderRadius: 12 },
            shadows,
            customShadows,
            components: ComponentsOverrides,
            breakpoints: {
              values: {
                xs: 0,
                sm: 600,
                md: 960,
                lg: 1280,
                xl: 1920,
              },
            },
          },
          frFR
        )
      );
    }
  }, [rootElement]);
  if (!theme) {
    return <LoadingScreen />;
  }
  return (
    <>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalStyles />
          <DataProvider>
            <RoutingHistoryProvider>
              <SnackbarProvider>
                <ProgressBar />
                <App {...props} />
              </SnackbarProvider>
            </RoutingHistoryProvider>
          </DataProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  );
};

export default AppWrapper;
