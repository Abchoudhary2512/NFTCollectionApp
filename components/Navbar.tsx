import Link from "next/link";
import styles from "../styles/Home.module.css";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";

export default function Navbar() {
  const address = useAddress();
  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <Link href="/">
          <p>NFT Collection</p>
        </Link>
        <div className={styles.navlink}>
          {address && (
            <Link href={`/profile/${address}`}>
              <p>My NFTs</p>
            </Link>
          )}
        </div>
        <ConnectWallet />
      </div>
    </div>
  );
}
