import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ControlPanel from "../compo/controlPanel"
import styles from "../css/reviews.module.css"
import Loading from "../compo/Loading"

export default function Reviews() {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (!token) {
            navigate("/organizer/login");
            return;
        }
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, [navigate]);

    const [filterRating, setFilterRating] = useState("all");

    if (loading) {
        return <Loading />;
    }

    const mockReviews = [
        { id: 1, author: "Rajesh Kumar", rating: 5, date: "May 22, 2026", tourName: "BGMI Ultimate Showdown", comment: "Outstanding tournament! The management was super professional and there were no delay in match timings. Payout was instant. Will definitely register in their next event." },
        { id: 2, author: "Vikram Malhotra", rating: 4, date: "May 20, 2026", tourName: "BGMI Ultimate Showdown", comment: "Very well managed and hack-free lobbies. High level competition. Just one match lobby was slightly delayed due to a player disc, but staff managed it well." },
        { id: 3, author: "Aditya Roy", rating: 5, date: "May 19, 2026", tourName: "Challengers Cup TDM", comment: "Best TDM tournament I've played on this platform. Anti-cheat support was active and query tickets were resolved in minutes on discord." },
        { id: 4, author: "Karan Johar", rating: 3, date: "May 18, 2026", tourName: "Sunday Showdown Classic", comment: "Okayish experience. The prize pool division could be better. Lobby ping was slightly high in game 3." },
        { id: 5, author: "Sanjay Dutt", rating: 2, date: "May 15, 2026", tourName: "Sunday Showdown Classic", comment: "Many teams were teaming up and reporting them took too long. Hope organizers verify reports faster next time." }
    ];

    const filteredReviews = mockReviews.filter(review => {
        return filterRating === "all" || review.rating === Number(filterRating);
    });

    const renderStars = (rating) => {
        let stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i 
                    className={`fa-solid fa-star ${i <= rating ? styles.filledStar : styles.emptyStar}`} 
                    key={i}
                ></i>
            );
        }
        return stars;
    };

    return (
        <>
            <ControlPanel />
            <div className={styles.reviewsContainer}>
                <div className={styles.header}>
                    <div className={styles.titleArea}>
                        <h1>Feedback & Reviews</h1>
                        <p>Read players experiences and tournament ratings to improve operations.</p>
                    </div>
                </div>

                <div className={styles.filtersArea}>
                    <div className={styles.ratingFilter}>
                        <span>Filter by Rating:</span>
                        <select 
                            value={filterRating} 
                            onChange={(e) => setFilterRating(e.target.value)}
                        >
                            <option value="all">All Ratings</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                        </select>
                    </div>
                </div>

                {/* Review Cards Grid */}
                <div className={styles.reviewsGrid}>
                    {filteredReviews.length === 0 ? (
                        <div className={styles.noResults}>
                            <i className="fa-solid fa-comment-slash"></i>
                            <h3>No Reviews Found</h3>
                            <p>No feedback matching this star rating criteria.</p>
                        </div>
                    ) : (
                        filteredReviews.map(review => (
                            <div className={styles.reviewCard} key={review.id}>
                                <div className={styles.cardTop}>
                                    <div className={styles.authorArea}>
                                        <div className={styles.avatar}>
                                            {review.author.charAt(0)}
                                        </div>
                                        <div>
                                            <h4>{review.author}</h4>
                                            <small>{review.date} • {review.tourName}</small>
                                        </div>
                                    </div>
                                    <div className={styles.starsArea}>
                                        {renderStars(review.rating)}
                                    </div>
                                </div>
                                <p className={styles.commentText}>{review.comment}</p>
                                <div className={styles.actionRow}>
                                    <button className={styles.btnReply}><i className="fa-solid fa-reply"></i> Reply</button>
                                    <button className={styles.btnReport}><i className="fa-solid fa-flag"></i> Report</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
