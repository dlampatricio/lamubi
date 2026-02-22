import useGameStore from "../hooks/useGameStore";

const HandleTeamsCard = () => {
  // Traemos la nueva acción
  const { teams, updateTeamName, addPlayer, removePlayer, updatePlayerName } = useGameStore();

  return (
    <div>
      {teams.map((team, teamIdx) => (
        <div key={teamIdx} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
          
          {/* Nombre del Equipo */}
          <h1>Team:</h1>
          <input 
            value={team.name} 
            onChange={(e) => updateTeamName(teamIdx, e.target.value)} 
            style={{ fontWeight: 'bold' }}
          />

          {/* Lista de Jugadores */}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {team.players.map((p, pIdx) => (
              <li key={pIdx} style={{ marginTop: '5px' }}>
                <input 
                  value={p.name} 
                  onChange={(e) => updatePlayerName(teamIdx, pIdx, e.target.value)} 
                  placeholder="Nombre del jugador"
                />
                <button onClick={() => removePlayer(teamIdx, pIdx)} style={{ marginLeft: '5px' }}>
                  X
                </button>
              </li>
            ))}
          </ul>

          <button onClick={() => addPlayer(teamIdx, "")}>
            + Add Player
          </button>
        </div>
      ))}
    </div>
  );
};
export default HandleTeamsCard;