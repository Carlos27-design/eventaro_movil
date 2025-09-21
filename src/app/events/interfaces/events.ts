import { Inscription } from 'src/app/lector-qr/services/inscription';
import { Organization } from 'src/app/organization/interfaces/organization';
import { TypeEvent } from 'src/app/typeEvent/interfaces/type-event';
import { Ubication } from 'src/app/ubication/interfaces/ubication';

export interface Events {
  id: string;
  name: string;
  description: string;
  initialDate: Date;
  finalDate: Date;
  statusEvent: string;
  images: string | string[];
  ubication: Ubication;
  typeEvent: TypeEvent;
  organization: Organization;
  inscription: Inscription[];
}
