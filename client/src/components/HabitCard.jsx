import React from "react";
import { useState , useEffect } from "react";
import deleteIcon from '../assets/delete.svg';
import Badge from "./Badge";

export default function HabitCard({ habit, onCheckIn, onDelete, onRequestDelete,deletedId }) {

  




  return (
    <div className={`card transition-all duration-500 ease-in-out animate-fade-in w-full rounded font-montserrat bg-base-100 relative flex flex-col items-start bg-emerald-200 shadow-md mb-4 ${deletedId === habit._id ? 'animate-fade-out' : ''}`}>
      <div className="card-body py-2 px-1 flex flex-col items-start w-full">
        <div className="flex gap-2 items-center w-full px-3 py-1">
          {/* ✅ Custom circular check-in */}
          <div
            onClick={() => {
              
                onCheckIn(habit._id);
              
            }}
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-200
              ${habit.checkedToday ? "bg-white border-green-500 scale-110" : "border-gray-400"}`}
          >
            {habit.checkedToday && (
              <div className="w-2 h-2 rounded-full bg-green-500 "></div>
            )}
          </div>
          <h2 className="card-title mr-4">{habit.name}</h2>

          
        </div>

        <span className="badge badge-info font-ancizar text-lg font-semibold badge-outline px-3 animate-bounce mt-2">{habit.streak >= 7 ? '🏆' : habit.streak >= 3 ? '🔥' : '💡'} Streak: {habit.streak}</span>

        

        
      </div>
      {/* 🗑 Delete Button */}
        <button
          onClick={() => onRequestDelete(habit)}
          className="btn btn-sm absolute top-2 right-1 btn-outline btn-error"
        >
          <img className="w-[1.1rem] mb-10" src={deleteIcon} alt="" />
        </button>
      
    </div>
    
  );
}
