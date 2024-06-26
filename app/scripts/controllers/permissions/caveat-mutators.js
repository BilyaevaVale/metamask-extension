import { CaveatMutatorOperation } from '@metamask/permission-controller';
import { toChecksumAddress } from 'ethereumjs-util';
import { CaveatTypes } from '../../../../shared/constants/permissions';

/**
 * Factories that construct caveat mutator functions that are passed to
 * PermissionController.updatePermissionsByCaveat.
 */
export const CaveatMutatorFactories = {
  [CaveatTypes.restrictReturnedAccounts]: {
    removeAccount,
  },
  [CaveatTypes.restrictNetworkSwitching]: {
    removeChainId,
  },
};

/**
 * Removes the target account from the value arrays of all
 * `restrictReturnedAccounts` caveats. No-ops if the target account is not in
 * the array, and revokes the parent permission if it's the only account in
 * the array.
 *
 * @param {string} targetAccount - The address of the account to remove from
 * all accounts permissions.
 * @param {string[]} existingAccounts - The account address array from the
 * account permissions.
 */
function removeAccount(targetAccount, existingAccounts) {
  const checkSumTargetAccount = toChecksumAddress(targetAccount);
  const newAccounts = existingAccounts.filter(
    (address) => toChecksumAddress(address) !== checkSumTargetAccount,
  );

  if (newAccounts.length === existingAccounts.length) {
    return { operation: CaveatMutatorOperation.noop };
  } else if (newAccounts.length > 0) {
    return {
      operation: CaveatMutatorOperation.updateValue,
      value: newAccounts,
    };
  }
  return { operation: CaveatMutatorOperation.revokePermission };
}

/**
 * Removes the target chain ID from the value arrays of all
 * `restrictNetworkSwitching` caveats. No-ops if the target chain ID is not in
 * the array, and revokes the parent permission if it's the only chain ID in
 * the array.
 *
 * @param {string} targetChainId - The chain ID to remove from
 * all network switching permissions.
 * @param {string[]} existingChainIds - The chain ID array from the
 * network switching permissions.
 */
function removeChainId(targetChainId, existingChainIds) {
  const newChainIds = existingChainIds.filter(
    (chainId) => chainId !== targetChainId,
  );

  if (newChainIds.length === existingChainIds.length) {
    return { operation: CaveatMutatorOperation.noop };
  } else if (newChainIds.length > 0) {
    return {
      operation: CaveatMutatorOperation.updateValue,
      value: newChainIds,
    };
  }
  return { operation: CaveatMutatorOperation.revokePermission };
}
