import { useEffect, useState } from "react";
import api from "../../api/axios";
import Profile from "../../components/Profile";

function TeacherProfile() {

  const [user, setUser] = useState(null);

  async function loadProfile() {
    try {

      const response = await api.get("/profile");

      setUser(response.data.user);

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <Profile
      role="Teacher"
      user={user}
    />
  );
}

export default TeacherProfile;