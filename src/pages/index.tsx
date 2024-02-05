import PageHeader from '@common/components/lib/partials/PageHeader';
import Routes from '@common/defs/routes';
import withAuth, { AUTH_MODE } from '@modules/auth/hocs/withAuth';
import { NextPage } from 'next';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Namespaces from '@common/defs/namespaces';
import { CRUD_ACTION } from '@common/defs/types';
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useMemo, useState } from 'react';
import useCategories from '@modules/categories/hooks/api/useCategories';
import { Event, STATUS } from '@modules/events/defs/types';
import useUtils from '@common/hooks/useUtils';
import DashEvents from '@modules/events/components/partials/DashEvents';
import useEvents from '@modules/events/hooks/api/useEvents';

interface FilterCriteria {
  categories: string[];
  status: string;
  countries: string[];
  sortOption: string;
}

const Index: NextPage = () => {
  const { items: categories } = useCategories({ fetchItems: true });
  const { items: events, mutate } = useEvents({ fetchItems: true });
  const [open, setOpen] = useState<boolean>(false);
  const { getAllCountryNames, filterByStatus } = useUtils();
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
    categories: [],
    sortOption: 'asc',
    status: STATUS.UPCOMING,
    countries: [],
  });
  const handleFilterChange = (field: string, value: string | string[]) => {
    setFilterCriteria((prevCriteria) => ({
      ...prevCriteria,
      [field]: value,
    }));
  };
  const reFetchEvents = () => {
    mutate();
  };
  const applyFiltersSorts = () => {
    setOpen(false);
  };
  const filteredEvents: Event[] = useMemo(() => {
    if (events && events.length !== 0) {
      const filtered = events.filter((event) => {
        return (
          (filterCriteria.categories.length === 0 ||
            filterCriteria.categories.includes(event.categoryName)) &&
          (!filterCriteria.status || filterByStatus(event.date, filterCriteria.status)) &&
          (filterCriteria.countries.length === 0 ||
            filterCriteria.countries.includes(event.location.country))
        );
      });
      filtered.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        if (filterCriteria.sortOption === 'asc') {
          return dateA - dateB;
        }
        if (filterCriteria.sortOption === 'desc') {
          return dateB - dateA;
        }

        // Default to ascending order if sortOption is not recognized
        return dateA - dateB;
      });

      return filtered;
    }
    return [];
  }, [events, filterCriteria]);

  return (
    <>
      <PageHeader
        title="Dashboard"
        action={{
          label: 'Filtrage et Triage',
          startIcon: <FilterAltIcon />,
          onClick: () => setOpen(true),
          permission: {
            entity: Namespaces.Events,
            action: CRUD_ACTION.READ,
          },
        }}
      />
      {filteredEvents && <DashEvents events={filteredEvents} mutate={reFetchEvents} />}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Filtrage et Triage</DialogTitle>
        <DialogContent>
          <Divider sx={{ mt: 2 }} />
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item md={6} sm={12} xs={12}>
              <Autocomplete
                options={categories ? categories.map((category) => category.name) : []}
                multiple
                value={filterCriteria.categories}
                onChange={(e, value) => {
                  handleFilterChange('categories', value);
                }}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" label="Catégories" />
                )}
              />
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="select-label-status">Status</InputLabel>
                <Select
                  labelId="select-label-status"
                  fullWidth
                  variant="outlined"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  value={filterCriteria.status}
                  label="Status"
                  placeholder="Status"
                >
                  <MenuItem value={STATUS.TODAY}>{STATUS.TODAY}</MenuItem>
                  <MenuItem value={STATUS.UPCOMING}>{STATUS.UPCOMING}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <Autocomplete
                options={getAllCountryNames()}
                multiple
                value={filterCriteria.countries}
                onChange={(e, value) => {
                  handleFilterChange('countries', value);
                }}
                renderInput={(params) => (
                  <TextField {...params} maxRows={4} variant="outlined" label="Pays" />
                )}
              />
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="select-label">Triage</InputLabel>
                <Select
                  labelId="select-label"
                  fullWidth
                  variant="outlined"
                  onChange={(e) => handleFilterChange('sortOption', e.target.value)}
                  value={filterCriteria.sortOption}
                  label="Triage"
                  placeholder="ASC/DESC"
                >
                  <MenuItem value="asc">ASC</MenuItem>
                  <MenuItem value="desc">DESC</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setFilterCriteria({
                categories: [],
                sortOption: 'asc',
                status: STATUS.UPCOMING,
                countries: [],
              });
            }}
          >
            Annuler
          </Button>
          <Button onClick={applyFiltersSorts}>Appliquer</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default withAuth(Index, {
  mode: AUTH_MODE.LOGGED_IN,
  redirectUrl: Routes.Auth.Login,
});
