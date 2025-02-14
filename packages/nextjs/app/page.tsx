"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useState } from "react";
import { Heart, Star, Sun, Moon, Cloud, Flower2, Sword, type LucideIcon } from "lucide-react";

type MonanimalCard = {
  id: number;
  src: string;
  color: string;
  health: number;
};

const createCards = () => {
  const cardImages = [
    { src: "/molandak.png", color: "text-rose-400" },
    { src: "/mopo.png", color: "text-amber-400" },
    { src: "/mosca.png", color: "text-yellow-400" },
    { src: "/Moyaki.png", color: "text-purple-400" },
    { src: "/salmonadela.png", color: "text-sky-400" },
    { src: "/Chog1.png", color: "text-emerald-400" },
  ];

  return cardImages.map((config, index) => ({
    id: index,
    health: 10000,
    ...config,
  }));
};

function MonanimalWars() {
  const [cards, setCards] = useState<MonanimalCard[]>(createCards());

  const handleAttack = (id: number) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, health: Math.max(card.health - 1000, 0) } : card
      )
    );
  };

  const handleHeal = (id: number) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, health: Math.min(card.health + 1000, 10000) } : card
      )
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8 bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 text-transparent bg-clip-text">
          Monanimal Wars
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-4 md:gap-6 p-6 rounded-xl bg-indigo-950/50 backdrop-blur-sm">
        {cards.map((card) => (
          <div key={card.id} className="flex flex-col items-center">
            <div
              className="relative w-56 h-56 md:w-64 md:h-64 cursor-pointer transition-all duration-300 bg-indigo-950 border border-indigo-800 hover:border-indigo-600 hover:bg-indigo-900/80 rounded-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-indigo-500/5 to-white/5 rounded-lg" />
              <div className="absolute inset-0 flex items-center justify-center">
                <img src={card.src} className={`w-full h-full object-contain ${card.color}`} alt={`Card ${card.id}`} />
              </div>
              <div className="absolute bottom-2 left-2 flex space-x-2">
                <button
                  className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors duration-300"
                  onClick={() => handleAttack(card.id)}
                >
                  <Sword className="h-6 w-6 text-white" />
                </button>
                <button
                  className="p-2 bg-green-500 rounded-full hover:bg-green-600 transition-colors duration-300"
                  onClick={() => handleHeal(card.id)}
                >
                  <Heart className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>
            {/* Health Bar for each Monanimal, placed below the box */}
            <div className="w-full h-2 bg-gray-300 rounded mt-2">
              <div
                className="h-full bg-green-500 rounded"
                style={{ width: `${(card.health / 10000) * 100}%` }} // Calculate health percentage
              />
            </div>
          </div>
        ))}
      </div>

      <button className="px-4 py-2 bg-indigo-950 border border-indigo-700 hover:bg-indigo-900 hover:border-indigo-500 text-indigo-200 hover:text-indigo-100 rounded-lg transition-colors duration-300">
        Start Game
      </button>
    </div>
  );
}

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <button className="absolute left-5 top-5 bg-blue-500 text-white px-4 py-2 rounded">
          Transaction
        </button>
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
            <span className="block text-lg mb-2">Foundry Edition</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>

          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/app/page.tsx
            </code>
          </p>
          <p className="text-center text-lg">
            Edit your smart contract{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              YourContract.sol
            </code>{" "}
            in{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/hardhat/contracts
            </code>
          </p>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
      <MonanimalWars />
    </>
  );
};

export default Home;
