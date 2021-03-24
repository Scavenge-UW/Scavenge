function HomeView(props) {
  const showUsername = () => {
    if (props.profile) {
      return <h3>Welcome, {props.profile.username}</h3>
    } else {
      return <h3>You are not logged in.</h3>
    }
  }

  return (
    <>
      <h1>Home</h1>
      {showUsername()}
    </>
  );
}

export default HomeView;
