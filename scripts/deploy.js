const hre = require('hardhat');

async function main() {
    const SessionFactory = await hre.ethers.getContractFactory("SessionFactory");
    const sessionFactory = await SessionFactory.deploy();

    await sessionFactory.deployed();

    console.log("Factory deployed to:", sessionFactory.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
