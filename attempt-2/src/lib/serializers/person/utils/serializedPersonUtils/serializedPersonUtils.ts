import { serializedTypes } from '@/reports/types';
import { DateUtil } from '@/utils/index';

export const getAge = (person: serializedTypes.SerializedPerson) => {
  if (!person) return '-';
  if (person.identity.ages[0]) return person.identity.ages[0].years?.toString();
  if (person.identity.dobs[0]) {
    const dateUtil = new DateUtil();
    const month = person.identity.dobs[0].date?.parsed?.month;
    const year = person.identity.dobs[0].date?.parsed?.year;
    return (
      dateUtil.yearsSinceDate(`${year}-${month}`, 'yyyy-L')?.toString() || '-'
    );
  }
  return '-';
};

export const getName = (person: serializedTypes.SerializedPerson) => {
  return person?.identity?.names?.[0]?.full ?? '';
};

export const getLanguages = (person: serializedTypes.SerializedPerson) => {
  return (
    (person?.rawData?.demographic?.languages?.length > 0
      ? person.rawData.demographic.languages
          .map(({ language }) => language?.toUpperCase())
          .join(', ')
      : '-') ?? '-'
  );
};

export const getCountryOfOrigin = (
  person: serializedTypes.SerializedPerson
) => {
  return (
    (person?.rawData?.demographic?.origin_countries?.length > 0
      ? person.rawData.demographic.origin_countries.join(', ')
      : '-') ?? '-'
  );
};
