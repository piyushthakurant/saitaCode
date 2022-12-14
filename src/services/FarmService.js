import { MAIN_CONTRACT_LIST } from "../assets/tokens";
import { toast } from "../components/Toast/Toast";
import { ERRORS } from "../constant";
import { ContractServices } from "./ContractServices";

const poolLength = async () => {
  try {
    const contract = await ContractServices.callContract(
      MAIN_CONTRACT_LIST.farm.address,
      MAIN_CONTRACT_LIST.farm.abi
    );
    return await contract.methods.poolLength().call();
  } catch (error) {
    return error;
  }
};

const poolInfo = async (index, type) => {
  try {
    const contract = await ContractServices.callContract(
      MAIN_CONTRACT_LIST.farm.address,
      MAIN_CONTRACT_LIST.farm.abi
    );
    const result = await contract.methods.poolInfo(index).call();
    return result;
  } catch (error) {
    return error;
  }
};

const saitaId = async () => {
  try {
    const contract = await ContractServices.callContract(
      MAIN_CONTRACT_LIST.farm.address,
      MAIN_CONTRACT_LIST.farm.abi
    );
    return await contract.methods.saitaId().call();
  } catch (error) {
    return error;
  }
};

const farmAndPoolInfo = async (index) => {
  try {
    const contract = await ContractServices.callContract(
      MAIN_CONTRACT_LIST.farm.address,
      MAIN_CONTRACT_LIST.farm.abi
    );
    const result = await contract.methods.poolInfo(index).call();
    const poolType = await contract.methods.poolType(result.lpToken).call();

    if (poolType === "1") {
      return { farm: result, pool: false };
    }
    if (poolType === "2") {
      return { farm: false, pool: result };
    }
    return false;
  } catch (error) {
    return error;
  }
};
const totalPoolInfo = async (index, type) => {
  try {
    const contract = await ContractServices.callContract(
      MAIN_CONTRACT_LIST.farm.address,
      MAIN_CONTRACT_LIST.farm.abi
    );
    const result = await contract.methods.poolInfo(index).call();
    const web3 = await ContractServices.callWeb3();
    if (!web3) return toast.error(ERRORS.SEL_WALLET);
    const latest = await web3.eth.getBlockNumber();
    return { poolInfo: result, latest };
  } catch (error) {
    return error;
  }
};

const getLpTokenDetails = async (lpToken) => {
  try {
    const contract = await ContractServices.callContract(
      lpToken,
      MAIN_CONTRACT_LIST.pair.abi
    );
    const decimals = await contract.methods.decimals().call();
    const token0 = await contract.methods.token0().call();
    const token1 = await contract.methods.token1().call();

    let symbol0 = await ContractServices.getTokenSymbol(token0);
    if (symbol0 === "WETH") {
      symbol0 = "ETH";
    }

    let symbol1 = await ContractServices.getTokenSymbol(token1);
    if (symbol1 === "WETH") {
      symbol1 = "ETH";
    }
    const lpTokenName = `${symbol0}-${symbol1} LP`;
    return {
      token0,
      token1,
      symbol0,
      symbol1,
      decimals,
      lpTokenName,
    };
  } catch (err) {
    return err;
  }
};
const getPoolTokenDetails = async (lpToken) => {
  try {
    const decimals = await ContractServices.getDecimals(lpToken);

    let symbol = await ContractServices.getTokenSymbol(lpToken);
    if (symbol === "WETH") {
      symbol = "BNB";
    }

    return {
      symbol,
      lpTokenName: symbol,
      decimals,
    };
  } catch (err) {
    return err;
  }
};
const userInfo = async (index, address) => {
  try {
    const contract = await ContractServices.callContract(
      MAIN_CONTRACT_LIST.farm.address,
      MAIN_CONTRACT_LIST.farm.abi
    );
    return await contract.methods.userInfo(index, address).call();
  } catch (err) {
    return err;
  }
};

const poolInfoo = async (index, address) => {
  try {
    const contract = await ContractServices.callContract(
      MAIN_CONTRACT_LIST.farm.address,
      MAIN_CONTRACT_LIST.farm.abi
    );
    return await contract.methods.saita().call();
  } catch (err) {
    return err;
  }
};

const deposit = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { pid, amount, referrer, from } = data;
      const contract = await ContractServices.callContract(
        MAIN_CONTRACT_LIST.farm.address,
        MAIN_CONTRACT_LIST.farm.abi
      );
      const gasPrice = await ContractServices.calculateGasPrice();

      const gas = await contract.methods
        .deposit(pid, amount)
        .estimateGas({ from, value: 0 });

      contract.methods
        .deposit(pid, amount)
        .send({ from, gasPrice, gas, value: 0 })
        .on("transactionHash", (hash) => {
          resolve(hash);
        })
        .on("receipt", (receipt) => {
          resolve(receipt);
          toast.success("Token deposited successfully");
        })
        .on("error", (error, receipt) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
      return error;
    }
  });
};
const withdraw = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { pid, amount, from } = data;
      const contract = await ContractServices.callContract(
        MAIN_CONTRACT_LIST.farm.address,
        MAIN_CONTRACT_LIST.farm.abi
      );
      const gasPrice = await ContractServices.calculateGasPrice();

      const gas = await contract.methods
        .withdraw(pid, amount)
        .estimateGas({ from, value: 0 });

      contract.methods
        .withdraw(pid, amount)
        .send({ from, gasPrice, gas, value: 0 })
        .on("transactionHash", (hash) => {
          resolve(hash);
        })
        .on("receipt", (receipt) => {
          toast.success("LP withdrawn successfully.");
        })
        .on("error", (error, receipt) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};
const withdrawSaita = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { pid, amount, from } = data;
      const contract = await ContractServices.callContract(
        MAIN_CONTRACT_LIST.farm.address,
        MAIN_CONTRACT_LIST.farm.abi
      );
      const gasPrice = await ContractServices.calculateGasPrice();

      const gas = await contract.methods
        .withdrawSaita(amount)
        .estimateGas({ from, value: 0 });

      contract.methods
        .withdrawSaita(amount)
        .send({ from, gasPrice, gas, value: 0 })
        .on("transactionHash", (hash) => {
          resolve(hash);
        })
        .on("receipt", (receipt) => {
          toast.success("LP withdrawn successfully.");
        })
        .on("error", (error, receipt) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};
const canHarvest = async (pid, address) => {
  try {
    const contract = await ContractServices.callContract(
      MAIN_CONTRACT_LIST.farm.address,
      MAIN_CONTRACT_LIST.farm.abi
    );
    return await contract.methods.canHarvest(pid, address).call();
  } catch (err) {
    return err;
  }
};
const pendingSaitama = async (pid, address) => {
  try {
    const contract = await ContractServices.callContract(
      MAIN_CONTRACT_LIST.farm.address,
      MAIN_CONTRACT_LIST.farm.abi
    );
    return await contract.methods.pendingSaitama(pid, address).call();
  } catch (err) {
    return err;
  }
};

const totalAllocationPoint = async () => {
  try {
    const contractFarm = await ContractServices.callContract(
      MAIN_CONTRACT_LIST.farm.address,
      MAIN_CONTRACT_LIST.farm.abi
    );
    return await contractFarm.methods.totalAllocPoint().call();
  } catch (err) {
    return err;
  }
};
const pantherPerBlock = async () => {
  try {
    const contractFarm = await ContractServices.callContract(
      MAIN_CONTRACT_LIST.farm.address,
      MAIN_CONTRACT_LIST.farm.abi
    );
    // console.log("jiiiiiiiiiiiiiiiiiiiiiii", contractFarm.methods);
    let bbb = await contractFarm.methods.SaitamaPerBlock().call();
    console.log("bbb", bbb);
    return await contractFarm.methods.SaitamaPerBlock().call();
  } catch (err) {
    return err;
  }
};
const getSaita = async (address) => {
  try {
    const contract = await ContractServices.callContract(
      MAIN_CONTRACT_LIST.farm.address,
      MAIN_CONTRACT_LIST.farm.abi
    );
    //const decimals = await ContractServices.getDecimals(address);
    const res = await contract.methods.getWithdrawableSaita(address).call();
    let saitaTokens = 0;
    if (res[0]) {
      saitaTokens = res[0] / 10 ** 18;
    }
    return saitaTokens;
  } catch (error) {
    return error;
  }
};
export const FarmService = {
  poolLength,
  poolInfo,
  getLpTokenDetails,
  userInfo,
  deposit,
  withdraw,
  withdrawSaita,
  canHarvest,
  pendingSaitama,
  getPoolTokenDetails,
  poolInfoo,
  totalAllocationPoint,
  pantherPerBlock,
  totalPoolInfo,
  farmAndPoolInfo,
  saitaId,
  getSaita,
};
