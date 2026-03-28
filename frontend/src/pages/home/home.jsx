import { Link, useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import styles from './home.module.css'

export default function Home() {
    const navigate = useNavigate()
    const ribbonRef = useRef(null)
    const [movies, setMovies] = useState([])

    useEffect(() => {
        fetch("http://localhost:3000/movies")
            .then(res => res.json())
            .then(data => setMovies(data))
    }, [])

    useEffect(() => {
        const ribbon = ribbonRef.current
        let animationId
        let position = 0
    
        const scroll = () => {
            if (ribbon) {
                position += 0.35
                ribbon.scrollLeft = position
                if (position >= ribbon.scrollWidth / 2) {
                    position = 0
                }
            }
            animationId = requestAnimationFrame(scroll)
        }
    
        animationId = requestAnimationFrame(scroll)
        return () => cancelAnimationFrame(animationId)
    }, [])

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link to="/favourites" className={styles.favLink}>
                    <img className={styles.star} src="/src/assets/icons/star.png" /> 
                    Favourites
                </Link>
            </header>

            <main className={styles.hero}>
                <h1 className={styles.title}>Movie Explorer</h1>
                <p>Discover and save your favourite movies</p>
                <input
                    type="text"
                    placeholder="Search for a movie..."
                    className={styles.searchBar}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") navigate(`/movies?search=${e.target.value}`)
                    }}
                />
            </main>
            <div className={styles.ribbon} ref={ribbonRef}>
                <div className={styles.ribbonTrack}>
                    {[...movies, ...movies].map((movie, index) => (
                        <img
                            key={index}
                            src={movie.poster}
                            alt={movie.title}
                            className={styles.ribbonPoster}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}