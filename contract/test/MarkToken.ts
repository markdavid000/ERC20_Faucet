import { expect } from "chai";
import hre from "hardhat";

describe("MarkToken", function () {
  const MAX_SUPPLY = 10_000_000n * 10n ** 18n;
  const CLAIM_AMOUNT = 100n * 10n ** 18n;

  async function deployToken(initialSupply: bigint = 0n) {
    const [owner, user] = await hre.ethers.getSigners();
    const MarkToken = await hre.ethers.getContractFactory("MarkToken");
    const token = await MarkToken.deploy(initialSupply);
    await token.waitForDeployment();

    return { token, owner, user };
  }

  it("should deploy and mint initial supply to owner", async () => {
    const initialSupply = 1000n * 10n ** 18n;
    const { token, owner } = await deployToken(initialSupply);

    expect(await token.balanceOf(owner.address)).to.equal(initialSupply);
  });

  it("should revert if initial supply exceeds max supply", async () => {
    const MarkToken = await hre.ethers.getContractFactory("MarkToken");

    await expect(
      MarkToken.deploy(MAX_SUPPLY + 1n)
    ).to.be.revertedWithCustomError(MarkToken, "ExceedsMaxSupply");
  });

  it("should allow user to claim tokens", async () => {
    const { token, user } = await deployToken();

    await token.connect(user).requestToken();

    expect(await token.balanceOf(user.address)).to.equal(CLAIM_AMOUNT);
  });

  it("should revert if user claims before cooldown", async () => {
    const { token, user } = await deployToken();

    await token.connect(user).requestToken();

    await expect(
      token.connect(user).requestToken()
    ).to.be.revertedWithCustomError(token, "CooldownNotElapsed");
  });

  it("should allow claim after cooldown", async () => {
    const { token, user } = await deployToken();

    await token.connect(user).requestToken();

    await hre.ethers.provider.send("evm_increaseTime", [24 * 60 * 60]);
    await hre.ethers.provider.send("evm_mine", []);

    await token.connect(user).requestToken();

    expect(await token.balanceOf(user.address)).to.equal(CLAIM_AMOUNT * 2n);
  });

  it("should revert if claim exceeds max supply", async () => {
    const { token } = await deployToken(MAX_SUPPLY);

    await expect(token.requestToken()).to.be.revertedWithCustomError(
      token,
      "ExceedsMaxSupply"
    );
  });

  it("should allow owner to mint", async () => {
    const { token, user } = await deployToken();

    const amount = 500n * 10n ** 18n;

    await token.mint(user.address, amount);

    expect(await token.balanceOf(user.address)).to.equal(amount);
  });

  it("should revert if non-owner tries to mint", async () => {
    const { token, user } = await deployToken();

    await expect(
      token.connect(user).mint(user.address, 100n)
    ).to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
  });

  it("should revert when minting to zero address", async () => {
    const { token } = await deployToken();

    await expect(
      token.mint(hre.ethers.ZeroAddress, 100n)
    ).to.be.revertedWithCustomError(token, "InvalidRecipient");
  });

  it("should revert if mint exceeds max supply", async () => {
    const { token } = await deployToken(MAX_SUPPLY - 50n);

    await expect(
      token.mint("0x0000000000000000000000000000000000000001", 100n)
    ).to.be.revertedWithCustomError(token, "ExceedsMaxSupply");
  });
});
