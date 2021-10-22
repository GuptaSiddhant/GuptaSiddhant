import { green, bold } from "ansi-colors";
import sanity from "../sanity";
const { log } = console;

const educationQuery = `* | 
[_type == "education"] | { 
    degree, field, school, 
    isCurrent, startDate, endDate,     
    "city": location -> city,
    "country": location -> country,
} | order(isCurrent desc, endDate desc)`;

export default async function Education() {
  const educationList: Array<EducationType> = await sanity.fetch(
    educationQuery
  );

  educationList.map((education) => {
    log("");
    log(green("•"), `${education.degree} - ${education.field}`);
    log(" ", bold(education.school));
    log(" ", buildDateLine(education));
  });
}

function buildDateLine({ startDate, endDate, city, country }: EducationType) {
  const start = startDate.slice(0, 7);
  const end = endDate?.slice(0, 7) || "on-going";
  return `${start} - ${end} | ${city}, ${country}`;
}

interface EducationType {
  degree: string;
  field: string;
  school: string;
  startDate: string;
  endDate?: string;
  city: string;
  country: string;
}
