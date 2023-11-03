import { expect } from 'chai';
import { getEthersSigners } from '../../helpers/contracts-helpers';
import { createRandomAddress } from '../../helpers/misc-utils';
import {
  InitializableAdminUpgradeabilityProxyFactory,
  VariableDebtTokenFactory,
  VariableDebtTokenFactoryContract,
  VariableDebtTokenFactoryContractFactory,
} from '../../types';
import { makeSuite, TestEnv } from './helpers/make-suite';

makeSuite('Factory: VariableDebtToken', async (testEnv: TestEnv) => {
  it('create', async () => {
    const [signer, admin] = await getEthersSigners();
    const { dai } = testEnv;
    const randomAddress = createRandomAddress();
    const debtTokenParams: Parameters<VariableDebtTokenFactoryContract['callStatic']['create']>[2] =
      {
        pool: randomAddress,
        underlyingAsset: dai.address,
        incentivesController: randomAddress,
        debtTokenDecimals: 18,
        debtTokenName: 'vdDAI',
        debtTokenSymbol: 'vdDAI',
        params: '0x10',
      };

    const debtTokenImpl = await new VariableDebtTokenFactory(signer).deploy();
    const debtTokenFactory = await new VariableDebtTokenFactoryContractFactory(signer).deploy();
    const args: Parameters<(typeof debtTokenFactory)['create']> = [
      debtTokenImpl.address,
      await admin.getAddress(),
      debtTokenParams,
    ];
    const deployedAddr = await debtTokenFactory.callStatic.create(...args);

    await expect(debtTokenFactory.create(...args)).not.to.be.reverted;

    // work as debtToken
    const debtTokenCreated = await VariableDebtTokenFactory.connect(deployedAddr, signer);
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

    const newVariableDebtTokenImpl = await new VariableDebtTokenFactory(signer).deploy();
    await expect(proxy.upgradeTo(newVariableDebtTokenImpl.address)).to.be.reverted;

    const proxyWithAdmin = proxy.connect(admin);
    expect(await proxyWithAdmin.callStatic.implementation()).to.be.equal(args[0]);
    expect(await proxyWithAdmin.callStatic.admin()).to.be.equal(args[1]);
    await expect(proxyWithAdmin.upgradeTo(newVariableDebtTokenImpl.address)).not.to.be.reverted;
    expect(await proxyWithAdmin.callStatic.implementation()).to.be.equal(
      newVariableDebtTokenImpl.address
    );
  });
});
