import React, { useState } from 'react';
import Head from 'next/head';
import Footer from './Footer';
import Leftbar, { LEFTBAR_WIDTH } from './Leftbar';
// import Topbar from './Topbar';
import Box from '@mui/material/Box';
import { Container, useMediaQuery, useTheme } from '@mui/material';
import Stack from '@mui/material/Stack';

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = (props: ILayoutProps) => {
  const { children } = props;
  const theme = useTheme();
  const [openLeftbar, setOpenLeftbar] = useState(false);
  const isMobile = !useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <div>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_TITLE}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Box
        sx={{
          display: 'flex',
        }}
      >
        <Box sx={{ minHeight: '100vh', width: '100vw' }}>
          <Stack direction="column" sx={{ height: '100%', position: 'relative' }}>
            <Leftbar open={openLeftbar} onToggle={(open) => setOpenLeftbar(open)} />
            {/* <Topbar /> */}
            <Box
              sx={
                !isMobile
                  ? {
                      display: 'flex',
                      flex: 1,
                      justifyContent: 'center',
                      marginLeft: openLeftbar ? LEFTBAR_WIDTH + 'px' : 0,
                      width: openLeftbar ? `calc(100% - ${LEFTBAR_WIDTH}px)` : '100%',
                    }
                  : {
                      display: 'flex',
                      flex: 1,
                      justifyContent: 'center',
                      marginLeft: 0,
                      width: '100%',
                    }
              }
            >
              <Container
                sx={{
                  flex: 1,
                  paddingY: 6,
                  transition: theme.transitions.create(['all'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                  }),
                }}
              >
                <Box component="main" sx={{}}>
                  {children}
                </Box>
              </Container>
            </Box>
            <Box
              sx={
                !isMobile
                  ? {
                      marginLeft: openLeftbar ? LEFTBAR_WIDTH + 'px' : 0,
                      maxWidth: openLeftbar ? `calc(100% - ${LEFTBAR_WIDTH}px)` : '100%',
                      transition: theme.transitions.create(['all'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                      }),
                    }
                  : {
                      marginLeft: 0,
                      width: '100%',
                      transition: theme.transitions.create(['all'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                      }),
                    }
              }
            >
              <Footer />
            </Box>
          </Stack>
        </Box>
      </Box>
    </div>
  );
};

export default Layout;
