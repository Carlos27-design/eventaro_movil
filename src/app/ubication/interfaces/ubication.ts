import { Events } from 'src/app/events/interfaces/events';

export interface Ubication {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  event: Events;
}
