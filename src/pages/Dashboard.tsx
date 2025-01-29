
import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { IoMdNotifications } from "react-icons/io";
import { FiSearch } from "react-icons/fi";

interface UserDetails {
  displayName: string;
  photoURL: string;
}

export default function Dashboard() {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [dropdown, setDropdown] = useState(false);

  const toggleDropdown = () => {
    setDropdown(!dropdown);
  };

  useEffect(() => {
    const fetchUserData = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(user);

        if (user.providerData.some((provider) => provider.providerId === "google.com")) {
          setUserDetails({
            displayName: user.displayName || "Anonymous",
            photoURL: user.photoURL || "/default-avatar.png",
          });
        } else {

          const userDocRef = doc(db, "users", user.uid); 
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUserDetails({
              displayName: userData.displayName || "Anonymous",
              photoURL: userData.photoURL || "/default-avatar.png",
            });
          } else {

            console.log("User document not found");
            setUserDetails({
              displayName: "Anonymous",
              photoURL: "/default-avatar.png",
            });
          }
        }
      } else {
        console.log("no user signed in");
        setUserDetails(null);
      }
    });
    
    return () => fetchUserData();
  }, []);

  async function handleLogout() {
    try {
      await auth.signOut();
      window.location.href = "./"
      console.log('user logged out successfully')
    } catch (error: any) {
      console.error('error logging out', error.message)
    }
  }

  return (
    <div>
      {userDetails ? (
        <nav className="h-12 flex items-center justify-between px-10 bg-green-100 shadow sticky">
          <h1 className="text-3xl font-bold text-green-900">TaskFlow</h1>
          <div className="w-full flex items-center justify-center relative">
            <input
              className="w-[70%] border border-solid rounded-md py-1 px-4 hover:bg-green-50 focus:ring-2 focus:ring-green-900 outline-none"
              type="search"
              placeholder="search..."
            />
            <span className="absolute left-[890px]">
              <FiSearch />
            </span>
          </div>
          <div className="flex items-center gap-4">
            <IoMdNotifications className="text-5xl cursor-pointer text-green-900" />
            <img
              onClick={toggleDropdown}
              src={userDetails.photoURL}
              alt="User Avatar"
              className="w-8 h-8 rounded-full object-cover cursor-pointer"
            />
          </div>

          {dropdown && (
            <div className="absolute right-10 top-14 bg-white border border-gray-200 rounded-lg shadow-lg w-48">
              <ul className="py-2">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Profile
                </li>

                <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Logout
                </li>
              </ul>
            </div>
          )}
        </nav>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}