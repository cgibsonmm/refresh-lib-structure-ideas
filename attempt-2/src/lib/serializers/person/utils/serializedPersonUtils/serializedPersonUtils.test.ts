import { PersonMock } from '@/mocks/SerializedPerson';
import {
  getAge,
  getCountryOfOrigin,
  getLanguages,
  getName,
} from './serializedPersonUtils';

test('getAge works appropriately in each circumstance', () => {
  let age = getAge(PersonMock);
  expect(age).toBe('-');
  PersonMock.identity.ages = [{ years: 25, confidence: null }];
  age = getAge(PersonMock);
  expect(age).toBe('25');
  PersonMock.identity.ages = [];
  PersonMock.identity.dobs = [
    {
      date: {
        full: '1960-01-00',
        parsed: {
          month: 1,
          day: null,
          year: new Date().getFullYear() - 63,
        },
      },
      meta: null,
    },
  ];
  age = getAge(PersonMock);
  expect(age).toBe('63');
});

test('getName works appropriately in each circumstance', () => {
  let name = getName(PersonMock);
  expect(name).toBe('John Smith');
  PersonMock.identity.names[0].full = 'Oliver Twist';
  name = getName(PersonMock);
  expect(name).toBe('Oliver Twist');
  name = getName(PersonMock);
});

test('getLanguages works appropriately in each circumstance', () => {
  let languages = getLanguages(PersonMock);
  expect(languages).toBe('EN');
  PersonMock.rawData.demographic.languages.push({
    language: 'fr',
    region: null,
  });
  languages = getLanguages(PersonMock);
  expect(languages).toBe('EN, FR');
  PersonMock.rawData.demographic.languages = [];
  languages = getLanguages(PersonMock);
  expect(languages).toBe('-');
});

test('getCountryOfOrigin works appropriately in each circumstance', () => {
  const originCountries = getCountryOfOrigin(PersonMock);
  expect(originCountries).toBe('-');
});
