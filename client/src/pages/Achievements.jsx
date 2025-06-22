import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { useAuth } from '../AuthContext';

export default function Achievements() {
    const { user } = useAuth();
    const [habits, setHabits] = useState([]);

    useEffect(() => {
        const fetchHabits = async () => {
            const token = await auth.currentUser.getIdToken();
            const res = await fetch(`http://localhost:5000/api/habits/${user.uid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setHabits(data);
        };

        if (user) fetchHabits();
    }, [user]);

    const hasBadges = (habit) => habit.badges && habit.badges.length > 0;

    return (
        <div className="min-h-screen p-0 m-0 font-montserrat">
            <h1 className="text-3xl font-bold mb-6 text-center bg-indigo-500 py-3 text-yellow-400">🏅 My Achievements</h1>

            {habits.filter(hasBadges).length === 0 ? (
                <p className="text-center text-gray-500">You haven’t earned any badges yet. Start building those streaks! 💪</p>
            ) : (
                <div className="grid gap-4 lg:grid-cols-3 md:grid-cols-2 mx-4 my-2">
                    {habits.filter(hasBadges).map((habit) => (
                        <div key={habit._id} className="card bg-base-100 bg-emerald-300 shadow-md p-4 border border-gray-200">
                            <h2 className="card-title mb-2">{habit.name}</h2>
                            <div className="flex gap-2 flex-wrap">
                                {habit.badges.includes("7") && (
                                    <span className="badge badge-info text-sm">🎯 7-Day Streak</span>
                                )}
                                {habit.badges.includes("30") && (
                                    <span className="badge badge-warning text-sm">🥇 30-Day Streak</span>
                                )}
                                {habit.badges.includes("100") && (
                                    <span className="badge badge-accent text-sm">🏆 100-Day Streak</span>
                                )}
                                
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
