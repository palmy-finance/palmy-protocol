import { expect } from 'chai';
import { getEthersSigners } from '../../helpers/contracts-helpers';
import { createRandomAddress } from '../../helpers/misc-utils';
import {
  InitializableAdminUpgradeabilityProxyFactory,
  StableDebtTokenFactory,
  StableDebtTokenFactoryContract,
  StableDebtTokenFactoryContractFactory,
} from '../../types';
import { makeSuite, TestEnv } from './helpers/make-suite';

makeSuite('Factory: StableDebtToken', async (testEnv: TestEnv) => {
  it('create', async () => {
    const [signer, admin] = await getEthersSigners();
    const { dai } = testEnv;
    const randomAddress = createRandomAddress();
    const debtTokenParams: Parameters<StableDebtTokenFactoryContract['callStatic']['create']>[2] = {
      pool: randomAddress,
      underlyingAsset: dai.address,
      incentivesController: randomAddress,
      debtTokenDecimals: 18,
      debtTokenName: 'sdDAI',
      debtTokenSymbol: 'sdDAI',
      params: '0x10',
    };

    const debtTokenImpl = await new StableDebtTokenFactory(signer).deploy();
    const debtTokenFactory = await new StableDebtTokenFactoryContractFactory(signer).deploy();
    const args: Parameters<(typeof debtTokenFactory)['create']> = [
      debtTokenImpl.address,
      await admin.getAddress(),
      debtTokenParams,
    ];
    const deployedAddr = await debtTokenFactory.callStatic.create(...args);

    await expect(debtTokenFactory.create(...args)).not.to.be.reverted;

    // work as debtToken
    const debtTokenCreated = await StableDebtTokenFactory.connect(deployedAddr, signer);
    expect(await debtTokenCreated.POOL()).to.be.equal(args[2].pool);
    expect(await debtTokenCreated.UNDERLYING_ASSET_ADDRESS()).to.be.equal(args[2].underlyingAsset);
    expect(await debtTokenCreated.getIncentivesController()).to.be.equal(
      args[2].incentivesController
    );
    expect(await debtTokenCreated.decimals()).to.be.equal(args[2].debtTokenDecimals);
    expect(await debtTokenCreated.name()).to.be.equal(args[2].debtTokenName);
    expect(await debtTokenCreated.symbol()).to.be.equal(args[2].debtTokenSymbol);
    // work as upgreadeable proxy
    const proxy = await InitializableAdminUpgradeabilityProxyFactory.connect(deployedAddr, signer);

    const newStableDebtTokenImpl = await new StableDebtTokenFactory(signer).deploy();
    await expect(proxy.upgradeTo(newStableDebtTokenImpl.address)).to.be.reverted;

    const proxyWithAdmin = proxy.connect(admin);
    expect(await proxyWithAdmin.callStatic.implementation()).to.be.equal(args[0]);
    expect(await proxyWithAdmin.callStatic.admin()).to.be.equal(args[1]);
    await expect(proxyWithAdmin.upgradeTo(newStableDebtTokenImpl.address)).not.to.be.reverted;
    expect(await proxyWithAdmin.callStatic.implementation()).to.be.equal(
      newStableDebtTokenImpl.address
    );
  });
});
