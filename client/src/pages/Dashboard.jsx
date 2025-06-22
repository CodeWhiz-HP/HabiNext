import { auth } from "../firebase";
import { useAuth } from "../AuthContext";
import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import userphoto from "../assets/user1.png";
import HabitCard from "../components/HabitCard";
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { Link } from "react-router-dom";


export default function Dashboard() {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [quote, setQuote] = useState("Loading...");
    const [author, setAuthor] = useState("");
    const [habitInput, setHabitInput] = useState("");
    const [habits, setHabits] = useState([]);
    const [pendingDeleteHabit, setPendingDeleteHabit] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [deletedId, setDeletedId] = useState(null);

    function getTimeLeftToday() {
        const now = new Date();
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const diffMs = endOfDay - now;

        const hours = Math.floor(diffMs / 3600000);
        const minutes = Math.floor((diffMs % 3600000) / 60000);
        const seconds = Math.floor((diffMs % 60000) / 1000);

        return { hours, minutes, seconds };
    }

    const [timeLeft, setTimeLeft] = useState(getTimeLeftToday());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeLeftToday());
        }, 1000); // or use 60000 for once per minute

        return () => clearInterval(interval);
    }, []);


    // Fetch habits (on load)
    useEffect(() => {
        const fetchHabits = async () => {
            const token = await auth.currentUser.getIdToken();
            const res = await fetch(`http://localhost:5000/api/habits/${user.uid}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            const today = new Date().toDateString();
            const updatedHabits = data.map(habit => {
                if (habit.lastChecked !== today) {
                    return { ...habit, checkedToday: false };
                }
                return habit;
            });

            setHabits(updatedHabits);
        };

        if (user) fetchHabits();
    }, [user]);


    // Add habit
    const addHabit = async () => {
        const token = await auth.currentUser.getIdToken();
        fetch("http://localhost:5000/api/habits", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId: user.uid, name: habitInput }),
        })
            .then((res) => res.json())
            .then((newHabit) => setHabits([...habits, newHabit]));

        setHabitInput("");
    };

    const handleDelete = async (id, name) => {
        setDeletedId(id); // ✅ mark it for animation

        setTimeout(async () => {
            const token = await auth.currentUser.getIdToken();
            const res = await fetch(`http://localhost:5000/api/habits/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                setHabits((prev) => prev.filter((h) => h._id !== id));
                toast.success(`🗑 Deleted "${name}"`);
            } else {
                toast.error("Failed to delete habit");
            }

            setDeletedId(null); // clear deleted state
        }, 500); // match fade-out duration
    };



    const handleCheckIn = async (id) => {
        const token = await auth.currentUser.getIdToken();

        try {
            const res = await fetch(`http://localhost:5000/api/habits/${id}/checkin`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const updated = await res.json();

            setHabits((prev) =>
                prev.map((h) => (h._id === updated._id ? updated : h))
            );

            // ✅ Toast based on state
            if (updated.checkedToday) {
                toast.success(`Checked in "${updated.name}"`);
                if (updated.streak === 7) {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 },
                    });
                    confetti({
                        particleCount: 100,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 },
                    });
                    confetti({
                        particleCount: 100,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 },
                    });

                    toast.success(`🎉 Congrats! 7-day streak for "${updated.name}"`, { duration: 5000, });
                } else if (updated.streak === 30) {

                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 },
                    });
                    confetti({
                        particleCount: 100,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 },
                    });
                    confetti({
                        particleCount: 100,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 },
                    });
                    toast.success(`🥇 Wow! 30-Day Streak Badge unlocked!`, { duration: 5000, });
                } else if (updated.streak === 100) {

                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 },
                    });
                    confetti({
                        particleCount: 100,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 },
                    });
                    confetti({
                        particleCount: 100,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 },
                    });
                    toast.success(`🏆 Unstoppable! 100-Day Streak Badge achieved!`, { duration: 5000, });
                }

            } else {
                toast.error(`Removed check-in for "${updated.name}"`);
            }

        } catch (err) {
            console.error("Check-in error:", err);

            toast.error("⚠️ Failed to update check-in. Please try again.");

            // Optional fallback update
            setHabits((prev) =>
                prev.map((h) =>
                    h._id === id ? { ...h, checkedToday: true } : h
                )
            );
        }
    };







    const localQuotes = [
        { content: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
        { content: "Productivity is never an accident. It is always the result of a commitment.", author: "Paul J. Meyer" },
        { content: "Amateurs sit and wait for inspiration. The rest of us just get up and go to work.", author: "Stephen King" },
        { content: "Action is the foundational key to all success.", author: "Pablo Picasso" },
        { content: "The key is not to prioritize what’s on your schedule, but to schedule your priorities.", author: "Stephen Covey" }
    ];

    useEffect(() => {
        const updateQuote = () => {
            const random = localQuotes[Math.floor(Math.random() * localQuotes.length)];
            setQuote(random.content);
            setAuthor(random.author);
        };

        updateQuote(); // initial
        const interval = setInterval(updateQuote, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            {pendingDeleteHabit && (
                <div className={`alert rounded-e-full font-montserrat text-sm p-2 bg-red-400 alert-warning fixed top-4  transform  z-50 w-[90vw] max-w-xl transition-all duration-500 ease-in-out shadow-lg ${showAlert ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between w-full">
                        <span>
                            Are you sure you want to delete <strong>{pendingDeleteHabit.name}</strong>?
                        </span>
                        <div className="flex gap-2 mt-2 md:mt-0">
                            <button
                                className="btn btn-sm bg-gray-300 text-gray-500 text-xs px-1 py-[0.125rem]"
                                onClick={() => {
                                    setShowAlert(false);
                                    setTimeout(() => setPendingDeleteHabit(null), 300); // wait for animation

                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-sm btn-error bg-red-600 text-xs px-1 py-[0.125rem] text-gray-200  hover:bg-red-700"
                                onClick={() => {
                                    handleDelete(pendingDeleteHabit._id, pendingDeleteHabit.name);
                                    setShowAlert(false);
                                    setTimeout(() => setPendingDeleteHabit(null), 300); // wait for animation

                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex flex-col overflow-x-hidden">
                <div className="navbar w-[100vw] flex justify-between bg-base-100 shadow-sm bg-indigo-500 px-4 py-3 pr-3 items-center">
                    <div className="flex gap-2 items-center">
                        <img src={logo} alt="" className="w-12" />
                        <a className="btn btn-ghost text-4xl text-yellow-400 font-montserrat ">HabiNext</a>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="relative">
                            <button
                                onClick={() => setOpen(!open)}
                                className="btn btn-ghost btn-circle avatar"
                            >
                                <div className="w-8 rounded-full">
                                    <img className="rounded-full"
                                        alt="User avatar"
                                        src={userphoto}
                                    />
                                </div>
                            </button>

                            {open && (
                                <ul className="menu text-lg font-ancizar absolute right-0 z-50 mt-2 w-52 rounded-box bg-gray-300 bg-base-100 p-2 shadow">
                                    <li><p className="">{user?.email.split('@')[0]}</p></li>
                                    <li><Link to="/achievements" className="btn btn-sm btn-outline">
                                        🏅 My Achievements
                                    </Link></li>
                                    <li><a>Settings</a></li>
                                    <li onClick={() => auth.signOut()} className="hover:cursor-pointer"><a>Logout</a></li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
                <div
                    className="hero flex flex-col items-center overflow-x-hidden pt-4 pb-4"
                    style={{
                        backgroundImage:
                            "url(https://images.pexels.com/photos/7130557/pexels-photo-7130557.jpeg)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="hero-overlay"></div>
                    <div className="hero-content flex flex-col items-center text-neutral-content text-center">
                        <div className="flex flex-col items-center">
                            <h1 className="mb-5 text-5xl font-ancizar">Welcome, {user?.email.split('@')[0]}</h1>

                            <div className=" w-[88%] p-4 rounded-lg bg-blue-100 text-sm shadow-xl mb-5">
                                <p className="italic">"{quote}"</p>
                                <p className="text-right mt-2 text-xs text-gray-600">— {author}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=" mx-auto mt-8 sm:mx-4 sm:px-0  px-4 flex flex-col items-start" >
                    <div className="text-center mb-3 w-full">
                        <h1 className="text-3xl font-bold">🧠 Your Habits</h1>
                        <p className="text-sm text-gray-500 mb-3">Track and build better habits daily.</p>
                        <p className="text-sm text-gray-600 font-medium mb-1">
                            🕒 {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s left to check in today
                        </p>
                    </div>



                    {habits.length === 0 && (
                        <div className="alert rounded-md alert-info shadow-sm mb-4 font-ancizar bg-red-400 px-3 py-1">
                            You haven’t added any habits yet.
                        </div>
                    )}

                    <div className="flex border-[5px] border-double border-gray-500 flex-col sm:gap-x-4 lg:grid-cols-4 py-3 px-4 mb-3 rounded-lg md:grid-cols-3 sm:grid sm:grid-cols-2 sm:w-full w-full items-start h-fit">
                        {habits.map((habit) => (
                            <HabitCard key={habit._id} habit={habit} deletedId={deletedId} onCheckIn={handleCheckIn} onDelete={handleDelete} onRequestDelete={(habit) => {
                                setPendingDeleteHabit(habit);
                                setShowAlert(false); // reset first
                                setTimeout(() => setShowAlert(true), 50); // 👈 trigger slide-in after mount
                            }} />
                        ))}
                    </div>

                    <div className="form-control w-[100%] md:w-[67%] lg:w-[50%] rounded-md mb-4 bg-white p-3">
                        <div className="input-group">
                            <input
                                value={habitInput}
                                onChange={(e) => setHabitInput(e.target.value)}
                                placeholder="Add new habit"
                                className="input rounded input-bordered w-full bg-gray-200 font-ancizar px-2 py-1 mb-3 text-xl"
                            />
                            <button className="btn btn-primary bg-yellow-400 px-2 py-1 rounded" onClick={addHabit}>Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
