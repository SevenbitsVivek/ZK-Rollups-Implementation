async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const UpdateBase64Transaction = await ethers.getContractFactory("UpdateBase64Transaction");
  const updateBase64Transaction = await UpdateBase64Transaction.deploy();

  console.log("UpdateBase64Transaction contract address:-", updateBase64Transaction.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });