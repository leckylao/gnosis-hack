pragma solidity >=0.5.3 <0.6.0;

import "@gnosis.pm/safe-contracts/contracts/base/Module.sol";
// Required for triggering execution
import "@gnosis.pm/safe-contracts/contracts/common/Enum.sol";

contract AnswerRecoveryModule is Module {

  string public constant NAME = "Recovery Module";
  string public constant VERSION = "0.1.0";

  mapping (bytes32 => address) internal addresses;

  function setup(bytes memory _answer)
  public
  {
    setManager();
    bytes32 answer = keccak256(_answer);
    addresses[answer] = msg.sender;
  }

  function recoverAccess(bytes memory _answer, address newOwner)
  public
  {
    // require(newOwner.length > 0, "New owners are required!");
    bytes32 answer = keccak256(_answer);
    require(addresses[answer] != address(0), "Wrong answer!");
    bytes memory addOwnerData = abi.encodeWithSignature("addOwnerWithThreshold(address,uint256)", newOwner, 1);
    require(manager.execTransactionFromModule(address(manager), 0, addOwnerData, Enum.Operation.Call), "Could not execute recovery!");
    // This recovery module can only be used once and should be disabled when the recovery was successfull
    bytes memory disableModuleData = abi.encodeWithSignature("disableModule(address,address)", address(0x1), address(this));
    require(manager.execTransactionFromModule(address(manager), 0, disableModuleData, Enum.Operation.Call), "Could not disable module!");
  }

}
