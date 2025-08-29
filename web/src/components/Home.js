import { withRouter } from 'react-router-dom';

function Home(props) {
  const profile = props.userProfile ? props.userProfile : null;
  const friendsPosts = props.friendsPosts ? props.friendsPosts : [];

  return (
    <div>
      {/* {profile ? console.log(friendsPosts)
      :
        <></>
      } */}
    </div>
  );
}

export default withRouter(Home);
