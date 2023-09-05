import {
  commonTypes,
  peopleTypes,
  realestateTypes,
  serializedTypes,
} from '@/reports/types/index';
import { generateJsonPath } from '@/utils/jsonPath';

export const mapPeople = (personRootJsonPath: string) => {
  return (person: serializedTypes.SerializedPerson, index: number) => {
    const rootPersonJsonPath = `$.${personRootJsonPath}[${index}]`;
    person.jsonPath = rootPersonJsonPath;
    person.contact.addresses = mapAddresses(
      person.contact.addresses,
      rootPersonJsonPath
    );
    person.contact.phones = mapPhones(
      person.contact.phones,
      rootPersonJsonPath
    );
    person.contact.emails = mapEmails(
      person.contact.emails,
      rootPersonJsonPath
    );
    person.jobs = mapJobs(person.jobs, rootPersonJsonPath);
    person.educations = mapSchools(person.educations, rootPersonJsonPath);
    person.profiles = mapProfiles(person.profiles, rootPersonJsonPath);
    person.vehicles.automobiles = mapAutomobiles(
      person.vehicles.automobiles,
      rootPersonJsonPath
    );
    person.vehicles.watercraft = mapWatercraft(
      person.vehicles.watercraft,
      rootPersonJsonPath
    );
    person.vehicles.aircraft = mapAircraft(
      person.vehicles.aircraft,
      rootPersonJsonPath
    );
    person.real_estate = mapRealEstate(person.real_estate, rootPersonJsonPath);
    person.images = mapImages(person.images, rootPersonJsonPath);

    person.courts.criminal = mapCriminal(
      person.courts.criminal,
      rootPersonJsonPath
    );
    return person;
  };
};

const mapCriminal = (
  criminalRecords: peopleTypes.Criminals,
  rootPersonJsonPath: string
) => {
  const mappedCriminalRecords = criminalRecords.map((record, index) => {
    record.jsonPath = generateJsonPath(
      index,
      `${rootPersonJsonPath}.courts`,
      'criminal'
    );

    record.upvoted = record.upvoted || false;
    record.downvoted = record.downvoted || false;
    return record;
  });

  return mappedCriminalRecords;
};

const mapAddresses = (
  addresses: commonTypes.Addresses = [],
  rootPersonJsonPath: string
) => {
  const mappedAddresses = addresses.map((address, index) => {
    address.jsonPath = generateJsonPath(
      index,
      `${rootPersonJsonPath}.contact`,
      'addresses'
    );

    return address;
  });

  return mappedAddresses;
};

const mapPhones = (phones: commonTypes.Phones, rootPersonJsonPath: string) => {
  const mappedPhones = phones.map((phone, index) => {
    phone.jsonPath = generateJsonPath(
      index,
      `${rootPersonJsonPath}.contact`,
      'phones'
    );

    return phone;
  });

  return mappedPhones;
};

const mapEmails = (emails: commonTypes.Emails, rootPersonJsonPath: string) => {
  const mappedEmails = emails.map((email, index) => {
    email.jsonPath = generateJsonPath(
      index,
      `${rootPersonJsonPath}.contact`,
      'emails'
    );

    return email;
  });

  return mappedEmails;
};

const mapJobs = (jobs: peopleTypes.Jobs, rootPersonJsonPath: string) => {
  const mappedJobs = jobs.map((job, index) => {
    job.jsonPath = generateJsonPath(index, `${rootPersonJsonPath}`, 'jobs');

    return job;
  });

  return mappedJobs;
};

const mapSchools = (
  educations: peopleTypes.Educations,
  rootPersonJsonPath: string
) => {
  const mappedSchools = educations.map((education, index) => {
    education.jsonPath = generateJsonPath(
      index,
      `${rootPersonJsonPath}`,
      'educations'
    );

    return education;
  });

  return mappedSchools;
};

const mapProfiles = (
  profiles: peopleTypes.Profiles,
  rootPersonJsonPath: string
) => {
  const mappedProfiles = profiles.map((profile, index) => {
    profile.jsonPath = generateJsonPath(
      index,
      `${rootPersonJsonPath}.social`,
      'profiles'
    );

    return profile;
  });

  return mappedProfiles;
};

const mapAutomobiles = (
  automobiles: peopleTypes.Automobiles,
  rootPersonJsonPath: string
) => {
  const mappedAutomobiles = automobiles.map((automobile, index) => {
    automobile.jsonPath = generateJsonPath(
      index,
      `${rootPersonJsonPath}.vehicles`,
      'automobiles'
    );

    return automobile;
  });

  return mappedAutomobiles;
};

const mapWatercraft = (
  watercraft: peopleTypes.Watercrafts,
  rootPersonJsonPath: string
) => {
  const mappedWatercraft = watercraft.map((craft, index) => {
    craft.jsonPath = generateJsonPath(
      index,
      `${rootPersonJsonPath}.vehicles`,
      'watercraft'
    );

    return craft;
  });

  return mappedWatercraft;
};

const mapAircraft = (
  aircraft: peopleTypes.Aircrafts,
  rootPersonJsonPath: string
) => {
  const mappedAircraft = aircraft.map((craft, index) => {
    craft.jsonPath = generateJsonPath(
      index,
      `${rootPersonJsonPath}.vehicles`,
      'aircraft'
    );

    return craft;
  });

  return mappedAircraft;
};

const mapRealEstate = (
  properties: realestateTypes.Properties,
  rootPersonJsonPath: string
) => {
  const mappedRealEstate = properties.map((property, index) => {
    property.jsonPath = generateJsonPath(
      index,
      `${rootPersonJsonPath}`,
      'properties'
    );

    return property;
  });

  return mappedRealEstate;
};

const mapImages = (
  images: peopleTypes.ImageMetas,
  rootPersonJsonPath: string
) => {
  const mappedImages = images.map((image, index) => {
    image.jsonPath = generateJsonPath(index, `${rootPersonJsonPath}`, 'images');

    return image;
  });

  return mappedImages;
};
