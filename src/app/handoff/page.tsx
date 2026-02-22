"use client"

import useGameStore from "@/hooks/useGameStore";
import { useRouter } from "next/navigation";

export default function HandoffPage(){
    const router = useRouter()
    const {current_team } = useGameStore()

    return (
        <>
        <div>
            <h1>Handoff</h1>
            <p>Current Team: {current_team.name}</p>
            <p>Current Player: {current_team.players[current_team.current_player_index].name}</p>
        </div>
        <button onClick={() => router.push('/acting')}>Acting</button>
        </>
    )
}