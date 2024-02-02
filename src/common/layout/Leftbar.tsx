import {
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  styled,
  Stack,
  Tooltip,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import { pxToRem } from '@common/theme/typography';
import DashboardCustomizeRoundedIcon from '@mui/icons-material/DashboardCustomizeRounded';
import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';
import useAuth from '@modules/auth/hooks/api/useAuth';
import { useState, useEffect } from 'react';
import Logo from '@common/assets/svgs/Logo';
import Routes from '@common/defs/routes';
import ListSubheader from '@mui/material/ListSubheader';
import usePermissions from '@modules/permissions/hooks/usePermissions';
import { AccountCircle, AddRounded, Close, ExitToAppOutlined } from '@mui/icons-material';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import { CRUD_ACTION, CrudLabels, CrudRoutes } from '@common/defs/types';
import Namespaces from '@common/defs/namespaces';
import Labels from '@common/defs/labels';
import LockRoundedIcon from '@mui/icons-material/LockRounded';

interface LeftbarProps {
  open: boolean;
  onToggle: (open: boolean) => void;
}
export const LEFTBAR_WIDTH = 260;
interface NavGroup {
  text?: string;
  items: NavItem[];
}
interface NavItem {
  text: string;
  icon: JSX.Element;
  suffix?: {
    tooltip: string;
    icon: JSX.Element;
    link: string;
  };
  link: string;
}
interface CrudNavItem {
  icon: JSX.Element;
  namespace: string;
  routes: CrudRoutes;
  labels: CrudLabels;
}
const Leftbar = (props: LeftbarProps) => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const { can } = usePermissions();
  const [navEntries, setNavEntries] = useState<NavGroup[]>([]);
  const open = props.open;
  useEffect(() => {
    const newEntries: NavGroup[] = [];
    if (user) {
      const managementGroup: NavGroup = {
        text: 'Gestion',
        items: [],
      };
      managementGroup.items.push({
        text: 'Dashboard',
        icon: <DashboardCustomizeRoundedIcon />,
        link: Routes.Common.Home,
      });
      pushCrudNavItem(
        {
          icon: <AccountBoxRoundedIcon />,
          namespace: Namespaces.Users,
          routes: Routes.Users,
          labels: Labels.Users,
        },
        managementGroup
      );
      if (managementGroup.items.length > 0) {
        newEntries.push(managementGroup);
      }
    } else {
      newEntries.push({
        items: [{ text: 'Login', icon: <LockRoundedIcon />, link: Routes.Auth.Login }],
      });
    }
    setNavEntries(newEntries);
  }, [user]);

  const pushCrudNavItem = (item: CrudNavItem, group: NavGroup) => {
    const { icon, namespace, routes, labels } = item;
    if (can(namespace, CRUD_ACTION.READ)) {
      const navEntry: NavItem = {
        text: labels.Items,
        icon,
        link: routes.ReadAll,
      };
      if (can(namespace, CRUD_ACTION.CREATE)) {
        navEntry.suffix = {
          tooltip: labels.NewOne,
          icon: <AddRounded />,
          link: routes.CreateOne,
        };
      }
      group.items.push(navEntry);
    }
  };
  const isMobile = !useMediaQuery(theme.breakpoints.up('sm'));
  const toggleLeftbar = () => {
    const newOpen = !open;
    props.onToggle(newOpen);
  };
  return (
    <>
      <Drawer
        anchor="left"
        open={open}
        variant={isMobile ? 'temporary' : 'persistent'}
        PaperProps={{
          sx: {
            width: LEFTBAR_WIDTH,
            bgcolor: 'background.default',
            borderRightStyle: 'dashed',
            marginTop: 0.5,
            px: 2.5,
          },
        }}
        sx={{
          display: open ? 'block' : 'none',
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            py: 3,
            marginBottom: 2,
            borderBottomWidth: 1,
            borderBottomColor: 'grey.300',
          }}
        >
          <Stack direction="row" alignItems="center">
            <Logo id="leftbar-logo" sx={{ marginRight: 2 }} />
            <Typography variant="h6" sx={{ color: 'primary.main' }}>
              {process.env.NEXT_PUBLIC_APP_TITLE}
            </Typography>
          </Stack>

          <IconButton onClick={toggleLeftbar}>
            <Close
              sx={{
                cursor: 'pointer',
                transition: 'color 0.2s',
                color: 'grey.700',
              }}
              fontSize="small"
            />
          </IconButton>
        </Stack>
        {user && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: theme.spacing(2, 2.5),
              borderRadius: theme.shape.borderRadius * 1.5 + 'px',
              backgroundColor: 'action.hover',
              mb: 5,
            }}
          >
            <AccountCircle fontSize="large" color="action" sx={{ mr: 1 }} />
            <Box>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {user.email}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {user.rolesNames[0]}
              </Typography>
            </Box>
          </Box>
        )}
        <Box>
          <List disablePadding>
            {navEntries.map((entry, groupIndex) => (
              <Box key={groupIndex}>
                {entry.text && <StyledSubheader disableSticky>{entry.text}</StyledSubheader>}
                {entry.items.map((item, itemIndex) => {
                  let link = item.link;
                  if (link.length > 1) {
                    link = item.link.endsWith('/') ? item.link.slice(0, -1) : item.link;
                  }
                  return (
                    <StyledLinkNavItem
                      key={itemIndex}
                      passHref
                      href={link}
                      className={`${router.pathname === link ? 'active' : ''}`}
                    >
                      <StyledListItemButton disableGutters>
                        <StyledListItemIcon>{item.icon}</StyledListItemIcon>
                        <ListItemText disableTypography primary={item.text} />
                        {item.suffix && (
                          <Tooltip title={item.suffix.tooltip}>
                            <IconButton
                              size="small"
                              // on click, stoppropagation to avoid triggering the parent link
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                if (item.suffix) {
                                  router.push(item.suffix.link);
                                }
                              }}
                            >
                              {item.suffix.icon}
                            </IconButton>
                          </Tooltip>
                        )}
                      </StyledListItemButton>
                    </StyledLinkNavItem>
                  );
                })}
              </Box>
            ))}
          </List>
        </Box>
        {user && (
          <IconButton
            sx={{
              color: theme.palette.text.secondary,
              padding: theme.spacing(2, 2.5),
              borderRadius: theme.shape.borderRadius * 1.5 + 'px',
              marginTop: 10,
              textAlign: 'center',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
            onClick={() => {
              router.push(Routes.Common.Home);
              logout();
            }}
          >
            <ExitToAppOutlined sx={{ marginRight: 1 }} fontSize="small" />
            <Typography variant="body2" sx={{ cursor: 'pointer' }}>
              Déconnexion
            </Typography>
          </IconButton>
        )}
      </Drawer>
      {!open && (
        <Box
          sx={{
            position: 'absolute',
            display: 'flex',
            top: 6,
            left: {
              xs: 6,
              sm: 14,
            },
          }}
        >
          <IconButton
            onClick={toggleLeftbar}
            sx={{
              display: open ? 'none' : 'block',
              height: 40,
            }}
          >
            <MenuIcon fontSize="medium" sx={{ color: 'grey.700' }} />
          </IconButton>
        </Box>
      )}
    </>
  );
};

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  lineHeight: 1.5,
  fontSize: pxToRem(14),
  height: 48,
  position: 'relative',
  textTransform: 'capitalize',
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
  paddingLeft: 10,
  paddingRight: 10,
  '.active > &': {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

const StyledLinkNavItem = styled(Link)({
  display: 'block',
  '&:not(:last-of-type)': {
    marginBottom: 5,
  },
});

export const StyledSubheader = styled(ListSubheader)(({ theme }) => ({
  ...theme.typography.overline,
  fontSize: 11,
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

export const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  width: 22,
  height: 22,
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 'auto',
  marginRight: theme.spacing(2),
}));

export default Leftbar;
