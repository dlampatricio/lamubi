"use client"

import { useRouter } from "next/navigation";
import useGameStore from "../../hooks/useGameStore";

export default function ResultPage(){
    const router = useRouter()
    const { teams, reset, nextTeam } = useGameStore()
    return (
        <>
        <div>
            <h1>Result</h1>
            <p>Score Team A: {teams[0].score}</p>
            <p>Score Team B: {teams[1].score}</p>
        </div>
        <button onClick={() => {router.push('/lobby')
            reset()
        }}>Lobby</button>
        <button onClick={() => {router.push('/handoff')
            nextTeam()
        }}>Next Team</button>
        </>
    )
}