import React from "react";
import "../Styles/filter.css";
import queryString from "query-string";
import axios from "axios";

class Filter extends React.Component {
  constructor() {
    super();
    this.state = {
      restaurants: [],
      locations: [],
      mealtype: undefined,
      cuisine: [],
      location: undefined,
      lcost: undefined,
      hcost: undefined,
      sort: 1,
      page: 1,
      pageCount: []
    };
  }
  componentDidMount() {
    const qs = queryString.parse(this.props.location.search); //syntax for capture the value in string
    const { mealtype, location } = qs;

    const filterObj = {
      mealtype: Number(mealtype),
      location,
    };

    axios({
      method: "POST",
      url: "http://localhost:8989/filter",
      headers: { "Content-type": "application/json" },
      data: filterObj,
    })
      .then((response) => {
        this.setState({
          restaurants: response.data.restaurants,
          mealtype,
          location,
          pageCount: response.data.pageCount
        });
      })
      .catch((err) => console.log(err));

    axios({
      method: "GET",
      url: "http://localhost:8989/locations",
      headers: { "Content-type": "application/json" },
    })
      .then((response) => {
        this.setState({ locations: response.data.locations });
      })
      .catch((err) => console.log(err));
  }

  handleSortChange = (sort) => {
    const { mealtype, location, cuisine, lcost, hcost, page } = this.state;

    const filterObj = {
      mealtype: Number(mealtype),
      cuisine: cuisine.length == 0 ? undefined : cuisine,
      location,
      lcost,
      hcost,
      page,
      sort,
    };

    axios({
      method: "POST",
      url: "http://localhost:8989/filter",
      headers: { "Content-type": "application/json" },
      data: filterObj,
    })
      .then((response) => {
        this.setState({ restaurants: response.data.restaurants, sort, pageCount: response.data.pageCount });
      })
      .catch((err) => console.log(err));
  };

  handleCostChange = (lcost, hcost) => {
    const { mealtype, location, cuisine, sort, page } = this.state;

    const filterObj = {
      mealtype: Number(mealtype),
      cuisine: cuisine.length == 0 ? undefined : cuisine,
      location,
      lcost,
      hcost,
      page,
      sort,
    };

    axios({
      method: "POST",
      url: "http://localhost:8989/filter",
      headers: { "Content-type": "application/json" },
      data: filterObj,
    })
      .then((response) => {
        this.setState({ restaurants: response.data.restaurants, lcost, hcost, pageCount: response.data.pageCount });
      })
      .catch((err) => console.log(err));
  };

  handleLocationChange = (event) => {
    const location = event.target.value; // gives locationid

    const { mealtype, cuisine, lcost, hcost, sort, page } = this.state;

    const filterObj = {
      mealtype: Number(mealtype),
      cuisine: cuisine.length == 0 ? undefined : cuisine,
      location,
      lcost,
      hcost,
      page,
      sort,
    };

    axios({
      method: "POST",
      url: "http://localhost:8989/filter",
      headers: { "Content-type": "application/json" },
      data: filterObj,
    })
      .then((response) => {
        this.setState({ restaurants: response.data.restaurants, location, pageCount: response.data.pageCount });
      })
      .catch((err) => console.log(err));

    this.props.history.push(`/filter?mealtype=${mealtype} &location=${location}`);
  };

  handleCuisineChange = (cuisineId) => {
    const { mealtype, cuisine, location, lcost, hcost, sort, page } = this.state;

    const index = cuisine.indexOf(cuisineId);

    if (index >= 0) {
      cuisine.splice(index, 1);
    } else {
      cuisine.push(cuisineId);
    }

    const filterObj = {
      mealtype: Number(mealtype),
      cuisine: cuisine.length == 0 ? undefined : cuisine,
      location,
      lcost,
      hcost,
      page,
      sort
    }

    axios({
      method: 'POST',
      url: 'http://localhost:8989/filter',
      headers: { 'Content-Type': 'application/json' },
      data: filterObj
    })
      .then(response => {
        this.setState({ restaurants: response.data.restaurants, cuisine, pageCount: response.data.pageCount })
      })
      .catch(err => console.log(err));
  }


  handlePageChange = (page) => {

    const { mealtype, cuisine, location, lcost, hcost, sort } = this.state;

    const filterObj = {
      mealtype: Number(mealtype),
      cuisine: cuisine.length == 0 ? undefined : cuisine,
      location,
      lcost,
      hcost,
      page,
      sort
    }

    axios({
      method: 'POST',
      url: 'http://localhost:8989/filter',
      headers: { 'Content-Type': 'application/json' },
      data: filterObj
    })
      .then(response => {
        this.setState({ restaurants: response.data.restaurants, page, pageCount: response.data.pageCount })
      })
      .catch(err => console.log(err));
  }


  handleNavigate = (resId) => {
    this.props.history.push(`/details?restaurant=${resId}`);
  }

