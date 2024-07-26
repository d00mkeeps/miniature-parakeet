import React from 'react';
import { ProgramListProps } from '@/types';
import ProgramCard from '@/components/program/molecules/ProgramCard';
import styles from '@/styles/organisms.module.css';

const ProgramList: React.FC<ProgramListProps> = ({ programs, onDelete }) => (
  <div className={styles.programList}>
    {programs.map((program) => (
      <ProgramCard key={program.id} program={program} onDelete={onDelete} />
    ))}
  </div>
);

export default ProgramList