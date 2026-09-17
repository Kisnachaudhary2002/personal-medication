import React from "react";

const MedicationCard = ({ medication, onEdit, onDelete }) => {
  return (
    <div className="med-card">
      <div className="med-card-header">
        <h3>{medication.name}</h3>
        <span className={`badge ${medication.isActive ? "badge-active" : "badge-inactive"}`}>
          {medication.isActive ? "Active" : "Inactive"}
        </span>
      </div>
      <p className="med-dosage">{medication.dosage} · {medication.frequency.replace("-", " ")}</p>
      <div className="med-times">
        {medication.reminderTimes.map((slot) => (
          <span key={slot.time} className="time-chip">{slot.time}</span>
        ))}
      </div>
      {medication.notes && <p className="med-notes">{medication.notes}</p>}
      <div className="med-card-actions">
        <button className="btn-ghost" onClick={() => onEdit(medication)}>Edit</button>
        <button className="btn-danger" onClick={() => onDelete(medication._id)}>Delete</button>
      </div>
    </div>
  );
};

export default MedicationCard;
