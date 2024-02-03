import { City, Country, State } from 'country-state-city';
import dayjs, { Dayjs } from 'dayjs';

interface Utils {
  formatDate: (date: Date | string | Dayjs) => string;
  formatHours: (time: string) => string;
  isEndTimeLaterThanStartTime: (startTime: string, endTime: string) => boolean;
  transformToCustomFormat: (timeString: string) => string;
  getAllCountryNames: () => string[];
  getAllStatesNamesOfCountry: (countryName: string) => string[];
  getAllCitiesNamesOfCountry: (countryName: string) => string[];
  isEventDateGreaterThanToday: (eventDate: Date | string) => boolean;
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
    return time.split(' ')[4].split(':').slice(0, 2).join(':');
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
  const getAllStatesNamesOfCountry = (countryName: string): string[] => {
    const countryCode = Country.getAllCountries().filter(
      (country) => country.name === countryName
    )[0].isoCode;
    const states = State.getStatesOfCountry(countryCode)?.map((country) => country.name);
    if (states) {
      return states;
    }
    return [];
  };
  const getAllCitiesNamesOfCountry = (countryName: string): string[] => {
    const countryCode = Country.getAllCountries().filter(
      (country) => country.name === countryName
    )[0].isoCode;
    const cities = City.getCitiesOfCountry(countryCode)?.map((city) => city.name);
    if (cities) {
      return cities;
    }
    return [];
  };
  const isEventDateGreaterThanToday = (eventDate: Date | string): boolean => {
    const today = dayjs().startOf('day');
    const eventDateTime = dayjs(eventDate);

    return eventDateTime.isAfter(today.add(1, 'day'));
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
  };
};

export default useUtils;
