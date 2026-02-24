import { Movie } from '../types/game';

interface MovieCardProps {
  movie: Movie | null;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  if (!movie) {
    return (
      <div className="w-full max-w-xs mx-auto bg-gray-50 aspect-2/3 rounded-2xl flex items-center justify-center border border-gray-100">
        <span className="text-gray-400 font-bold tracking-widest text-[10px] animate-pulse uppercase">Loading...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xs mx-auto bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
      
      {/* Poster Area */}
      <div className="relative aspect-2/3 bg-gray-100">
        {movie.poster_path ? (
          <img 
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px] font-bold tracking-widest uppercase text-center p-4">
            No Image Available
          </div>
        )}
      </div>

      {/* Details Area */}
      <div className="p-5 text-left bg-white">
        {/* Title and Year */}
        <h2 className="text-xl font-black leading-tight text-gray-900 uppercase">
          {movie.title} {!!(movie.year) && <span className="text-gray-400 ml-1">({movie.year})</span>}
        </h2>
        
        {/* Rating*/}
        {movie.rating !== undefined && (
          <div className="mt-2 text-[11px] font-bold text-gray-500 tracking-tight uppercase flex items-center gap-1">
            <span>Rating: {movie.rating} / 10</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;