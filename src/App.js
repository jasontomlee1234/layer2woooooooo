import { useEffect, useState } from "react";
import { WalletHook } from "./utils/ethereum";
import { woolBalance, milkBalance, weedBalance } from "./utils/wool";
import {
  loadTotalSupply,
  loadWoolfList,
  loadStakedWoolfList,
} from "./utils/woolf";
import { getClaimable, claimable } from "./utils/barn";
import Page from "./Page";
import Modal from "react-modal";
import "./App.css";
const App = () => {

  const { wallet, chain } = WalletHook();
  const [wool, setWool] = useState("?");
  const [milk, setMilk] = useState("?");
  const [weed, setWeed] = useState("?");
  const [total, setTotal] = useState(0);
  const [woolf, setWoolf] = useState([]);
  const [stakedWoolf, setStakedWoolf] = useState([]);

  useEffect(() => {
    Modal.setAppElement("body");
  }, []);

  useEffect(() => {
    const loadWool = async () => {
      if (!wallet) return;
      setWool(await woolBalance(wallet));
      setMilk(await milkBalance(wallet));
      setWeed(await weedBalance(wallet));
      loadWoolf();
      loadStaked();
    };
    const loadTotal = async () => {
      setTotal(await loadTotalSupply());
    };
    const loadWoolf = async () => {
      if (!wallet) return;

      const value = await loadWoolfList(wallet, total);
      setWoolf(value);
    };
    const loadStaked = async () => {
      if (!wallet) return;
      const value = await loadStakedWoolfList(wallet, total);

      const a = await getClaimable(value.map((x) => x.number));
      for (let i = 0; i < value.length; i++) {
        // const unclaimed = await claimable(v.number, v.isSheep);
        value[i].unclaimed = parseFloat((a[i] / 10 ** 18).toString());
      }
      // console.log(value)
      setStakedWoolf(value);
    };

    loadTotal();
    loadWool();
  }, [wallet, chain, total]);

  return (
    <Page
      wallet={wallet}
      chain={chain}
      wool={wool}
      milk={milk}
      weed={weed}
      total={total}
      woolf={woolf}
      stakedWoolf={stakedWoolf}
      reload={async () => {
        if (!wallet) return;
        setWool(await woolBalance(wallet));
        setTotal(await loadTotalSupply());
      }}
    />
  );
};

export default App;
