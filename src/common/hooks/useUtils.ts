import { STATUS } from '@modules/events/defs/types';
import { City, Country, State } from 'country-state-city';
import dayjs, { Dayjs } from 'dayjs';

interface Utils {
  formatDate: (date: Date | string | Dayjs) => string;
  formatHours: (time: string) => string;
  isEndTimeLaterThanStartTime: (startTime: string, endTime: string) => boolean;
  transformToCustomFormat: (timeString: string) => string;
  getAllCountryNames: () => string[];
  getAllCitiesNames: () => string[];
  getAllStatesNamesOfCountry: (countryName: string) => string[];
  getAllCitiesNamesOfCountry: (countryName: string) => string[];
  isEventDateGreaterThanToday: (eventDate: Date | string) => boolean;
  formatDateTime: (dateString: string, timeString: string) => string;
  formatReadableDuration: (duration: string) => string;
  filterByStatus: (dateString: string, status: string) => boolean;
}

const useUtils = (): Utils => {
  const formatDate = (date: Date | string | Dayjs): string => {
    // format date for api request
    if (date instanceof Date) {
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
        .getDate()
        .toString()
        .padStart(2, '0')}`;
    }
    if (date instanceof Dayjs) {
      const newDate = date.toDate();
      return `${newDate.getFullYear()}-${(newDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${newDate.getDate().toString().padStart(2, '0')}`;
    }
    return date;
  };
  const formatHours = (time: string): string => {
    const dateTime = dayjs(time).add(1, 'hour').toISOString().split('T')[1].split('.')[0];
    return dateTime;
  };
  const isEndTimeLaterThanStartTime = (startTime: string, endTime: string): boolean => {
    // validate time as endTime latter than startTime (true if valid false if invalid)
    const onlyHoursAndMinutesStart = formatHours(startTime);
    const onlyHoursAndMinutesEnd = formatHours(endTime);
    const startTimeMinutes =
      parseInt(onlyHoursAndMinutesStart.split(':')[0]) * 60 +
      parseInt(onlyHoursAndMinutesStart.split(':')[1]);
    const endTimeMinutes =
      parseInt(onlyHoursAndMinutesEnd.split(':')[0]) * 60 +
      parseInt(onlyHoursAndMinutesEnd.split(':')[1]);

    return endTimeMinutes > startTimeMinutes;
  };
  const transformToCustomFormat = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':');

    const customFormat = dayjs()
      .set('hour', parseInt(hours))
      .set('minute', parseInt(minutes))
      .set('second', 2)
      .format('ddd, DD MMM YYYY HH:mm:ss [GMT]');

    return customFormat;
  };

  const getAllCountryNames = (): string[] => {
    return Country.getAllCountries().map((country) => country.name);
  };
  const getAllCitiesNames = (): string[] => {
    const cities = City.getAllCities().map((city) => city.name);
    // Filter out duplicates
    const uniqueCities = cities.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });

    return uniqueCities;
  };
  const getAllStatesNamesOfCountry = (countryName: string): string[] => {
    const countries = Country.getAllCountries();
    if (countries) {
      const countryCode = countries.find((country) => country.name === countryName)?.isoCode;
      if (countryCode) {
        const states = State.getStatesOfCountry(countryCode)?.map((country) => country.name);
        if (states) {
          return states;
        }
      }
    }
    return [];
  };
  const getAllCitiesNamesOfCountry = (countryName: string): string[] => {
    const countries = Country.getAllCountries();

    if (countries) {
      const countryCode = countries.find((country) => country.name === countryName)?.isoCode;
      if (countryCode) {
        const cities = City.getCitiesOfCountry(countryCode)?.map((city) => city.name);
        if (cities) {
          return cities;
        }
      }
    }
    return [];
  };
  const isEventDateGreaterThanToday = (eventDate: Date | string): boolean => {
    const today = dayjs().startOf('day');
    const eventDateTime = dayjs(eventDate);

    return eventDateTime.isAfter(today.add(1, 'day'));
  };

  const formatDateTime = (dateString: string, timeString: string) => {
    const dateObj = new Date(dateString.split('T')[0] + 'T' + timeString); // Concatenate date and time
    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
    }).format(dateObj);

    const formattedTime = new Intl.DateTimeFormat('fr-FR', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false, // Use 24-hour format
    }).format(dateObj);

    return `${formattedDate} à ${formattedTime}`;
  };

  const formatReadableDuration = (duration: string) => {
    // Extract hours, minutes, and seconds
    const [hours, minutes, _seconds] = duration.split(':').map(Number);

    // Create a readable format
    let readableDuration = '';
    if (hours > 0) {
      readableDuration += `${hours} ${hours > 1 ? 'heures' : 'heure'} `;
    }
    if (minutes > 0) {
      readableDuration += `${minutes} ${minutes > 1 ? 'minutes' : 'minute'} `;
    }

    return readableDuration.trim();
  };
  const filterByStatus = (dateString: string, status: string): boolean => {
    const currentDate = new Date();
    const date = new Date(dateString);
    if (status === STATUS.TODAY) {
      // Check if the date is today
      return date.toDateString() === currentDate.toDateString();
    }
    if (status === STATUS.UPCOMING) {
      // Check if the date is in the future
      return date.getTime() > currentDate.getTime();
    }
    if (status === STATUS.PAST) {
      return date.getTime() < currentDate.getTime();
    }
    // Return false for invalid condition
    return false;
  };

  return {
    formatDate,
    formatHours,
    isEndTimeLaterThanStartTime,
    transformToCustomFormat,
    getAllCountryNames,
    getAllCitiesNamesOfCountry,
    getAllStatesNamesOfCountry,
    isEventDateGreaterThanToday,
    formatDateTime,
    formatReadableDuration,
    getAllCitiesNames,
    filterByStatus,
  };
};

export default useUtils;
