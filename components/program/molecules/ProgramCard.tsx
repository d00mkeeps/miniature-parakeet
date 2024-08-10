import React from 'react';
import { ProgramCardProps } from '@/types';
import Button from '@/components/public/atoms/Button';
import { Heading, Paragraph } from '@/components/public/atoms/Typography';
import { PencilIcon } from '@heroicons/react/24/solid';
import styles from '@/styles/molecules.module.css';

const ProgramCard: React.FC<ProgramCardProps> = ({ program, onDelete }) => (
  <div className={styles.programCard}>
    <Heading level={2}>{program.name}</Heading>
    <Paragraph>{program.description || "No description"}</Paragraph>
    <div className={styles.programCardFooter}>
      <Paragraph className={styles.programDate}>
        Created: {new Date(program.time).toLocaleDateString()}
      </Paragraph>
      <div className={styles.programActions}>
        <Button
          href={`/program/edit/${program.id}`}
          variant="primary"
          size="small"
        >
          <PencilIcon className={styles.buttonIcon} />
          Edit
        </Button>
        <Button
          onClick={() => onDelete(program.id)}
          variant="danger"
          size="small"
        >
          Delete
        </Button>
      </div>
    </div>
  </div>
);

export default ProgramCard;