import MyPosts from "./MyPosts";
import SavedPosts from "./SavedPosts";

interface ProfileBodyProps {
  selectedTab: 'posts' | 'saved';
}

const ProfileBody: React.FC<ProfileBodyProps> = ({ selectedTab }) => {
  return (
    <div>
      {selectedTab === 'posts' ? (
        <MyPosts /> // Component for user posts
      ) : (
        <SavedPosts /> // Component for saved posts
      )}
    </div>
  );
};
export default ProfileBody