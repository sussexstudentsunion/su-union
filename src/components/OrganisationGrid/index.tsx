import React from 'react';
import OrganisationCard from '../OrganisationCard';
import {FalmerImage} from "~components/EventsCalender/types";

export interface StudentGroup {
  link: string;
  name: string;
  description: string;
  image: {
    src: string;
  };
  logo: FalmerImage;
  isProspective: boolean;
  id: number;
}

interface IProps {
  organisations: Array<StudentGroup>
}

export default function OrganisationGrid(props: IProps) {
  const { organisations } = props;
  return (
    <ul className="OrgansiationGrid">
      {organisations.map(org => <OrganisationCard org={org} key={org.id} />)}
    </ul>
  );
}
