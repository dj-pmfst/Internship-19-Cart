// import styles from './details.module.css'
// import { useParams, useNavigate, Link } from "react-router-dom"
// import { useDominantColor } from "../../hooks/useDominantColor"
// import { useState, useEffect } from 'react'

// export default function MovieDetail() {
//     const { id } = useParams()
//     const navigate = useNavigate()
//     const [movie, setMovie] = useState(null)
//     const [isFavourite, setIsFavourite] = useState(false)
//     const dominantColor = useDominantColor(movie?.poster)

//     useEffect(() => {
//         fetch(`http://localhost:3000/movies/${id}`)
//             .then(res => res.json())
//             .then(data => setMovie(data))
//     }, [id])
 
//     useEffect(() => {
//         fetch("http://localhost:3000/favorites", {
//             headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//         })
//             .then(res => res.json())
//             .then(data => {
//                 if (Array.isArray(data)) {
//                     setIsFavourite(data.some(f => f.movieId === parseInt(id)))
//                 }
//             })
//     }, [id])

//     const toggleFavourite = async () => {
//         if (isFavourite) {
//             const favs = await fetch("http://localhost:3000/favorites", {
//                 headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//             }).then(r => r.json())
//             const fav = favs.find(f => f.movieId === parseInt(id))
//             await fetch(`http://localhost:3000/favorites/${fav.id}`, {
//                 method: "DELETE",
//                 headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//             })
//             setIsFavourite(false)
//         } else {
//             await fetch("http://localhost:3000/favorites", {
//                 method: "POST",
//                 headers: { 
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${localStorage.getItem("token")}`
//                 },
//                 body: JSON.stringify({ movieId: parseInt(id) })
//             })
//             setIsFavourite(true)
//         }
//     }

//     if (!movie) return <p>Movie not found.</p>

//     return (
//         <div 
//         className={styles.container}
//         style={{ 
//             background: dominantColor 
//                 ? `linear-gradient(to bottom, ${dominantColor}, rgb(94, 94, 94))` 
//                 : "rgb(94, 94, 94)" 
//         }}
//         >
//             <header className={styles.header}>
//                 <Link to="/home" className={styles.logoLink}>
//                     <span>Movie Explorer <img src="/src/assets/icons/film-roll.png"/></span>
//                 </Link>
//             </header>
//             <main className={styles.main}>
//                 <button className={styles.backButton} onClick={() => navigate(-1)}>← Back</button>
//                 <div className={styles.content }>
//                     <img src={movie.poster} alt={movie.title} className={styles.poster} />
//                     <div className={styles.info}>
//                         <h1>{movie.title}</h1>
//                         <p className={styles.meta}>{movie.year} • {movie.genres?.map(g => g.name).join(', ')} • {movie.rating} ⭐</p>
//                         <p className={styles.description}>{movie.description}</p>
//                         <button className={styles.favButton} onClick={toggleFavourite}>
//                             {isFavourite ? "Remove from Favourites" : "Add to Favourites"}
//                         </button>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     )
// }