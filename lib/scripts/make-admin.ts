#!/usr/bin/env ts-node

import { prisma } from '../db';

async function main() {
  const email = process.argv[2];
  
  if (!email) {
    console.error('Please provide an email address');
    console.error('Usage: npx ts-node make-admin.ts user@example.com');
    process.exit(1);
  }
  
  try {
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, role: true }
    });
    
    if (!user) {
      console.error(`No user found with email: ${email}`);
      process.exit(1);
    }
    
    if (user.role === 'ADMIN') {
      console.log(`User ${email} is already an admin`);
      process.exit(0);
    }
    
    // Update the user to admin
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: 'ADMIN' }
    });
    
    console.log(`Successfully promoted ${updatedUser.email} to ADMIN role`);
  } catch (error) {
    console.error('Failed to promote user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 