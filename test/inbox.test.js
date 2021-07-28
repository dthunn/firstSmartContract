const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { abi, evm } = require('../compile');

const web3 = new Web3(ganache.provider());

let initMessage = 'Ayo!';
let accounts;
let inbox;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract
  let contract = await new web3.eth.Contract(abi);
  let deploy = await contract.deploy({
    data: '0x' + evm.bytecode.object,
    arguments: [initMessage],
  });
  inbox = await deploy.send({ from: accounts[0], gas: '1000000' });
});

describe('Inbox', () => {
  it('deploy a contract', () => {
    assert.ok(inbox.options.address);
  });

  it('has a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.strictEqual(message, initMessage);
  });

  it('can set a message', async () => {
    const newMsg = 'Adios!';

    await inbox.methods.setMessage(newMsg).send({ from: accounts[0] });
    const message = await inbox.methods.message().call();

    assert.strictEqual(message, newMsg);
  });
});
