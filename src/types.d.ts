interface Chemical {
  name: string;
  vendor: string;
  density: number;
  viscosity: number;
  packaging: string;
  pack_size: string;
  unit: string;
  quantity: number;
}

interface Observer {
  update(eventType: string, data?: any): void;
}
