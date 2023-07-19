import styles from "../styles/Home.module.css";
import Image from "next/image";
import type { NextPage } from "next";
import { ethers } from "ethers";
import {
  MediaRenderer,
  useActiveClaimConditionForWallet,
  useAddress,
  useClaimIneligibilityReasons,
  useContract,
  useContractMetadata,
  useTotalCirculatingSupply,
  useTotalCount,
} from "@thirdweb-dev/react";
import { CONTRACT_ADDRESS } from "../const/addresses";
import { parse } from "path";
import { Web3Button } from "@thirdweb-dev/react";
import { useState } from "react";

const Home: NextPage = () => {
  const address = useAddress();

  const { contract } = useContract(CONTRACT_ADDRESS);
  const { data: contractMetadata, isLoading: isContractMetadataLoading } =
    useContractMetadata(contract);

  const { data: activeClaimPhase, isLoading: isActiveClaimPhaseLoading } =
    useActiveClaimConditionForWallet(contract, address);

  const { data: totalSupply, isLoading: isTotalSupplyLoading } =
    useTotalCount(contract);
  const { data: totalClaimed, isLoading: isTotalClaimedLoading } =
    useTotalCirculatingSupply(contract);

  const maxClaimable = parseInt(activeClaimPhase?.maxClaimablePerWallet || "0");
  const [claimQuantity,setClaimQuaantity] = useState(1);
  const increament= ()=>{
    if(claimQuantity < maxClaimable){
      setClaimQuaantity(claimQuantity+1);
    }
  };
  const decrement= ()=>{
    if(claimQuantity >1){
      setClaimQuaantity(claimQuantity-1);
    }
  };
  
  
  
  
  
  const { data: claimIneligibility, isLoading: isClaimIneligibilityLoading } =
    useClaimIneligibilityReasons(contract, {
      walletAddress: address || "",
      quantity: claimQuantity,
    });

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        {!isContractMetadataLoading && (
          <div className={styles.heroSection}>
            <div className={styles.collectionImage}>
              <MediaRenderer src={contractMetadata?.image} />
            </div>
            <div>
              <h1>{contractMetadata?.name}</h1>
              <p>{contractMetadata?.description}</p>
              {!isActiveClaimPhaseLoading ? (
                <div>
                  <p>Claim Phase: {activeClaimPhase?.metadata?.name}</p>
                  <p>
                    Price: {ethers.utils.formatUnits(activeClaimPhase?.price!)}
                  </p>
                </div>
              ) : (
                <p>Loading... </p>
              )}
              {!isTotalSupplyLoading && !isTotalClaimedLoading ? (
                <p>
                  Claimed:{totalClaimed?.toNumber()} / {totalSupply?.toNumber()}
                </p>
              ) : (
                <p>Loading...</p>
              )}
              {address ? (
                !isClaimIneligibilityLoading ? (
                  claimIneligibility?.length! > 0 ? (
                    claimIneligibility?.map((reason) => <p>{reason}</p>)
                  ) : (
                    <div>
                      <p>
                        You are eligible to Claim.
                        {`(Max claimable: ${maxClaimable})`}
                      </p>
                      <div className={styles.claimContainer}>
                        <div className={styles.claimValue}>
                          <button className={styles.claimBtn}
                          onClick={decrement}
                          >-</button>
                          <input className={styles.claimInput}
                          type="number" 
                          value={claimQuantity} />
                          <button className={styles.claimBtn}
                          onClick={increament}>+</button>
                        </div>
                        <Web3Button
                          contractAddress={CONTRACT_ADDRESS}
                          action={(contract) => contract.erc721.claim(claimQuantity)}
                        >
                          Claim NFT
                        </Web3Button>
                      </div>
                    </div>
                  )
                ) : (
                  <p>Loading...</p>
                )
              ) : (
                <p>Connect your wallet to claim</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
