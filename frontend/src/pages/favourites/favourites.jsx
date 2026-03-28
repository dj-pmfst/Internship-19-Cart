import styles from './favourites.module.css'
import MovieCard from "../../components/MovieCard/MovieCard"
import { useNavigate } from "react-router-dom"
import Loading from "../../components/Loading/loader"
import { useState, useEffect } from "react"

export default function Favourites() {
    const [favourites, setFavourites] = useState([ ])
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("http://localhost:3000/favorites", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setFavourites(data)
            })
            .catch(err => console.error(err))
    }, [])

    useEffect(() => {                          
        const timeout = setTimeout(() => {
            setLoading(false)
        }, 400)
        return () => clearTimeout(timeout)
    }, [])

    const removeFavourite = async (id) => {
        await fetch(`http://localhost:3000/favorites/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        setFavourites(favourites.filter(f => f.id !== id))
    }

    if (loading) return <Loading />

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <span>Favourites <img className={styles.star} src="/src/assets/icons/star.png" /></span>
                <button className={styles.backButton} onClick={() => navigate(-1)}><img src='/src/assets/icons/left-arrow.svg'/></button>
            </header>
            <main className={styles.main}>
                <div className={styles.favourites}>
                    {favourites.length === 0 
                        ? <p className={styles.empty}>No favourites added</p>
                        : <div className={styles.grid}>
                            {favourites.map(fav => (
                                <MovieCard key={fav.id} movie={fav.movie} onRemove={() => removeFavourite(fav.id)} />
                            ))}
                        </div>
                    }
                </div>
            </main>
        </div>
    )
}