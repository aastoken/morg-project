const {
  invoices,
  customers,
  revenue,
  users,
} = require('../app/lib/placeholder-data.ts');
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';


const prisma = new(PrismaClient)

//TODO add function to seed tag_type with some basic default types, with NONE as the first one, Key as the second one and Energy as the 3rd.

async function main() {
  const tableNames = ['User', 'Invoice', 'Customer', 'Revenue'];
  for (const tableName of tableNames) await prisma.$queryRawUnsafe(`Truncate "${tableName}" restart identity cascade;`);

  // await seedUsers();
  // await seedCustomers();
  // await seedInvoices();
  // await seedRevenue();

}

main()
.then(async () => {
  await prisma.$disconnect()
})
.catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})