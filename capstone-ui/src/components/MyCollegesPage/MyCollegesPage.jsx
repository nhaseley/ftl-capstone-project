import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./MyCollegesPage.css";

export default function MyCollegesPage({ userLoginInfo, selectedCollege }) {
  const [likedColleges, setLikedColleges] = useState([]);

  useEffect(() => {
    if (
      // unnecessary once we require login for this page
      userLoginInfo.firstName != ""
    ) {
      axios
        .post("http://localhost:3010/like", {
          student_id: userLoginInfo.id,
          college: selectedCollege,
        })
        .then((response) => {
          setLikedColleges(response.data);
        });
    }
  }, [userLoginInfo]);

  return (
    <div className="my-colleges-page">
      <h1> Your Liked Colleges:</h1>
      <div>
        {likedColleges?.map((college) => (
          <h2 className="my-college-name"> <Link to={"/info/" + college.name}> {college.name} </Link></h2>
        ))}
      </div>
    </div>
  );
}
