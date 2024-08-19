import React from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '../../atoms/Label';
import Button from '../../atoms/Button';
import styles from '@/styles/organisms.module.css'
type TrainingHistoryStepProps = {
  onNext: (history: string) => void;
  initialData: string;
};

export const TrainingHistoryStep: React.FC<TrainingHistoryStepProps> = ({ onNext, initialData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<{ trainingHistory: string }>({
    defaultValues: { trainingHistory: initialData },
  });

  const onSubmit = (data: { trainingHistory: string }) => {
    onNext(data.trainingHistory);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <Label htmlFor="trainingHistory">Tell us about yourself! [i]<br></br> -1RMs<br></br> -Past injuries <br></br> -Training preferences<br></br><br></br><b>Training history:</b></Label>
        <textarea
          id="trainingHistory"
          {...register("trainingHistory", { required: "Training history is required" })}
          className={styles.textarea}
          rows={5}
          placeholder="I'm a powerlifter with a big total and shoulder problems..."
        ></textarea>
        {errors.trainingHistory && (
          <span className="text-red-500">{errors.trainingHistory.message}</span>
        )}
      </div>
      <Button type="submit" variant="primary" size="large" className="w-full mt-4">
        Next
      </Button>
    </form>
  );
};