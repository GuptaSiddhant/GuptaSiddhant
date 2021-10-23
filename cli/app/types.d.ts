export interface PageProps<T> {
  query: string;
  limit?: number;
  itemBuilder: (item: T) => JSX.Element;
}

export type PartialPageProps<T> = Partial<PageProps<T>>;

export interface CareerType extends Common, DateTime, Location {
  position: string;
  company: string;
  type: string;
}

export interface EducationType extends Common, DateTime, Location {
  degree: string;
  field: string;
  school: string;
}

export interface ProjectType extends Common, DateTime {
  title: string;
  association: string;
}

export interface Common {
  slug: { current: string };
  tags: string[];
}

export interface DateTime {
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

export interface Location {
  city: string;
  country: string;
}