  render() {
    const { restaurants, locations, pageCount } = this.state;
    return (
      <div>
        <h1 className="Breakfast">Restaurants & Cafes in Mumbai</h1>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3 col-md-12 col-sm-12 ">
              <div className="filter-options">
                <div className="filter-heading">Filters / Sort</div>
                <span class="fas fa-angle-double-down icon" data-bs-toggle="collapse"
                  data-bs-target="#collapseExample-1">
                </span>
                <div class="collapse show" id="collapseExample-1">
                  <div className="Select-Location">Select Location</div>
                  <select
                    className="Rectangle-2236"
                    onChange={this.handleLocationChange}
                  >
                    <option value={0}>Select</option>
                    {locations.map((item) => {
                      return (
                        <option
                          value={item.location_id}
                        >{`${item.name}, ${item.city}`}</option>
                      );
                    })}
                  </select>
                  <div className="Cuisine">Cuisine</div>
                  <div>
                    <input
                      type="checkbox"
                      onChange={() => this.handleCuisineChange(1)}
                    />
                    <span className="checkbox-items">North Indian</span>
                  </div>
                  <div>
                    <input type="checkbox" onChange={() => this.handleCuisineChange(2)} />
                    <span className="checkbox-items">South Indian</span>
                  </div>
                  <div>
                    <input type="checkbox" onChange={() => this.handleCuisineChange(3)} />
                    <span className="checkbox-items">Chineese</span>
                  </div>
                  <div>
                    <input type="checkbox" onChange={() => this.handleCuisineChange(4)} />
                    <span className="checkbox-items">Fast Food</span>
                  </div>
                  <div>
                    <input type="checkbox" onChange={() => this.handleCuisineChange(5)} />
                    <span className="checkbox-items">Street Food</span>
                  </div>
                  <div className="Cuisine">Cost For Two</div>
                  <div>
                    <input
                      type="radio"
                      name="cost"
                      onChange={() => this.handleCostChange(1, 500)}
                    />
                    <span className="checkbox-items">Less than &#8377; 500</span>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="cost"
                      onChange={() => this.handleCostChange(500, 1000)}
                    />
                    <span className="checkbox-items">
                      &#8377; 500 to &#8377; 1000
                    </span>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="cost"
                      onChange={() => this.handleCostChange(1000, 1500)}
                    />
                    <span className="checkbox-items">
                      &#8377; 1000 to &#8377; 1500
                    </span>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="cost"
                      onChange={() => this.handleCostChange(1500, 2000)}
                    />
                    <span className="checkbox-items">
                      &#8377; 1500 to &#8377; 2000
                    </span>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="cost"
                      onChange={() => this.handleCostChange(2000, 50000)}
                    />
                    <span className="checkbox-items">&#8377; 2000 +</span>
                  </div>
                  <div className="Cuisine">Sort</div>
                  <div>
                    <input
                      type="radio"
                      name="sort"
                      onChange={() => this.handleSortChange(1)}
                    />
                    <span className="checkbox-items">Price low to high</span>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="sort"
                      onChange={() => this.handleSortChange(-1)}
                    />
                    <span className="checkbox-items">Price high to low</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-9 col-md-12 col-sm-12">
              {restaurants.length > 0 ? restaurants.map((item) => {
                return (
                  <div className="Item" onClick={() => this.handleNavigate(item._id)}>
                    <div>
                      <div className="small-item vertical">
                        <img className="img" src={`../${item.image}`} alt=" " />
                      </div>
                      <div className="big-item">
                        <div className="rest-name">{item.name}</div>
                        <div className="rest-location">{item.locality}</div>
                        <div className="rest-address">{item.city}</div>
                        <div className="star-rating">
                          <span class="fa fa-star checked"></span>
                          <span className="fa fa-star checked"></span>
                          <span className="fa fa-star checked"></span>
                          <span className="fa fa-star checked"></span>

                          <span className="fa fa-star "></span>
                          <span className="rating">{item.aggregate_rating}</span>
                          <span className="rate-text">{item.rating_text}</span>
                        </div>
                      </div>
                    </div>
                    <hr />
                    <div>
                      <div className="margin-left">
                        <div className="Bakery">
                          CUISINES :{" "}
                          {item.cuisine.map((cuisine) => `${cuisine.name}`)}
                        </div>
                        <div className="Bakery">
                          COST FOR TWO : &#8377; {item.min_price}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }) : <div className="nrecords">
                No options found....
              </div>}


              {
                restaurants.length > 0 ? <div className="pagination">
                  <button className='page-number'>&laquo;</button>
                  {pageCount.map(item => {
                    return <button className='page-number' onClick={() => this.handlePageChange(item)} >{item}</button>
                  })}
                  <button className='page-number'>&raquo;</button>
                </div> : null
              }

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Filter;
