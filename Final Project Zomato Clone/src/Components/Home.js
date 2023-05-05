import axios from "axios";
import React from "react";
import "../Styles/Homeboot.css";
import QuickSearch from "./QuickSearch";

import Wallpaper from "./Wallpaper";

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      locations: [],
      mealtypes: [],
    };
  }
  componentDidMount() {
    sessionStorage.clear();
    axios({
      method: "GET",
      url: "http://localhost:8989/locations",
      headers: { "Content-type": "application/json" },
    })
      .then((response) => {
        this.setState({ locations: response.data.locations });
      })
      .catch((err) => console.log(err));
    axios({
      method: "GET",
      url: "http://localhost:8989/mealtypes",
      headers: { "Content-type": "application/json" },
    })
      .then((response) => {
        this.setState({ mealtypes: response.data.mealTypes });
      })
      .catch((err) => console.log(err));
  }

  componentWillUnmount() {
    sessionStorage.clear();
  }
  render() {
    const { locations, mealtypes } = this.state;
    return (
      <div>
        <Wallpaper locationsData={locations} />
        <QuickSearch mealtypesData={mealtypes} />
      </div>
    );
  }
}

export default Home;
