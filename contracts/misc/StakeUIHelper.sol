// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;
import {IERC20} from '../interfaces/IERC20.sol';
import {IStakedToken} from '../interfaces/IStakedToken.sol';
import {StakeUIHelperI} from '../interfaces/StakeUIHelperI.sol';
import {IERC20WithNonce} from '../interfaces/IERC20WithNonce.sol';
import {IPriceOracleGetter} from '../interfaces/IPriceOracleGetter.sol';
import {Initializable} from '../dependencies/openzeppelin/upgradeability/Initializable.sol';

contract StakeUIHelper is StakeUIHelperI, Initializable {
  IPriceOracleGetter public PRICE_ORACLE;

  address public MOCK_USD_ADDRESS;
  address public WOAS;
  IStakedToken public STAKED_OAS;

  uint256 constant SECONDS_PER_YEAR = 365 * 24 * 60 * 60;
  uint256 constant APY_PRECISION = 10000;
  uint256 internal constant USD_BASE = 1e26;

  function initialize(address priceOracle, address wOas, address stkOas, address mockUsd) external initializer {
    require(priceOracle != address(0), 'priceOracle address cannot be empty');
    require(wOas != address(0), 'wOas address cannot be empty');
    require(stkOas != address(0), 'stkOas address cannot be empty');
    require(mockUsd != address(0), 'mockUsd address cannot be empty');
    PRICE_ORACLE = IPriceOracleGetter(priceOracle);

    WOAS = wOas;
    STAKED_OAS = IStakedToken(stkOas);
    MOCK_USD_ADDRESS = mockUsd;
  }

  function _getUserAndGeneralStakedAssetData(
    IStakedToken stakeToken,
    address underlyingToken,
    address user,
    bool isNonceAvailable
  ) internal view returns (AssetUIData memory) {
    AssetUIData memory data;
    GeneralStakeUIData memory generalStakeData = _getGeneralStakedAssetData(stakeToken);

    data.stakeTokenTotalSupply = generalStakeData.stakeTokenTotalSupply;
    data.stakeCooldownSeconds = generalStakeData.stakeCooldownSeconds;
    data.stakeUnstakeWindow = generalStakeData.stakeUnstakeWindow;
    data.rewardTokenPriceEth = generalStakeData.rewardTokenPriceEth;
    data.distributionEnd = generalStakeData.distributionEnd;
    data.distributionPerSecond = generalStakeData.distributionPerSecond;

    if (user != address(0)) {
      UserStakeUIData memory userStakeData = _getUserStakedAssetData(
        stakeToken,
        underlyingToken,
        user,
        isNonceAvailable
      );

      data.underlyingTokenUserBalance = userStakeData.underlyingTokenUserBalance;
      data.stakeTokenUserBalance = userStakeData.stakeTokenUserBalance;
      data.userIncentivesToClaim = userStakeData.userIncentivesToClaim;
      data.userCooldown = userStakeData.userCooldown;
      data.userPermitNonce = userStakeData.userPermitNonce;
    }

    return data;
  }

  function _getUserStakedAssetData(
    IStakedToken stakeToken,
    address underlyingToken,
    address user,
    bool isNonceAvailable
  ) internal view returns (UserStakeUIData memory) {
    UserStakeUIData memory data;
    data.underlyingTokenUserBalance = IERC20(underlyingToken).balanceOf(user);
    data.stakeTokenUserBalance = stakeToken.balanceOf(user);
    data.userIncentivesToClaim = stakeToken.getTotalRewardsBalance(user);
    data.userCooldown = stakeToken.stakersCooldowns(user);
    data.userPermitNonce = isNonceAvailable ? IERC20WithNonce(underlyingToken)._nonces(user) : 0;

    return data;
  }

  function _getGeneralStakedAssetData(
    IStakedToken stakeToken
  ) internal view returns (GeneralStakeUIData memory) {
    GeneralStakeUIData memory data;

    data.stakeTokenTotalSupply = stakeToken.totalSupply();
    data.stakeCooldownSeconds = stakeToken.COOLDOWN_SECONDS();
    data.stakeUnstakeWindow = stakeToken.UNSTAKE_WINDOW();
    data.rewardTokenPriceEth = PRICE_ORACLE.getAssetPrice(WOAS);
    data.distributionEnd = stakeToken.DISTRIBUTION_END();
    if (block.timestamp < data.distributionEnd) {
      data.distributionPerSecond = stakeToken.assets(address(stakeToken)).emissionPerSecond;
    }

    return data;
  }

  function _calculateApy(
    uint256 distributionPerSecond,
    uint256 stakeTokenTotalSupply
  ) internal pure returns (uint256) {
    if (stakeTokenTotalSupply == 0) {
      return 0;
    }
    return (distributionPerSecond * SECONDS_PER_YEAR * APY_PRECISION) / stakeTokenTotalSupply;
  }

  function getstkOalData(address user) public view override returns (AssetUIData memory) {
    AssetUIData memory data = _getUserAndGeneralStakedAssetData(STAKED_OAS, WOAS, user, true);

    data.stakeTokenPriceEth = data.rewardTokenPriceEth;
    data.stakeApy = _calculateApy(data.distributionPerSecond, data.stakeTokenTotalSupply);
    return data;
  }

  function getStkGeneralOalData() public view override returns (GeneralStakeUIData memory) {
    GeneralStakeUIData memory data = _getGeneralStakedAssetData(STAKED_OAS);

    data.stakeTokenPriceEth = data.rewardTokenPriceEth;
    data.stakeApy = _calculateApy(data.distributionPerSecond, data.stakeTokenTotalSupply);
    return data;
  }

  function getStkUserOalData(address user) public view override returns (UserStakeUIData memory) {
    UserStakeUIData memory data = _getUserStakedAssetData(STAKED_OAS, WOAS, user, true);
    return data;
  }

  function getUserUIData(
    address user
  ) external view override returns (AssetUIData memory, uint256) {
    return (getstkOalData(user), USD_BASE / PRICE_ORACLE.getAssetPrice(MOCK_USD_ADDRESS));
  }

  function getGeneralStakeUIData()
    external
    view
    override
    returns (GeneralStakeUIData memory, uint256)
  {
    return (getStkGeneralOalData(), USD_BASE / PRICE_ORACLE.getAssetPrice(MOCK_USD_ADDRESS));
  }

  function getUserStakeUIData(
    address user
  ) external view override returns (UserStakeUIData memory, uint256) {
    return (getStkUserOalData(user), USD_BASE / PRICE_ORACLE.getAssetPrice(MOCK_USD_ADDRESS));
  }
}
