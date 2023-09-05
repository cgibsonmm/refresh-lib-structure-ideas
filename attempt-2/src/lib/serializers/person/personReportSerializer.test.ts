import { rawPerson } from '@/mocks/RawPersonReport';
import { SerializePerson } from './personReportSerializer';

test('it serializes raw person', () => {
  const serializedPerson = SerializePerson(rawPerson);
  expect(serializedPerson.rawData).toMatchObject(rawPerson);
  expect(serializedPerson.contact).toHaveProperty('addresses');
  expect(serializedPerson.contact).toHaveProperty('emails');
  expect(serializedPerson.contact).toHaveProperty('mainEmail');
  expect(serializedPerson.contact).toHaveProperty('mainPhone');
  expect(serializedPerson.contact).toHaveProperty('phones');
});
