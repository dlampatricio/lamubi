"use client"

import { useRouter } from "next/navigation";
import useGameStore from "../../hooks/useGameStore";
import HandleTeamsCard from "../../components/HandleTeamsCard";

export default function LobbyPage(){
    const router = useRouter()
    const { startGame, teams } = useGameStore()
    return (
        <>
        <div>
            <h1>Lobby</h1>
            <p>Score {teams[0].name}: {teams[0].score}</p>
            <p>Score {teams[1].name}: {teams[1].score}</p>
        </div>
        <button onClick={() => {router.push('/handoff')
            startGame()
        }}>Handoff</button>
        <HandleTeamsCard/>
        </>
    )
}