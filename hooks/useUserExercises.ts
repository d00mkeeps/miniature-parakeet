'use client'

import {useState, useEffect} from 'react'
import { useUser } from '@/contexts/UserContext'
import {createClient} from '../utils/supabase/client'

export interface Exercise {
    id: number
    name: string
    description:string
    is_template: boolean
}

export const useUserExercises = () => {
    const {userProfile} = useUser()
    const [exercises, setExercises] = useState<Exercise[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const supabase = createClient()

useEffect(() => {
    const fetchExercises = async () => {
        if (!userProfile) return

        try {
            const { data, error} = await supabase
            .from('exercises')
            .select('*')
            .eq('user_id', userProfile.user_id)

            if (error) throw error

            setExercises(data as Exercise[])
        } catch (err) {
            setError(err instanceof Error ? err: new Error('An unknown error occured!'))
        } finally {
            setLoading(false)
        }
    }

    fetchExercises()
    
}, [userProfile])

return { exercises, loading, error}
}

