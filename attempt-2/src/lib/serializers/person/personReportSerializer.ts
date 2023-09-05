import {
  commonTypes,
  peopleTypes,
  reportTypes,
  serializedTypes,
} from "@/reports/types";
import { serializeProfiles, serializeJobs } from "@/utils/data";
import { DateUtil, formatPhone, nameize } from "@/utils/index";
import isBlacklisted from "@/utils/isBlacklisted";
import { phoneType } from "@/utils/phone";
import { mapPeople } from "./utils/mapPersonProperties/mapPersonProperties";

function serializeConnection(connection: peopleTypes.RelativeConnection) {
  const dateParser = new DateUtil();
  if (connection.identity.names.length) {
    const connectionNames = connection?.identity?.names || [];
    const connectionAddresses = connection?.contact?.addresses || [];
    const name = nameize(connectionNames[0].full);
    const livesIn = [
      connectionAddresses[0]?.parsed?.city,
      connectionAddresses[0]?.parsed?.state,
    ]
      .filter(Boolean)
      .join(", ");
    const names = connectionNames.map((name) => nameize(name.full));

    const phones = connection?.contact?.phones.map((phone) => {
      return {
        phone: phone.number,
        firstDateSeen: phone.meta?.first_seen_date?.full,
        lastDateSeen: phone.meta?.last_seen_date?.full,
      };
    });

    const relatives =
      connection?.connections?.relatives?.map((relative) =>
        serializeConnection(relative)
      ) || [];

    let deadInfo = "";
    if (connection.identity?.dods.length) {
      const dead = connection.identity.dods[0];
      const deadDate = dateParser.parseDateFromString(
        dead.date?.full || "",
        "MMM yyyy",
        "yyyy-MM-dd"
      );
      const deadAge = dead.extra?.age_at_death;
      deadInfo = `Deceased ${
        deadAge ? `at age ~${deadAge}` : ""
      } on ${deadDate}`;
    }

    const serializedRelative: serializedTypes.Connection = {
      ...connection,
      name: name || "",
      age: connection?.identity?.ages[0]?.years || 0,
      livesIn: livesIn || "",
      relatives: relatives.filter(Boolean),
      addresses: SerializeAddresses(connectionAddresses, false),
      phones: phones || [],
      names: names || [],
      bvId: connection?.identity.ids[0] || "",
      deadInfo: deadInfo,
    };
    return serializedRelative;
  }

  return null;
}

function addressHasPropertyReport(address: commonTypes.Address) {
  const isNotPoBoxAddress = !address?.parsed?.street_name
    ?.toLowerCase()
    .includes("po box");
  const parentPropertyId = Boolean(
    address.property_related_info
      ? address.property_related_info.parent_property_id
      : null
  );

  return (
    isNotPoBoxAddress && (address.property_record_available || parentPropertyId)
  );
}

export function SerializePerson(
  rawPerson: peopleTypes.FullPerson,
  ignoreAddressValidation = false
) {
  const phones = rawPerson?.contact?.phones?.map((phone: commonTypes.Phone) => {
    return {
      ...phone,
      phoneType: phoneType(phone.type || ""),
      formattedPhone: formatPhone(phone.number || ""),
    };
  });

  const relatives = rawPerson.connections?.relatives?.map((relative) => {
    return serializeConnection(relative);
  });
  const neighbors = rawPerson.connections?.neighbors?.map((neighbor) => {
    return serializeConnection(neighbor);
  });
  const associates = rawPerson.connections?.associates?.map((associate) => {
    return serializeConnection(associate);
  });

  const addresses = SerializeAddresses(
    rawPerson.contact?.addresses,
    ignoreAddressValidation
  );

  const jobs = serializeJobs(rawPerson.jobs);
  const educations = rawPerson.educations.filter(
    (education: peopleTypes.Educations[number]) => education.institution
  );

  return {
    rawData: rawPerson,
    contact: {
      addresses: addresses || [],
      emails: rawPerson.contact?.emails || [],
      mainEmail: rawPerson.contact?.emails[0] || "",
      mainPhone: phones?.length ? phones[0] : null,
      phones: phones || [],
    },
    identity: {
      ...rawPerson.identity,
      name: rawPerson?.identity?.names[0].full,
    },
    jobs,
    rawJobs: rawPerson.jobs,
    educations: educations,
    usernames: rawPerson.social.usernames,
    profiles: serializeProfiles(rawPerson.social.profiles),
    userIds: rawPerson.social.user_ids,
    vehicles: rawPerson.vehicles,
    real_estate: rawPerson.real_estate,
    images: rawPerson.images,
    connections: {
      relatives,
      neighbors,
      associates,
    },
    marital: rawPerson.marital,
    courts: rawPerson.courts,
  } as serializedTypes.SerializedPerson;
}

export function SerializePersonReport(rawPersonReport: reportTypes.Report) {
  let is_Blacklisted = false;
  const entities = rawPersonReport.entities;
  const people = entities?.people?.filter(
    (person: peopleTypes.FullPerson) => person.identity
  );
  const serializedPeople = people?.map((person: peopleTypes.FullPerson) =>
    SerializePerson(person)
  );

  const mappedPeople = serializedPeople
    ? serializedPeople.map(mapPeople("entities.people"))
    : serializedPeople;

  if (
    rawPersonReport.meta?.report_info &&
    rawPersonReport.meta.report_info.proxy_flags
  ) {
    is_Blacklisted = isBlacklisted(
      rawPersonReport.meta.report_info.proxy_flags
    );
  }

  const serializedPersonReport = {
    rawData: rawPersonReport,
    people: mappedPeople,
    meta: rawPersonReport.meta,
    alert_me: rawPersonReport.meta?.alert_me || false,
    created_at: rawPersonReport.meta?.created_at || "",
    report_upgraded: rawPersonReport.meta?.report_upgraded || false,
    id: rawPersonReport.meta?.permalink || "",
    isBlacklisted: is_Blacklisted,
  } as serializedTypes.SerializedPersonReport;

  return serializedPersonReport;
}

function SerializeAddresses(
  addresses: commonTypes.Address[] | undefined,
  ignoreAddressValidation: boolean
) {
  if (!addresses) return [];
  return addresses.map((address) => {
    const is_searchable: boolean =
      ignoreAddressValidation || addressHasPropertyReport(address);
    return {
      ...address,
      is_searchable,
    };
  });
}
