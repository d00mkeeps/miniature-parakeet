import React from 'react';
import { useForm } from 'react-hook-form';
import { UserInfoData } from '@/types';
import { Input } from '../../public/atoms/Input';
import { Label } from '../../public/atoms/Label';
import Button from "../../public/atoms/Button";
import styles from '@/styles/atoms.module.css'

type UserInfoStepProps = {
  onNext: (data: UserInfoData) => void;
  initialData: UserInfoData;
};

export const UserInfoStep: React.FC<UserInfoStepProps> = ({ onNext, initialData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<UserInfoData>({
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onNext)}>
      <div className="mb-4">
        <Label htmlFor="displayName">Display Name</Label>
        <Input
          id="displayName"
          {...register("displayName", { required: "Display name is required" })}
          className={styles.input}

          placeholder="kingjohn21"
        />
        {errors.displayName && (
          <span className="text-red-500">{errors.displayName.message}</span>
        )}
      </div>
      <div className="mb-4">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          {...register("firstName")}
          className={styles.input}

          placeholder="John"
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          {...register("lastName")}
          className={styles.input}
          placeholder="Doe"
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="isImperial">
          <input
            id="isImperial"
            type="checkbox"
            {...register("isImperial")}
            className="mr-2"
          />
          Use freedom units? (lbs, ft, etc)
        </Label>
      </div>
      <Button type="submit" variant="primary" size="large" className="w-full mt-4">
        Next
      </Button>
    </form>
  );
};