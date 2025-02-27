import { Link } from "react-router-dom";

const PlateServiceCard = ({ title, description, image, link="/" }) => {
  return (
    <div className="bg-white rounded overflow-hidden shadow hover:shadow-md">
      <Link to={link}>
        <div className="plate-service-card-img-wrapper bg-blue-500">
            <img src={require(`../assets/images/${image}`)} alt={title} className="" />
        </div>
        <div className="plate-service-card-title p-[30px]">
            <h3 className="flex-div gap-[5px] pb-[15px]">
            <span>{title}</span>
            <img src={require("../assets/images/black-arr.svg").default} alt="balck-arrow" />
            </h3>
            <p className="">{description}</p>
        </div>
      </Link>
    </div>
  );
}

export default PlateServiceCard