export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export class AddressService {
  private addresses: Address[] = [
    {
      id: 'addr-demo-1',
      userId: 'usr-default-customer',
      fullName: 'Priya Sharma',
      phone: '9876543210',
      street: 'Flat 402, Lotus Heights, 100ft Road',
      landmark: 'Near Toit Brewery',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  getUserAddresses(userId: string): Address[] {
    return this.addresses.filter(a => a.userId === userId);
  }

  getAddressById(userId: string, addressId: string): Address | undefined {
    return this.addresses.find(a => a.id === addressId && a.userId === userId);
  }

  createAddress(userId: string, data: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Address {
    const userAddrs = this.getUserAddresses(userId);
    const shouldBeDefault = data.isDefault || userAddrs.length === 0;

    if (shouldBeDefault) {
      userAddrs.forEach(a => {
        a.isDefault = false;
      });
    }

    const newAddress: Address = {
      id: `addr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      fullName: data.fullName,
      phone: data.phone,
      street: data.street,
      landmark: data.landmark || '',
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      isDefault: shouldBeDefault,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.addresses.push(newAddress);
    return newAddress;
  }

  updateAddress(userId: string, addressId: string, data: Partial<Omit<Address, 'id' | 'userId' | 'createdAt'>>): Address | null {
    const addr = this.addresses.find(a => a.id === addressId && a.userId === userId);
    if (!addr) return null;

    if (data.isDefault) {
      this.getUserAddresses(userId).forEach(a => {
        a.isDefault = false;
      });
    }

    Object.assign(addr, data, { updatedAt: new Date().toISOString() });
    return addr;
  }

  deleteAddress(userId: string, addressId: string): boolean {
    const index = this.addresses.findIndex(a => a.id === addressId && a.userId === userId);
    if (index === -1) return false;

    const wasDefault = this.addresses[index].isDefault;
    this.addresses.splice(index, 1);

    // If deleted address was default, set another address as default
    if (wasDefault) {
      const remaining = this.getUserAddresses(userId);
      if (remaining.length > 0) {
        remaining[0].isDefault = true;
      }
    }

    return true;
  }

  setDefaultAddress(userId: string, addressId: string): Address | null {
    const userAddrs = this.getUserAddresses(userId);
    const target = userAddrs.find(a => a.id === addressId);
    if (!target) return null;

    userAddrs.forEach(a => {
      a.isDefault = a.id === addressId;
    });

    return target;
  }
}

export const addressService = new AddressService();
