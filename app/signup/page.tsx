// pages/signup.tsx
'use client'

import styles from './Signup.module.css'
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
type Inputs = {
  email: string;
  password: string;
  displayName: string;
  firstName: string;
  lastName: string;
  sex: number | null;
  dateOfBirth: string | null; // We'll use string for date input
  height: number | null;
  weight: number | null;
  isImperial: boolean;
};

export default function Signup() {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);
  
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const supabase = createClientComponentClient();
        
        try {
          // Step 1: Create user in Supabase auth system
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });
      
          if (authError) throw authError;
      
          if (!authData.user) {
            throw new Error('User data is missing after sign up');
          }
      
          // Step 2: Create entry in user_profiles
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert({
              auth_user_uuid: authData.user.id,
              display_name: data.displayName,
              first_name: data.firstName,
              last_name: data.lastName,
              sex: data.sex,
              date_of_birth: data.dateOfBirth,
              height: data.height,
              weight: data.weight,
              is_imperial: data.isImperial,
            });
      
          if (profileError) throw profileError;
      
          // If everything is successful, redirect to a success page
          router.push('/login');
      
        } catch (error: any) {
          console.error('Error during sign up:', error);
          setServerError(error.message || 'An error occurred during sign up');
        }
      };
    return (
        <div className="flex items-center justify-center min-h-screen px-8">
            
            <div className='animate-in flex-1 flex flex-col w-full sm:max-w-md text-foreground'> 
                
            <h1 className="text-2xl font-bold mb-4 text-center">Sign up!</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email">Email</label>
            <input
            className={styles.signUpFormInput}
              id="email"
              type="email"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <span>{errors.email.message}</span>}
          </div>
    
          <div>
            <label htmlFor="password">Password</label>
            <input
            className={styles.signUpFormInput}
              id="password"
              type="password"
              {...register('password', { required: 'Password is required', minLength: 8 })}
            />
            {errors.password && <span>{errors.password.message}</span>}
          </div>
    
          <div>
            <label 
            htmlFor="displayName">Display Name</label>
            <input
              className={styles.signUpFormInput}
              id="displayName"
              type="text"
              {...register('displayName', { required: 'Display name is required' })}
            />
            {errors.displayName && <span>{errors.displayName.message}</span>}
          </div>
    
          <div>
            <label htmlFor="firstName">First Name</label>
            <input
             className={styles.signUpFormInput}
              id="firstName"
              type="text"
              {...register('firstName')}
            />
          </div>
    
          <div>
            <label htmlFor="lastName">Last Name</label>
            <input
           className={styles.signUpFormInput}
              id="lastName"
              type="text"
              {...register('lastName')}
            />
          </div>
    
          <div>
            <label htmlFor="sex">Sex</label>
            <select
            className={styles.signUpFormInput}
             id="sex" {...register('sex', { valueAsNumber: true })}>
              <option value="">Select...</option>
              <option value="0">Male</option>
              <option value="1">Female</option>
              <option value="2">Other</option>
            </select>
          </div>
    
          <div>
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
            className={styles.signUpFormInput}
              id="dateOfBirth"
              type="date"
              {...register('dateOfBirth')}
            />
          </div>
    
          <div>
            <label htmlFor="height">Height</label>
            <input
        className={styles.signUpFormInput}
              id="height"
              type="number"
              step="0.01"
              {...register('height', { valueAsNumber: true })}
            />
          </div>
    
          <div>
            <label htmlFor="weight">Weight</label>
            <input
              id="weight"
              type="number"
              step="0.01"
              className={styles.signUpFormInput}
              {...register('weight', { valueAsNumber: true })}
            />
          </div>
    
          <div>
            <label htmlFor="isImperial">Use Imperial Units</label>
            <input
           className={styles.signUpFormInput}
              id="isImperial"
              type="checkbox"
              {...register('isImperial')}
            />
          </div>
    
          <button type="submit">Sign Up</button>
    
          {serverError && <div className="text-red-500">{serverError}</div>}
        </form>
    </div>
    </div>
      );
    }