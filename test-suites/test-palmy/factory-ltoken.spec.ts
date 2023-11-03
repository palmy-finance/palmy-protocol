import { expect } from 'chai';
import { getEthersSigners } from '../../helpers/contracts-helpers';
import { createRandomAddress } from '../../helpers/misc-utils';
import {
  InitializableAdminUpgradeabilityProxyFactory,
  LTokenFactory,
  LTokenFactoryContract,
  LTokenFactoryContractFactory,
} from '../../types';
import { makeSuite, TestEnv } from './helpers/make-suite';

makeSuite('Factory: LToken', async (testEnv: TestEnv) => {
  it('create', async () => {
    const [signer, admin] = await getEthersSigners();
    const { dai } = testEnv;
    const randomAddress = createRandomAddress();
    const lTokenParams: Parameters<LTokenFactoryContract['callStatic']['create']>[2] = {
      pool: randomAddress,
      treasury: randomAddress,
      underlyingAsset: dai.address,
      incentivesController: randomAddress,
      lTokenDecimals: 18,
      lTokenName: 'lDAI',
      lTokenSymbol: 'lDAI',
      params: '0x10',
    };

    const lTokenImpl = await new LTokenFactory(signer).deploy();
    const lTokenFactory = await new LTokenFactoryContractFactory(signer).deploy();
    const args: Parameters<(typeof lTokenFactory)['create']> = [
      lTokenImpl.address,
      await admin.getAddress(),
      lTokenParams,
    ];
    const deployedAddr = await lTokenFactory.callStatic.create(...args);

    await expect(lTokenFactory.create(...args)).not.to.be.reverted;

    // work as lToken
    const lTokenCreated = await LTokenFactory.connect(deployedAddr, signer);
    expect(await lTokenCreated.POOL()).to.be.equal(args[2].pool);
    expect(await lTokenCreated.RESERVE_TREASURY_ADDRESS()).to.be.equal(args[2].treasury);
    expect(await lTokenCreated.UNDERLYING_ASSET_ADDRESS()).to.be.equal(args[2].underlyingAsset);
    expect(await lTokenCreated.getIncentivesController()).to.be.equal(args[2].incentivesController);
    expect(await lTokenCreated.decimals()).to.be.equal(args[2].lTokenDecimals);
    expect(await lTokenCreated.name()).to.be.equal(args[2].lTokenName);
    expect(await lTokenCreated.symbol()).to.be.equal(args[2].lTokenSymbol);
    // work as upgreadeable proxy
    const proxy = await InitializableAdminUpgradeabilityProxyFactory.connect(deployedAddr, signer);

    const newLTokenImpl = await new LTokenFactory(signer).deploy();
    await expect(proxy.upgradeTo(newLTokenImpl.address)).to.be.reverted;

    const proxyWithAdmin = proxy.connect(admin);
    expect(await proxyWithAdmin.callStatic.implementation()).to.be.equal(args[0]);
    expect(await proxyWithAdmin.callStatic.admin()).to.be.equal(args[1]);
    await expect(proxyWithAdmin.upgradeTo(newLTokenImpl.address)).not.to.be.reverted;
    expect(await proxyWithAdmin.callStatic.implementation()).to.be.equal(newLTokenImpl.address);
  });
});
