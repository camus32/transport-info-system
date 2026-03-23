export type TransportMode = 'railway' | 'truck';

export interface RailwayRecord {
  id: string;
  mode: 'railway';
  carNumber: string;
  trailerNumber: string;
  name: string;
  certificateNumber: string;
  phone: string;
  boxNumber: string;
  boxType: string;
  destination: string;
  productName: string;
}

export interface TruckRecord {
  id: string;
  mode: 'truck';
  carNumber: string;
  trailerNumber: string;
  name: string;
  certificateNumber: string;
  phone: string;
  carType: string;
  destination: string;
  productName: string;
  departureTime: string;
  estimatedArrivalTime: string;
}

export type Record = RailwayRecord | TruckRecord;
