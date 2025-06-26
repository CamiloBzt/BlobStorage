import { Icon } from 'pendig-fro-transversal-lib-react';
import React from 'react';


interface StatsSectionProps {
  totalBlobs: number;
  totalSize: string;
  containerName: string;
}

export const StatsSection: React.FC<StatsSectionProps> = ({
  totalBlobs,
  totalSize,
  containerName,
}) => {
  return (
    <div className="stats-section">
      <div className="stats-section__card">
        <div className="stats-section__content">
          <Icon
            $name="description"
            $w="2rem"
            $h="2rem"
            className="stats-section__icon stats-section__icon--blue"
          />
          <div>
            <p className="stats-section__label">Total de Archivos</p>
            <p className="stats-section__value">{totalBlobs}</p>
          </div>
        </div>
      </div>

      <div className="stats-section__card">
        <div className="stats-section__content">
          <Icon
            $name="topic"
            $w="2rem"
            $h="2rem"
            className="stats-section__icon stats-section__icon--green"
          />
          <div>
            <p className="stats-section__label">Tamaño Total</p>
            <p className="stats-section__value">{totalSize}</p>
          </div>
        </div>
      </div>

      <div className="stats-section__card">
        <div className="stats-section__content">
          <Icon
            $name="moveUp"
            $w="2rem"
            $h="2rem"
            className="stats-section__icon stats-section__icon--purple"
          />
          <div>
            <p className="stats-section__label">Contenedor</p>
            <p className="stats-section__value">{containerName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
