import React from "react";
import "./card.css"
import noPriority from "../../assets/No-priority.svg";
import lowPriority from "../../assets/Img - Low Priority.svg";
import mediumPriority from "../../assets/Img - Medium Priority.svg";
import highPriority from "../../assets/Img - High Priority.svg";
import urgentPriority from "../../assets/SVG - Urgent Priority colour.svg";

function Card({ title, content, priorityLevel }) {
  return (
    <div className="card-container">
      <div className="card-title">{title}</div>
      <div className="card-content">{content}</div>
      <div className="tags">
        {priorityLevel != null && (
          <div className="priority">
            {priorityLevel === 0 && <img src={noPriority} alt="low priority" />}
            {priorityLevel === 1 && (
              <img src={lowPriority} alt="low priority" />
            )}
            {priorityLevel === 2 && (
              <img src={mediumPriority} alt="low priority" />
            )}
            {priorityLevel === 3 && (
              <img src={highPriority} alt="low priority" />
            )}
            {priorityLevel === 4 && (
              <img src={urgentPriority} alt="low priority" />
            )}
          </div>
        )}
        <div className="feature">
          <span>Feature Request</span>
        </div>
      </div>
    </div>
  );
}

export default Card;
