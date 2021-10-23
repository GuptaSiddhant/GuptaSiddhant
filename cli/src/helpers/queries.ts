export const careerQuery = `* 
| [_type == "career"] 
| { slug, position, type, company, isCurrent, startDate, endDate, 
    "city": location -> city, "country": location -> country, "tags": tags[] -> value, } 
| order(isCurrent desc, endDate desc)`;

export const educationQuery = `* 
| [_type == "education"] 
| { slug, degree, field, school, isCurrent, startDate, endDate, 
    "city": location -> city, "country": location -> country, "tags": tags[] -> value, } 
| order(isCurrent desc, endDate desc)`;

export const projectsQuery = `* 
| [_type == "project"] 
| { slug, title, isCurrent, startDate, endDate, "association": association -> company, "tags": tags[] -> value, } 
| order(isCurrent desc, endDate desc)`;
