import React from 'react'
import HabitHexTracker from './HabitHexTracker'

const SkinCareTrackerCard = () => {
  return (
    <div className='w-1/4 bg-black/40 rounded-2xl p-4 h-[50vh] flex justify-center items-end'>
        <HabitHexTracker habitId={1} year={2026} month={1} />
    </div>
  )
}

export default SkinCareTrackerCard
