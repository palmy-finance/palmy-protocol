// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;
import {Ownable} from './openzeppelin/contracts/Ownable.sol';

contract PalmyOwnable is Ownable {
  constructor(address initialOwner) public Ownable() {
    transferOwnership(initialOwner);
  }
}
