import { expect } from 'chai';
import { ethers } from 'ethers';
import { APPROVAL_AMOUNT_LENDING_POOL } from '../../helpers/constants';
import { convertToCurrencyDecimals } from '../../helpers/contracts-helpers';
import { ProtocolErrors, RateMode } from '../../helpers/types';
import { CommonsConfig } from '../../markets/palmy/commons';
import { makeSuite, TestEnv } from './helpers/make-suite';

const OASYSLEND_REFERRAL = CommonsConfig.ProtocolGlobalParams.PalmyReferral;

makeSuite('LToken: Transfer', (testEnv: TestEnv) => {
  const {
    INVALID_FROM_BALANCE_AFTER_TRANSFER,
    INVALID_TO_BALANCE_AFTER_TRANSFER,
    VL_TRANSFER_NOT_ALLOWED,
  } = ProtocolErrors;

  it('User 0 deposits 1000 DAI, transfers to user 1', async () => {
    const { users, pool, dai, lDai, configurator, weth } = testEnv;
    await configurator.enableReserveStableRate(weth.address);

    await dai.connect(users[0].signer).mint(await convertToCurrencyDecimals(dai.address, '1000'));

    await dai.connect(users[0].signer).approve(pool.address, APPROVAL_AMOUNT_LENDING_POOL);

    //user 1 deposits 1000 DAI
    const amountDAItoDeposit = await convertToCurrencyDecimals(dai.address, '1000');

    await pool
      .connect(users[0].signer)
      .deposit(dai.address, amountDAItoDeposit, users[0].address, '0');

    await lDai.connect(users[0].signer).transfer(users[1].address, amountDAItoDeposit);

    const name = await lDai.name();

    expect(name).to.be.equal('Palmy interest bearing DAI');

    const fromBalance = await lDai.balanceOf(users[0].address);
    const toBalance = await lDai.balanceOf(users[1].address);

    expect(fromBalance.toString()).to.be.equal('0', INVALID_FROM_BALANCE_AFTER_TRANSFER);
    expect(toBalance.toString()).to.be.equal(
      amountDAItoDeposit.toString(),
      INVALID_TO_BALANCE_AFTER_TRANSFER
    );
  });

  it('User 0 deposits 1 WETH and user 1 tries to borrow the WETH with the received DAI as collateral', async () => {
    const { users, pool, weth, helpersContract } = testEnv;
    const userAddress = await pool.signer.getAddress();

    await weth.connect(users[0].signer).mint(await convertToCurrencyDecimals(weth.address, '1'));

    await weth.connect(users[0].signer).approve(pool.address, APPROVAL_AMOUNT_LENDING_POOL);

    await pool
      .connect(users[0].signer)
      .deposit(weth.address, ethers.utils.parseEther('1.0'), userAddress, '0');
    await pool
      .connect(users[1].signer)
      .borrow(
        weth.address,
        ethers.utils.parseEther('0.1'),
        RateMode.Stable,
        OASYSLEND_REFERRAL,
        users[1].address
      );

    const userReserveData = await helpersContract.getUserReserveData(
      weth.address,
      users[1].address
    );

    expect(userReserveData.currentStableDebt.toString()).to.be.eq(ethers.utils.parseEther('0.1'));
  });

  it('User 1 tries to transfer all the DAI used as collateral back to user 0 (revert expected)', async () => {
    const { users, pool, lDai, dai, weth } = testEnv;

    const lDaitoTransfer = await convertToCurrencyDecimals(dai.address, '1000');

    await expect(
      lDai.connect(users[1].signer).transfer(users[0].address, lDaitoTransfer),
      VL_TRANSFER_NOT_ALLOWED
    ).to.be.revertedWith(VL_TRANSFER_NOT_ALLOWED);
  });

  it('User 1 tries to transfer a small amount of DAI used as collateral back to user 0', async () => {
    const { users, pool, lDai, dai, weth } = testEnv;

    const lDaitoTransfer = await convertToCurrencyDecimals(dai.address, '100');

    await lDai.connect(users[1].signer).transfer(users[0].address, lDaitoTransfer);

    const user0Balance = await lDai.balanceOf(users[0].address);

    expect(user0Balance.toString()).to.be.eq(lDaitoTransfer.toString());
  });
});
