import { prisma } from './db';
import { Prisma, Address } from '@prisma/client';

// Create a new address for a user
export const createAddress = async (userId: string, data: Omit<Prisma.AddressCreateInput, 'user'>): Promise<Address> => {
  // Ensure isDefault logic if necessary (e.g., only one default address per user)
  if (data.isDefault) {
    // Set other addresses for this user to not be default
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }
  return prisma.address.create({
    data: {
      ...data,
      userId, // Connect to the user
    },
  });
};

// Get all addresses for a user
export const getUserAddresses = async (userId: string): Promise<Address[]> => {
  return prisma.address.findMany({
    where: { userId },
    orderBy: { isDefault: 'desc' }, // Show default address first
  });
};

// Get a specific address by ID
export const getAddressById = async (id: string): Promise<Address | null> => {
  return prisma.address.findUnique({ where: { id } });
};

// Update an address
export const updateAddress = async (id: string, userId: string, data: Prisma.AddressUpdateInput): Promise<Address> => {
  // Ensure isDefault logic if setting to default
  if (data.isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true, NOT: { id } }, // Exclude the current address
      data: { isDefault: false },
    });
  }
  // Ensure the user owns the address before updating (handled by finding unique address id typically)
  return prisma.address.update({ where: { id }, data });
};

// Delete an address
export const deleteAddress = async (id: string): Promise<Address> => {
  // Add checks: ensure address is not currently used in an active order, etc.
  return prisma.address.delete({ where: { id } });
};

// Set an address as the default for a user
export const setDefaultAddress = async (userId: string, addressId: string): Promise<void> => {
  await prisma.$transaction([
    // Set all other addresses to non-default
    prisma.address.updateMany({
      where: { userId, NOT: { id: addressId } },
      data: { isDefault: false },
    }),
    // Set the specified address to default
    prisma.address.update({
      where: { id: addressId, userId }, // Ensure user owns the address
      data: { isDefault: true },
    }),
  ]);
}; 