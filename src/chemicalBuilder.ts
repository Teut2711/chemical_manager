class ChemicalBuilder {
  private chemical: {
    index: number;
    name: string;
    vendor: string;
    density: number;
    viscosity: number;
    packaging: string;
    packSize: number;
    unit: string;
    quantity: number;
  };

  constructor() {
    // Initialize with default values
    this.chemical = {
      index: -1,
      name: "Unnamed Chemical",
      vendor: "",
      density: 0,
      viscosity: 0,
      packaging: "N/A",
      packSize: 0,
      unit: "units",
      quantity: 0,
    };
  }

  public setIndex(index: number): this {
    this.chemical.index = index;
    return this;
  }
  public setName(name: string): this {
    this.chemical.name = name;
    return this;
  }

  public setVendor(vendor: string): this {
    this.chemical.vendor = vendor;
    return this;
  }

  public setDensity(density: number): this {
    this.chemical.density = density;
    return this;
  }

  public setViscosity(viscosity: number): this {
    this.chemical.viscosity = viscosity;
    return this;
  }

  public setPackaging(packaging: string): this {
    this.chemical.packaging = packaging;
    return this;
  }

  public setPackSize(packSize: number): this {
    this.chemical.packSize = packSize;
    return this;
  }

  public setUnit(unit: string): this {
    this.chemical.unit = unit;
    return this;
  }

  public setQuantity(quantity: number): this {
    this.chemical.quantity = quantity;
    return this;
  }

  public build(): Chemical {
    return this.chemical;
  }
}
export default ChemicalBuilder;
