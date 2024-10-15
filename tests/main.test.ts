import { describe, beforeEach, it, expect } from 'vitest';
import {
  Chain,
  Clarinet,
  Tx,
  types
} from 'https://deno.land/x/clarinet@v1.5.4/index.ts';

describe('loyalty-program contract test suite', () => {
  let chain: Chain;
  let deployer: string;
  let user1: string;
  let user2: string;
  
  beforeEach(() => {
    chain = new Chain();
    [deployer, user1, user2] = chain.defaultAccounts().map(account => account.address);
  });
  
  it('allows contract owner to mint tokens', () => {
    const { result } = chain.mineBlock([
      Tx.contractCall('loyalty-program', 'earn-tokens', [types.principal(user1), types.uint(100)], deployer)
    ]);
    
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result[0].result).toBeOk(types.bool(true));
    
    const balance = chain.callReadOnlyFn('loyalty-program', 'get-balance', [types.principal(user1)], deployer);
    expect(balance.result).toBeOk(types.uint(100000000)); // 100 tokens with 6 decimals
  });
  
  it('prevents non-owner from minting tokens', () => {
    const { result } = chain.mineBlock([
      Tx.contractCall('loyalty-program', 'earn-tokens', [types.principal(user2), types.uint(100)], user1)
    ]);
    
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result[0].result).toBeErr(types.uint(100)); // err-owner-only
  });
  
  it('allows adding an item to the program', () => {
    const { result } = chain.mineBlock([
      Tx.contractCall('loyalty-program', 'add-item', [types.ascii("Test Item"), types.uint(50)], deployer)
    ]);
    
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result[0].result).toBeOk(types.uint(1)); // First item ID
    
    const itemDetails = chain.callReadOnlyFn('loyalty-program', 'get-item-details', [types.uint(1)], deployer);
    expect(itemDetails.result).toBeOk(types.tuple({
      name: types.ascii("Test Item"),
      price: types.uint(50),
      'is-available': types.bool(true)
    }));
  });
  
  it('allows redeeming an item', () => {
    chain.mineBlock([
      Tx.contractCall('loyalty-program', 'earn-tokens', [types.principal(user1), types.uint(100)], deployer),
      Tx.contractCall('loyalty-program', 'add-item', [types.ascii("Redeemable Item"), types.uint(50)], deployer)
    ]);
    
    const { result } = chain.mineBlock([
      Tx.contractCall('loyalty-program', 'redeem-item', [types.uint(1)], user1)
    ]);
    
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result[0].result).toBeOk(types.bool(true));
    
    const balance = chain.callReadOnlyFn('loyalty-program', 'get-balance', [types.principal(user1)], deployer);
    expect(balance.result).toBeOk(types.uint(50000000)); // 50 tokens left
    
    const itemDetails = chain.callReadOnlyFn('loyalty-program', 'get-item-details', [types.uint(1)], deployer);
    expect(itemDetails.result).toBeOk(types.tuple({
      name: types.ascii("Redeemable Item"),
      price: types.uint(50),
      'is-available': types.bool(false)
    }));
  });
  
  it('allows transferring tokens between users', () => {
    chain.mineBlock([
      Tx.contractCall('loyalty-program', 'earn-tokens', [types.principal(user1), types.uint(100)], deployer)
    ]);
    
    const { result } = chain.mineBlock([
      Tx.contractCall('loyalty-program', 'transfer', [types.uint(50000000), types.principal(user1), types.principal(user2)], user1)
    ]);
    
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result[0].result).toBeOk(types.bool(true));
    
    const balance1 = chain.callReadOnlyFn('loyalty-program', 'get-balance', [types.principal(user1)], deployer);
    expect(balance1.result).toBeOk(types.uint(50000000)); // 50 tokens left
    
    const balance2 = chain.callReadOnlyFn('loyalty-program', 'get-balance', [types.principal(user2)], deployer);
    expect(balance2.result).toBeOk(types.uint(50000000)); // 50 tokens received
  });
});
