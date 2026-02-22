"use client"

import { useRouter } from "next/navigation";
import useGameStore from "../../hooks/useGameStore";

export default function ActingPage(){
    const router = useRouter()
    const { current_team, correctGuess } = useGameStore()

    return (
        <>
        <div>
            <h1>Acting</h1>
            <p>Current Team: {current_team.name}</p>
        </div>
        <button onClick={() => {router.push('/result')
            correctGuess()
        }}>Correct_Guess</button>
        </>
    )
}