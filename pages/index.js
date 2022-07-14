import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { mint } from '../web3/web3.js'
//Styles
import styles from '../styles/Home.module.css';
import "react-responsive-modal/styles.css";

//Resources
import Logo from '../src/img/logo.png';
// import Gold from '../src/vid/1.mp4';
// import Silver from '../src/vid/Silver.mp4';
// import Bronze from '../src/vid/Bronze.mp4';

export default function Home() {

  const [toggle, setToggle] = useState(false);
  const [metamask, setMetamask] = useState(false);
  const [dataAmount, setDataAmount] = useState(0);

  //Wallet Address
  const [address, setAddress] = useState('Connect Wallet');

  const changeToggle = () => {
    setToggle(!toggle);
  }
  const notifyUnAvailable = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }
  const onConnectWallet = async () => {
    if (window.ethereum) {
      if (!metamask) {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
          .then(res => {
            // Return the address of the wallet
            setMetamask(true);
            setAddress(res[0]);
          })
      } else {
        console.log("disconnect!")
        setMetamask(false);
        setAddress("Connect Wallet");
      }
    } else {
      notifyUnAvailable('Please install Metamask!')
    }
  }

  // const onDisconnectWallet = () => {
  //   await window.ethereum.request({
  //     method: "eth_requestAccounts",
  //     params: [{ eth_accounts: {} }]
  //   })
  // }

  const onMint = async () => {

    if (metamask) {
      const id = toast.loading("Please wait...");
      const mint_status = await mint(address);
      console.log("minted status:", mint_status);
      switch (mint_status) {
        case 0:
          toast.update(id, { render: "🦄 Sorry, You are not a NFT holder!", type: "error", isLoading: false, closeOnClick: true, draggable: true, autoClose: 3000 });
          return;
        case 1:
          toast.update(id, { render: "🦄 Sorry, There are issues in mint process. Please check your ether balance.", type: "error", isLoading: false, closeOnClick: true, draggable: true, autoClose: 3000 });
          return;
        case 2:
          toast.update(id, { render: "🦄 Welcome, You succeed to mint NFT!", type: "success", isLoading: false, closeOnClick: true, draggable: true, autoClose: 3000 });
          return;
      }
    } else {
      notifyUnAvailable('Please connect your Metamask!')
    }

  }

  const truncate = (input) =>
    input?.length > 15 ? `${input.substring(0, 10)}...` : input;

  return (
    <div className="mx-auto relative bg-black] bg-auto bg-cover bg-black overflow-hidden" >
      <Head>
        <title>BOTB.ONE</title>
      </Head>
      <nav className="bg-gray-900">
        <div className=" mx-auto px-2 sm:px-6 lg:px-8 py-3">
          <div className="relative flex items-center justify-between h-16">
            <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
              <button type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false" onClick={() => changeToggle()}>
                <span className="sr-only">Open main menu</span>
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-between">
              <div className="flex-shrink-0 flex items-center">
                <Image src={Logo} className="block lg:hidden w-auto" width={50} height={50} alt="Hactivist" />
              </div>
              <div className="hidden lg:block w-auto flex-shrink-0 flex items-center">
                <a className="text-white text-4xl font-black" alt="Hactivist">BOTB ONE</a>
              </div>
              <div className="hidden sm:block sm:ml-6">
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-300 bg-gray-800  hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-xl font-medium" onClick={() => onMint()}>Mint
                  </a>
                  <a href="#" className="text-gray-300 bg-gray-800 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-xl font-medium" onClick={() => onConnectWallet()}>
                    {truncate(address)}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Mobile menu, show/hide based on menu state. --> */}
        <div className={`${toggle ? 'sm:hidden' : 'hidden sm:hidden'}`} id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 text-right">
            <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              <span>{dataAmount} </span>
              <span>$Data</span>
            </span>
            <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium" onClick={() => depositToWallet()}>Staking</a>
            <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium" onClick={() => onConnectWallet()}>
              {truncate(address)}
            </a>
          </div>
        </div>
      </nav >
      <div className="h-screen w-screen">
        <div className="flex justify-around items-center h-full">
          {/* <Image src={Logo} className="block lg:hidden w-auto" width={50} height={50} alt="Hactivist" /> */}

          <video src={'./2.mp4'} className="w-96 lg:w-2/7"></video>
          <video src={'./1.mp4'} className="w-96 lg:w-1/3"></video>
          <video src={'./3.mp4'} className="w-96 lg:w-2/7"></video>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
      />
    </div >
  )
}
