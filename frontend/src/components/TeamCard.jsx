import PropTypes from "prop-types";

export default function TeamCard({ image, title, car, flag, drivers, engine }) {
  return (
    <div className="team-card">
      <img src={image} alt={title} className="team-car-img" />

      <div className="team-card-content">
        <div className="team-card-header">
          <div className="team-card-title-group">
            <h4>{title}</h4>
            <span className="car-badge">{car}</span>
          </div>
          <img src={flag} alt={`${title} flag`} className="flag-img" />
        </div>

        <div className="team-card-details">
          <div className="detail-item">
            <span className="detail-label">Pilotos</span>
            <div className="drivers-list">
              {drivers && drivers.map(driver => <span key={driver} className="driver-tag">{driver}</span>)}
            </div>
          </div>
          <div className="detail-item">
            <span className="detail-label">Motor</span>
            <span className="engine-text">{engine}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

TeamCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  car: PropTypes.string.isRequired,
  flag: PropTypes.string.isRequired,
  drivers: PropTypes.arrayOf(PropTypes.string),
  engine: PropTypes.string
};
