import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";
import { ContractPromise, CodePromise } from "@polkadot/api-contract";

import { BN } from "@polkadot/util";
import assert from "assert";

const storageDepositLimit = null;
let api: any;
let deployer: any;
let keyring: any;

let recieverList:string[] = [];
let recieverIndex:number = 0;
let sendAmount:string = "1000000000000000000";

/// controller function
const trasferLoopLogic = async () => {
  if (recieverIndex == recieverList.length){
    api.disconnect();
    console.log("#### Transfer End");
    process.exit(0);
  }
  await transferNativeToken(trasferLoopLogic);
}

const transferNativeToken = async (callBack:()=>void) => {
  let reciever = recieverList[recieverIndex];
  console.log("transferNativeToken start: reciever:",reciever);
  // transfer tokens
  const transfer = api.tx.balances.transfer(reciever, sendAmount);
  //@ts-ignore
  const unsub = await transfer.signAndSend(deployer, ({ events = [], status }) => {
    if (status.isFinalized) {
      if (checkEventsAndInculueError(events) == true) {
        console.log("### Transaction is failure.");
      }
      unsub();
      console.log("transferNativeToken end: reciever:",reciever);
      recieverIndex++;
      callBack();
    }
  });
}

const checkEventsAndInculueError = (events: any[]): boolean => {
  let ret = false;
  events.forEach(({ event: { data } }) => {
    // console.log("### data.methhod:", data.method);
    if (String(data.method) == "ExtrinsicFailed") {
      console.log("### check ExtrinsicFailed");
      ret = true;
    }
  });
  // console.log("### ret is:", ret);
  return ret;
};

export const getGasLimitForNotDeploy = (api: any): any => {
  const gasLimit: any = api.registry.createType("WeightV2", {
    refTime: new BN("100000000000"),
    proofSize: new BN("100000000000"),
    // refTime: 6219235328,
    // proofSize: 131072,
  });
  return gasLimit;
};

export const executeTransfer = async () => {

  // todo: ネットワーク設定を適宜変更して下さい。
  const wsProvider = new WsProvider("ws://127.0.0.1:9944");
  api = await ApiPromise.create({ provider: wsProvider });
  keyring = new Keyring({ type: "sr25519" });
  // todo: 実行者の秘密鍵を「//Alice」の代わりに設定して下さい。
  deployer = keyring.addFromUri("//Alice");

  await trasferLoopLogic();
};

export const setRecieverList = () => {
  // todo: ハードコード、もしくはファイル読み込みで送信者一覧を作成して下さい。
  recieverList.push("aEuGkN4A4oUQaWKqfTTR42EcpxvsjEYfESWgUy6fhcrYzgU");
  recieverList.push("bgrbE6JxaHBk2tS7JH4rjcicyMki4t1E9M6YivFzCUq2YDg");
}

const main = () => {
  console.log("#### Transfer Start");
  setRecieverList();
  executeTransfer();
};

main();

