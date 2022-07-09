export const careerQuery = `* 
| [_type == "career"] 
| { slug, position, type, company, isCurrent, startDate, endDate, link,
    "city": location -> city, "country": location -> country, "tags": tags[] -> value, } 
| order(isCurrent desc, endDate desc)`;

export const educationQuery = `* 
| [_type == "education"] 
| { slug, degree, field, school, isCurrent, startDate, endDate, link,
    "city": location -> city, "country": location -> country, "tags": tags[] -> value, } 
| order(isCurrent desc, endDate desc)`;

export const projectsQuery = `* 
| [_type == "project"] 
| { slug, title, isCurrent, startDate, endDate, link, "association": association -> company, "tags": tags[] -> value, } 
| order(isCurrent desc, endDate desc)`;

export const blogQuery = `* 
| [_type == "blog"] 
| { slug, title, date, content, "tags": tags[] -> value, } 
| order(date desc)`;
