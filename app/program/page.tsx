'use client'
/*imports

A program should have a name, description, and timestamp associated with it. It should  also pull the user id from context.


workout creation button creates a workout in this new program, with similiar logic to the old version of my program workout creation component (requires a name, etc)

workout select component does the following:
- allows a user to view and select created workouts within this program
- signals to switch the displayed workout to the selected option

workout creation rendering
- Should be able to reuse the WorkoutTracker component to render the workout


submit logic (let's just console log the program object, alert the user that the program's been logged, and clear the page for now)

*/

import ProgramDisplayPage from "@/components/pages/ProgramDisplay";

const Page = () => {
    return (
        <div>
<ProgramDisplayPage/>
        </div>
    )
}
export default Page
