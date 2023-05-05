import React from "react";
import queryString from 'query-string';
import axios from "axios";
import '../Styles/Details.css';
import Modal from "react-modal";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: 'solid 1px brown',
        background: 'aliceblue',
        overflow: 'auto'
    },
};

class Details extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurant: {},
            restaurantId: undefined,
            menuItemsModalIsOpen: false,
            formsModalIsOpen: false,
            galleryModalIsOpen: false,
            menuItems: [],
            subTotal: 0,
            name: undefined,
            email: undefined,
            contact: undefined,
            address: undefined
        }
    }
    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const { restaurant } = qs;

        axios({
            method: "GET",
            url: `http://localhost:8989/restaurant/${restaurant}`,
            headers: { "Content-type": "application/json" },
        })
            .then((response) => {
                this.setState({ restaurant: response.data.restaurant, restaurantId: restaurant });
            })
            .catch((err) => console.log(err));
    }
    handleModal = (state, value) => {
        this.setState({ [state]: value });
    }
    GetMenuItems = () => {
        const { restaurantId } = this.state;
        axios({
            method: "GET",
            url: `http://localhost:8989/menuitems/${restaurantId}`,
            headers: { "Content-type": "application/json" },
        })
            .then((response) => {
                this.setState({ menuItems: response.data.menuItems });
            })
            .catch((err) => console.log(err));
    }

    addItems = (index, operationType) => {
        let total = 0;
        // Spread Operator - Copy of Reference Types
        const items = [...this.state.menuItems];
        const item = items[index];

        if (operationType === 'add') {
            item.qty++;
        }
        else {
            item.qty--;
        }
        items[index] = item;
        items.map((item) => {
            total += item.qty * item.price;
        })
        this.setState({ menuItems: items, subTotal: total });
    }
    handleInputChange = (state, event) => {
        this.setState({ [state]: event.target.value });
    }

    isDate(val) {
        // Cross realm comptatible
        return Object.prototype.toString.call(val) === '[object Date]'
    }

    isObj = (val) => {
        return typeof val === 'object'
    }

    stringifyValue = (val) => {
        if (this.isObj(val) && !this.isDate(val)) {
            return JSON.stringify(val)
        } else {
            return val
        }
    }

    buildForm = ({ action, params }) => {
        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action', action)

        Object.keys(params).forEach(key => {
            const input = document.createElement('input')
            input.setAttribute('type', 'hidden')
            input.setAttribute('name', key)
            input.setAttribute('value', this.stringifyValue(params[key]))
            form.appendChild(input)
        })
        return form
    }

    post = (details) => {
        const form = this.buildForm(details)
        document.body.appendChild(form)
        form.submit()
        form.remove()
    }

    getData = (data) => {
        return fetch(`http://localhost:8989/payment`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => response.json()).catch(err => console.log(err))
    }

    handlePayment = (event) => {

        const { subTotal, email } = this.state;

        if (!email) {
            alert('Please fill this field and then Proceed...');
        }
        else {
            // Payment API Call 
            const paymentObj = {
                amount: subTotal,
                email: email
            };

            this.getData(paymentObj).then(response => {
                var information = {
                    action: "https://securegw-stage.paytm.in/order/process",
                    params: response
                }
                this.post(information)
            })
        }
        event.preventDefault();
    }

    render() {
        const { restaurant, menuItemsModalIsOpen, formsModalIsOpen, galleryModalIsOpen, menuItems, subTotal } = this.state;
        return (
            <div>
                <div>
                    <img src={`./${restaurant.image}`} alt="Not Found" width="100%" height="350px" />

                    <button className="button" onClick={() => this.handleModal('galleryModalIsOpen', true)}>Click to see Image Gallery</button>
                </div>
                <div className="heading">{restaurant.name}</div>
                <button className="btn-order" onClick={() => {
                    this.handleModal('menuItemsModalIsOpen', true)
                    this.GetMenuItems()
                }}>Place Online Order
                </button>

                <div className="tabs">
                    <div className="tab">
                        <input type="radio" id="tab-1" name="tab-group-1" defaultChecked />
                        <label htmlFor="tab-1">Overview</label>

                        <div className="content">
                            <div className="about">About this place</div>
                            <div className="head">Cuisine</div>
                            <div className="value">{restaurant && restaurant.cuisine && restaurant.cuisine.map(cuisine => `${cuisine.name}`)}</div>
                            <div className="head">Average Cost</div>
                            <div className="value">&#8377;{restaurant.min_price} for two people(approx)</div>
                            <div className="head">Rating</div>
                            <div className="value">
                                <span class="fa fa-star checked"></span>
                                <span className="fa fa-star checked"></span>
                                <span className="fa fa-star checked"></span>
                                <span className="fa fa-star checked"></span>

                                <span className="fa fa-star "></span>
                                <span className="rating">{restaurant.aggregate_rating}</span>
                                <span className="rate-text">{restaurant.rating_text}</span>
                            </div>
                        </div>
                    </div>

                    <div className="tab">
                        <input type="radio" id="tab-2" name="tab-group-1" />
                        <label htmlFor="tab-2">Contact</label>

                        <div className="content">
                            <div className="head">Phone Number</div>
                            <div className="value">{restaurant.contact_number}</div>
                            <div className="head">Address</div>
                            <div className="value">{restaurant.name}</div>
                            <div className="value">{`${restaurant.locality}, ${restaurant.city}`}</div>
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={menuItemsModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <div className="glyphicon glyphicon-remove" style={{ float: 'right', marginBottom: '10px' }}
                            onClick={() => this.handleModal('menuItemsModalIsOpen', false)}></div>
                        <div >
                            <h3 className="restaurant-name">MenuItems</h3>
                            <h3 className="item-total">SubTotal : {subTotal}</h3>
                            <button className="btn btn-danger order-button"
                                onClick={() => {
                                    this.handleModal('menuItemsModalIsOpen', false);
                                    this.handleModal('formsModalIsOpen', true);
                                }}> Pay Now</button>


                            {menuItems.map((item, index) => {
                                return <div style={{ width: '52rem', marginTop: '10px', height: '164px', marginBottom: '10px', border: '1px solid black' }}>
                                    <div className="card" style={{ width: '43rem', margin: 'auto' }}>
                                        <div className="row" style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                            <div className="col-xs-9 col-sm-9 col-md-9 col-lg-9 " style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                                <span className="card-body">
                                                    <h5 className="item-name">{item.name}</h5>
                                                    <h5 className="item-price">&#8377;{item.price}</h5>
                                                    <h5 className="item-name">Ingridients : {item.ingridients}</h5>
                                                    <p className="item-descp">{item.description}</p>
                                                </span>
                                            </div>
                                            <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                                                <img className="card-img-center title-img" src={`../${item.image}`} style={{
                                                    height: '81px',
                                                    width: '110px',
                                                    borderRadius: '10px',
                                                    marginTop: '7px',
                                                    marginLeft: '3px'
                                                }} alt="not found" />
                                                {item.qty === 0 ? <div>
                                                    <button className="add-button" onClick={() => this.addItems(index, 'add')}>Add</button>
                                                </div> :
                                                    <div className="add-number">
                                                        <button onClick={() => this.addItems(index, 'subtract')} className="aditems">-</button>
                                                        <span class="qty">{item.qty}</span>
                                                        <button onClick={() => this.addItems(index, 'add')} className="aditems">+</button>
                                                    </div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })}
                            <div className="card" style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', margin: 'auto' }}>
                            </div>
                        </div>
                    </div>
                </Modal>
                <Modal
                    isOpen={formsModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <div className="glyphicon glyphicon-remove" style={{ float: 'right', marginBottom: '10px' }}
                            onClick={() => this.handleModal('formsModalIsOpen', false)}></div>
                        <form>
                            <label className="form-label">Name</label>
                            <input style={{ width: '100%' }} type="text" class="form-control" onChange={(event) => this.handleInputChange('name', event)} />
                            <label className="form-label">Email</label>
                            <input type="text" class="form-control" onChange={(event) => this.handleInputChange('email', event)} />
                            <label className="form-label">Contact Number</label>
                            <input type="text" class="form-control" onChange={(event) => this.handleInputChange('contact', event)} />
                            <label className="form-label">Address</label>
                            <input type="text" class="form-control" onChange={(event) => this.handleInputChange('address', event)} />
                            <button className="btn btn-danger" style={{ marginTop: '20px', float: 'right' }} onClick={this.handlePayment}>Proceed</button>
                        </form>
                    </div>
                </Modal>
                <Modal
                    isOpen={galleryModalIsOpen}
                    style={customStyles}

                >
                    <div>
                        <div class="glyphicon glyphicon-remove" style={{ float: 'right', marginBottom: '10px' }}
                            onClick={() => this.handleModal('galleryModalIsOpen', false)}></div>
                        <div className="carl">
                            <Carousel
                                showIndicators={false}
                                showThumbs={false}
                            >

                                {restaurant && restaurant.thumb && restaurant.thumb.map(item => {
                                    return <div className="car_img">
                                        <img height="350px" width="100%" className="carl_img" alt="not found"
                                            src={`./${item}`} />
                                    </div>
                                })}
                            </Carousel>
                        </div>



                    </div>
                </Modal >
            </div >

        )
    }
};

export default Details;