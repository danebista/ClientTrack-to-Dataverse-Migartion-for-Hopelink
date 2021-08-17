import { batchLinkHouseholdMembers,deleteWrong } from './link-householdmembers';
async function main() {
   await batchLinkHouseholdMembers();
  //await deleteWrong();
}

main();
