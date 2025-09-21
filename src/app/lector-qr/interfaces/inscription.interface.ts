import { Events } from 'src/app/events/interfaces/events';

export interface Inscriptions {
  id: string;
  dateInscription: string;
  statusInscription: string;
  token: string;
  tokenExpiresAt: string;
  event: Events;
}
